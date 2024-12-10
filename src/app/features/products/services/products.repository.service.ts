import { Injectable } from '@angular/core'
import { Apollo, gql, QueryRef } from 'apollo-angular'
import { Filter } from '../types/filter'
import { Product } from '../types/product'
import { ProductsListItem } from '../types/products-list-item'

type Response = { products: ProductsListItem[] }
type DetailsResponse = { product: Product }
type PriceResponse = { product: Pick<Product, 'price'> }

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

  public getById(id: number): QueryRef<DetailsResponse> {
    return this._http.watchQuery<DetailsResponse>({
      query: gql`
        query Product($id: ID!) {
          product(id: $id) {
            id
            title
            description
            images
            category {
              id
              name
            }
          }
        }
      `,
      variables: { id }
    })
  }

  public getPrice(id: number): QueryRef<PriceResponse> {
    return this._http.watchQuery<PriceResponse>({
      query: gql`
        query ProductPrice($id: ID!) {
          product(id: $id) {
            id
            price
          }
        }
      `,
      variables: { id },
      useInitialLoading: true
    })
  }
}
