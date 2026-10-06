import React, { useState } from 'react';
import { X, Trophy, Users, Play, Plus, Minus } from 'lucide-react';
import { ScoreConfig, Team } from '../types/game';

interface ScoreSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (config: ScoreConfig) => void;
}

const suggestedTeamNames = ['Equipo Rojo', 'Equipo Azul', 'Los Invencibles', 'Los Genios', 'Equipo Fuego', 'Equipo Trueno'];

export const ScoreSetupModal: React.FC<ScoreSetupModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  const [numTeams, setNumTeams] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>(['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4', 'Equipo 5', 'Equipo 6']);
  const [targetScore, setTargetScore] = useState<number | null>(15);

  if (!isOpen) return null;

  const handleTeamNameChange = (index: number, val: string) => {
    const updated = [...teamNames];
    updated[index] = val;
    setTeamNames(updated);
  };

  const setTeamsCount = (count: number) => {
    if (count < 2 || count > 6) return;
    setNumTeams(count);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    const teams: Team[] = [];
    for (let i = 0; i < numTeams; i++) {
      const name = teamNames[i].trim() || `Equipo ${i + 1}`;
      teams.push({
        id: `team-${i + 1}`,
        name,
        score: 0,
        passes: 0,
      });
    }

    onStartGame({
      teams,
      targetScore,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Configurar Modo Puntaje</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleStart} className="p-6 space-y-5">
          {/* Número de Equipos */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
              Cantidad de Equipos
            </label>
            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setTeamsCount(numTeams - 1)}
                disabled={numTeams <= 2}
                className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-white flex items-center justify-center transition-all active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-extrabold text-lg text-slate-900 dark:text-white">{numTeams} Equipos</span>
              </div>
              <button
                type="button"
                onClick={() => setTeamsCount(numTeams + 1)}
                disabled={numTeams >= 6}
                className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-white flex items-center justify-center transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nombres de los equipos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Nombres de los Equipos
              </label>
              <button
                type="button"
                onClick={() => {
                  const shuffled = [...suggestedTeamNames].sort(() => 0.5 - Math.random());
                  setTeamNames(shuffled);
                }}
                className="text-[11px] text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
              >
                Sugerir nombres
              </button>
            </div>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {Array.from({ length: numTeams }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-xs font-bold text-slate-400 text-center">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={teamNames[idx] || ''}
                    onChange={(e) => handleTeamNameChange(idx, e.target.value)}
                    placeholder={`Equipo ${idx + 1}`}
                    maxLength={25}
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Meta de Puntos */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
              Meta de Puntos para Ganar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20].map((points) => (
                <button
                  key={points}
                  type="button"
                  onClick={() => setTargetScore(points)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    targetScore === points
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {points} pts
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTargetScore(null)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  targetScore === null
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                Libre
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              {targetScore
                ? `El primer equipo en llegar a ${targetScore} puntos ganará la partida.`
                : 'Sin límite de puntos. La partida termina cuando decidan o se acaben las palabras.'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              ¡Comenzar Partida!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
