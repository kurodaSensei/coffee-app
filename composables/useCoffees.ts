import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import type { Coffee } from '~/types'

export const useCoffees = () => {
  const { getAll, getById, create, update, remove } = useFirebase()
  const COLLECTION = 'coffees'

  const fetchAll = async (filters?: {
    roasterId?: string
    process?: string
    variety?: string
  }): Promise<Coffee[]> => {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

    if (filters?.roasterId) {
      constraints.unshift(where('roasterId', '==', filters.roasterId))
    }
    if (filters?.process) {
      constraints.unshift(where('process', '==', filters.process))
    }

    return getAll<Coffee>(COLLECTION, constraints)
  }

  const fetchById = async (id: string): Promise<Coffee | null> => {
    return getById<Coffee>(COLLECTION, id)
  }

  const createCoffee = async (data: Omit<Coffee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return create(COLLECTION, data)
  }

  const updateCoffee = async (id: string, data: Partial<Coffee>): Promise<void> => {
    return update(COLLECTION, id, data)
  }

  const deleteCoffee = async (id: string): Promise<void> => {
    return remove(COLLECTION, id)
  }

  return {
    fetchAll,
    fetchById,
    createCoffee,
    updateCoffee,
    deleteCoffee,
  }
}
