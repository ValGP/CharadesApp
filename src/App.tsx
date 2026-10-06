import { useState, useMemo } from 'react';
import { builtInCategories } from './data/categories';
import { Category, GameMode, ScreenState, ScoreConfig, Team, WordItem } from './types/game';
import { shuffleArray } from './utils/shuffle';
import { Header } from './components/Header';
import { CategoryCard } from './components/CategoryCard';
import { CustomCategoryModal } from './components/CustomCategoryModal';
import { ScoreSetupModal } from './components/ScoreSetupModal';
import { PlayScreen } from './components/PlayScreen';
import { EndGameScreen } from './components/EndGameScreen';
import { Play, Plus, Zap, Trophy, CheckSquare, Square } from 'lucide-react';

export function App() {
  const [isDark, setIsDark] = useState(true);
  const [categories, setCategories] = useState<Category[]>(builtInCategories);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([
    'movies',
    'series',
    'activities',
  ]);
  const [gameMode, setGameMode] = useState<GameMode>('free');
  const [screenState, setScreenState] = useState<ScreenState>('home');

  // Modales
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Estado de juego activo
  const [activeWords, setActiveWords] = useState<WordItem[]>([]);
  const [scoreConfig, setScoreConfig] = useState<ScoreConfig | null>(null);
  const [finalTeams, setFinalTeams] = useState<Team[]>([]);

  // Sincronizar clase 'dark' con documentElement
  const handleToggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Alternar selección de categoría
  const handleToggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Seleccionar todas / deseleccionar todas
  const handleSelectAll = () => {
    if (selectedCategoryIds.length === categories.length) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(categories.map((c) => c.id));
    }
  };

  // Eliminar categoría personalizada
  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setSelectedCategoryIds((prev) => prev.filter((item) => item !== id));
  };

  // Guardar categoría personalizada
  const handleSaveCustomCategory = (newCat: Category, playOnlyThis: boolean) => {
    setCategories((prev) => [newCat, ...prev]);
    if (playOnlyThis) {
      setSelectedCategoryIds([newCat.id]);
    } else {
      setSelectedCategoryIds((prev) => [...prev, newCat.id]);
    }
  };

  // Conteo total de palabras en categorías seleccionadas
  const totalSelectedWords = useMemo(() => {
    return categories
      .filter((c) => selectedCategoryIds.includes(c.id))
      .reduce((acc, c) => acc + c.words.length, 0);
  }, [categories, selectedCategoryIds]);

  // Preparar palabras barajadas del pool
  const generateShuffledPool = (): WordItem[] => {
    const pool: WordItem[] = [];
    categories
      .filter((c) => selectedCategoryIds.includes(c.id))
      .forEach((c) => {
        pool.push(...c.words);
      });
    return shuffleArray(pool);
  };

  // Iniciar Juego
  const handleStartGame = () => {
    if (selectedCategoryIds.length === 0) {
      alert('Por favor selecciona al menos una categoría para jugar.');
      return;
    }

    if (gameMode === 'free') {
      const shuffled = generateShuffledPool();
      setActiveWords(shuffled);
      setScreenState('playing');
    } else {
      setIsScoreModalOpen(true);
    }
  };

  const handleStartScoreMode = (config: ScoreConfig) => {
    setScoreConfig(config);
    setIsScoreModalOpen(false);
    const shuffled = generateShuffledPool();
    setActiveWords(shuffled);
    setScreenState('playing');
  };

  const handleReshuffle = () => {
    const shuffled = generateShuffledPool();
    setActiveWords(shuffled);
  };

  const handleFinishScoreGame = (teams: Team[]) => {
    setFinalTeams(teams);
    setScreenState('end-game');
  };

  const handlePlayAgain = () => {
    if (scoreConfig) {
      const resetTeams = scoreConfig.teams.map((t) => ({ ...t, score: 0, passes: 0 }));
      setScoreConfig({ ...scoreConfig, teams: resetTeams });
    }
    const shuffled = generateShuffledPool();
    setActiveWords(shuffled);
    setScreenState('playing');
  };

  const handleBackToHome = () => {
    setScreenState('home');
    setScoreConfig(null);
    setFinalTeams([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onReset={screenState !== 'home' ? handleBackToHome : undefined}
        showReset={screenState !== 'home'}
      />

      {/* PANTALLA PRINCIPAL */}
      {screenState === 'home' && (
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-6">
          {/* Selector de Modo de Juego */}
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Modo de Juego
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Opción 1: Juego Libre */}
              <button
                type="button"
                onClick={() => setGameMode('free')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  gameMode === 'free'
                    ? 'bg-purple-100/70 dark:bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/10 ring-1 ring-purple-500/40'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`p-2 rounded-xl ${
                      gameMode === 'free' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Juego Libre</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sin puntuación ni restricciones. Pasa palabras a tu propio ritmo.
                </p>
              </button>

              {/* Opción 2: Modo Puntaje */}
              <button
                type="button"
                onClick={() => setGameMode('score')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  gameMode === 'score'
                    ? 'bg-amber-100/70 dark:bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`p-2 rounded-xl ${
                      gameMode === 'score' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Modo Puntaje</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Compite por equipos con Aciertos (+1), Pasos y podio final.
                </p>
              </button>
            </div>
          </section>

          {/* Categorías */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Categorías
                </h2>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                  {selectedCategoryIds.length} seleccionadas ({totalSelectedWords} palabras en total)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors shadow-sm"
                >
                  {selectedCategoryIds.length === categories.length ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Deseleccionar</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      <span>Todas</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg shadow-md shadow-purple-600/20 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear Custom</span>
                </button>
              </div>
            </div>

            {/* Grid de Categorías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategoryIds.includes(category.id)}
                  onToggle={handleToggleCategory}
                  onDelete={category.isCustom ? handleDeleteCategory : undefined}
                />
              ))}
            </div>
          </section>

          {/* Botón Flotante / Inferior de Iniciar Juego */}
          <div className="sticky bottom-4 pt-2 z-30">
            <button
              onClick={handleStartGame}
              disabled={selectedCategoryIds.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-lg tracking-wide shadow-2xl shadow-purple-600/40 flex items-center justify-center gap-3 active:scale-98 transition-all"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>¡JUGAR AHORA ({totalSelectedWords} PALABRAS)!</span>
            </button>
          </div>
        </main>
      )}

      {/* PANTALLA DE JUEGO */}
      {screenState === 'playing' && (
        <PlayScreen
          words={activeWords}
          gameMode={gameMode}
          scoreConfig={scoreConfig}
          onExit={handleBackToHome}
          onFinishGame={handleFinishScoreGame}
          onReshuffle={handleReshuffle}
        />
      )}

      {/* PANTALLA DE RESULTADOS (SCORE MODE) */}
      {screenState === 'end-game' && (
        <EndGameScreen
          teams={finalTeams}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* MODALES */}
      <CustomCategoryModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSaveCategory={handleSaveCustomCategory}
      />

      <ScoreSetupModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        onStartGame={handleStartScoreMode}
      />
    </div>
  );
}

export default App;
