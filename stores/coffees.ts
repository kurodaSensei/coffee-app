import { defineStore } from 'pinia'
import type { Coffee, CoffeeInput, CoffeeProcess } from '~/types'

interface CoffeeFilters {
  roasterId?: string
  process?: CoffeeProcess
  variety?: string
}

export const useCoffeesStore = defineStore('coffees', () => {
  const { fetchAll, fetchById, createCoffee, updateCoffee, deleteCoffee } = useCoffees()
  const { getSharedWithMe, updateSharing: updateSharingDoc } = useFirebase()

  const base = useFirestoreStoreState<Coffee, CoffeeInput, CoffeeFilters>({
    api: {
      fetchAll,
      fetchById,
      create: createCoffee,
      update: updateCoffee,
      remove: deleteCoffee,
      fetchShared: () => getSharedWithMe<Coffee>('coffees'),
    },
    messages: {
      created: 'Café creado',
      updated: 'Café actualizado',
      removed: 'Café eliminado',
      createFailed: 'No se pudo crear el café',
      updateFailed: 'No se pudo actualizar el café',
      removeFailed: 'No se pudo eliminar el café',
      sharedLoadFailed: 'No se pudieron cargar cafés compartidos',
    },
    sortShared: items => items.sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? 0
      const tb = b.createdAt?.toMillis?.() ?? 0
      return tb - ta
    }),
  })

  // Domain-specific: persisted filters
  const filters = ref<CoffeeFilters>({})

  const originalLoadAll = base.loadAll
  async function loadAll(newFilters?: CoffeeFilters) {
    if (newFilters) filters.value = newFilters
    return originalLoadAll(filters.value)
  }

  function clearFilters() {
    filters.value = {}
  }

  async function updateSharing(id: string, uids: string[]) {
    const toast = useToast()
    try {
      await updateSharingDoc('coffees', id, uids)
      if (base.current.value?.id === id) {
        base.current.value = { ...base.current.value, sharedWith: uids } as Coffee
      }
      const idx = base.list.value.findIndex(c => c.id === id)
      if (idx !== -1) {
        base.list.value[idx] = { ...base.list.value[idx], sharedWith: uids } as Coffee
      }
      toast.success(uids.length === 0 ? 'Dejado de compartir' : 'Compartido')
    } catch (e: any) {
      toast.error('No se pudo actualizar quién ve el café', e)
      throw e
    }
  }

  const originalReset = base.reset
  function reset() {
    filters.value = {}
    originalReset()
  }

  return {
    ...base,
    filters,
    loadAll,
    clearFilters,
    updateSharing,
    reset,
  }
})
