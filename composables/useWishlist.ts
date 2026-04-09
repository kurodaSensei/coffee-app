import { orderBy } from 'firebase/firestore'
import type { WishlistItem } from '~/types'

export const useWishlist = () => {
  const { getAll, getById, create, update, remove } = useFirebase()
  const COLLECTION = 'wishlist'

  const fetchAll = async (): Promise<WishlistItem[]> => {
    return getAll<WishlistItem>(COLLECTION, [orderBy('priority', 'desc')])
  }

  const fetchById = async (id: string): Promise<WishlistItem | null> => {
    return getById<WishlistItem>(COLLECTION, id)
  }

  const createItem = async (data: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return create(COLLECTION, data)
  }

  const updateItem = async (id: string, data: Partial<WishlistItem>): Promise<void> => {
    return update(COLLECTION, id, data)
  }

  const deleteItem = async (id: string): Promise<void> => {
    return remove(COLLECTION, id)
  }

  return {
    fetchAll,
    fetchById,
    createItem,
    updateItem,
    deleteItem,
  }
}
