import { Routes } from '@angular/router';

/**
 * Todas las páginas se cargan de forma diferida: el bundle inicial sólo
 * contiene el shell (navegación, carrito, preloader) y la home.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'QUI9 — Quinua Peruana Premium',
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPage),
    title: 'Nuestra selección — QUI9',
  },
  {
    path: 'productos/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetailPage),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.CheckoutPage),
    title: 'Finalizar compra — QUI9',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'Página no encontrada — QUI9',
  },
];
