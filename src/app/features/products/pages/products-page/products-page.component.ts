import { NgOptimizedImage } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  numberAttribute,
  PendingTasks,
  signal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule } from '@angular/forms'
import { Meta } from '@angular/platform-browser'
import { Router, RouterLink } from '@angular/router'
import { injectQueryParams } from 'ngxtension/inject-query-params'
import { map, of, switchMap, tap } from 'rxjs'
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component'
import { ProductsListItemComponent } from '../../components/products-list-item/products-list-item.component'
import { SearchFieldComponent } from '../../components/search-field/search-field.component'
import { CategoryFilterComponent } from '../../containers/category-filter/category-filter.component'
import { ProductsRepositoryService } from '../../services/products.repository.service'

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    ProductsListItemComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    PaginatorComponent,
    CategoryFilterComponent,
    SearchFieldComponent,
    RouterLink
  ],
  templateUrl: './products-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block py-4 xl:py-12 space-y-6 md:space-y-8' }
})
export default class ProductsPageComponent {
  private readonly _meta = inject(Meta)
  private readonly _repository = inject(ProductsRepositoryService)
  private readonly _router = inject(Router)
  private readonly _pendingTasks = inject(PendingTasks)

  public readonly title = injectQueryParams('title')
  public readonly limit = signal(16)

  public readonly offset = injectQueryParams('offset', {
    initialValue: 0,
    transform: numberAttribute
  })

  public readonly categoryId = injectQueryParams('categoryId', {
    transform: numberAttribute
  })

  public readonly productsQuery = this._repository.get({
    title: this.title() ?? undefined,
    categoryId: this.categoryId() ?? undefined,
    limit: this.limit(),
    offset: this.offset() ?? undefined
  })

  public readonly products = toSignal(
    of(this._pendingTasks.add()).pipe(
      switchMap(cleanup => {
        return this.productsQuery.valueChanges.pipe(
          map(({ data }) => [data.products, cleanup] as const)
        )
      }),
      tap(([, cleanup]) => cleanup()),
      map(([products]) => products)
    ),
    { initialValue: [] }
  )

  constructor() {
    effect(() => {
      this.title()
      this.categoryId()

      this._restPagination()
    })

    effect(() => {
      this.productsQuery.setVariables({
        title: this.title() ?? undefined,
        categoryId: this.categoryId() ?? undefined,
        limit: this.limit(),
        offset: this.offset()
      })
    })
  }

  public ngOnInit(): void {
    this._meta.addTag({
      name: 'description',
      content: 'Buy the best products on the planet'
    })
  }

  public addToCart(id: string): void {
    alert(`Product with ID ${id} added to cart`)
  }

  private _restPagination(): void {
    this._router.navigate([], {
      queryParams: { offset: null },
      queryParamsHandling: 'merge'
    })
  }
}
