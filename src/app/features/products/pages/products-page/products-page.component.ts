import { NgOptimizedImage } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { Meta } from '@angular/platform-browser'
import { debounceTime, map } from 'rxjs'
import { ProductsListItemComponent } from '../../components/products-list-item/products-list-item.component'
import { ProductsRepositoryService } from '../../services/products.repository.service'

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductsListItemComponent, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './products-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block py-8 space-y-6 md:space-y-8' }
})
export default class ProductsPageComponent {
  private readonly _meta = inject(Meta)
  private readonly _repository = inject(ProductsRepositoryService)

  public readonly searchQueryControl = new FormControl('')
  public readonly searchQuery = toSignal(
    this.searchQueryControl.valueChanges.pipe(debounceTime(200))
  )

  public readonly productsQuery = this._repository.get({ limit: 16, offset: 0 })
  public readonly products = toSignal(
    this.productsQuery.valueChanges.pipe(map(v => v.data.products))
  )

  constructor() {
    effect(() => {
      if (this.searchQuery() === undefined) return

      this.productsQuery.refetch({ title: this.searchQuery() })
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
