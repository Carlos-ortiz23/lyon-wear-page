/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Last line of defense: if any component throws during render,
 * show a branded recovery screen instead of a blank white page.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unexpected render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-6 text-center gap-5">
          <img src="/lyon-wear-logo.png" alt="Lyon Wear" className="w-16 h-16 object-contain" />
          <h1 className="text-lg font-black uppercase tracking-widest text-black">
            Algo salió mal
          </h1>
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider max-w-sm leading-relaxed">
            Ocurrió un error inesperado al mostrar el catálogo. Recarga la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black hover:bg-neutral-800 text-white font-black text-xs tracking-widest uppercase px-6 py-3 transition-all cursor-pointer shadow-md"
          >
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
