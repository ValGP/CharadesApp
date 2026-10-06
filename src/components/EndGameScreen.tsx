import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Home, Award } from 'lucide-react';
import { Team } from '../types/game';
import { fireVictoryConfetti } from '../utils/confetti';

interface EndGameScreenProps {
  teams: Team[];
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const EndGameScreen: React.FC<EndGameScreenProps> = ({
  teams,
  onPlayAgain,
  onBackToHome,
}) => {
  // Ordenar equipos por puntaje descendente
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  useEffect(() => {
    fireVictoryConfetti();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-between px-4 py-6 max-w-lg mx-auto w-full select-none animate-in fade-in duration-300 text-slate-900 dark:text-white">
      {/* Encabezado de Victoria */}
      <div className="text-center space-y-2 mt-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mb-1 shadow-lg shadow-amber-500/10">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          ¡Fin de la Partida!
        </h2>
        {winner && (
          <p className="text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-300">
            🏆 ¡Ganador: <span className="text-amber-600 dark:text-amber-300 font-extrabold">{winner.name}</span> con {winner.score} pts!
          </p>
        )}
      </div>

      {/* Tabla de Ranking y Estadísticas */}
      <div className="w-full space-y-3 my-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Ranking Final de Equipos
        </h3>

        <div className="space-y-2.5">
          {sortedTeams.map((team, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={team.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isFirst
                    ? 'bg-gradient-to-r from-amber-50 via-purple-50 to-white dark:from-amber-950/40 dark:via-purple-950/40 dark:to-slate-900 border-amber-300 dark:border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                        : isSecond
                        ? 'bg-slate-200 text-slate-900 dark:bg-slate-300 dark:text-slate-950'
                        : isThird
                        ? 'bg-amber-600 text-white dark:bg-amber-700'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {isFirst ? <Award className="w-5 h-5" /> : `#${idx + 1}`}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{team.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {team.passes} {team.passes === 1 ? 'paso' : 'pasos'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {team.score}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="w-full space-y-2.5 pt-2">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Jugar Otra Vez (Mismos Equipos)</span>
        </button>

        <button
          onClick={onBackToHome}
          className="w-full py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Volver al Menú Principal</span>
        </button>
      </div>
    </div>
  );
};
