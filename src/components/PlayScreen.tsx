import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  X,
  RotateCcw,
  Flag,
  ChevronDown,
  Layers
} from 'lucide-react';
import { WordItem, GameMode, Team, ScoreConfig } from '../types/game';

interface PlayScreenProps {
  words: WordItem[];
  gameMode: GameMode;
  scoreConfig: ScoreConfig | null;
  onExit: () => void;
  onFinishGame: (finalTeams: Team[]) => void;
  onReshuffle: () => void;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  words,
  gameMode,
  scoreConfig,
  onExit,
  onFinishGame,
  onReshuffle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [teams, setTeams] = useState<Team[]>(scoreConfig?.teams || []);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [isPoolExhausted, setIsPoolExhausted] = useState(false);

  const currentWord: WordItem | undefined = words[currentIndex];
  const activeTeam = teams[currentTeamIndex];

  // Avanzar palabra en Free Play
  const handleNextWordFree = () => {
    if (currentIndex + 1 >= words.length) {
      setIsPoolExhausted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Manejo de Acierto (+1) en Score Mode
  const handleScoreCorrect = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeTeam) return;

    const updatedTeams = teams.map((team, idx) => {
      if (idx === currentTeamIndex) {
        return { ...team, score: team.score + 1 };
      }
      return team;
    });

    setTeams(updatedTeams);

    // Verificar si se alcanzó la meta de puntos
    const reachedTarget = scoreConfig?.targetScore && updatedTeams[currentTeamIndex].score >= scoreConfig.targetScore;
    if (reachedTarget) {
      onFinishGame(updatedTeams);
      return;
    }

    advanceTurnAndWord(updatedTeams);
  };

  // Manejo de Paso en Score Mode
  const handleScorePass = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeTeam) return;

    const updatedTeams = teams.map((team, idx) => {
      if (idx === currentTeamIndex) {
        return { ...team, passes: team.passes + 1 };
      }
      return team;
    });

    setTeams(updatedTeams);
    advanceTurnAndWord(updatedTeams);
  };

  const advanceTurnAndWord = (currentTeamsList: Team[]) => {
    if (currentIndex + 1 >= words.length) {
      setIsPoolExhausted(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    // Rotar automáticamente al siguiente equipo
    setCurrentTeamIndex((prev) => (prev + 1) % currentTeamsList.length);
  };

  const handleManualTeamSelect = (index: number) => {
    setCurrentTeamIndex(index);
    setShowTeamDropdown(false);
  };

  // Tocar la pantalla en Free Play avanza de palabra
  const handleScreenClick = () => {
    if (gameMode === 'free') {
      handleNextWordFree();
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className="relative flex-1 flex flex-col justify-between select-none overflow-hidden touch-manipulation"
    >
      {/* Barra superior de información */}
      <div className="w-full px-4 pt-3 pb-2 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          {currentWord?.category && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              {currentWord.category}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {currentIndex + 1} / {words.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {gameMode === 'score' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFinishGame(teams);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg border border-red-200 dark:border-red-500/20 transition-all flex items-center gap-1"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Finalizar</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Salir al menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini-marcador superior en Score Mode */}
      {gameMode === 'score' && (
        <div className="px-4 py-1 z-20 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {teams.map((team, idx) => {
              const isActive = idx === currentTeamIndex;
              return (
                <button
                  key={team.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualTeamSelect(idx);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isActive
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 scale-102'
                      : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                  }`}
                >
                  <span>{team.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {team.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Banner de Turno Activo con selector desplegable */}
          <div className="mt-2 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-2xl relative shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Turno de:</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTeamDropdown(!showTeamDropdown);
                }}
                className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                <span>{activeTeam?.name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {scoreConfig?.targetScore && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Meta: {scoreConfig.targetScore} pts
              </span>
            )}

            {/* Dropdown flotante para cambio manual de turno */}
            {showTeamDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 text-slate-800 dark:text-slate-200"
              >
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-1">
                  Cambiar equipo activo:
                </p>
                {teams.map((team, idx) => (
                  <button
                    key={team.id}
                    onClick={() => handleManualTeamSelect(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      idx === currentTeamIndex
                        ? 'bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{team.name}</span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{team.score} pts</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ÁREA CENTRAL: LA PALABRA GIGANTE */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center z-10">
        {currentWord ? (
          <div className="max-w-3xl w-full flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-150">
            {/* Título Principal */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight drop-shadow-sm">
              {currentWord.es}
            </h2>

            {/* Subtítulo Dual (ej. Inglés para películas y series si es distinto) */}
            {currentWord.en && currentWord.en.toLowerCase() !== currentWord.es.toLowerCase() && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400">Título en Inglés:</span>
                <span className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300">
                  {currentWord.en}
                </span>
              </div>
            )}

            {gameMode === 'free' && (
              <p className="text-xs text-slate-400 dark:text-slate-500 pt-6 animate-pulse select-none">
                Toca cualquier lugar de la pantalla para avanzar
              </p>
            )}
          </div>
        ) : (
          <p className="text-slate-400">No hay palabras disponibles.</p>
        )}
      </div>

      {/* ÁREA INFERIOR: BOTONES DE ACCIÓN */}
      <div className="w-full px-4 pb-6 pt-2 z-20 shrink-0">
        {gameMode === 'free' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextWordFree();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span>Siguiente Palabra</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
            {/* Botón PASO */}
            <button
              onClick={handleScorePass}
              className="py-4 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 font-extrabold text-base sm:text-lg shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Paso</span>
            </button>

            {/* Botón ¡CORRECTO! (+1) */}
            <button
              onClick={handleScoreCorrect}
              className="py-4 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>¡Correcto! (+1)</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL FIN DE PALABRAS */}
      {isPoolExhausted && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl">
              🎉
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">¡Mazo Completado!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Han pasado por todas las {words.length} palabras disponibles en las categorías seleccionadas.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsPoolExhausted(false);
                  setCurrentIndex(0);
                  onReshuffle();
                }}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Volver a Barajar Mazo
              </button>

              {gameMode === 'score' ? (
                <button
                  onClick={() => onFinishGame(teams)}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  Ver Resultados Finales
                </button>
              ) : (
                <button
                  onClick={onExit}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  Volver al Menú Principal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
