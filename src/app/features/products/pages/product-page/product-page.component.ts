import { CurrencyPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  PendingTasks
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HoverPrefetchLinkDirective } from 'ngx-hover-preload'
import { map, of, switchMap, tap } from 'rxjs'
import { BreadcrumbsComponent } from '../../../../layout/components/breadcrumbs/breadcrumbs.component'
import { HeaderComponent } from '../../../../layout/components/header/header.component'
import { GalleryComponent } from '../../components/gallery/gallery.component'
import { ProductsRepositoryService } from '../../services/products.repository.service'

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    HeaderComponent,
    GalleryComponent,
    RouterLink,
    HoverPrefetchLinkDirective,
    CurrencyPipe,
    BreadcrumbsComponent
  ],
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-4 md:space-y-6 md:space-y-8' }
})
export default class ProductPageComponent {
  private readonly _repository = inject(ProductsRepositoryService)
  private readonly _pendingTasks = inject(PendingTasks)
  private readonly _route = inject(ActivatedRoute)
  private readonly _meta = inject(Meta)
  private readonly _title = inject(Title)

  private readonly _id = toSignal(
    this._route.paramMap.pipe(map(paramMap => +paramMap.get('id')!)),
    { initialValue: 0 }
  )

  private readonly _productQuery = this._repository.getById(this._id())
  private readonly _priceQuery = this._repository.getPrice(this._id())

  public readonly productQueryResult = toSignal(
    of(this._pendingTasks.add()).pipe(
      switchMap(completePendingTask => {
        return this._productQuery.valueChanges.pipe(
          map(queryResult => [queryResult, completePendingTask] as const)
        )
      }),
      tap(([queryResult, completePendingTask]) => {
        return queryResult.data?.product && completePendingTask()
      }),
      map(([queryResult]) => queryResult)
    )
  )

  public readonly priceQueryResult = toSignal(
    of(this._pendingTasks.add()).pipe(
      switchMap(completePendingTask => {
        return this._priceQuery.valueChanges.pipe(
          map(queryResult => [queryResult, completePendingTask] as const)
        )
      }),
      tap(([queryResult, completePendingTask]) => {
        return queryResult.data?.product && completePendingTask()
      }),
      map(([queryResult]) => queryResult)
    )
  )

  constructor() {
    effect(this._setMetaTags.bind(this))
  }

  public addToCart(id: string): void {
    alert(`Product with ID ${id} added to cart`)
  }

  private _setMetaTags(): void {
    this._title.setTitle(
      this.productQueryResult()?.data.product.title ?? 'Product title'
    )

    this._meta.addTag({
      name: 'description',
      content:
        this.productQueryResult()?.data.product.description ??
        'Product description'
    })
  }
}
