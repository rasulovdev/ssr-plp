import { CurrencyPipe, NgOptimizedImage } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { HoverPrefetchLinkDirective } from 'ngx-hover-preload'
import { provideImageLoader } from '../../providers/image-loader.provider'
import { ProductsListItem } from '../../types/products-list-item'

@Component({
  selector: 'app-products-list-item',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CurrencyPipe,
    RouterLink,
    HoverPrefetchLinkDirective
  ],
  templateUrl: './products-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-3 relative' },
  providers: [provideImageLoader()]
})
export class ProductsListItemComponent {
  public readonly product = input.required<ProductsListItem>()
  public readonly addToCart = output<string>()
}
