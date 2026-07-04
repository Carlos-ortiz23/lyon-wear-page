/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { LayoutGrid, RefreshCw, AlertCircle, FilterX } from 'lucide-react';
import { Product } from './types';
import { CatalogService } from './services/api';

// Components
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import FeaturedCarousel from './components/FeaturedCarousel';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

// Skeletons
import {
  CatalogGridSkeleton,
  CategorySkeleton,
  CarouselSkeleton
} from './components/SkeletonLoader';

export default function App() {
  // Application Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'todos' | 'hombre' | 'mujer'>('todos');

  // Selected Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch full digital catalog from Google Apps Script API.
  // silent = true refreshes data in the background without skeletons or error screens,
  // so an auto-refresh failure never breaks a catalog that is already on screen.
  const loadCatalogData = useCallback(async (forceRefresh = false, silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }
    try {
      // Parallel non-blocking requests to optimize response speeds
      const [allProducts, apiCategories] = await Promise.all([
        CatalogService.getProducts(forceRefresh),
        CatalogService.getCategories(forceRefresh)
      ]);

      setProducts(allProducts);
      setCategories(apiCategories);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load catalog data:', err);
      if (!silent) {
        setError('No pudimos conectar con el servidor de productos. Revisa tu conexión de internet e intenta de nuevo.');
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCatalogData();
  }, [loadCatalogData]);

  // Keep the catalog in sync with the Google Sheet automatically:
  // background refresh every 5 minutes and whenever the user returns to the tab.
  useEffect(() => {
    const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
    const intervalId = setInterval(() => loadCatalogData(true, true), REFRESH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCatalogData(true, true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadCatalogData]);

  // Lock body scroll while the product detail modal is open (avoids background scrolling on mobile)
  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  // Deep Linking support - Open a product detailed modal automatically if its ID is present in the URL query string
  useEffect(() => {
    if (products.length > 0) {
      const queryParams = new URLSearchParams(window.location.search);
      const urlProductId = queryParams.get('id');
      if (urlProductId) {
        const found = products.find(p => p.id === urlProductId);
        if (found) {
          setSelectedProduct(found);
        }
      }
    }
  }, [products]);

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    // Sync query parameters without reloading the page so customers can share the URL
    const newUrl = `${window.location.pathname}?id=${product.id}`;
    window.history.replaceState({ id: product.id }, '', newUrl);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
    // Clear URL query parameters cleanly
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  };

  // Reset all filters to easily browse the entire catalog
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedGender('todos');
  };

  // Compute dynamic counters for category chips based on current products array
  const productCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      if (p.categoria) {
        counts[p.categoria] = (counts[p.categoria] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Derived filter arrays
  const featuredProducts = useMemo(() => {
    return products.filter(p => p.destacado);
  }, [products]);

  const newProducts = useMemo(() => {
    return products.filter(p => p.nuevo);
  }, [products]);

  // Compute fully filtered catalog products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search filter (covers Name, Brand, Category, Labels, and ID)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        product.nombre.toLowerCase().includes(q) ||
        product.marca.toLowerCase().includes(q) ||
        product.categoria.toLowerCase().includes(q) ||
        product.id.toLowerCase().includes(q) ||
        product.etiquetas.some(tag => tag.toLowerCase().includes(q))
      );

      // 2. Category filter
      const matchesCategory = !selectedCategory || product.categoria === selectedCategory;

      // 3. Gender filter
      const matchesGender = selectedGender === 'todos' || product.genero === selectedGender;

      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [products, searchQuery, selectedCategory, selectedGender]);
  return (
    <div id="next-level-app" className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-between">
      
      {/* HEADER SECTION */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
      />

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 py-4 md:px-6 md:py-10 space-y-8 md:space-y-12">
        
        {/* EXCEPTION: Error Connection view — only when there is no data at all to show */}
        {error && products.length === 0 && (
          <div className="bg-white border border-neutral-200 rounded-none p-6 md:p-8 flex flex-col items-center text-center space-y-4 max-w-xl mx-auto my-12 shadow-xl">
            <AlertCircle className="w-12 h-12 text-black animate-pulse" />
            <h3 className="text-lg font-black uppercase tracking-widest text-black">Error de Conexión</h3>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-md uppercase font-bold tracking-wider">{error}</p>
            <button
              id="retry-connection-btn"
              onClick={() => loadCatalogData(true)}
              className="bg-black hover:bg-neutral-800 text-white font-black text-xs tracking-widest uppercase px-6 py-3 rounded-none flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar Carga
            </button>
          </div>
        )}

        {/* LOADING STATE - Elegant skeletons */}
        {isLoading && !error && (
          <div className="space-y-12 animate-pulse-fast">
            <CategorySkeleton />
            <CarouselSkeleton />
            <div className="space-y-4">
              <div className="h-6 bg-neutral-200 rounded-none w-1/4" />
              <CatalogGridSkeleton />
            </div>
          </div>
        )}

        {/* READY STATE - Main catalog UI (renders even after a failed refresh if we have data) */}
        {!isLoading && (!error || products.length > 0) && (
          <>
            {/* Dynamic Categories row */}
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              productCounts={productCategoryCounts}
            />

            {/* Showcase Featured carousel (Render only when filters are empty) */}
            {!searchQuery && !selectedCategory && selectedGender === 'todos' && featuredProducts.length > 0 && (
              <FeaturedCarousel
                products={featuredProducts}
                onProductClick={handleOpenProductDetail}
              />
            )}

            {/* Showcase New Products horizontal row (Render only when filters are empty) */}
            {!searchQuery && !selectedCategory && selectedGender === 'todos' && newProducts.length > 0 && (
              <section className="space-y-4 select-none">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2.5 h-2.5 bg-black rounded-none animate-ping" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">
                    Recién Llegados / Nuevos Ingresos
                  </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto premium-scrollbar pb-3 pt-1 -mx-3 px-3 md:mx-0 md:px-0">
                  {newProducts.map((p) => (
                    <div key={p.id} className="w-[150px] xs:w-[180px] sm:w-[220px] shrink-0">
                      <ProductCard
                        product={p}
                        onClick={() => handleOpenProductDetail(p)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Main catalog Section Header */}
            <div className="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-black" />
                  {selectedCategory ? `Colección ${selectedCategory}` : 'Catálogo Completo'}
                </h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Mostrando {filteredProducts.length} de {products.length} productos premium disponibles
                </p>
              </div>

              {/* Reset active filters label */}
              {(searchQuery || selectedCategory || selectedGender !== 'todos') && (
                <button
                  id="reset-filters-btn"
                  onClick={handleResetFilters}
                  className="bg-black hover:bg-neutral-800 text-white text-xs font-black tracking-widest uppercase py-3 px-5 rounded-none flex items-center gap-2 transition-all self-start cursor-pointer shadow-md"
                >
                  <FilterX className="w-4 h-4" />
                  Limpiar todos los filtros
                </button>
              )}
            </div>

            {/* Catalog Grid View — no layout/exit animations: filtering must feel instant */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleOpenProductDetail(product)}
                  />
                ))}
              </div>
            ) : (
              /* No matching items filter state */
              <div className="bg-white border border-neutral-200 rounded-none p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto shadow-sm">
                <FilterX className="w-12 h-12 text-neutral-300" />
                <h3 className="text-lg font-black uppercase tracking-widest text-black">Sin resultados</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-bold uppercase tracking-wider">
                  No encontramos ningún producto que coincida con tus criterios de búsqueda. Intenta simplificar las palabras clave o borrar filtros.
                </p>
                <button
                  id="empty-reset-btn"
                  onClick={handleResetFilters}
                  className="bg-black hover:bg-neutral-800 text-white font-black text-xs tracking-widest uppercase px-6 py-3.5 rounded-none transition-all cursor-pointer shadow-md"
                >
                  Restablecer filtros
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* FLOATING ACTION WHATSAPP */}
      <WhatsAppButton />

      {/* FOOTER SECTION */}
      <Footer />

      {/* IMMERSIVE PRODUCT DETAIL DRAWER MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            allProducts={products}
            onClose={handleCloseProductDetail}
            onProductClick={handleOpenProductDetail}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
