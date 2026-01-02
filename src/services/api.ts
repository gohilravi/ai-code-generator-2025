import axios from 'axios'
import type { 
  SearchResponse, 
  SearchFilters, 
  AutocompleteItem, 
  User,
  Offer,
  CreateOfferRequest,
  AssignOfferRequest,
  OffersListResponse,
  OffersListParams,
  SearchToken
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setSearchToken = (token: SearchToken) => {
  if (token.token) {
    api.defaults.headers.common['X-Search-Token'] = token.token
  }
}

export const clearSearchToken = () => {
  delete api.defaults.headers.common['X-Search-Token']
}

export const searchService = {
  async search(filters: SearchFilters, page = 1, pageSize = 20): Promise<SearchResponse> {
    try {
      const response = await api.post('/api/search', {
        ...filters,
        page,
        pageSize,
      })
      return response.data
    } catch (error) {
      console.error('Search error:', error)
      return {
        results: [],
        total: 0,
        page: 1,
        pageSize: 20,
        entityType: filters.entityType,
      }
    }
  },

  async autocomplete(query: string, userType: string, userId: string): Promise<AutocompleteItem[]> {
    try {
      const response = await api.post('/api/search/autocomplete', {
        query,
        userType,
        userId,
      })
      return response.data.suggestions || []
    } catch (error) {
      console.error('Autocomplete error:', error)
      return []
    }
  },

  async getUsers(userType: string): Promise<User[]> {
    try {
      const response = await api.get(`/api/users?type=${userType}`)
      return response.data.users || []
    } catch (error) {
      console.error('Get users error:', error)
      return []
    }
  },

  async generateToken(userType: string, userId: string): Promise<SearchToken | null> {
    try {
      const response = await api.post('/api/search/token', {
        userType,
        userId,
      })
      return response.data
    } catch (error) {
      console.error('Token generation error:', error)
      return null
    }
  },
}

export const offerService = {
  async getOffers(params: OffersListParams = {}): Promise<OffersListResponse> {
    try {
      const queryParams = {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
        sortBy: params.sortBy || 'createdAt',
        sortDescending: params.sortDescending !== false, // default to true
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status }),
      }
      
      const response = await api.get('/api/offers', { params: queryParams })
      return response.data
    } catch (error) {
      console.error('Get offers error:', error)
      return {
        offers: [],
        total: 0,
        page: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
      }
    }
  },

  async getOfferById(id: string): Promise<Offer | null> {
    try {
      const response = await api.get(`/api/offers/${id}`)
      return response.data
    } catch (error) {
      console.error('Get offer error:', error)
      return null
    }
  },

  async createOffer(data: CreateOfferRequest): Promise<Offer | null> {
    try {
      const response = await api.post('/api/offers', data)
      return response.data
    } catch (error) {
      console.error('Create offer error:', error)
      throw error
    }
  },

  async assignOffer(offerId: string, data: AssignOfferRequest): Promise<Offer | null> {
    try {
      const response = await api.post(`/api/offers/${offerId}/assign`, {
        buyer_id: data.buyer_id,
        carrier_id: data.carrier_id
      })
      return response.data
    } catch (error) {
      console.error('Assign offer error:', error)
      throw error
    }
  },

  async cancelOffer(offerId: string): Promise<Offer | null> {
    try {
      const response = await api.post(`/api/offers/${offerId}/cancel`)
      return response.data
    } catch (error) {
      console.error('Cancel offer error:', error)
      throw error
    }
  },
}

export default api
