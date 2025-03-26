export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface CalligraphyWork {
  id: number
  title: string
  content: string
  author: User
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
} 