import { Injectable } from '@angular/core'
import { Apollo, gql, QueryRef } from 'apollo-angular'
import { Filter } from '../types/filter'
import { ProductsListItem } from '../types/products-list-item'

type Response = { products: ProductsListItem[] }

@Injectable({ providedIn: 'root' })
export class ProductsRepositoryService {
  constructor(private readonly _http: Apollo) {}

  public get(filter?: Filter): QueryRef<Response> {
    return this._http.watchQuery<Response>({
      query: gql`
        query Products(
          $limit: Int
          $offset: Int
          $title: String
          $categoryId: Float
        ) {
          products(
            limit: $limit
            offset: $offset
            title: $title
            categoryId: $categoryId
          ) {
            id
            title
            price
            images
          }
        }
      `,
      variables: filter
    })
  }
}
