import { defineStore } from 'pinia'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ModalState {
  open: boolean
  component: string | null
  props: Record<string, any>
}

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(false)
  const toasts = ref<Toast[]>([])
  // Hoja «Nueva nota» (v2): se abre desde el botón + de la barra, la tarjeta
  // del Diario o «Repetir». `coffeeId` precarga el café.
  const noteSheet = ref<{ open: boolean, coffeeId: string | null }>({ open: false, coffeeId: null })

  function openNoteSheet(coffeeId: string | null = null) {
    noteSheet.value = { open: true, coffeeId }
  }

  function closeNoteSheet() {
    noteSheet.value = { ...noteSheet.value, open: false }
  }

  const modal = ref<ModalState>({
    open: false,
    component: null,
    props: {},
  })

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function openModal(component: string, props: Record<string, any> = {}) {
    modal.value = { open: true, component, props }
  }

  function closeModal() {
    modal.value = { open: false, component: null, props: {} }
  }

  function addToast(message: string, type: Toast['type'] = 'info', duration: number = 4000) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    sidebarOpen,
    toasts,
    modal,
    noteSheet,
    openNoteSheet,
    closeNoteSheet,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    openModal,
    closeModal,
    addToast,
    removeToast,
  }
})
