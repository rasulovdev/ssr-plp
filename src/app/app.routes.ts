import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    title: 'Products',
    loadComponent: () =>
      import('./features/products/pages/products-page/products-page.component')
  }
]
