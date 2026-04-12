import type { Timestamp } from 'firebase/firestore'

// Enums
export type CoffeeProcess =
  | 'washed'
  | 'natural'
  | 'honey'
  | 'anaerobic'
  | 'carbonic'
  | 'experimental'
  | 'other'

export type RoastLevel =
  | 'light'
  | 'medium_light'
  | 'medium'
  | 'medium_dark'
  | 'dark'

export type BrewMethod =
  | 'v60'
  | 'kalita'
  | 'chemex'
  | 'aeropress'
  | 'french_press'
  | 'origami'
  | 'suiren'
  | 'espresso'
  | 'moka_pot'
  | 'phin'
  | 'cold_brew'
  | 'other'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'very_rare'

export type WishlistStatus = 'pending' | 'purchased' | 'unavailable'

// Interfaces
export interface Roaster {
  id: string
  name: string
  website?: string
  instagram?: string
  city?: string
  country: string
  notes?: string
  rating?: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Coffee {
  id: string
  name: string
  roasterId?: string
  roasterName?: string
  variety: string
  process: CoffeeProcess
  originRegion: string
  originCountry: string
  originFarm?: string
  originProducer?: string
  altitude?: number
  scaScore?: number
  roastLevel?: RoastLevel
  roastDate?: Timestamp
  price?: number
  weight?: number
  flavorNotes: string[]
  photoUrl?: string
  sharedWith?: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Tasting {
  id: string
  coffeeId: string
  coffeeName: string
  roasterName: string
  brewMethod: BrewMethod
  brewDate: Timestamp
  dose?: number
  water?: number
  ratio?: string
  grindSize?: number
  waterTemp?: number
  brewTime?: number
  recipeName?: string
  ratingOverall: number
  ratingAroma?: number
  ratingAcidity?: number
  ratingSweetness?: number
  ratingBody?: number
  ratingAftertaste?: number
  ratingBalance?: number
  personalNotes?: string
  wouldBuyAgain?: boolean
  isFavorite?: boolean
  photoUrl?: string
  sharedWith?: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Recipe {
  id: string
  name: string
  brewMethod: BrewMethod
  dose: number
  water: number
  ratio?: string
  grindSize?: number
  waterTemp?: number
  instructions?: string
  bestFor?: string
  sharedWith?: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface WishlistItem {
  id: string
  roasterId?: string
  roasterName?: string
  coffeeName: string
  variety?: string
  notes?: string
  priority: number
  status: WishlistStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserProfile {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected'

export interface Friendship {
  id: string
  uids: string[]
  users: Array<{ uid: string; email: string; displayName?: string }>
  status: FriendshipStatus
  initiatedBy: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface UserPreferences {
  id: string
  userId: string
  customVarieties: string[]
  customProcesses: { value: string; label: string }[]
  customBrewMethods: { value: string; label: string }[]
  disabledVarieties: string[]
  disabledProcesses: string[]
  disabledBrewMethods: string[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Variety {
  id: string
  name: string
  origin?: string
  description?: string
  typicalNotes: string[]
  rarity: Rarity
}
