import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  PendingTasks
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Router, RouterLink } from '@angular/router'
import { HoverPrefetchLinkDirective } from 'ngx-hover-preload'
import { injectQueryParams } from 'ngxtension/inject-query-params'
import { map, of, switchMap, tap } from 'rxjs'
import { CategoriesRepositoryService } from '../../../features/products/services/categories.repository.service'

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [RouterLink, HoverPrefetchLinkDirective],
  templateUrl: './category-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex gap-1 overflow-auto max-w-full' }
})
export class CategoryFilterComponent {
  private readonly _categoriesRepository = inject(CategoriesRepositoryService)
  private readonly _pendingTasks = inject(PendingTasks)
  private readonly _router = inject(Router)

  public readonly asNavigation = input<boolean, unknown>(false, {
    transform: booleanAttribute
  })
  public readonly categoryId = injectQueryParams('categoryId')
  public readonly categoriesQuery = this._categoriesRepository.get()
  public readonly isProductsPage = this._router.url === '/products'

  public readonly categories = toSignal(
    of(this._pendingTasks.add()).pipe(
      switchMap(cleanup => {
        return this.categoriesQuery.valueChanges.pipe(
          map(request => [request, cleanup] as const)
        )
      }),
      tap(([, cleanup]) => cleanup()),
      map(([{ data }]) => [{ id: null, name: 'All' }, ...data.categories])
    )
  )
}
