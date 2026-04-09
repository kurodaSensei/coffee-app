import { defineStore } from 'pinia'
import type { Recipe } from '~/types'

export const useRecipesStore = defineStore('recipes', () => {
  const { fetchAll, fetchById, createRecipe, updateRecipe, deleteRecipe } = useRecipes()

  const list = ref<Recipe[]>([])
  const current = ref<Recipe | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchAll()
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load recipes'
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
      error.value = e.message ?? 'Failed to load recipe'
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const id = await createRecipe(data)
      await loadAll()
      return id
    } catch (e: any) {
      error.value = e.message ?? 'Failed to create recipe'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: Partial<Recipe>) {
    loading.value = true
    error.value = null
    try {
      await updateRecipe(id, data)
      await loadAll()
      if (current.value?.id === id) {
        current.value = await fetchById(id)
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to update recipe'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await deleteRecipe(id)
      list.value = list.value.filter((r) => r.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
    } catch (e: any) {
      error.value = e.message ?? 'Failed to delete recipe'
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
