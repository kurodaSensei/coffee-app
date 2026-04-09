import { orderBy } from 'firebase/firestore'
import type { Roaster } from '~/types'

export const useRoasters = () => {
  const { getAll, getById, create, update, remove } = useFirebase()
  const COLLECTION = 'roasters'

  const fetchAll = async (): Promise<Roaster[]> => {
    return getAll<Roaster>(COLLECTION, [orderBy('name')])
  }

  const fetchById = async (id: string): Promise<Roaster | null> => {
    return getById<Roaster>(COLLECTION, id)
  }

  const createRoaster = async (data: Omit<Roaster, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return create(COLLECTION, data)
  }

  const updateRoaster = async (id: string, data: Partial<Roaster>): Promise<void> => {
    return update(COLLECTION, id, data)
  }

  const deleteRoaster = async (id: string): Promise<void> => {
    return remove(COLLECTION, id)
  }

  return {
    fetchAll,
    fetchById,
    createRoaster,
    updateRoaster,
    deleteRoaster,
  }
}
