import React, { useState, useEffect, useRef } from "react";
import { SegmentedControl } from "./ui";

export default function Game() {
  const size = 6; // 6x6 grid
  const winLength = 4; // need 4 in a row to win

  // Extremely hard but still beatable configuration:
  const DEPTH = 4; // deeper search = stronger AI
  const THINK_DELAY = 250; // ms (short delay for feel)

  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState("pve"); // default 1 player vs AI
  const [isThinking, setIsThinking] = useState(false);
  const [blocked, setBlocked] = useState([]);
  const [audio, setAudio] = useState({});
  const [lastMove, setLastMove] = useState(null);

  // transposition table cached across a single game to speed minimax
  const tt = useRef(new Map());

  // Preload sounds
  useEffect(() => {
    setAudio({
      click: new Audio(
        "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
      ),
      win: new Audio(
        "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
      ),
      draw: new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg"),
    });
  }, []);

  // Generate winning lines dynamically (all consecutive sequences of length winLength)
  const lines = [];
  // rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      let line = [];
      for (let k = 0; k < winLength; k++) line.push(r * size + c + k);
      lines.push(line);
    }
  }
  // columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      let line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * size + c);
      lines.push(line);
    }
  }
  // diagonals down-right
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      let line = [];
      for (let k = 0; k < winLength; k++) line.push(r + k ? (r + k) * size + (c + k) : (r + k) * size + (c + k));
      lines.push(line);
    }
  }
  // diagonals down-left
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      let line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * size + (c - k));
      lines.push(line);
    }
  }

  function checkWinner(newBoard) {
    for (let line of lines) {
      const [a, ...rest] = line;
      if (newBoard[a] && rest.every((i) => newBoard[i] === newBoard[a])) {
        return newBoard[a];
      }
    }
    if (
      newBoard.every((cell, i) => cell || blocked.includes(i))
    )
      return "Draw";
    return null;
  }

  function resetGame(mode = gameMode) {
    setBoard(Array(size * size).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameMode(mode);
    setIsThinking(false);
    setLastMove(null);
    tt.current = new Map(); // clear cache each game

    // Add blocked cells mechanic
    const blockedCount = 3;
    const allCells = Array.from({ length: size * size }, (_, i) => i);
    const randomBlocked = [];
    while (randomBlocked.length < blockedCount) {
      const pick = allCells[Math.floor(Math.random() * allCells.length)];
      if (!randomBlocked.includes(pick)) randomBlocked.push(pick);
    }
    setBlocked(randomBlocked);
  }

  useEffect(() => {
    resetGame(gameMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCellClick(index) {
    if (board[index] || winner || isThinking || blocked.includes(index)) return;
    if (audio.click) audio.click.play();

    if (gameMode === "pvp") {
      const newBoard = [...board];
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);
      setLastMove(index);
      const result = checkWinner(newBoard);
      if (result) {
        setWinner(result);
        if (audio.win && result !== "Draw") audio.win.play();
        if (audio.draw && result === "Draw") audio.draw.play();
      } else setIsXNext(!isXNext);
    } else {
      // Player always X; AI is O
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      setLastMove(index);
      let result = checkWinner(newBoard);
      if (result) {
        setWinner(result);
        if (audio.win && result !== "Draw") audio.win.play();
        if (audio.draw && result === "Draw") audio.draw.play();
        return;
      }
      // AI turn
      setIsThinking(true);
      setTimeout(() => {
        const aiMove = aiMoveBest(newBoard);
        if (aiMove !== -1 && aiMove !== undefined) newBoard[aiMove] = "O";
        setBoard([...newBoard]);
        setLastMove(aiMove);
        result = checkWinner(newBoard);
        if (result) {
          setWinner(result);
          if (audio.win && result !== "Draw") audio.win.play();
          if (audio.draw && result === "Draw") audio.draw.play();
        }
        setIsThinking(false);
      }, THINK_DELAY);
    }
  }

  // Stronger evaluation function with open-line detection and multi-threats
  function evaluateBoard(b) {
  let score = 0;

  for (let line of lines) {
    const vals = line.map((i) => b[i]);
    const o = vals.filter((v) => v === "O").length;
    const x = vals.filter((v) => v === "X").length;
    const empty = vals.filter((v) => !v).length;

    if (o > 0 && x > 0) continue; // blocked line

    // Offensive (AI)
    if (o > 0 && x === 0) {
      if (o === 3 && empty === 1) score += 3000; // almost win
      else if (o === 2 && empty === 2) score += 600;
      else if (o === 1 && empty === 3) score += 100;
    }

    // Defensive (Player threats)
    if (x > 0 && o === 0) {
      if (x === 3 && empty === 1) score -= 2900;
      else if (x === 2 && empty === 2) score -= 500;
      else if (x === 1 && empty === 3) score -= 90;
    }
  }

  // Center control (priority)
  const mid = Math.floor(size / 2);
  const centerIndices = [
    mid * size + mid,
    mid * size + mid - 1,
    (mid - 1) * size + mid,
    (mid - 1) * size + mid - 1,
  ];
  for (const ci of centerIndices) {
    if (b[ci] === "O") score += 50;
    if (b[ci] === "X") score -= 40;
  }

  return score;
}

  // Helper: get all legal moves (non-blocked, empty)
  function legalMoves(b) {
    return b
      .map((v, i) => (v || blocked.includes(i) ? null : i))
      .filter((v) => v !== null);
  }

  // Helper: board -> key string for transposition table
  function boardKey(b) {
    return b.map((c) => (c ? c : ".")).join("");
  }

  // Minimax with alpha-beta and transposition table
  function minimax(b, depth, alpha, beta, maximizingPlayer) {
    const key = boardKey(b) + `|d${depth}|m${maximizingPlayer ? "1" : "0"}`;
    const cached = tt.current.get(key);
    if (cached) return cached;

    const winnerNow = checkWinner(b);
    if (winnerNow === "O") {
      const res = { score: 100000 - (DEPTH - depth), move: undefined };
      tt.current.set(key, res);
      return res;
    }
    if (winnerNow === "X") {
      const res = { score: -100000 + (DEPTH - depth), move: undefined };
      tt.current.set(key, res);
      return res;
    }
    if (winnerNow === "Draw") {
      const res = { score: 0, move: undefined };
      tt.current.set(key, res);
      return res;
    }
    if (depth === 0) {
      const res = { score: evaluateBoard(b), move: undefined };
      tt.current.set(key, res);
      return res;
    }

    const moves = legalMoves(b);
    if (moves.length === 0) {
      const res = { score: 0, move: undefined };
      tt.current.set(key, res);
      return res;
    }

    // Move ordering: evaluate heuristics quickly to sort moves
    const scoredMoves = moves.map((m) => {
      // immediate win/block check
      const copyForO = [...b];
      copyForO[m] = "O";
      const winsForO = checkWinner(copyForO) === "O";
      const copyForX = [...b];
      copyForX[m] = "X";
      const winsForX = checkWinner(copyForX) === "X";

      if (winsForO) return { move: m, score: 999999 };
      if (winsForX) return { move: m, score: 999990 }; // blocking high priority

      // heuristic quick score: evaluateBoard after placing O (aggressive) and placing X (defensive)
      const afterO = [...b];
      afterO[m] = "O";
      const afterX = [...b];
      afterX[m] = "X";

      // small eval to sort
      const h = evaluateBoard(afterO) * 1.05 - evaluateBoard(afterX) * 0.95;

      // center proximity bonus
      const r = Math.floor(m / size);
      const c = m % size;
      const centerR = (size - 1) / 2;
      const centerC = (size - 1) / 2;
      const dist = Math.abs(r - centerR) + Math.abs(c - centerC);
      return { move: m, score: h - dist * 8 };
    });

    scoredMoves.sort((a, b) => b.score - a.score);
    const ordered = scoredMoves.map((s) => s.move);

    if (maximizingPlayer) {
      let value = -Infinity;
      let bestMove = ordered[0];
      for (const m of ordered) {
        const copy = [...b];
        copy[m] = "O";
        const result = minimax(copy, depth - 1, alpha, beta, false);
        if (result.score > value) {
          value = result.score;
          bestMove = m;
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break; // beta cutoff
      }
      const res = { score: value, move: bestMove };
      tt.current.set(key, res);
      return res;
    } else {
      let value = Infinity;
      let bestMove = ordered[0];
      for (const m of ordered) {
        const copy = [...b];
        copy[m] = "X";
        const result = minimax(copy, depth - 1, alpha, beta, true);
        if (result.score < value) {
          value = result.score;
          bestMove = m;
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) break; // alpha cutoff
      }
      const res = { score: value, move: bestMove };
      tt.current.set(key, res);
      return res;
    }
  }

  // AI move selection — no randomness; prefers winning/blocking and best minimax move
  function aiMoveBest(currentBoard) {
    const empties = legalMoves(currentBoard);

    // 1. Immediate win
    for (const i of empties) {
      const copy = [...currentBoard];
      copy[i] = "O";
      if (checkWinner(copy) === "O") return i;
    }

    // 2. Immediate block of player's win
    for (const i of empties) {
      const copy = [...currentBoard];
      copy[i] = "X";
      if (checkWinner(copy) === "X") return i;
    }

    // 3. Use minimax to choose the best move
    // Clear or reuse transposition table (we keep across a game)
    const { move } = minimax(currentBoard, DEPTH, -Infinity, Infinity, true);
    if (move !== undefined) return move;

    // 4. Heuristic fallback (center-pref + highest eval)
    const centerIdx = Math.floor((size * size) / 2);
    if (empties.includes(centerIdx)) return centerIdx;

    let best = empties[0];
    let bestScore = -Infinity;
    for (const m of empties) {
      const copy = [...currentBoard];
      copy[m] = "O";
      const s = evaluateBoard(copy);
      if (s > bestScore) {
        bestScore = s;
        best = m;
      }
    }
    return best !== undefined ? best : (empties.length ? empties[0] : -1);
  }

  const status = winner
    ? winner === 'Draw'
      ? 'Draw.'
      : `${winner} wins.`
    : isThinking
      ? 'Thinking…'
      : `${isXNext ? 'X' : 'O'} to move`;

  return (
    <div className="mx-auto w-full max-w-md">
      <style>{`
        @keyframes cellIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes alertIn { from { transform: scale(1.1); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .cell-in { animation: cellIn 160ms cubic-bezier(0.25, 0.1, 0.25, 1); }
        .alert-in { animation: alertIn 200ms cubic-bezier(0.25, 0.1, 0.25, 1); }
      `}</style>

      <div className="mb-4 flex items-center justify-between gap-3">
        <SegmentedControl
          label="Game mode"
          value={gameMode}
          onChange={(m) => resetGame(m)}
          options={[
            { value: 'pve', label: 'vs Computer' },
            { value: 'pvp', label: 'Two players' },
          ]}
        />
        <button
          type="button"
          onClick={() => resetGame(gameMode)}
          className="inline-flex min-h-[44px] items-center rounded-full px-3 text-callout font-medium text-tint hover:bg-fill"
        >
          Restart
        </button>
      </div>

      <div className="grid aspect-square w-full grid-cols-6 gap-1.5" role="grid" aria-label="Board">
        {board.map((cell, i) => {
          const isBlocked = blocked.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleCellClick(i)}
              disabled={isBlocked || !!winner || isThinking}
              aria-label={isBlocked ? `Cell ${i + 1}, blocked` : cell ? `Cell ${i + 1}, ${cell}` : `Cell ${i + 1}, empty`}
              className={`flex aspect-square w-full items-center justify-center rounded-[10px] text-title3 font-semibold transition-colors duration-150 ${
                isBlocked
                  ? 'cursor-not-allowed bg-label/[0.06] text-label3 dark:bg-white/[0.04]'
                  : cell
                    ? 'bg-fill'
                    : 'bg-fill hover:bg-fill2'
              } ${lastMove === i ? 'ring-2 ring-tint/50' : ''}`}
            >
              {isBlocked ? (
                <span aria-hidden="true" className="text-callout">×</span>
              ) : cell ? (
                <span className={`cell-in ${cell === 'X' ? 'text-tint' : 'text-[#C93400] dark:text-[#FF9F0A]'}`}>{cell}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-callout font-medium" role="status">{status}</p>
      <p className="mt-2 text-center text-footnote text-label2">
        Four in a row wins. A few cells are blocked each game. The computer searches four moves ahead, so it is strong but beatable.
      </p>

      {winner && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4" role="alertdialog" aria-modal="true" aria-labelledby="game-alert-title">
          <div className="alert-in material-bar w-[270px] overflow-hidden rounded-[14px] text-center">
            <div className="px-4 pb-4 pt-5">
              <h2 id="game-alert-title" className="text-headline font-semibold">
                {winner === 'Draw' ? 'Draw' : `${winner} Wins`}
              </h2>
              <p className="mt-1 text-footnote text-label">Play another round?</p>
            </div>
            <div className="hairline-t flex">
              <button type="button" onClick={() => resetGame(gameMode)} className="min-h-[44px] flex-1 text-body font-semibold text-tint hover:bg-fill" autoFocus>
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
