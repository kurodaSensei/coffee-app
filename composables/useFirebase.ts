import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'

export const useFirebase = () => {
  const { $db } = useNuxtApp()
  const { userId } = useAuth()

  const getAll = async <T>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
  ): Promise<T[]> => {
    if (!userId.value) return []
    const userConstraint = where('userId', '==', userId.value)
    const q = query(collection($db, collectionName), userConstraint, ...constraints)
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as T[]
  }

  const getById = async <T>(collectionName: string, id: string): Promise<T | null> => {
    const docRef = doc($db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      // Verify ownership
      if (data.userId !== userId.value) return null
      return { id: docSnap.id, ...data } as T
    }
    return null
  }

  const create = async <T extends DocumentData>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>,
  ): Promise<string> => {
    if (!userId.value) throw new Error('No authenticated user')
    const docRef = await addDoc(collection($db, collectionName), {
      ...data,
      userId: userId.value,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  }

  const update = async <T extends DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ): Promise<void> => {
    const docRef = doc($db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  }

  const remove = async (collectionName: string, id: string): Promise<void> => {
    const docRef = doc($db, collectionName, id)
    await deleteDoc(docRef)
  }

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    collection,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
  }
}
