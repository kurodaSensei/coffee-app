import { toast } from 'vue-sonner'

export type ErrorCategory = 'network' | 'permission' | 'not-found' | 'validation' | 'rate-limit' | 'auth' | 'unknown'

export interface ParsedError {
  category: ErrorCategory
  message: string
  /** Short action hint shown as description */
  hint?: string
}

const FIRESTORE_CODES: Record<string, ParsedError> = {
  'permission-denied': {
    category: 'permission',
    message: 'No tienes permiso para esta acción',
    hint: 'Verifica que estés autenticado y sea tu contenido',
  },
  'unavailable': {
    category: 'network',
    message: 'Servicio no disponible',
    hint: 'Revisa tu conexión e intenta de nuevo',
  },
  'not-found': {
    category: 'not-found',
    message: 'Recurso no encontrado',
    hint: 'Es posible que fuera eliminado',
  },
  'already-exists': {
    category: 'validation',
    message: 'Este elemento ya existe',
  },
  'failed-precondition': {
    category: 'validation',
    message: 'Operación no válida en este estado',
  },
  'invalid-argument': {
    category: 'validation',
    message: 'Datos inválidos',
    hint: 'Revisa los campos del formulario',
  },
  'resource-exhausted': {
    category: 'rate-limit',
    message: 'Cuota excedida',
    hint: 'Intenta más tarde',
  },
  'unauthenticated': {
    category: 'auth',
    message: 'Debes iniciar sesión',
  },
  'cancelled': {
    category: 'unknown',
    message: 'Operación cancelada',
  },
  'deadline-exceeded': {
    category: 'network',
    message: 'La operación tardó demasiado',
    hint: 'Revisa tu conexión e intenta de nuevo',
  },
}

const AUTH_CODES: Record<string, ParsedError> = {
  'auth/email-already-in-use': {
    category: 'validation',
    message: 'Este correo ya está registrado',
  },
  'auth/invalid-email': {
    category: 'validation',
    message: 'Correo inválido',
  },
  'auth/weak-password': {
    category: 'validation',
    message: 'Contraseña muy débil',
    hint: 'Mínimo 6 caracteres',
  },
  'auth/wrong-password': {
    category: 'auth',
    message: 'Correo o contraseña incorrectos',
  },
  'auth/user-not-found': {
    category: 'auth',
    message: 'Correo o contraseña incorrectos',
  },
  'auth/invalid-credential': {
    category: 'auth',
    message: 'Correo o contraseña incorrectos',
  },
  'auth/too-many-requests': {
    category: 'rate-limit',
    message: 'Demasiados intentos',
    hint: 'Espera unos minutos antes de intentar de nuevo',
  },
  'auth/network-request-failed': {
    category: 'network',
    message: 'Error de conexión',
    hint: 'Revisa tu internet',
  },
  'auth/popup-closed-by-user': {
    category: 'unknown',
    message: 'Operación cancelada',
  },
  'auth/account-exists-with-different-credential': {
    category: 'validation',
    message: 'Ya existe una cuenta con ese correo usando otro método',
  },
}

export function parseError(e: any): ParsedError {
  if (!e) return { category: 'unknown', message: 'Error desconocido' }

  const code: string = e.code || ''
  const rawMessage: string = e.message || String(e)

  if (code in FIRESTORE_CODES) return FIRESTORE_CODES[code]
  if (code in AUTH_CODES) return AUTH_CODES[code]
  if (code.startsWith('auth/')) {
    return { category: 'auth', message: rawMessage }
  }

  // Message-based fallbacks
  if (rawMessage.includes('Missing or insufficient permissions')) {
    return {
      category: 'permission',
      message: 'No tienes permiso para esta acción',
      hint: 'Verifica las reglas de Firestore',
    }
  }
  if (/offline|network|fetch failed/i.test(rawMessage)) {
    return {
      category: 'network',
      message: 'Error de conexión',
      hint: 'Revisa tu internet e intenta de nuevo',
    }
  }

  return { category: 'unknown', message: rawMessage }
}

export const useToast = () => {
  function success(message: string, description?: string) {
    toast.success(message, { description })
  }

  function error(message: string, e?: any) {
    if (e) {
      const parsed = parseError(e)
      const description = parsed.hint
        ? `${parsed.message}. ${parsed.hint}`
        : parsed.message
      toast.error(message, { description })
      console.error(message, e)
    } else {
      toast.error(message)
    }
  }

  function info(message: string, description?: string) {
    toast(message, { description })
  }

  function warning(message: string, description?: string) {
    toast.warning(message, { description })
  }

  return { success, error, info, warning, parseError }
}
