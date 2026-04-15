import { collection, query, where, getDocs, writeBatch, doc, Timestamp } from 'firebase/firestore'
import type { Roaster } from '~/types'

export const useRoasters = () => {
  const { getAll, getById, create, update, remove } = useFirebase()
  const { $db } = useNuxtApp()
  const { userId } = useAuth()
  const COLLECTION = 'roasters'

  const fetchAll = async (): Promise<Roaster[]> => {
    const all = await getAll<Roaster>(COLLECTION)
    return all.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }

  const fetchById = async (id: string): Promise<Roaster | null> => {
    return getById<Roaster>(COLLECTION, id)
  }

  const createRoaster = async (data: Omit<Roaster, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return create(COLLECTION, data)
  }

  /**
   * Update a roaster. If the `name` changed, cascade the new name to the
   * denormalized `roasterName` field on all owned coffees and tastings.
   */
  const updateRoaster = async (id: string, data: Partial<Roaster>): Promise<void> => {
    const before = await getById<Roaster>(COLLECTION, id)
    await update(COLLECTION, id, data)

    const nameChanged = data.name && before && before.name !== data.name
    if (!nameChanged || !userId.value) return

    const newName = data.name as string
    const batch = writeBatch($db)

    // Update coffees with this roasterId
    const coffeesQ = query(
      collection($db, 'coffees'),
      where('userId', '==', userId.value),
      where('roasterId', '==', id),
    )
    const coffeesSnap = await getDocs(coffeesQ)
    coffeesSnap.forEach((d) => {
      batch.update(doc($db, 'coffees', d.id), {
        roasterName: newName,
        updatedAt: Timestamp.now(),
      })
    })

    // Tastings store coffeeId, not roasterId directly — we need to update
    // tastings whose coffee belongs to this roaster. We iterate the coffee
    // IDs we just found.
    if (!coffeesSnap.empty) {
      const coffeeIds = coffeesSnap.docs.map(d => d.id)
      // Firestore 'in' operator supports up to 30 values per query
      const chunks: string[][] = []
      for (let i = 0; i < coffeeIds.length; i += 30) {
        chunks.push(coffeeIds.slice(i, i + 30))
      }
      for (const chunk of chunks) {
        const tastingsQ = query(
          collection($db, 'tastings'),
          where('userId', '==', userId.value),
          where('coffeeId', 'in', chunk),
        )
        const tastingsSnap = await getDocs(tastingsQ)
        tastingsSnap.forEach((d) => {
          batch.update(doc($db, 'tastings', d.id), {
            roasterName: newName,
            updatedAt: Timestamp.now(),
          })
        })
      }
    }

    await batch.commit()
  }

  const deleteRoaster = async (id: string): Promise<void> => {
    return remove(COLLECTION, id)
  }

  return {
    fetchAll,
    fetchById,
    createRoaster,
    updateRoaster,
    deleteRoaster,
  }
}
