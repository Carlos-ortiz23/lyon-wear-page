/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Ruler, Info, Check, Sparkles, ChevronRight, Share2 } from 'lucide-react';
import { Product } from '../types';
import { CatalogService } from '../services/api';
import { formatPrice } from './ProductCard';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export default function ProductDetail({
  product,
  allProducts,
  onClose,
  onProductClick
}: ProductDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load related products of the same category (excluding current)
  // and reset gallery/size state, pre-selecting the first available size
  useEffect(() => {
    if (product) {
      const related = allProducts
        .filter(p => p.categoria === product.categoria && p.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(related);
      setActiveImageIndex(0);
      setSelectedSize(product.tallas?.[0] ?? '');
    }
  }, [product, allProducts]);

  const handleWhatsAppBuy = () => {
    const link = CatalogService.getWhatsAppLink(product, selectedSize);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${product.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {
      // Clipboard denied or unavailable (e.g. HTTP context) — keep the button usable
    });
  };

  return (
    <motion.div
      ref={scrollContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center items-start md:py-8 px-0 md:px-4"
    >
      {/* Background click close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Container */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-none shadow-2xl overflow-hidden z-10 flex flex-col min-h-screen md:min-h-0 text-neutral-900"
      >
        {/* Floating Close Button */}
        <button
          id="close-detail-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-none bg-black text-white hover:bg-neutral-800 transition-all duration-200 border border-black"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT: Premium Image Gallery */}
          <div className="p-3 md:p-6 flex flex-col gap-3">
            {/* Main Stage */}
            <div className="aspect-[3/4] rounded-none overflow-hidden bg-neutral-100 border border-neutral-200 relative group select-none flex items-center justify-center p-3 xs:p-6">
              <img
                src={product.imagenes[activeImageIndex]}
                alt={product.nombre}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Image position dots overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-none text-[10px] font-bold tracking-widest text-white backdrop-blur-sm">
                {activeImageIndex + 1} / {product.imagenes.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.imagenes.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {product.imagenes.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-[3/4] w-16 md:w-20 rounded-none overflow-hidden bg-neutral-100 border transition-all duration-200 shrink-0 flex items-center justify-center p-2 ${
                      index === activeImageIndex ? 'border-black scale-95 shadow-md' : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.nombre} - ${index + 1}`} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Specs & Purchase panel */}
          <div className="p-4 xs:p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header: Brand, Title & Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-[0.25em] text-neutral-400 uppercase">
                    {product.marca || 'NEXT LEVEL'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-none text-neutral-600 hover:text-black transition-all text-xs flex items-center gap-1.5 font-bold"
                      title="Copiar enlace de compra"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedLink ? 'Copiado' : 'Compartir'}</span>
                    </button>
                  </div>
                </div>
                <h1 className="text-2xl xs:text-3xl md:text-5xl font-black uppercase italic leading-none text-black tracking-tighter">
                  {product.nombre}
                </h1>
                
                {/* Meta specifications */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-none">
                    Cat: {product.categoria.toUpperCase()}
                  </span>
                  {product.genero && (
                    <span className="text-[10px] font-black tracking-wider uppercase text-white bg-black px-2.5 py-1 rounded-none">
                      Gén: {product.genero.toUpperCase()}
                    </span>
                  )}
                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="text-[10px] font-black tracking-wider uppercase bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded-none flex items-center gap-1 animate-pulse">
                      ¡Últimas {product.stock} unidades!
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing section */}
              <div className="py-4 border-y border-neutral-200 flex items-baseline gap-3">
                <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-black tracking-tight">
                  {formatPrice(product.precio)}
                </span>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">
                  IVA incluido
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-black" />
                  Descripción del Producto
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  {product.descripcion || 'Diseño de alta gama confeccionado con materiales premium que garantizan durabilidad y confort excepcionales. Un artículo de lujo ideal para elevar tu guardarropa diario.'}
                </p>
              </div>

              {/* Color attribute */}
              {product.color && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                    Color disponible:
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-none border border-neutral-300 shadow-sm" style={{ backgroundColor: '#ffffff' }} />
                    <span className="text-sm font-bold text-neutral-800 capitalize">{product.color}</span>
                  </div>
                </div>
              )}

              {/* Sizes list selector */}
              {product.tallas && product.tallas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-black" />
                      Selecciona tu Talla
                    </h3>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Guía de tallas colombiana</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.tallas.map((talla) => (
                      <button
                        key={talla}
                        onClick={() => setSelectedSize(talla)}
                        className={`min-w-[54px] h-12 px-3 rounded-none text-xs tracking-wider font-black uppercase transition-all duration-200 border flex items-center justify-center cursor-pointer ${
                          selectedSize === talla
                            ? 'bg-black border-black text-white scale-105 shadow-md'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-black'
                        }`}
                      >
                        {talla}
                        {selectedSize === talla && <Check className="w-3 h-3 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Purchase WhatsApp checkout button */}
            <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
              <button
                id="buy-whatsapp-btn"
                onClick={handleWhatsAppBuy}
                className="w-full bg-black hover:bg-neutral-900 text-white font-black text-xs tracking-widest uppercase py-4.5 px-6 rounded-none flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-[0.99] shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                Comprar por WhatsApp
              </button>
              <p className="text-[10px] text-neutral-400 text-center font-bold uppercase tracking-wider">
                Se abrirá un chat directo para coordinar envío y métodos de pago. Código único de orden: <span className="font-mono text-black font-black">{product.id}</span>
              </p>
            </div>

          </div>

        </div>

        {/* BOTTOM: Related products section */}
        {relatedProducts.length > 0 && (
          <div className="p-4 xs:p-6 md:p-8 border-t border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base xs:text-lg font-black uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-black" />
                Colección Relacionada
              </h3>
              <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                Recomendados <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={() => {
                    onProductClick(relProduct);
                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-neutral-200 rounded-none p-3 cursor-pointer group hover:border-black transition-all duration-300 shadow-sm"
                >
                  <div className="aspect-[3/4] rounded-none overflow-hidden bg-neutral-100 mb-2 relative">
                    <img src={relProduct.imagenes[0]} alt={relProduct.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase block mb-0.5">
                    {relProduct.marca || 'NEXT LEVEL'}
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-tight text-neutral-800 truncate">
                    {relProduct.nombre}
                  </h4>
                  <span className="text-xs font-bold text-neutral-500 block mt-1">
                    {formatPrice(relProduct.precio)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
}
