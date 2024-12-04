import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CategoryFilterComponent } from '../category-filter/category-filter.component'

@Component({
  selector: 'header[app-header]',
  standalone: true,
  imports: [RouterLink, CategoryFilterComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col md:flex-row items-center justify-between gap-4'
  }
})
export class HeaderComponent {}
