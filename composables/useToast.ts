import { toast } from 'vue-sonner'

function parseFirebaseError(e: any): string {
  if (!e) return 'Error desconocido'
  const code = e.code || ''
  const message = e.message || String(e)

  const map: Record<string, string> = {
    'permission-denied': 'No tienes permiso para realizar esta acción',
    'unavailable': 'Servicio no disponible, intenta de nuevo',
    'not-found': 'Recurso no encontrado',
    'already-exists': 'Este elemento ya existe',
    'failed-precondition': 'Operación no válida en este estado',
    'invalid-argument': 'Datos inválidos',
    'resource-exhausted': 'Cuota excedida, intenta más tarde',
    'unauthenticated': 'Debes iniciar sesión',
    'cancelled': 'Operación cancelada',
  }

  if (code && map[code]) return map[code]
  if (code.startsWith('auth/')) return message
  if (message.includes('Missing or insufficient permissions')) {
    return 'No tienes permiso para esta acción. Verifica las reglas de Firestore.'
  }

  return message
}

export const useToast = () => {
  function success(message: string, description?: string) {
    toast.success(message, { description })
  }

  function error(message: string, e?: any) {
    const detail = e ? parseFirebaseError(e) : undefined
    toast.error(message, { description: detail })
    if (e) console.error(message, e)
  }

  function info(message: string, description?: string) {
    toast(message, { description })
  }

  function warning(message: string, description?: string) {
    toast.warning(message, { description })
  }

  return { success, error, info, warning }
}
