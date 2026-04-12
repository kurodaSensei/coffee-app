import {
  collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, Timestamp,
} from 'firebase/firestore'
import type { Friendship } from '~/types'

export const useFriends = () => {
  const { $db } = useNuxtApp()

  function friendshipId(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join('_')
  }

  const listForUser = async (uid: string): Promise<Friendship[]> => {
    const q = query(collection($db, 'friendships'), where('uids', 'array-contains', uid))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Friendship)
  }

  const sendRequest = async (
    from: { uid: string; email: string; displayName?: string },
    to: { uid: string; email: string; displayName?: string },
  ): Promise<void> => {
    const id = friendshipId(from.uid, to.uid)
    const ref = doc($db, 'friendships', id)
    await setDoc(ref, {
      uids: [from.uid, to.uid].sort(),
      users: [from, to],
      status: 'pending',
      initiatedBy: from.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  }

  const acceptRequest = async (friendshipId: string): Promise<void> => {
    const ref = doc($db, 'friendships', friendshipId)
    await setDoc(ref, { status: 'accepted', updatedAt: Timestamp.now() }, { merge: true })
  }

  const rejectOrRemove = async (friendshipId: string): Promise<void> => {
    const ref = doc($db, 'friendships', friendshipId)
    await deleteDoc(ref)
  }

  const getById = async (id: string): Promise<Friendship | null> => {
    const snap = await getDoc(doc($db, 'friendships', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() } as Friendship
  }

  return { listForUser, sendRequest, acceptRequest, rejectOrRemove, getById, friendshipId }
}
