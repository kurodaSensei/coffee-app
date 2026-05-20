import { defineStore } from 'pinia'
import type { Recipe, RecipeInput, Visibility } from '~/types'

const VISIBILITY_TOAST: Record<Visibility, string> = {
  private: 'Ahora es privada',
  friends: 'Compartida con amigos',
  community: 'Compartida con la comunidad',
}

export const useRecipesStore = defineStore('recipes', () => {
  const { fetchAll, fetchById, createRecipe, updateRecipe, deleteRecipe } = useRecipes()
  const { getSharedWithMe, updateVisibility: updateVisibilityDoc } = useFirebase()

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

  async function updateVisibility(id: string, visibility: Visibility, sharedWith: string[] = []) {
    const toast = useToast()
    const { currentUser } = useAuth()
    try {
      await updateVisibilityDoc('recipes', id, {
        visibility,
        sharedWith,
        authorName: currentUser.value?.displayName
          || currentUser.value?.email?.split('@')[0]
          || undefined,
        authorPhotoURL: currentUser.value?.photoURL || undefined,
      })
      const patch = {
        visibility,
        sharedWith: visibility === 'friends' ? sharedWith : [],
      }
      if (base.current.value?.id === id) {
        base.current.value = { ...base.current.value, ...patch } as Recipe
      }
      const idx = base.list.value.findIndex(r => r.id === id)
      if (idx !== -1) {
        base.list.value[idx] = { ...base.list.value[idx], ...patch } as Recipe
      }
      toast.success(VISIBILITY_TOAST[visibility])
    } catch (e: any) {
      toast.error('No se pudo actualizar la visibilidad', e)
      throw e
    }
  }

  return {
    ...base,
    updateVisibility,
  }
})
