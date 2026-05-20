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

export type PurchaseChannel =
  | 'website'
  | 'instagram'
  | 'whatsapp'
  | 'shop'
  | 'other'

export type GrindSize =
  | 'fine'
  | 'medium_fine'
  | 'medium'
  | 'medium_coarse'
  | 'coarse'

export interface RecipeStep {
  /** Time of this milestone since brew start, in seconds. */
  timeSeconds: number
  title: string
  description?: string
}

export type WishlistStatus = 'pending' | 'purchased' | 'unavailable'

/**
 * Nivel de visibilidad de un item compartible (café, cata, receta).
 *  - private:   solo el dueño.
 *  - friends:   el dueño + los UIDs en `sharedWith`.
 *  - community: cualquier usuario autenticado (aparece en Explora).
 * Documentos antiguos sin el campo se tratan como `private`.
 */
export type Visibility = 'private' | 'friends' | 'community'

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
  /** UID del dueño. Presente en los documentos de Firestore. */
  userId?: string
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
  /** Canal por el que se compró el café (web, Instagram, WhatsApp, tienda, otro). */
  purchaseChannel?: PurchaseChannel
  /** Referencia del canal: URL, @handle, nombre de tienda o detalle libre. */
  purchaseReference?: string
  sharedWith?: string[]
  /** Nivel de visibilidad. Ausente = 'private' (documentos antiguos). */
  visibility?: Visibility
  /** Denormalizado al compartir a comunidad — evita un lookup por item en el feed. */
  authorName?: string
  authorPhotoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Tasting {
  id: string
  /** UID del dueño. Presente en los documentos de Firestore. */
  userId?: string
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
  /** Nivel de visibilidad. Ausente = 'private' (documentos antiguos). */
  visibility?: Visibility
  /** Denormalizado al compartir a comunidad — evita un lookup por item en el feed. */
  authorName?: string
  authorPhotoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Recipe {
  id: string
  /** UID del dueño. Presente en los documentos de Firestore. */
  userId?: string
  name: string
  brewMethod: BrewMethod
  dose: number
  water: number
  ratio?: string
  grindSize?: GrindSize
  waterTemp?: number
  instructions?: string
  bestFor?: string
  /** Author or source — e.g. "James Hoffmann", "Tetsu Kasuya". */
  author?: string
  /** Ordered timeline of milestones during the brew. */
  steps?: RecipeStep[]
  sharedWith?: string[]
  /** Nivel de visibilidad. Ausente = 'private' (documentos antiguos). */
  visibility?: Visibility
  /** Denormalizado al compartir a comunidad — evita un lookup por item en el feed. */
  authorName?: string
  authorPhotoURL?: string
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
  bio?: string
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
  customFlavorNotes: string[]
  disabledVarieties: string[]
  disabledProcesses: string[]
  disabledBrewMethods: string[]
  disabledFlavorNotes: string[]
  /** True once the user has seen and dismissed the welcome bottom sheet. */
  hasSeenWelcome?: boolean
  /** True once the user has explicitly hidden the onboarding checklist (or completed all steps). */
  hideOnboardingChecklist?: boolean
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

// Form DTO types — fields required for creating or updating (no id/timestamps/userId)
export type CoffeeInput = Omit<Coffee, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type TastingInput = Omit<Tasting, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type RecipeInput = Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type RoasterInput = Omit<Roaster, 'id' | 'createdAt' | 'updatedAt'>
export type WishlistInput = Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>
