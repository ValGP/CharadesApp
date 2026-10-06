import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  RotateCcw,
  Flag,
  ChevronDown,
  Layers,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { WordItem, GameMode, Team, ScoreConfig } from '../types/game';

interface PlayScreenProps {
  words: WordItem[];
  gameMode: GameMode;
  scoreConfig: ScoreConfig | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onExit: () => void;
  onFinishGame: (finalTeams: Team[]) => void;
  onReshuffle: () => void;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  words,
  gameMode,
  scoreConfig,
  isDark,
  onToggleTheme,
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
      className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between select-none overflow-hidden touch-manipulation bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 z-50"
    >
      {/* SECCIÓN SUPERIOR COMPACTA */}
      <div className="w-full shrink-0 safe-top px-3 sm:px-4 pb-1 space-y-1.5 z-30">
        {/* Fila 1: Control principal, Categoría, Contador y Ajustes */}
        <div className="flex items-center justify-between gap-2 h-9">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExit();
              }}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Salir al menú"
            >
              <X className="w-4 h-4" />
            </button>

            {currentWord?.category && (
              <span className="truncate px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                {currentWord.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
              <Layers className="w-3 h-3" />
              {currentIndex + 1} / {words.length}
            </span>

            {gameMode === 'score' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFinishGame(teams);
                }}
                className="px-2 py-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md border border-red-200 dark:border-red-500/20 transition-all flex items-center gap-1"
                title="Finalizar partida ahora"
              >
                <Flag className="w-3 h-3" />
                <span className="hidden xs:inline">Terminar</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleTheme();
              }}
              className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Alternar tema claro/oscuro"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Fila 2: En Score Mode: Barra unificada de Turno Activo y Marcador */}
        {gameMode === 'score' && (
          <div className="relative flex items-center justify-between gap-2 px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
            {/* Selector de turno */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0">Turno:</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTeamDropdown(!showTeamDropdown);
                }}
                className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors truncate"
              >
                <span className="truncate">{activeTeam?.name}</span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>
            </div>

            {/* Marcadores de equipos */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 pl-1">
              {teams.map((team, idx) => {
                const isActive = idx === currentTeamIndex;
                return (
                  <button
                    key={team.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManualTeamSelect(idx);
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-400 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="max-w-[60px] truncate">{team.name}</span>
                    <span className={`px-1 rounded ${isActive ? 'bg-purple-800 text-purple-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                      {team.score}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown flotante */}
            {showTeamDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1 z-40 text-slate-800 dark:text-slate-200"
              >
                <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2.5 py-1">
                  Elegir equipo en turno:
                </p>
                {teams.map((team, idx) => (
                  <button
                    key={team.id}
                    onClick={() => handleManualTeamSelect(idx)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      idx === currentTeamIndex
                        ? 'bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{team.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 shrink-0">{team.score} pts</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ÁREA CENTRAL: LA PALABRA GIGANTE (AJUSTE AUTOMÁTICO DE ALTURA SIN SCROLL) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-2 text-center z-10 overflow-hidden">
        {currentWord ? (
          <div className="max-w-xl w-full flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-100">
            {/* Título Principal con tamaño responsive inteligente */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-snug drop-shadow-xs max-h-[40vh] overflow-hidden break-words line-clamp-3">
              {currentWord.es}
            </h2>

            {/* Subtítulo Dual (ej. Inglés para películas y series si es distinto) */}
            {currentWord.en && currentWord.en.toLowerCase() !== currentWord.es.toLowerCase() && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 shadow-xs max-w-full">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">EN:</span>
                <span className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 truncate">
                  {currentWord.en}
                </span>
              </div>
            )}

            {gameMode === 'free' && (
              <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 pt-2 animate-pulse select-none">
                Toca la pantalla para avanzar
              </p>
            )}
          </div>
        ) : (
          <p className="text-slate-400">No hay palabras disponibles.</p>
        )}
      </div>

      {/* ÁREA INFERIOR: BOTONES ERGONÓMICOS CON SAFE BOTTOM */}
      <div className="w-full shrink-0 safe-bottom px-3 sm:px-4 pb-2 pt-1 z-30">
        {gameMode === 'free' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextWordFree();
            }}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-base shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span>Siguiente Palabra</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-lg mx-auto">
            {/* Botón PASO */}
            <button
              onClick={handleScorePass}
              className="py-3.5 sm:py-4 px-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 font-extrabold text-base shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Paso</span>
            </button>

            {/* Botón ¡CORRECTO! (+1) */}
            <button
              onClick={handleScoreCorrect}
              className="py-3.5 sm:py-4 px-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-5 h-5 stroke-[3]" />
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl text-slate-900 dark:text-white">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
              🎉
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">¡Mazo Completado!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Han pasado por todas las {words.length} palabras de las categorías seleccionadas.
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setIsPoolExhausted(false);
                  setCurrentIndex(0);
                  onReshuffle();
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Volver a Barajar Mazo
              </button>

              {gameMode === 'score' ? (
                <button
                  onClick={() => onFinishGame(teams)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  Ver Resultados Finales
                </button>
              ) : (
                <button
                  onClick={onExit}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
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
