import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage
} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { ProductsListItem } from '../../types/products-list-item'

@Component({
  selector: 'app-products-list-item',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe, RouterLink],
  templateUrl: './products-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-3 relative' },
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return config.src.replace('.jpeg', 'm.jpeg')
      }
    }
  ]
})
export class ProductsListItemComponent {
  public readonly product = input.required<ProductsListItem>()
  public readonly addToCart = output<string>()
}
