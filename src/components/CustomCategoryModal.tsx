import React, { useState } from 'react';
import { X, Upload, Copy, Check, FileSpreadsheet, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { Category, WordItem } from '../types/game';
import { parsePlainText, parseExcelFile } from '../utils/importer';

interface CustomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCategory: (category: Category, playOnlyThis: boolean) => void;
}

type TabType = 'manual' | 'file' | 'ai';

export const CustomCategoryModal: React.FC<CustomCategoryModalProps> = ({
  isOpen,
  onClose,
  onSaveCategory,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [categoryName, setCategoryName] = useState('');
  const [manualText, setManualText] = useState('');
  const [playOnlyThis, setPlayOnlyThis] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [aiTopic, setAiTopic] = useState('Superhéroes y Villanos de Marvel');
  const [fileWords, setFileWords] = useState<WordItem[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const detectedManualWords = parsePlainText(manualText, categoryName || 'Personalizada');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setFileName(file.name);

    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        const words = parsePlainText(text, categoryName || file.name.replace('.txt', ''));
        if (words.length === 0) {
          throw new Error('El archivo .txt no contiene palabras válidas.');
        }
        setFileWords(words);
        if (!categoryName) {
          setCategoryName(file.name.replace('.txt', ''));
        }
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const result = await parseExcelFile(file, categoryName || file.name.replace(/\.[^/.]+$/, ''));
        setFileWords(result.words);
        if (!categoryName && result.categoryName) {
          setCategoryName(result.categoryName);
        }
      } else {
        throw new Error('Formato no soportado. Por favor sube un archivo .txt o .xlsx');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar el archivo.';
      setErrorMessage(msg);
      setFileWords([]);
      setFileName(null);
    }
  };

  const handleCopyAiPrompt = () => {
    const prompt = `Generate a plain text list containing 150 unique items for a Charades game.
Category: ${aiTopic || '[CATEGORY NAME]'}
Rules:
- One item per line.
- No numbering.
- No bullet points.
- No duplicates.
- Keep names concise.
- Return only the list.`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const name = categoryName.trim() || 'Categoría Personalizada';
    let wordsToSave: WordItem[] = [];

    if (activeTab === 'manual') {
      wordsToSave = parsePlainText(manualText, name);
    } else if (activeTab === 'file') {
      wordsToSave = fileWords;
    } else if (activeTab === 'ai') {
      setActiveTab('manual');
      return;
    }

    if (wordsToSave.length === 0) {
      setErrorMessage('Debes ingresar o cargar al menos 1 palabra para crear la categoría.');
      return;
    }

    const newCategory: Category = {
      id: `custom-cat-${Date.now()}`,
      name,
      icon: 'Sparkles',
      isCustom: true,
      hasDualTitles: false,
      words: wordsToSave,
    };

    onSaveCategory(newCategory, playOnlyThis);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Crear Categoría Personalizada</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 shrink-0 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Manual / Pegar
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'file'
                ? 'border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Subir Archivo
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'ai'
                ? 'border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            Asistente IA
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nombre de la categoría (en tabs manual y file) */}
          {activeTab !== 'ai' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre de la Categoría
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ej. Personajes de Marvel, Pelis de Terror..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          )}

          {/* TAB 1: MANUAL */}
          {activeTab === 'manual' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Palabras o Frases (una por línea)
                </label>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  {detectedManualWords.length} {detectedManualWords.length === 1 ? 'palabra' : 'palabras'}
                </span>
              </div>
              <textarea
                rows={7}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Iron Man&#10;Thor&#10;Capitán América&#10;Hulk&#10;Loki"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Pega directamente una lista. Se limpiarán automáticamente viñetas, guiones y números.
              </p>
            </div>
          )}

          {/* TAB 2: ARCHIVO */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 dark:bg-slate-950/50">
                <input
                  type="file"
                  id="fileInput"
                  accept=".txt,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Haz clic para elegir archivo o arrástralo aquí
                  </span>
                  <span className="text-xs text-slate-500">
                    Soporta archivos <strong>.txt</strong> (1 palabra por línea) o <strong>.xlsx</strong> (Excel)
                  </span>
                </label>
              </div>

              {fileName && (
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    {fileName.endsWith('.txt') ? (
                      <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{fileName}</span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {fileWords.length} palabras detectadas
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROMPT IA */}
          {activeTab === 'ai' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Genera fácilmente listas enormes de cualquier temática con ChatGPT o Claude para pegarlas en la app.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tema deseado
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ej. Películas de terror, Anime, Canciones de Rock..."
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="relative bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-800 dark:text-slate-300 space-y-1">
                <p className="text-purple-600 dark:text-purple-400 font-semibold">Generate a plain text list containing 150 unique items for a Charades game.</p>
                <p>Category: <span className="text-pink-600 dark:text-pink-400 font-semibold">{aiTopic || '[TEMA]'}</span></p>
                <p className="text-slate-600 dark:text-slate-400">Rules: - One item per line. - No numbering. - No bullet points. - No duplicates. - Keep names concise. - Return only the list.</p>

                <button
                  type="button"
                  onClick={handleCopyAiPrompt}
                  className="mt-3 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition-all"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>¡Prompt copiado al portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Prompt para ChatGPT / Claude</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl text-[11px] text-purple-700 dark:text-purple-300">
                💡 <strong>Paso 2:</strong> Pega el prompt en la IA, copia el resultado que te devuelva y pégalo en la pestaña <strong>"Manual / Pegar"</strong>.
              </div>
            </div>
          )}

          {/* Opciones de mezcla */}
          {activeTab !== 'ai' && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={playOnlyThis}
                  onChange={(e) => setPlayOnlyThis(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Jugar <strong>únicamente</strong> con esta categoría (deseleccionar el resto)
                </span>
              </label>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            {activeTab !== 'ai' ? (
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
              >
                Crear y Guardar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
              >
                Ir a Pegar Palabras
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
