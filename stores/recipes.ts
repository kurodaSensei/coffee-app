import { defineStore } from 'pinia'
import type { Recipe, RecipeInput } from '~/types'

export const useRecipesStore = defineStore('recipes', () => {
  const { fetchAll, fetchById, createRecipe, updateRecipe, deleteRecipe } = useRecipes()
  const { getSharedWithMe } = useFirebase()

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

  return base
})
