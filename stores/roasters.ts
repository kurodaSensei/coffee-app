import { defineStore } from 'pinia'
import type { Roaster } from '~/types'

export const useRoastersStore = defineStore('roasters', () => {
  const { fetchAll, fetchById, createRoaster, updateRoaster, deleteRoaster } = useRoasters()

  const list = ref<Roaster[]>([])
  const current = ref<Roaster | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchAll()
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load roasters'
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
      error.value = e.message ?? 'Failed to load roaster'
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<Roaster, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const id = await createRoaster(data)
      await loadAll()
      return id
    } catch (e: any) {
      error.value = e.message ?? 'Failed to create roaster'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: Partial<Roaster>) {
    loading.value = true
    error.value = null
    try {
      await updateRoaster(id, data)
      await loadAll()
      if (current.value?.id === id) {
        current.value = await fetchById(id)
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to update roaster'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await deleteRoaster(id)
      list.value = list.value.filter((r) => r.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to delete roaster'
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
    remove,
  }
})
