import { Injectable } from '@angular/core'
import { Apollo, gql, QueryRef } from 'apollo-angular'
import { Category } from '../types/category'

type Response = { categories: Category[] }

@Injectable({ providedIn: 'root' })
export class CategoriesRepositoryService {
  constructor(private readonly _http: Apollo) {}

  public get(): QueryRef<Response> {
    return this._http.watchQuery<Response>({
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
