import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

export type WaitlistResult =
  | { status: 'success' }
  | { status: 'duplicate' }
  | { status: 'invalid' }
  | { status: 'error'; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const useWaitlist = () => {
  const { $db } = useNuxtApp()

  function normalizeEmail(raw: string): string {
    return raw.trim().toLowerCase()
  }

  async function subscribe(rawEmail: string, source = 'landing'): Promise<WaitlistResult> {
    const email = normalizeEmail(rawEmail)
    if (!email || !EMAIL_RE.test(email) || email.length > 200) {
      return { status: 'invalid' }
    }
    try {
      const ref = doc($db, 'waitlist', email)
      await setDoc(ref, {
        email,
        source,
        createdAt: serverTimestamp(),
      })
      return { status: 'success' }
    }
    catch (e: any) {
      if (e?.code === 'permission-denied') {
        return { status: 'duplicate' }
      }
      return { status: 'error', message: e?.message || 'No se pudo guardar tu correo' }
    }
  }

  return { subscribe }
}
