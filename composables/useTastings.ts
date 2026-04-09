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
    const constraints: QueryConstraint[] = [orderBy('brewDate', 'desc')]

    if (filters?.coffeeId) {
      constraints.unshift(where('coffeeId', '==', filters.coffeeId))
    }
    if (filters?.brewMethod) {
      constraints.unshift(where('brewMethod', '==', filters.brewMethod))
    }
    if (filters?.isFavorite) {
      constraints.unshift(where('isFavorite', '==', true))
    }

    return getAll<Tasting>(COLLECTION, constraints)
  }

  const fetchRecent = async (count: number = 5): Promise<Tasting[]> => {
    return getAll<Tasting>(COLLECTION, [orderBy('brewDate', 'desc'), limit(count)])
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
