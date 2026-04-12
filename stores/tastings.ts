import { defineStore } from 'pinia'
import type { Tasting, BrewMethod } from '~/types'

interface TastingFilters {
  coffeeId?: string
  brewMethod?: BrewMethod
  isFavorite?: boolean
}

export const useTastingsStore = defineStore('tastings', () => {
  const { fetchAll, fetchRecent, fetchById, createTasting, updateTasting, deleteTasting } = useTastings()
  const { getSharedWithMe } = useFirebase()

  const list = ref<Tasting[]>([])
  const sharedList = ref<Tasting[]>([])
  const recent = ref<Tasting[]>([])
  const current = ref<Tasting | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadShared() {
    try {
      const shared = await getSharedWithMe<Tasting>('tastings')
      sharedList.value = shared.sort((a, b) => {
        const ta = a.brewDate?.toMillis?.() ?? 0
        const tb = b.brewDate?.toMillis?.() ?? 0
        return tb - ta
      })
    } catch (e: any) {
      console.error('Failed to load shared tastings:', e)
    }
  }

  async function loadAll(filters?: TastingFilters) {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchAll(filters)
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load tastings'
    } finally {
      loading.value = false
    }
  }

  async function loadRecent(count: number = 5) {
    loading.value = true
    error.value = null
    try {
      recent.value = await fetchRecent(count)
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load recent tastings'
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
      error.value = e.message ?? 'Failed to load tasting'
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<Tasting, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const id = await createTasting(data)
      await loadAll()
      return id
    } catch (e: any) {
      error.value = e.message ?? 'Failed to create tasting'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: Partial<Tasting>) {
    loading.value = true
    error.value = null
    try {
      await updateTasting(id, data)
      await loadAll()
      if (current.value?.id === id) {
        current.value = await fetchById(id)
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to update tasting'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await deleteTasting(id)
      list.value = list.value.filter((t) => t.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to delete tasting'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    list,
    sharedList,
    recent,
    current,
    loading,
    error,
    loadAll,
    loadShared,
    loadRecent,
    loadById,
    create,
    update,
    remove,
  }
})
