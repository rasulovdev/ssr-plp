import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    title: 'Products',
    loadComponent: () =>
      import('./features/products/pages/products-page/products-page.component')
  },
  {
    path: 'products/:id',
    title: 'Product details',
    loadComponent: () =>
      import('./features/products/pages/product-page/product-page.component')
  }
]
