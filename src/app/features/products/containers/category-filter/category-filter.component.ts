import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { injectQueryParams } from 'ngxtension/inject-query-params'
import { filter, map } from 'rxjs'
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

  public readonly categoryId = injectQueryParams('categoryId')
  public readonly categoriesQuery = this._categoriesRepository.get()

  public readonly categories = toSignal(
    this.categoriesQuery.valueChanges.pipe(
      filter(request => !request.loading && !!request.data.categories.length),
      map(({ data }) => [{ id: null, name: 'All' }, ...data.categories])
    )
  )

  public filter(categoryId: number | null): void {
    this._router.navigate([], {
      queryParams: { categoryId },
      queryParamsHandling: 'merge'
    })
  }
}
