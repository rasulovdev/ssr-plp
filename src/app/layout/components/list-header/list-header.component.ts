import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { SearchFieldComponent } from '../search-field/search-field.component'

@Component({
  selector: 'header[app-list-header]',
  standalone: true,
  imports: [NgOptimizedImage, SearchFieldComponent, RouterLink],
  templateUrl: './list-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'relative space-y-5 overflow-clip rounded-lg bg-black p-4 text-center sm:p-6 md:p-12 lg:p-20'
  }
})
export class ListHeaderComponent {}
