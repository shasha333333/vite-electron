export interface Photo {
  id: number
  url: string
  name: string
  date: string
  category: string
  size: string
  dimensions: string
  location: string
  tags: string[]
  favorite: boolean
  description?: string
  deleted?: boolean
} 