export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  statusCode: number
  message: string
  error?: string
  details?: Record<string, unknown>
}

export interface Money {
  amount: number
  currency: string
}

export interface GeoPoint {
  lat: number
  lng: number
}
