import { Injectable } from '@angular/core'
import { Apollo, gql, QueryRef } from 'apollo-angular'
import { Category } from '../types/category'

export type CategoriesResponse = { categories: Category[] }

@Injectable({ providedIn: 'root' })
export class CategoriesRepositoryService {
  constructor(private readonly _http: Apollo) {}

  public get(): QueryRef<CategoriesResponse> {
    return this._http.watchQuery<CategoriesResponse>({
      query: gql`
        query Categories {
          categories {
            id
            name
          }
        }
      `
    })
  }
}
