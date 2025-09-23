import React from 'react';
import Game from '../components/Game';

const GamePage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h1 className="text-3xl font-extrabold text-center text-slate-900 dark:text-slate-100 mb-2">Space Dodger</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
          Use the arrow keys or drag to move your ship and dodge the incoming asteroids. Good luck!
        </p>
        <Game />
      </div>
    </div>
  );
};

export default GamePage;
