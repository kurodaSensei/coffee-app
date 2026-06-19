import { defineStore } from 'pinia'
import type { Roaster, RoasterInput } from '~/types'

export const useRoastersStore = defineStore('roasters', () => {
  const { fetchAll, fetchById, createRoaster, updateRoaster, deleteRoaster } = useRoasters()

  const base = useFirestoreStoreState<Roaster, RoasterInput>({
    api: {
      fetchAll,
      fetchById,
      create: createRoaster,
      update: updateRoaster,
      remove: deleteRoaster,
    },
    messages: {
      created: 'Marca creada',
      updated: 'Marca actualizada',
      removed: 'Marca eliminada',
      createFailed: 'No se pudo crear la marca',
      updateFailed: 'No se pudo actualizar la marca',
      removeFailed: 'No se pudo eliminar la marca',
    },
  })

  return base
})
