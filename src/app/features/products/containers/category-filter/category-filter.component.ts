import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PendingTasks
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { injectQueryParams } from 'ngxtension/inject-query-params'
import { map, of, switchMap, tap } from 'rxjs'
import { CategoriesRepositoryService } from '../../services/categories.repository.service'

@Component({
  selector: 'app-category-filter',
  standalone: true,
  templateUrl: './category-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex gap-1 overflow-auto' }
})
export class CategoryFilterComponent {
  private readonly _categoriesRepository = inject(CategoriesRepositoryService)
  private readonly _router = inject(Router)
  private readonly _pendingTasks = inject(PendingTasks)

  public readonly categoryId = injectQueryParams('categoryId')
  public readonly categoriesQuery = this._categoriesRepository.get()

  public readonly categories = toSignal(
    of(this._pendingTasks.add()).pipe(
      switchMap(cleanup => {
        return this.categoriesQuery.valueChanges.pipe(
          map(request => [request, cleanup] as const)
        )
      }),
      tap(([, cleanup]) => cleanup()),
      map(([{ data }]) => [{ id: null, name: 'All' }, ...data.categories])
    )
  )

  public filter(categoryId: number | null): void {
    this._router.navigate([], {
      queryParams: { categoryId },
      queryParamsHandling: 'merge'
    })
  }
}
