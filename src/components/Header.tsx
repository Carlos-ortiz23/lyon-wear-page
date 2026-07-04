/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: 'todos' | 'hombre' | 'mujer') => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedGender,
  setSelectedGender
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-3 py-2.5 md:px-8 md:py-4 text-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4">
        
        {/* Top Row on Mobile: Logo and Menu */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-none bg-black border border-neutral-800 shadow-md p-1 md:p-1.5">
              <img
                src="/lyon-wear-logo.png"
                alt="Lyon Wear"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic text-neutral-950 leading-none">
                LYON WEAR
              </span>
              <span className="text-[7.5px] md:text-[9px] font-bold tracking-[0.25em] text-neutral-500 uppercase leading-none mt-0.5 md:mt-1">
                PREMIUM CATALOGUE
              </span>
            </div>
          </div>

          {/* Hamburger Menu button on mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMenuOpen(true)}
              className="relative p-2.5 text-neutral-800 hover:text-black bg-neutral-100 rounded-none hover:bg-neutral-200 transition-all duration-200 cursor-pointer h-11 w-11 flex items-center justify-center border border-neutral-200"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar - Always visible, full width on Mobile, max-w-md on Desktop */}
        <div className="w-full md:flex-1 md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              id="search-input"
              placeholder="BUSCAR PRODUCTO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-none py-2.5 pl-10 pr-10 text-xs tracking-wider uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 h-11"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors p-1"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Only Navigation Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="desktop-hamburger-btn"
            onClick={() => setIsMenuOpen(true)}
            className="relative p-2.5 text-neutral-800 hover:text-black bg-neutral-100 rounded-none hover:bg-neutral-200 transition-all duration-200 cursor-pointer h-11 w-11 flex items-center justify-center border border-neutral-200"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* MOBILE FULL SCREEN SLIDE-DOWN NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-drawer-panel"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-0 bg-white w-full h-screen shadow-2xl z-50 flex flex-col p-6 text-neutral-900 select-none overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-none bg-black border border-neutral-800 shadow-md p-1">
                  <img
                    src="/lyon-wear-logo.png"
                    alt="Lyon Wear"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase italic text-neutral-950 leading-none">
                  LYON WEAR
                </span>
              </div>
              <button
                id="mobile-drawer-close"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-none h-11 w-11 flex items-center justify-center border border-neutral-200"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 py-10 flex flex-col justify-center max-w-md mx-auto w-full">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-[11px] font-black text-neutral-400 tracking-[0.3em] uppercase mb-1">
                    Colecciones Premium
                  </div>
                  <div className="h-[2px] w-12 bg-neutral-200 mx-auto"></div>
                </div>
                
                <nav className="flex flex-col gap-4">
                  {(['todos', 'hombre', 'mujer'] as const).map((gender) => {
                    const isSelected = selectedGender === gender;
                    return (
                      <button
                        key={gender}
                        id={`drawer-gender-${gender}`}
                        onClick={() => {
                          setSelectedGender(gender);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full text-center py-4.5 px-6 border text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 h-14 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-black border-black text-white shadow-lg'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black'
                        }`}
                      >
                        <span>
                          {gender === 'todos' ? 'Colección Completa' : gender === 'hombre' ? 'Colección Hombre' : 'Colección Mujer'}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-none ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {gender === 'todos' ? 'Ver todo' : gender === 'hombre' ? 'Hombre' : 'Mujer'}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Decorative Brand watermark inside full screen drawer */}
              <div className="mt-16 text-center select-none opacity-10">
                <span className="text-4xl font-black italic tracking-widest text-neutral-900">LYON WEAR</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
