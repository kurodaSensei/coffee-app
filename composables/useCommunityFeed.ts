import type { Coffee, Recipe, Tasting } from '~/types'

export type FeedItem =
  | { kind: 'coffee'; id: string; createdAtMs: number; data: Coffee }
  | { kind: 'tasting'; id: string; createdAtMs: number; data: Tasting }
  | { kind: 'recipe'; id: string; createdAtMs: number; data: Recipe }

function tsMillis(ts: any): number {
  if (!ts) return 0
  if (typeof ts.toMillis === 'function') return ts.toMillis()
  if (typeof ts.seconds === 'number') return ts.seconds * 1000
  return 0
}

/**
 * Feed de Explora: items marcados como 'community' de las tres colecciones,
 * mezclados y ordenados cronológicamente. Excluye los del propio usuario —
 * Explora es para descubrir lo de los demás.
 */
export const useCommunityFeed = () => {
  const { getCommunityFeed } = useFirebase()
  const { userId } = useAuth()

  const items = ref<FeedItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const [coffees, tastings, recipes] = await Promise.all([
        getCommunityFeed<Coffee>('coffees'),
        getCommunityFeed<Tasting>('tastings'),
        getCommunityFeed<Recipe>('recipes'),
      ])

      const merged: FeedItem[] = [
        ...coffees.map(c => ({ kind: 'coffee' as const, id: c.id, createdAtMs: tsMillis(c.createdAt), data: c })),
        ...tastings.map(t => ({ kind: 'tasting' as const, id: t.id, createdAtMs: tsMillis(t.createdAt), data: t })),
        ...recipes.map(r => ({ kind: 'recipe' as const, id: r.id, createdAtMs: tsMillis(r.createdAt), data: r })),
      ]

      items.value = merged
        .filter(item => item.data.userId !== userId.value)
        .sort((a, b) => b.createdAtMs - a.createdAtMs)
      loaded.value = true
    }
    catch (e: any) {
      // El error más probable en el primer uso es el índice compuesto faltante.
      error.value = e?.code === 'failed-precondition'
        ? 'Explora necesita un índice de Firestore. Revisa la consola para crearlo.'
        : (e?.message ?? 'No se pudo cargar Explora')
      console.error('[useCommunityFeed] load failed:', e)
    }
    finally {
      loading.value = false
    }
  }

  return { items, loading, error, loaded, load }
}
