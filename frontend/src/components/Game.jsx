import React, { useState, useEffect } from "react";

export default function Game() {
  const size = 6; // 6x6 grid
  const winLength = 4; // need 4 in a row to win
  const DEPTH = 3; // minimax depth
  const THINK_DELAY = 500; // ms

  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState("pve"); // default 1 player vs AI
  const [isThinking, setIsThinking] = useState(false);
  const [blocked, setBlocked] = useState([]);
  const [audio, setAudio] = useState({});
  const [lastMove, setLastMove] = useState(null);

  // Preload sounds
  useEffect(() => {
    setAudio({
      click: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
      win: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
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
      for (let k = 0; k < winLength; k++) line.push((r + k) * size + (c + k));
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
    if (newBoard.every((cell, i) => cell || blocked.includes(i))) return "Draw";
    return null;
  }

  function resetGame(mode = gameMode) {
    setBoard(Array(size * size).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameMode(mode);
    setIsThinking(false);
    setLastMove(null);
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
        if (aiMove !== -1) newBoard[aiMove] = "O";
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

  // Evaluation function: stronger weighting and look for open lines
  function evaluateBoard(b) {
    let score = 0;
    for (let line of lines) {
      const vals = line.map((i) => b[i]);
      const o = vals.filter((v) => v === "O").length;
      const x = vals.filter((v) => v === "X").length;
      const empty = vals.filter((v) => !v).length;

      // immediate wins/loses handled elsewhere, but give large weight
      if (o > 0 && x === 0) {
        if (o === 3 && empty === 1) score += 1000; // open-3 (one away)
        else if (o === 2 && empty === 2) score += 200; // 2-in-line with two empties
        else if (o === 1) score += 10;
      }
      if (x > 0 && o === 0) {
        if (x === 3 && empty === 1) score -= 900; // player threat
        else if (x === 2 && empty === 2) score -= 180;
        else if (x === 1) score -= 8;
      }
    }

    // center control bonus
    const centerIndices = [];
    const mid = Math.floor(size / 2);
    for (let dr = -1; dr <= 0; dr++) {
      for (let dc = -1; dc <= 0; dc++) {
        const r = mid + dr;
        const c = mid + dc;
        if (r >= 0 && r < size && c >= 0 && c < size) centerIndices.push(r * size + c);
      }
    }
    for (const ci of centerIndices) {
      if (b[ci] === "O") score += 30;
      if (b[ci] === "X") score -= 20;
    }

    return score;
  }

  // alpha-beta minimax with depth limit
  function minimax(b, depth, alpha, beta, maximizingPlayer) {
    const winnerNow = checkWinner(b);
    if (winnerNow === "O") return { score: 100000 - depth };
    if (winnerNow === "X") return { score: -100000 + depth };
    if (winnerNow === "Draw") return { score: 0 };
    if (depth === 0) return { score: evaluateBoard(b) };

    const moves = b.map((v, i) => (v || blocked.includes(i) ? null : i)).filter((v) => v !== null);
    if (moves.length === 0) return { score: 0 };

    // move ordering: try immediate wins/blocks first
    const ordered = [...moves];
    ordered.sort((a, bIdx) => {
      // prefer moves that create immediate win
      const copyA = [...b];
      copyA[a] = maximizingPlayer ? "O" : "X";
      const winA = checkWinner(copyA) === (maximizingPlayer ? "O" : "X");
      const copyB = [...b];
      copyB[bIdx] = maximizingPlayer ? "O" : "X";
      const winB = checkWinner(copyB) === (maximizingPlayer ? "O" : "X");
      return (winB ? 1 : 0) - (winA ? 1 : 0);
    });

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
        if (alpha >= beta) break; // beta cut-off
      }
      return { score: value, move: bestMove };
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
        if (alpha >= beta) break; // alpha cut-off
      }
      return { score: value, move: bestMove };
    }
  }

  function aiMoveBest(currentBoard) {
    // quick heuristic shortcuts: win/block immediate
    const empties = currentBoard.map((v, i) => (v || blocked.includes(i) ? null : i)).filter((v) => v !== null);
    for (const i of empties) {
      const copy = [...currentBoard];
      copy[i] = "O";
      if (checkWinner(copy) === "O") return i;
    }
    for (const i of empties) {
      const copy = [...currentBoard];
      copy[i] = "X";
      if (checkWinner(copy) === "X") return i; // block
    }

    // otherwise run minimax with depth limit and alpha-beta
    const { move } = minimax(currentBoard, DEPTH, -Infinity, Infinity, true);
    if (move !== undefined) return move;

    // fallback: random
    return empties.length ? empties[Math.floor(Math.random() * empties.length)] : -1;
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
          💡 Some cells are blocked (✖) each game for extra challenge!
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