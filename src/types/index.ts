export type UserType = 'seller' | 'buyer' | 'carrier' | 'agent'

export type EntityType = 'offer' | 'purchase' | 'transport' | 'all'

export interface User {
  id: string
  name: string
  type: UserType
}

export type OfferStatus = 'draft' | 'assigned' | 'cancelled' | 'completed'

export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Other'
export type BodyType = 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Coupe' | 'Convertible' | 'Wagon' | 'Hatchback' | 'Other'
export type OwnershipType = 'owned' | 'leased' | 'financed'
export type TitleType = 'clean' | 'salvage' | 'rebuilt' | 'lemon' | 'flood'
export type YesNo = 'yes' | 'no'
export type DrivetrainCondition = 'drives' | 'runs_but_does_not_drive' | 'does_not_run'
export type EngineTransmissionCondition = 'intact' | 'damaged' | 'missing'

export interface Offer {
  id: string
  sellerId: string
  sellerName?: string
  buyerId?: string
  buyerName?: string
  carrierId?: string
  carrierName?: string
  
  vin?: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleTrim?: string
  vehicleBodyType: BodyType
  vehicleCabType?: string
  vehicleDoorCount: number
  vehicleFuelType: FuelType
  vehicleBodyStyle?: string
  vehicleUsage: 'personal' | 'commercial'
  vehicleZipCode: string
  
  ownershipType: OwnershipType
  ownershipTitleType: TitleType
  mileage: number
  isMileageUnverifiable: boolean
  
  drivetrainCondition: DrivetrainCondition
  keyOrFobAvailable: YesNo
  workingBatteryInstalled: YesNo
  allTiresInflated: YesNo
  wheelsRemoved: YesNo
  wheelsRemovedDriverFront: boolean
  wheelsRemovedDriverRear: boolean
  wheelsRemovedPassengerFront: boolean
  wheelsRemovedPassengerRear: boolean
  
  bodyPanelsIntact: YesNo
  bodyDamageFree: YesNo
  mirrorsLightsGlassIntact: YesNo
  interiorIntact: YesNo
  floodFireDamageFree: YesNo
  engineTransmissionCondition: EngineTransmissionCondition
  airbagsDeployed: YesNo
  
  status: OfferStatus
  createdAt: string
  updatedAt: string
}

export interface Purchase {
  id: string
  buyerId: string
  offerId: string
  purchaseDate: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  buyerDetails: {
    name: string
    email: string
    phone: string
  }
  offer?: Offer
  createdAt: string
  updatedAt: string
}

export interface Transport {
  id: string
  carrierId: string
  purchaseId: string
  pickupLocation: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  deliveryLocation: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  scheduleDate: string
  status: 'scheduled' | 'in-transit' | 'delivered' | 'cancelled'
  vehicleDetails?: {
    vin: string
    make: string
    model: string
  }
  carrierInfo?: {
    name: string
    contact: string
  }
  createdAt: string
  updatedAt: string
}

export type SearchResult = Offer | Purchase | Transport

export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  pageSize: number
  entityType: EntityType
}

export interface SearchFilters {
  userType: UserType
  userId: string
  query: string
  entityType: EntityType
  status?: string
  dateRange?: {
    from: string
    to: string
  }
}

export interface AutocompleteItem {
  value: string
  label: string
  type: 'vin' | 'id' | 'location' | 'make' | 'model' | 'phone'
  highlight?: string
}

export interface CreateOfferRequest {
  sellerId: string
  vin?: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleTrim?: string
  vehicleBodyType: BodyType
  vehicleCabType?: string
  vehicleDoorCount: number
  vehicleFuelType: FuelType
  vehicleBodyStyle?: string
  vehicleUsage: 'personal' | 'commercial'
  vehicleZipCode: string
  ownershipType: OwnershipType
  ownershipTitleType: TitleType
  mileage: number
  isMileageUnverifiable: boolean
  drivetrainCondition: DrivetrainCondition
  keyOrFobAvailable: YesNo
  workingBatteryInstalled: YesNo
  allTiresInflated: YesNo
  wheelsRemoved: YesNo
  wheelsRemovedDriverFront: boolean
  wheelsRemovedDriverRear: boolean
  wheelsRemovedPassengerFront: boolean
  wheelsRemovedPassengerRear: boolean
  bodyPanelsIntact: YesNo
  bodyDamageFree: YesNo
  mirrorsLightsGlassIntact: YesNo
  interiorIntact: YesNo
  floodFireDamageFree: YesNo
  engineTransmissionCondition: EngineTransmissionCondition
  airbagsDeployed: YesNo
}

export interface AssignOfferRequest {
  buyer_id: number
  carrier_id: number
}

export interface OffersListResponse {
  offers: Offer[]
  total: number
  page: number
  pageSize: number
}

export interface OffersListParams {
  pageNumber?: number
  pageSize?: number
  search?: string
  status?: OfferStatus
  sortBy?: string
  sortDescending?: boolean
}

export interface SearchToken {
  userType: UserType
  userId: string
  token: string
  expiresAt: string
}
