import { CurrencyPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  numberAttribute
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HoverPrefetchLinkDirective } from 'ngx-hover-preload'
import { map } from 'rxjs'
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
  private readonly _route = inject(ActivatedRoute)
  private readonly _meta = inject(Meta)
  private readonly _title = inject(Title)

  public readonly id = toSignal(
    this._route.paramMap.pipe(
      map(paramMap => numberAttribute(paramMap.get('id')))
    )
  )

  private readonly productQuery = this._repository.getById(this.id()!)

  public readonly product = toSignal(
    this.productQuery.valueChanges.pipe(map(response => response.data.product))
  )

  private readonly priceQuery = this._repository.getPrice(this.id()!)

  public readonly price = toSignal(this.priceQuery.valueChanges)

  constructor() {
    effect(() => {
      this._title.setTitle(this.product()?.title ?? 'Product title')
      this._meta.addTag({
        name: 'description',
        content: this.product()?.description ?? 'Product description'
      })
    })
  }

  public addToCart(id: string): void {
    alert(`Product with ID ${id} added to cart`)
  }
}
