import React, { useState, useEffect, useRef } from "react";

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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Local keyframes */}
      <style>{`
        @keyframes popIn { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4) } 50% { box-shadow: 0 0 0 8px rgba(59,130,246,0) } }
        @keyframes dots { 0% { content: ''; } 33% { content: '.'; } 66% { content: '..'; } 100% { content: '...'; } }
        .thinking:after { content: ''; animation: dots 1.2s steps(3,end) infinite; }
        .cell-pop { animation: popIn 200ms ease-out; }
        .modal-pop { animation: popIn 240ms ease-out; }
      `}</style>

      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 text-center">
          Tic Tac Toe 6×6
        </h1>
        <p className="text-sm md:text-base text-center text-slate-600 dark:text-slate-400 mb-6">
          Get 4 in a row to win!
        </p>

        {/* Decorative glow behind grid */}
        <div className="relative flex justify-center mb-6">
          <div className="pointer-events-none absolute -z-10 h-48 w-48 md:h-64 md:w-64 rounded-full bg-blue-400/20 blur-3xl" />

          {/* Responsive grid container */}
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
            <div className="grid grid-cols-6 gap-1 md:gap-2 w-full aspect-square">
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={blocked.includes(i) || !!winner || isThinking}
                  className={`
                    aspect-square w-full rounded-md border transition-all duration-150
                    flex items-center justify-center
                    text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold
                    ${
                      blocked.includes(i)
                        ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 dark:border-slate-700'
                        : cell
                        ? 'bg-white text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 cell-pop shadow-sm'
                        : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'
                    }
                  `}
                  aria-label={`cell-${i}`}
                >
                  {cell || (blocked.includes(i) ? "✖" : "")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          {winner ? (
            winner === "Draw" ? (
              <p className="text-lg md:text-xl font-semibold text-slate-700 dark:text-slate-200">It's a Draw! 🤝</p>
            ) : (
              <p className="text-lg md:text-xl font-semibold text-slate-700 dark:text-slate-200">
                Winner: <span className="text-2xl">{winner}</span> 🎉
              </p>
            )
          ) : (
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300">
              {isThinking ? (
                <span className="thinking">AI is thinking</span>
              ) : (
                <>
                  Next Turn: <span className="font-semibold text-xl">{isXNext ? "X" : "O"}</span>
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <button
            onClick={() => resetGame("pvp")}
            className={`w-full sm:w-auto rounded-full px-6 py-3 text-sm md:text-base font-semibold shadow transition-all duration-200 ${
              gameMode === 'pvp'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            👥 2 Players
          </button>
          <button
            onClick={() => resetGame("pve")}
            className={`w-full sm:w-auto rounded-full px-6 py-3 text-sm md:text-base font-semibold shadow transition-all duration-200 ${
              gameMode === 'pve'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            🤖 vs AI
          </button>
          <button
            onClick={() => resetGame(gameMode)}
            className="w-full sm:w-auto rounded-full bg-emerald-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow hover:bg-emerald-600 transition-all duration-200"
          >
            🔄 Restart
          </button>
        </div>

        <p className="text-xs md:text-sm text-center text-slate-500 dark:text-slate-400 px-4">
          💡 Some cells are blocked (✖) each game for extra challenge! AI is tuned to be extremely strong but still beatable with careful play.
        </p>
      </div>

      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="modal-pop relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white/90 p-6 text-center shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-400 opacity-60 blur" />
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              {winner === 'Draw' ? "It's a Draw! 🤝" : `${winner} Wins! 🎉`}
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6">
              {winner === 'Draw' ? 'Great match!' : 'Congratulations!'} Want to play again?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => resetGame(gameMode)}
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow hover:bg-emerald-600 transition-all duration-200"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => resetGame('pvp')}
                className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm md:text-base font-semibold text-slate-700 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 transition-all duration-200"
              >
                👥 2 Players
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
