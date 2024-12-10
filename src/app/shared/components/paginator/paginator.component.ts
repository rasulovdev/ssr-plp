import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { injectQueryParams } from 'ngxtension/inject-query-params'

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex justify-center' }
})
export class PaginatorComponent {
  public readonly items = input.required<unknown[]>()
  public readonly limit = input.required<number>()

  public readonly offset = injectQueryParams('offset', {
    initialValue: 0,
    transform: numberAttribute
  })
}
