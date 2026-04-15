import { defineStore } from 'pinia'
import type { WishlistItem, WishlistInput, WishlistStatus } from '~/types'

export const useWishlistStore = defineStore('wishlist', () => {
  const { fetchAll, fetchById, createItem, updateItem, deleteItem } = useWishlist()

  const base = useFirestoreStoreState<WishlistItem, WishlistInput>({
    api: {
      fetchAll,
      fetchById,
      create: createItem,
      update: updateItem,
      remove: deleteItem,
    },
    messages: {
      created: 'Agregado a wishlist',
      updated: 'Wishlist actualizada',
      removed: 'Eliminado de wishlist',
      createFailed: 'No se pudo crear el item de wishlist',
      updateFailed: 'No se pudo actualizar el item de wishlist',
      removeFailed: 'No se pudo eliminar el item de wishlist',
    },
  })

  // Domain-specific: change status only
  async function changeStatus(id: string, status: WishlistStatus) {
    const toast = useToast()
    base.loading.value = true
    base.error.value = null
    try {
      await updateItem(id, { status })
      await base.loadAll()
      if (base.current.value?.id === id) {
        base.current.value = await fetchById(id)
      }
      toast.success('Estado actualizado')
    } catch (e: any) {
      base.error.value = e.message ?? 'Failed'
      toast.error('No se pudo actualizar el estado', e)
      throw e
    } finally {
      base.loading.value = false
    }
  }

  return {
    ...base,
    changeStatus,
  }
})
