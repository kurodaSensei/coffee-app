import { defineStore } from 'pinia'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import type { UserPreferences } from '~/types'

const DEFAULT_PREFS: Omit<UserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  customVarieties: [],
  customProcesses: [],
  customBrewMethods: [],
  disabledVarieties: [],
  disabledProcesses: [],
  disabledBrewMethods: [],
}

export const useSettingsStore = defineStore('settings', () => {
  const prefs = ref<UserPreferences | null>(null)
  const loading = ref(false)

  async function load() {
    const { $db } = useNuxtApp()
    const { userId } = useAuth()
    if (!userId.value) return

    loading.value = true
    try {
      const ref = doc($db, 'userPreferences', userId.value)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        prefs.value = { id: snap.id, ...snap.data() } as UserPreferences
      } else {
        prefs.value = {
          id: userId.value,
          userId: userId.value,
          ...DEFAULT_PREFS,
        }
      }
    } finally {
      loading.value = false
    }
  }

  async function save() {
    const { $db } = useNuxtApp()
    const { userId } = useAuth()
    if (!userId.value || !prefs.value) return

    const ref = doc($db, 'userPreferences', userId.value)
    await setDoc(ref, {
      userId: userId.value,
      customVarieties: prefs.value.customVarieties,
      customProcesses: prefs.value.customProcesses,
      customBrewMethods: prefs.value.customBrewMethods,
      disabledVarieties: prefs.value.disabledVarieties,
      disabledProcesses: prefs.value.disabledProcesses,
      disabledBrewMethods: prefs.value.disabledBrewMethods,
      updatedAt: Timestamp.now(),
      createdAt: prefs.value.createdAt || Timestamp.now(),
    }, { merge: true })
  }

  async function addVariety(name: string) {
    if (!prefs.value || !name.trim()) return
    const v = name.trim()
    if (!prefs.value.customVarieties.includes(v)) {
      prefs.value.customVarieties.push(v)
      await save()
    }
  }

  async function removeCustomVariety(name: string) {
    if (!prefs.value) return
    prefs.value.customVarieties = prefs.value.customVarieties.filter(v => v !== name)
    await save()
  }

  async function toggleDefaultVariety(name: string) {
    if (!prefs.value) return
    if (prefs.value.disabledVarieties.includes(name)) {
      prefs.value.disabledVarieties = prefs.value.disabledVarieties.filter(v => v !== name)
    } else {
      prefs.value.disabledVarieties.push(name)
    }
    await save()
  }

  async function addProcess(label: string) {
    if (!prefs.value || !label.trim()) return
    const value = `custom_${label.trim().toLowerCase().replace(/\s+/g, '_')}`
    if (!prefs.value.customProcesses.some(p => p.value === value)) {
      prefs.value.customProcesses.push({ value, label: label.trim() })
      await save()
    }
  }

  async function removeCustomProcess(value: string) {
    if (!prefs.value) return
    prefs.value.customProcesses = prefs.value.customProcesses.filter(p => p.value !== value)
    await save()
  }

  async function toggleDefaultProcess(value: string) {
    if (!prefs.value) return
    if (prefs.value.disabledProcesses.includes(value)) {
      prefs.value.disabledProcesses = prefs.value.disabledProcesses.filter(v => v !== value)
    } else {
      prefs.value.disabledProcesses.push(value)
    }
    await save()
  }

  async function addBrewMethod(label: string) {
    if (!prefs.value || !label.trim()) return
    const value = `custom_${label.trim().toLowerCase().replace(/\s+/g, '_')}`
    if (!prefs.value.customBrewMethods.some(m => m.value === value)) {
      prefs.value.customBrewMethods.push({ value, label: label.trim() })
      await save()
    }
  }

  async function removeCustomBrewMethod(value: string) {
    if (!prefs.value) return
    prefs.value.customBrewMethods = prefs.value.customBrewMethods.filter(m => m.value !== value)
    await save()
  }

  async function toggleDefaultBrewMethod(value: string) {
    if (!prefs.value) return
    if (prefs.value.disabledBrewMethods.includes(value)) {
      prefs.value.disabledBrewMethods = prefs.value.disabledBrewMethods.filter(v => v !== value)
    } else {
      prefs.value.disabledBrewMethods.push(value)
    }
    await save()
  }

  return {
    prefs,
    loading,
    load,
    save,
    addVariety,
    removeCustomVariety,
    toggleDefaultVariety,
    addProcess,
    removeCustomProcess,
    toggleDefaultProcess,
    addBrewMethod,
    removeCustomBrewMethod,
    toggleDefaultBrewMethod,
  }
})
