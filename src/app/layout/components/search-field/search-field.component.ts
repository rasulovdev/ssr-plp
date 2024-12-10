import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { injectQueryParams } from 'ngxtension/inject-query-params'
import { debounceTime, filter, map } from 'rxjs'

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class SearchFieldComponent {
  private readonly _router = inject(Router)

  public readonly title = injectQueryParams('title')

  public readonly searchQueryControl = new FormControl<string | null>(
    this.title()
  )

  public readonly searchQuery = toSignal(
    this.searchQueryControl.valueChanges.pipe(
      debounceTime(200),
      map(query => query?.trim()),
      filter(query => !query?.length || query.length > 2)
    )
  )

  constructor() {
    effect(() => {
      if (this.searchQuery() === undefined) return

      this._router.navigate([], {
        queryParams: { title: this.searchQuery() || null },
        queryParamsHandling: 'merge'
      })
    })
  }
}
