import { defineStore } from 'pinia'
import type { WishlistItem, WishlistStatus } from '~/types'

export const useWishlistStore = defineStore('wishlist', () => {
  const { fetchAll, fetchById, createItem, updateItem, deleteItem } = useWishlist()

  const list = ref<WishlistItem[]>([])
  const current = ref<WishlistItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchAll()
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load wishlist'
    } finally {
      loading.value = false
    }
  }

  async function loadById(id: string) {
    loading.value = true
    error.value = null
    try {
      current.value = await fetchById(id)
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load wishlist item'
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const id = await createItem(data)
      await loadAll()
      return id
    } catch (e: any) {
      error.value = e.message ?? 'Failed to create wishlist item'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: Partial<WishlistItem>) {
    loading.value = true
    error.value = null
    try {
      await updateItem(id, data)
      await loadAll()
      if (current.value?.id === id) {
        current.value = await fetchById(id)
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to update wishlist item'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function changeStatus(id: string, status: WishlistStatus) {
    return update(id, { status })
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await deleteItem(id)
      list.value = list.value.filter((item) => item.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to delete wishlist item'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    list,
    current,
    loading,
    error,
    loadAll,
    loadById,
    create,
    update,
    changeStatus,
    remove,
  }
})
