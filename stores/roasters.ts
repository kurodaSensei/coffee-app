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
      created: 'Tostador creado',
      updated: 'Tostador actualizado',
      removed: 'Tostador eliminado',
      createFailed: 'No se pudo crear el tostador',
      updateFailed: 'No se pudo actualizar el tostador',
      removeFailed: 'No se pudo eliminar el tostador',
    },
  })

  return base
})
