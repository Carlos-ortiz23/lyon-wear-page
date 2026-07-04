/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Tag, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onClick: () => void;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Determine if we show second image on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.imagenes && product.imagenes.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col bg-white border border-neutral-200 rounded-none overflow-hidden shadow-sm hover:shadow-md hover:border-black transition-all duration-300 cursor-pointer select-none"
    >
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
        {product.nuevo && (
          <span className="flex items-center gap-1 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none shadow-md">
            <Sparkles className="w-2.5 h-2.5" />
            NUEVO
          </span>
        )}
        {product.destacado && (
          <span className="flex items-center gap-1 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none shadow-md">
            <Tag className="w-2.5 h-2.5" />
            DESTACADO
          </span>
        )}
      </div>

      {/* Image Gallery Block */}
      <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden flex items-center justify-center p-2 md:p-4">
        <img
          src={product.imagenes[currentImageIndex] || product.imagenes[0]}
          alt={product.nombre}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Hover overlay details button */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-black text-white text-xs font-black tracking-widest uppercase px-5 py-3 rounded-none flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-4 h-4" />
            VER DETALLE
          </span>
        </div>

        {/* Small discrete dot navigation for multiline images */}
        {product.imagenes.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.imagenes.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-none transition-all duration-300 ${
                  i === currentImageIndex ? 'bg-black scale-125 w-3' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information Footer */}
      <div className="p-2.5 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand - hidden on mobile */}
          <span className="hidden md:block text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1">
            {product.marca || 'LYON WEAR'}
          </span>
          {/* Product Name */}
          <h3 className="text-xs md:text-sm font-black uppercase tracking-tight text-neutral-900 line-clamp-1">
            {product.nombre}
          </h3>
          {/* Tags preview - hidden on mobile */}
          {product.etiquetas && product.etiquetas.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-1 mt-2 line-clamp-1 overflow-hidden">
              {product.etiquetas.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-[9px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded-none">
                  #{tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 md:mt-4 md:pt-3 border-t border-neutral-100">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[7px] md:text-[8px] font-bold uppercase text-neutral-400 tracking-widest leading-none">Precio</span>
            <span className="text-xs md:text-[15px] font-black text-neutral-950 tracking-tight mt-1 leading-none">
              {formatPrice(product.precio)}
            </span>
          </div>

          {/* Quick status (sizes or stock) - hidden on mobile */}
          <span className="hidden md:inline-block text-[9px] font-black uppercase tracking-wider text-black bg-neutral-100 px-2 py-1.5 rounded-none">
            {product.tallas && product.tallas.length > 0 ? `${product.tallas.length} Tallas` : 'Único'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
