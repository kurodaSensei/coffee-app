import { defineStore } from 'pinia'
import type { Recipe, RecipeInput } from '~/types'

export const useRecipesStore = defineStore('recipes', () => {
  const { fetchAll, fetchById, createRecipe, updateRecipe, deleteRecipe } = useRecipes()
  const { getSharedWithMe, updateSharing: updateSharingDoc } = useFirebase()

  const base = useFirestoreStoreState<Recipe, RecipeInput>({
    api: {
      fetchAll,
      fetchById,
      create: createRecipe,
      update: updateRecipe,
      remove: deleteRecipe,
      fetchShared: () => getSharedWithMe<Recipe>('recipes'),
    },
    messages: {
      created: 'Receta creada',
      updated: 'Receta actualizada',
      removed: 'Receta eliminada',
      createFailed: 'No se pudo crear la receta',
      updateFailed: 'No se pudo actualizar la receta',
      removeFailed: 'No se pudo eliminar la receta',
      sharedLoadFailed: 'No se pudieron cargar recetas compartidas',
    },
    sortShared: items => items.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
  })

  async function updateSharing(id: string, uids: string[]) {
    const toast = useToast()
    try {
      await updateSharingDoc('recipes', id, uids)
      if (base.current.value?.id === id) {
        base.current.value = { ...base.current.value, sharedWith: uids } as Recipe
      }
      const idx = base.list.value.findIndex(r => r.id === id)
      if (idx !== -1) {
        base.list.value[idx] = { ...base.list.value[idx], sharedWith: uids } as Recipe
      }
      toast.success(uids.length === 0 ? 'Dejado de compartir' : 'Compartido')
    } catch (e: any) {
      toast.error('No se pudo actualizar quién ve la receta', e)
      throw e
    }
  }

  return {
    ...base,
    updateSharing,
  }
})
