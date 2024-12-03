import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute
} from '@angular/core'
import { Router } from '@angular/router'
import { injectQueryParams } from 'ngxtension/inject-query-params'

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex justify-center' }
})
export class PaginatorComponent {
  private readonly _router = inject(Router)

  public readonly items = input.required<unknown[]>()
  public readonly limit = input.required<number>()
  public readonly offset = injectQueryParams('offset', {
    initialValue: 0,
    transform: numberAttribute
  })

  public previousPage(): void {
    if (this.offset()! < this.limit()) return

    const offset = this.offset()! - this.limit()

    this._router.navigate([], {
      queryParams: { offset: offset || null }
    })
  }

  public nextPage(): void {
    if (this.items().length < this.limit()) return

    this._router.navigate([], {
      queryParams: { offset: this.offset()! + this.limit() }
    })
  }
}
