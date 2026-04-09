import { z } from 'zod'

const safeUrl = z.string().url('URL inválida').refine(
  (url) => {
    try {
      return ['http:', 'https:'].includes(new URL(url).protocol)
    } catch {
      return false
    }
  },
  { message: 'La URL debe usar http o https' },
)

const instagramHandle = z.string().regex(
  /^@?[a-zA-Z0-9._]{1,30}$/,
  'Handle de Instagram inválido',
)

export const roasterSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  website: safeUrl.optional().or(z.literal('')),
  instagram: instagramHandle.optional().or(z.literal('')),
  city: z.string().optional(),
  country: z.string().min(1, 'El país es requerido'),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
})

export const coffeeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  roasterId: z.string().optional(),
  roasterName: z.string().optional(),
  brand: z.string().optional(),
  variety: z.string().min(1, 'La variedad es requerida'),
  process: z.enum(['washed', 'natural', 'honey', 'anaerobic', 'carbonic', 'experimental', 'other']),
  originRegion: z.string().min(1, 'La región es requerida'),
  originCountry: z.string().min(1, 'El país es requerido'),
  originFarm: z.string().optional(),
  originProducer: z.string().optional(),
  altitude: z.number().positive().optional(),
  scaScore: z.number().min(60).max(100).optional(),
  roastLevel: z.enum(['light', 'medium_light', 'medium', 'medium_dark', 'dark']).optional(),
  price: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  flavorNotes: z.array(z.string()).default([]),
})

export const tastingSchema = z.object({
  coffeeId: z.string().min(1, 'El café es requerido'),
  coffeeName: z.string(),
  roasterName: z.string(),
  brewMethod: z.enum(['v60', 'kalita', 'chemex', 'aeropress', 'french_press', 'origami', 'suiren', 'espresso', 'moka_pot', 'phin', 'cold_brew', 'other']),
  brewDate: z.date(),
  dose: z.number().positive().optional(),
  water: z.number().positive().optional(),
  ratio: z.string().optional(),
  grindSize: z.number().positive().optional(),
  waterTemp: z.number().min(0).max(100).optional(),
  brewTime: z.number().positive().optional(),
  recipeName: z.string().optional(),
  ratingOverall: z.number().min(1).max(10),
  ratingAroma: z.number().min(1).max(10).optional(),
  ratingAcidity: z.number().min(1).max(10).optional(),
  ratingSweetness: z.number().min(1).max(10).optional(),
  ratingBody: z.number().min(1).max(10).optional(),
  ratingAftertaste: z.number().min(1).max(10).optional(),
  ratingBalance: z.number().min(1).max(10).optional(),
  personalNotes: z.string().optional(),
  wouldBuyAgain: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
})

export const recipeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  brewMethod: z.enum(['v60', 'kalita', 'chemex', 'aeropress', 'french_press', 'origami', 'suiren', 'espresso', 'moka_pot', 'phin', 'cold_brew', 'other']),
  dose: z.number().positive('La dosis es requerida'),
  water: z.number().positive('El agua es requerida'),
  ratio: z.string().optional(),
  grindSize: z.number().positive().optional(),
  waterTemp: z.number().min(0).max(100).optional(),
  instructions: z.string().optional(),
  bestFor: z.string().optional(),
})

export const wishlistSchema = z.object({
  coffeeName: z.string().min(1, 'El nombre es requerido'),
  roasterId: z.string().optional(),
  roasterName: z.string().optional(),
  variety: z.string().optional(),
  notes: z.string().optional(),
  priority: z.number().min(1).max(5).default(2),
  status: z.enum(['pending', 'purchased', 'unavailable']).default('pending'),
})

export type RoasterFormData = z.infer<typeof roasterSchema>
export type CoffeeFormData = z.infer<typeof coffeeSchema>
export type TastingFormData = z.infer<typeof tastingSchema>
export type RecipeFormData = z.infer<typeof recipeSchema>
export type WishlistFormData = z.infer<typeof wishlistSchema>
