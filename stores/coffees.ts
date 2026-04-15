import { defineStore } from 'pinia'
import type { Coffee, CoffeeInput, CoffeeProcess } from '~/types'

interface CoffeeFilters {
  roasterId?: string
  process?: CoffeeProcess
  variety?: string
}

export const useCoffeesStore = defineStore('coffees', () => {
  const { fetchAll, fetchById, createCoffee, updateCoffee, deleteCoffee } = useCoffees()
  const { getSharedWithMe } = useFirebase()

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
    reset,
  }
})
