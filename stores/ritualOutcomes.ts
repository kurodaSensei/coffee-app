import { defineStore } from 'pinia'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import type { RitualOutcome, RitualOutcomeInput } from '~/types'

/**
 * RitualOutcome — cada vez que el usuario cierra un vertido (con cata,
 * con nota rápida, o descartado) se escribe un doc a `ritualOutcomes/`.
 * Es el feedback que en el futuro alimentará el Affinity Score.
 *
 * ponytail: write-only por ahora. No hay reads/list — se agregan cuando
 * exista scoring real (Fase 4). Sin factory CRUD; una función create()
 * basta.
 */
export const useRitualOutcomesStore = defineStore('ritualOutcomes', () => {
  const creating = ref(false)

  async function create(input: RitualOutcomeInput): Promise<string | null> {
    const { $db } = useNuxtApp()
    const { userId } = useAuth()
    if (!userId.value) return null
    creating.value = true
    try {
      const payload = {
        ...input,
        userId: userId.value,
        timestamp: Timestamp.now(),
      }
      const ref = await addDoc(collection($db, 'ritualOutcomes'), payload)
      return ref.id
    }
    catch (e) {
      // No molestamos al usuario — este write es telemetría implícita, si
      // falla no bloquea el flow. Sentry lo captura vía global handler.
      console.error('[ritualOutcomes] create failed:', e)
      return null
    }
    finally {
      creating.value = false
    }
  }

  return { create, creating }
})
