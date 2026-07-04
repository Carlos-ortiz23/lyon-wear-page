/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-none overflow-hidden shadow-sm animate-pulse-fast">
      {/* Image Block */}
      <div className="aspect-[3/4] bg-neutral-200 relative" />
      
      {/* Meta Block */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="h-3 bg-neutral-200 rounded-none w-1/3" />
        {/* Title */}
        <div className="h-4 bg-neutral-200 rounded-none w-3/4" />
        {/* Bottom Metadata */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-neutral-300 rounded-none w-1/4" />
          <div className="h-6 bg-neutral-200 rounded-none w-12" />
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex gap-2 py-2 overflow-x-auto no-scrollbar animate-pulse-fast">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-10 w-24 bg-neutral-200 rounded-none shrink-0" />
      ))}
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-200 border border-neutral-200 rounded-none overflow-hidden animate-pulse-fast">
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-100 via-transparent to-transparent z-10" />
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 space-y-3 max-w-lg">
        <div className="h-3 bg-neutral-300 rounded-none w-1/4" />
        <div className="h-8 bg-neutral-300 rounded-none w-3/4" />
        <div className="h-4 bg-neutral-300 rounded-none w-1/2" />
      </div>
    </div>
  );
}

export function CatalogGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
