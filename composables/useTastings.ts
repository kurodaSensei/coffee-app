import { orderBy, where, limit, type QueryConstraint } from 'firebase/firestore'
import type { Tasting } from '~/types'

export const useTastings = () => {
  const { getAll, getById, create, update, remove } = useFirebase()
  const COLLECTION = 'tastings'

  const fetchAll = async (filters?: {
    coffeeId?: string
    brewMethod?: string
    isFavorite?: boolean
  }): Promise<Tasting[]> => {
    // No Firestore orderBy to avoid composite index requirement;
    // sort client-side by brewDate desc.
    const all = await getAll<Tasting>(COLLECTION)
    let result = all
    if (filters?.coffeeId) result = result.filter(t => t.coffeeId === filters.coffeeId)
    if (filters?.brewMethod) result = result.filter(t => t.brewMethod === filters.brewMethod)
    if (filters?.isFavorite) result = result.filter(t => t.isFavorite)
    return result.sort((a, b) => {
      const ta = a.brewDate?.toMillis?.() ?? 0
      const tb = b.brewDate?.toMillis?.() ?? 0
      return tb - ta
    })
  }

  const fetchRecent = async (count: number = 5): Promise<Tasting[]> => {
    const all = await fetchAll()
    return all.slice(0, count)
  }

  const fetchById = async (id: string): Promise<Tasting | null> => {
    return getById<Tasting>(COLLECTION, id)
  }

  const createTasting = async (data: Omit<Tasting, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return create(COLLECTION, data)
  }

  const updateTasting = async (id: string, data: Partial<Tasting>): Promise<void> => {
    return update(COLLECTION, id, data)
  }

  const deleteTasting = async (id: string): Promise<void> => {
    return remove(COLLECTION, id)
  }

  return {
    fetchAll,
    fetchRecent,
    fetchById,
    createTasting,
    updateTasting,
    deleteTasting,
  }
}
