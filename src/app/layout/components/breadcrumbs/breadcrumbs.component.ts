import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HoverPrefetchLinkDirective } from 'ngx-hover-preload'
import { Product } from '../../../features/products/types/product'

@Component({
  selector: 'nav[app-breadcrumbs]',
  standalone: true,
  imports: [RouterLink, HoverPrefetchLinkDirective],
  templateUrl: './breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
  public readonly product = input.required<Product>()
}
