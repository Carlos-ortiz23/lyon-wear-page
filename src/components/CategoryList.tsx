/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tag } from 'lucide-react';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  productCounts: Record<string, number>;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts
}: CategoryListProps) {
  return (
    <div className="w-full py-2 md:py-4 select-none">
      <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
        <h2 className="text-[11px] md:text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-black" />
          Categorías
        </h2>
        {selectedCategory && (
          <button
            id="clear-category-btn"
            onClick={() => onSelectCategory(null)}
            className="text-[10px] md:text-xs font-black text-black hover:text-neutral-600 uppercase tracking-widest h-9 px-2 flex items-center justify-center border border-neutral-200"
          >
            Limpiar Filtro
          </button>
        )}
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-1.5 md:gap-2.5 md:overflow-x-auto md:premium-scrollbar pb-1 md:pb-3 pt-1">
        {/* "All" button */}
        <button
          id="category-all"
          onClick={() => onSelectCategory(null)}
          className={`px-3 md:px-5 rounded-none text-[10px] md:text-xs font-black tracking-widest uppercase transition-all duration-300 border cursor-pointer shrink-0 h-8 md:h-11 flex items-center justify-center ${
            selectedCategory === null
              ? 'bg-black border-black text-white shadow-md'
              : 'bg-white border-neutral-200 text-neutral-500 hover:text-black hover:border-black'
          }`}
        >
          Ver todo
        </button>

        {/* Dynamic Category Chips */}
        {categories.map((category) => {
          const count = productCounts[category] || 0;
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onSelectCategory(category)}
              className={`px-2.5 md:px-4 rounded-none text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer shrink-0 h-8 md:h-11 flex items-center justify-center gap-1.5 md:gap-2 ${
                isSelected
                  ? 'bg-black border-black text-white shadow-md font-black'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:text-black hover:border-black'
              }`}
            >
              <span>{category}</span>
              <span className={`text-[8px] md:text-[9px] font-bold px-1 py-0.5 md:px-1.5 rounded-none ${
                isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
