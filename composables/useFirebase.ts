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
      // Owner OR shared-with can read
      const isOwner = data.userId === userId.value
      const isShared = Array.isArray(data.sharedWith) && data.sharedWith.includes(userId.value)
      if (!isOwner && !isShared) return null
      return { id: docSnap.id, ...data } as T
    }
    return null
  }

  // Fetch items shared with the current user (across a collection)
  const getSharedWithMe = async <T>(collectionName: string): Promise<T[]> => {
    if (!userId.value) return []
    const q = query(
      collection($db, collectionName),
      where('sharedWith', 'array-contains', userId.value),
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as T[]
  }

  const updateSharing = async (
    collectionName: string,
    id: string,
    sharedWith: string[],
  ): Promise<void> => {
    if (!userId.value) throw new Error('No authenticated user')
    const docRef = doc($db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists() || docSnap.data().userId !== userId.value) {
      throw new Error('Unauthorized')
    }
    await updateDoc(docRef, { sharedWith, updatedAt: Timestamp.now() })
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
    if (!userId.value) throw new Error('No authenticated user')
    const docRef = doc($db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists() || docSnap.data().userId !== userId.value) {
      throw new Error('Unauthorized: document not found or access denied')
    }
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  }

  const remove = async (collectionName: string, id: string): Promise<void> => {
    if (!userId.value) throw new Error('No authenticated user')
    const docRef = doc($db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists() || docSnap.data().userId !== userId.value) {
      throw new Error('Unauthorized: document not found or access denied')
    }
    await deleteDoc(docRef)
  }

  return {
    getAll,
    getById,
    getSharedWithMe,
    updateSharing,
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
