import type { WishlistItem } from '~/types'

export const useWishlist = () => {
  const { getAll, getById, create, update, remove } = useFirebase()
  const COLLECTION = 'wishlist'

  const fetchAll = async (): Promise<WishlistItem[]> => {
    const all = await getAll<WishlistItem>(COLLECTION)
    return all.sort((a, b) => (b.priority || 0) - (a.priority || 0))
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
