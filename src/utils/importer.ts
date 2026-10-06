import * as XLSX from 'xlsx';
import { WordItem } from '../types/game';

/**
 * Limpia y extrae palabras de un texto plano (manual o archivo .txt)
 */
export function parsePlainText(rawText: string, categoryName: string = 'Personalizada'): WordItem[] {
  const lines = rawText.split(/\r?\n/);
  const words: WordItem[] = [];

  for (const line of lines) {
    // Elimina numeración (ej. 1., 2-), viñetas (- , * , •) y espacios excesivos
    const cleaned = line
      .replace(/^[\s*\-•\d.)\]]+/, '')
      .trim();

    if (cleaned.length > 0) {
      words.push({
        id: `custom-${Math.random().toString(36).substring(2, 9)}`,
        es: cleaned,
        category: categoryName,
      });
    }
  }

  return words;
}

/**
 * Lee un archivo .xlsx y extrae palabras o categorías y palabras
 */
export async function parseExcelFile(file: File, defaultCategoryName: string = 'Personalizada'): Promise<{
  categoryName: string;
  words: WordItem[];
}> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('El archivo Excel no contiene hojas de cálculo.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

  if (!rows || rows.length === 0) {
    throw new Error('El archivo Excel está vacío.');
  }

  const words: WordItem[] = [];
  let detectedCategoryName = defaultCategoryName;

  // Analizar estructura de columnas
  // Caso 1: Si hay 2 columnas (Categoría, Palabra) o más
  // Caso 2: 1 columna (Palabra)
  const firstRow = rows[0] || [];
  const hasHeaders = firstRow.some(cell => 
    typeof cell === 'string' && /^(palabra|word|categor[ií]a|category|item)/i.test(cell)
  );

  const startIndex = hasHeaders ? 1 : 0;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    if (row.length >= 2) {
      // Columna 0: Categoría, Columna 1: Palabra
      const cat = String(row[0] ?? '').trim();
      const word = String(row[1] ?? '').trim();
      if (cat && !detectedCategoryName) {
        detectedCategoryName = cat;
      }
      if (word) {
        words.push({
          id: `custom-${Math.random().toString(36).substring(2, 9)}`,
          es: word,
          category: cat || detectedCategoryName,
        });
      }
    } else {
      // Columna única
      const word = String(row[0] ?? '').trim();
      if (word) {
        words.push({
          id: `custom-${Math.random().toString(36).substring(2, 9)}`,
          es: word,
          category: detectedCategoryName,
        });
      }
    }
  }

  if (words.length === 0) {
    throw new Error('No se encontraron palabras válidas en el archivo Excel.');
  }

  return {
    categoryName: detectedCategoryName,
    words,
  };
}
