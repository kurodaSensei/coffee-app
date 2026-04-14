import { defineStore } from 'pinia'
import type { Coffee, CoffeeProcess } from '~/types'

interface CoffeeFilters {
  roasterId?: string
  process?: CoffeeProcess
  variety?: string
}

export const useCoffeesStore = defineStore('coffees', () => {
  const { fetchAll, fetchById, createCoffee, updateCoffee, deleteCoffee } = useCoffees()
  const { getSharedWithMe } = useFirebase()

  const list = ref<Coffee[]>([])
  const sharedList = ref<Coffee[]>([])
  const current = ref<Coffee | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<CoffeeFilters>({})

  async function loadShared() {
    try {
      const shared = await getSharedWithMe<Coffee>('coffees')
      sharedList.value = shared.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0
        const tb = b.createdAt?.toMillis?.() ?? 0
        return tb - ta
      })
    } catch (e: any) {
      console.error('Failed to load shared coffees:', e)
      const toast = useToast()
      toast.error('No se pudieron cargar cafés compartidos', e)
    }
  }

  async function loadAll(newFilters?: CoffeeFilters) {
    loading.value = true
    error.value = null
    if (newFilters) {
      filters.value = newFilters
    }
    try {
      list.value = await fetchAll(filters.value)
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load coffees'
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
      error.value = e.message ?? 'Failed to load coffee'
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<Coffee, 'id' | 'createdAt' | 'updatedAt'>) {
    const toast = useToast()
    loading.value = true
    error.value = null
    try {
      const id = await createCoffee(data)
      await loadAll()
      toast.success('Café creado')
      return id
    } catch (e: any) {
      error.value = e.message ?? 'Failed to create coffee'
      toast.error('No se pudo crear el café', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: Partial<Coffee>) {
    const toast = useToast()
    loading.value = true
    error.value = null
    try {
      await updateCoffee(id, data)
      await loadAll()
      if (current.value?.id === id) {
        current.value = await fetchById(id)
      }
      toast.success('Café actualizado')
    } catch (e: any) {
      error.value = e.message ?? 'Failed to update coffee'
      toast.error('No se pudo actualizar el café', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    const toast = useToast()
    loading.value = true
    error.value = null
    try {
      await deleteCoffee(id)
      list.value = list.value.filter((c) => c.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
      toast.success('Café eliminado')
    } catch (e: any) {
      error.value = e.message ?? 'Failed to delete coffee'
      toast.error('No se pudo eliminar el café', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearFilters() {
    filters.value = {}
  }

  return {
    list,
    sharedList,
    current,
    loading,
    error,
    filters,
    loadAll,
    loadShared,
    loadById,
    create,
    update,
    remove,
    clearFilters,
  }
})
