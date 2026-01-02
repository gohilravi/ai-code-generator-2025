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
      const data = response.data;
      // Ensure backwards compatibility by adding 'total' if it doesn't exist
      if (data && typeof data.totalCount === 'number' && typeof data.total === 'undefined') {
        data.total = data.totalCount;
      }
      return data
    } catch (error) {
      console.error('Get offers error:', error)
      return {
        offers: [],
        total: 0,
        totalCount: 0,
        page: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
        totalPages: 0,
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
      // Convert sellerId to number - extract numeric part from string like "seller-2"
      const match = data.sellerId.match(/-?(\d+)$/);
      const sellerId = match ? parseInt(match[1]) : 0;
      
      const payload = {
        sellerId,
        vin: data.vin || "",
        vehicleYear: data.vehicleYear,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehicleTrim: data.vehicleTrim,
        vehicleBodyType: data.vehicleBodyType,
        vehicleCabType: data.vehicleCabType,
        vehicleDoorCount: data.vehicleDoorCount,
        vehicleFuelType: data.vehicleFuelType,
        vehicleBodyStyle: data.vehicleBodyStyle,
        vehicleUsage: data.vehicleUsage,
        vehicleZipCode: data.vehicleZipCode,
        ownershipType: data.ownershipType,
        ownershipTitleType: data.ownershipTitleType,
        mileage: data.mileage,
        isMileageUnverifiable: data.isMileageUnverifiable,
        drivetrainCondition: data.drivetrainCondition,
        keyOrFobAvailable: data.keyOrFobAvailable,
        workingBatteryInstalled: data.workingBatteryInstalled,
        allTiresInflated: data.allTiresInflated,
        wheelsRemoved: data.wheelsRemoved,
        wheelsRemovedDriverFront: data.wheelsRemovedDriverFront,
        wheelsRemovedDriverRear: data.wheelsRemovedDriverRear,
        wheelsRemovedPassengerFront: data.wheelsRemovedPassengerFront,
        wheelsRemovedPassengerRear: data.wheelsRemovedPassengerRear,
        bodyPanelsIntact: data.bodyPanelsIntact,
        bodyDamageFree: data.bodyDamageFree,
        mirrorsLightsGlassIntact: data.mirrorsLightsGlassIntact,
        interiorIntact: data.interiorIntact,
        floodFireDamageFree: data.floodFireDamageFree,
        engineTransmissionCondition: data.engineTransmissionCondition,
        airbagsDeployed: data.airbagsDeployed
      };
      
      const response = await api.post('/api/offers', payload)
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
