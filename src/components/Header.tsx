import React from 'react';
import { Sun, Moon, RotateCcw } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onReset?: () => void;
  showReset?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onReset,
  showReset = false,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-lg">
          🎭
        </div>
        <div>
          <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 dark:from-purple-400 dark:via-pink-400 dark:to-amber-300 bg-clip-text text-transparent">
            Dígalo con Mímica
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider hidden sm:block">
            Charades Party
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showReset && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-lg border border-slate-200 dark:border-slate-700"
            title="Reiniciar y volver al menú principal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Menú</span>
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label="Alternar tema"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
        </button>
      </div>
    </header>
  );
};
