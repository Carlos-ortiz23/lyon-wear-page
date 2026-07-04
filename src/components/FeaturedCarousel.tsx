/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from './ProductCard';

interface FeaturedCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function FeaturedCarousel({ products, onProductClick }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play the featured slider
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  return (
    <div className="relative w-full py-2 select-none">
      <div className="flex flex-col gap-1 mb-4 px-1">
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-400">Ediciones Especiales</span>
        <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-black" />
          Colección Destacada
        </h2>
      </div>

      <div
        onClick={() => onProductClick(currentProduct)}
        className="relative w-full aspect-[16/10] sm:aspect-[21/9] bg-neutral-900 border border-neutral-200 rounded-none overflow-hidden shadow-xl cursor-pointer group transition-all duration-300"
      >
        {/* Animated slide switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <img
              src={currentProduct.imagenes[0]}
              alt={currentProduct.nombre}
              className="w-full h-full object-cover object-center transition-transform duration-[10000ms] group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark contrast overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden md:block" />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic product specs */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 z-20 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 pointer-events-none">
          <div className="space-y-1.5 md:space-y-4 max-w-xl">
            <span className="inline-block bg-white text-black font-black text-[8px] md:text-[9px] uppercase px-2 py-0.5 md:px-3 md:py-1 rounded-none tracking-[0.2em] leading-none shadow-md">
              {currentProduct.marca || 'NEXT LEVEL'}
            </span>
            <h3 className="text-xl xs:text-2xl sm:text-5xl md:text-6xl font-black uppercase italic leading-[0.9] text-white tracking-tighter drop-shadow-lg">
              {currentProduct.nombre}
            </h3>
            <p className="text-xs text-neutral-300 line-clamp-2 font-light italic max-w-md hidden sm:block">
              {currentProduct.descripcion || 'Siente la evolución en cada paso. Diseño minimalista con tecnología de amortiguación y tejidos de alta gama.'}
            </p>
          </div>

          {/* Action button & Pricing */}
          <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
            <div className="text-left md:text-right">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">Precio Especial</span>
              <span className="text-base sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                {formatPrice(currentProduct.precio)}
              </span>
            </div>
            
            <button className="bg-white text-black font-black text-[10px] sm:text-xs tracking-widest uppercase px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-none flex items-center gap-1.5 shadow-xl group-hover:bg-neutral-200 transition-all duration-300 pointer-events-auto h-11">
              Ver Colección
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Manual Slides Controls (Arrows) */}
        {products.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-30 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-none bg-black/80 hover:bg-white text-white hover:text-black transition-all duration-200 border border-neutral-800 flex items-center justify-center pointer-events-auto shadow-md"
              aria-label="Anterior destacado"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-none bg-black/80 hover:bg-white text-white hover:text-black transition-all duration-200 border border-neutral-800 flex items-center justify-center pointer-events-auto shadow-md"
              aria-label="Siguiente destacado"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Slide Indicator dots */}
        {products.length > 1 && (
          <div className="absolute top-4 right-6 z-20 flex gap-1.5 bg-black/60 px-2.5 py-1.5 rounded-none backdrop-blur-sm border border-neutral-800">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-none transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white scale-125 w-4' : 'bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Ir al destacado ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
