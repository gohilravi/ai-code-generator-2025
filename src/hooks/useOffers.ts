import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { offerService } from '@/services/api'
import type { 
  CreateOfferRequest, 
  AssignOfferRequest, 
  OffersListParams
} from '@/types'

export const OFFERS_QUERY_KEY = 'offers'

export function useOffers(params: OffersListParams = {}) {
  const queryParams = {
    pageNumber: params.pageNumber || 1,
    pageSize: params.pageSize || 20,
    sortBy: params.sortBy || 'createdAt',
    sortDescending: params.sortDescending !== false,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
  }

  return useQuery({
    queryKey: [OFFERS_QUERY_KEY, queryParams],
    queryFn: () => offerService.getOffers(queryParams),
    staleTime: 30000,
  })
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: [OFFERS_QUERY_KEY, id],
    queryFn: () => offerService.getOfferById(id),
    enabled: !!id,
    staleTime: 30000,
  })
}

export function useCreateOffer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOfferRequest) => offerService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] })
    },
  })
}

export function useAssignOffer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ offerId, data }: { offerId: number; data: AssignOfferRequest }) =>
      offerService.assignOffer(offerId.toString(), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY, variables.offerId.toString()] })
    },
  })
}

export function useCancelOffer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (offerId: number) => offerService.cancelOffer(offerId.toString()),
    onSuccess: (_, offerId) => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY, offerId.toString()] })
    },
  })
}
