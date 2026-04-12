import type { Recipe } from '~/types'

export const useRecipes = () => {
  const { getAll, getById, create, update, remove } = useFirebase()
  const COLLECTION = 'recipes'

  const fetchAll = async (): Promise<Recipe[]> => {
    const all = await getAll<Recipe>(COLLECTION)
    return all.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }

  const fetchById = async (id: string): Promise<Recipe | null> => {
    return getById<Recipe>(COLLECTION, id)
  }

  const createRecipe = async (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return create(COLLECTION, data)
  }

  const updateRecipe = async (id: string, data: Partial<Recipe>): Promise<void> => {
    return update(COLLECTION, id, data)
  }

  const deleteRecipe = async (id: string): Promise<void> => {
    return remove(COLLECTION, id)
  }

  return {
    fetchAll,
    fetchById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  }
}
