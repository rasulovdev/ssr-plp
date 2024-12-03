import { NgOptimizedImage } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  NgZone,
  numberAttribute,
  signal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule } from '@angular/forms'
import { Meta } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { injectQueryParams } from 'ngxtension/inject-query-params'
import { map } from 'rxjs'
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
    SearchFieldComponent
  ],
  templateUrl: './products-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block py-8 space-y-6 md:space-y-8' }
})
export default class ProductsPageComponent {
  private readonly _meta = inject(Meta)
  private readonly _repository = inject(ProductsRepositoryService)
  private readonly _router = inject(Router)
  private readonly _ngZone = inject(NgZone)

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
    offset: this.offset()!
  })

  public readonly products = toSignal(
    this.productsQuery.valueChanges.pipe(map(({ data }) => data.products)),
    { initialValue: [] }
  )

  constructor() {
    effect(() => {
      this.title()
      this.categoryId()
      this._router.navigate([], {
        queryParams: { offset: null },
        queryParamsHandling: 'merge'
      })
    })

    effect(() => {
      this.productsQuery.refetch({
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
    alert(id)
  }
}
