/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  genero: string;
  marca: string;
  precio: number;
  descripcion: string;
  color: string;
  tallas: string[]; // parsed from comma-separated string or array
  stock: number;
  disponible: boolean;
  nuevo: boolean;
  destacado: boolean;
  etiquetas: string[]; // parsed from comma-separated string
  orden: number;
  imagenes: string[]; // parsed from imagen1, imagen2, etc.
  fecha_ingreso: string;
  activo: boolean;
}

export interface Category {
  id: string;
  nombre: string;
  cantidad?: number;
}

export type GenderFilter = 'todos' | 'hombre' | 'mujer' | 'unisex';

