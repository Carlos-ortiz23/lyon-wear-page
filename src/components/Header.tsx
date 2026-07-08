/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, X, Menu, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TikTokIcon from './TikTokIcon';
import { SOCIAL_LINKS } from '../constants/social';

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
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-3 py-2.5 md:px-8 md:py-4 text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 lg:gap-4">

        {/* Top Row on Mobile/Tablet: Logo and Menu */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center">
              <img
                src="/lyon-wear-logo.png"
                alt="Lyon Wear"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic text-white leading-none">
                LYON WEAR
              </span>
              <span className="text-[7.5px] md:text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase leading-none mt-0.5 md:mt-1">
                PREMIUM CATALOGUE
              </span>
            </div>
          </div>

          {/* Hamburger Menu button — only on mobile and tablet */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMenuOpen(true)}
              className="relative p-2.5 text-neutral-300 hover:text-white bg-neutral-900 rounded-none hover:bg-neutral-800 transition-all duration-200 cursor-pointer h-11 w-11 flex items-center justify-center border border-neutral-800"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar - Always visible, full width on Mobile/Tablet, max-w-md on Desktop */}
        <div className="w-full lg:flex-1 lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              id="search-input"
              placeholder="BUSCAR PRODUCTO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-none py-2.5 pl-10 pr-10 text-xs tracking-wider uppercase text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200 h-11"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors p-1"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Only Navigation: collections inline + social links */}
        <div className="hidden lg:flex items-center gap-2">
          <nav className="flex items-center gap-2" aria-label="Colecciones">
            {(['todos', 'hombre', 'mujer'] as const).map((gender) => {
              const isSelected = selectedGender === gender;
              return (
                <button
                  key={gender}
                  id={`desktop-gender-${gender}`}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 h-11 text-[11px] font-black uppercase tracking-[0.2em] border rounded-none transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-white text-black'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {gender === 'todos' ? 'Todos' : gender === 'hombre' ? 'Hombre' : 'Mujer'}
                </button>
              );
            })}
          </nav>
          <div className="w-px h-6 bg-neutral-800 mx-1"></div>
          <a
            id="desktop-social-instagram"
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 w-11 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-none text-neutral-300 hover:bg-white hover:text-black transition-all duration-200"
            aria-label="Síguenos en Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            id="desktop-social-tiktok"
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 w-11 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-none text-neutral-300 hover:bg-white hover:text-black transition-all duration-200"
            aria-label="Síguenos en TikTok"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>
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
            className="fixed inset-0 bg-neutral-950 w-full h-screen shadow-2xl z-50 flex flex-col p-6 text-white select-none overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 flex items-center justify-center">
                  <img
                    src="/lyon-wear-logo.png"
                    alt="Lyon Wear"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">
                  LYON WEAR
                </span>
              </div>
              <button
                id="mobile-drawer-close"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 transition-colors rounded-none h-11 w-11 flex items-center justify-center border border-neutral-800"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 py-10 flex flex-col justify-center max-w-md mx-auto w-full">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-[11px] font-black text-neutral-500 tracking-[0.3em] uppercase mb-1">
                    Colecciones Premium
                  </div>
                  <div className="h-[2px] w-12 bg-neutral-800 mx-auto"></div>
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
                            ? 'bg-white border-white text-black shadow-lg'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        <span>
                          {gender === 'todos' ? 'Colección Completa' : gender === 'hombre' ? 'Colección Hombre' : 'Colección Mujer'}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-none ${
                          isSelected ? 'bg-black/10 text-black' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {gender === 'todos' ? 'Ver todo' : gender === 'hombre' ? 'Hombre' : 'Mujer'}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Social links inside drawer */}
                <div className="pt-2">
                  <div className="text-center text-[11px] font-black text-neutral-500 tracking-[0.3em] uppercase mb-4">
                    Síguenos
                  </div>
                  <div className="flex justify-center gap-4">
                    <a
                      id="drawer-social-instagram"
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-none text-neutral-300 hover:bg-white hover:text-black transition-all duration-200"
                      aria-label="Síguenos en Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      id="drawer-social-tiktok"
                      href={SOCIAL_LINKS.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-none text-neutral-300 hover:bg-white hover:text-black transition-all duration-200"
                      aria-label="Síguenos en TikTok"
                    >
                      <TikTokIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Decorative Brand watermark inside full screen drawer */}
              <div className="mt-16 text-center select-none opacity-10">
                <span className="text-4xl font-black italic tracking-widest text-white">LYON WEAR</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
