import type { Coffee, CoffeeProcess, CoffeeProfile, RoastLevel } from '~/types'

/**
 * Función pura — deriva un `CoffeeProfile` bucketed desde un Coffee.
 * Base del Affinity Score (design/el-vertido.md §4.2). Sin dependencias de
 * store; testable en aislamiento.
 *
 * ponytail: cero magia. Buckets amplios, heurísticas explicables. Cuando
 * lleguen >10k outcomes se puede plantar ML; hasta entonces esto basta.
 */

function bucketRoast(level?: RoastLevel): CoffeeProfile['roastBand'] {
  if (!level) return 'mid'
  if (level === 'light' || level === 'medium_light') return 'light'
  if (level === 'dark' || level === 'medium_dark') return 'dark'
  return 'mid'
}

function bucketScore(sca?: number): CoffeeProfile['scoreBand'] {
  if (!sca) return 'casual'
  if (sca >= 90) return 'topShelf'
  if (sca >= 84) return 'specialty'
  return 'casual'
}

// Clasificación de notas en clases dominantes. Si hay múltiples clases con
// hits, devuelve 'mixed'. Diccionario mínimo — se puede expandir a demanda.
const FLAVOR_DICT: Record<CoffeeProfile['flavorClass'], string[]> = {
  fruit:  ['cereza', 'naranja', 'mandarina', 'durazno', 'mora', 'frutal', 'cítrico', 'bergamota', 'limón'],
  choco:  ['chocolate', 'cacao', 'caramelo', 'panela', 'nutella'],
  floral: ['jazmín', 'floral', 'rosa', 'lavanda'],
  nut:    ['nuez', 'almendra', 'avellana', 'maní'],
  spice:  ['canela', 'clavo', 'cardamomo', 'pimienta', 'especia'],
  mixed:  [],
}

function classifyNotes(notes: string[]): CoffeeProfile['flavorClass'] {
  if (!notes || notes.length === 0) return 'mixed'
  const normalized = notes.map(n => n.toLowerCase().trim())
  const hits = new Set<CoffeeProfile['flavorClass']>()
  for (const note of normalized) {
    for (const [cls, keywords] of Object.entries(FLAVOR_DICT)) {
      if (cls === 'mixed') continue
      if (keywords.some(k => note.includes(k))) {
        hits.add(cls as CoffeeProfile['flavorClass'])
      }
    }
  }
  if (hits.size === 0) return 'mixed'
  if (hits.size === 1) return [...hits][0]
  return 'mixed'
}

export function coffeeToProfile(coffee: Coffee | null | undefined): CoffeeProfile | undefined {
  if (!coffee) return undefined
  return {
    process: (coffee.process || 'other') as CoffeeProcess,
    roastBand: bucketRoast(coffee.roastLevel),
    flavorClass: classifyNotes(coffee.flavorNotes ?? []),
    scoreBand: bucketScore(coffee.scaScore),
  }
}

/** Serialización para indexar en Firestore. */
export function profileKey(p: CoffeeProfile): string {
  return `${p.process}|${p.roastBand}|${p.flavorClass}|${p.scoreBand}`
}
