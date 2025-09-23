const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-transparent animate-spin dark:border-slate-700" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-cyan-400/20 to-emerald-400/20 blur" />
      </div>
      <div className="w-64 max-w-[80vw]">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/2 animate-[progress_1.4s_ease_infinite] rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />
        </div>
      </div>
      <style>{`@keyframes progress { 0% { transform: translateX(-100%); } 50% { transform: translateX(-10%); } 100% { transform: translateX(110%); } }`}</style>
    </div>
  );
};

export default LoadingSpinner;
