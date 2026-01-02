import { useOffers } from './useOffers'
import type { OfferStatus } from '@/types'

export function useOffersList() {
  return useOffers({
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortDescending: true
  })
}

export function useOffersPaginated(pageNumber: number, pageSize: number = 20) {
  return useOffers({
    pageNumber,
    pageSize,
    sortBy: 'createdAt',
    sortDescending: true
  })
}

export function useOffersSorted(sortBy: string, sortDescending: boolean = true) {
  return useOffers({
    pageNumber: 1,
    pageSize: 20,
    sortBy,
    sortDescending
  })
}

export function useOffersFiltered(filters: {
  search?: string
  status?: OfferStatus
  pageNumber?: number
  pageSize?: number
}) {
  return useOffers({
    pageNumber: filters.pageNumber || 1,
    pageSize: filters.pageSize || 20,
    sortBy: 'createdAt',
    sortDescending: true,
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status })
  })
}
