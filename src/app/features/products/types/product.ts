import { Category } from './category'

export type Product = {
  id: string
  title: string
  price: number
  description: string
  images: string[]
  category: Category
}
