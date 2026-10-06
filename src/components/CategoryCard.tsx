import React from 'react';
import {
  Film,
  Tv,
  Activity,
  Package,
  PawPrint,
  Gamepad2,
  Trophy,
  Users,
  Utensils,
  Globe,
  Briefcase,
  Sparkles,
  Check,
  Trash2,
  LucideIcon
} from 'lucide-react';
import { Category } from '../types/game';

const iconMap: Record<string, LucideIcon> = {
  Film,
  Tv,
  Activity,
  Package,
  PawPrint,
  Gamepad2,
  Trophy,
  Users,
  Utensils,
  Globe,
  Briefcase,
  Sparkles,
};

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onToggle,
  onDelete,
}) => {
  const IconComponent = iconMap[category.icon] || Sparkles;

  return (
    <div
      onClick={() => onToggle(category.id)}
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 select-none border ${
        isSelected
          ? 'bg-purple-100/70 border-purple-500 shadow-md shadow-purple-500/10 ring-1 ring-purple-500/30 dark:bg-purple-950/40 dark:border-purple-500/80 dark:shadow-purple-500/10 dark:ring-purple-500/40'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
            isSelected
              ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/30'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-slate-200'
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold text-sm sm:text-base truncate transition-colors ${
                isSelected
                  ? 'text-purple-950 dark:text-white'
                  : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
              }`}
            >
              {category.name}
            </h3>
            {category.isCustom && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30">
                Custom
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {category.words.length} {category.words.length === 1 ? 'palabra' : 'palabras'}
            {category.hasDualTitles && ' (ES/EN)'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {category.isCustom && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category.id);
            }}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            title="Eliminar categoría personalizada"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
              : 'border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-transparent group-hover:border-slate-400 dark:group-hover:border-slate-600'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      </div>
    </div>
  );
};
