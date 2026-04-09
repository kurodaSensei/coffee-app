<script setup lang="ts">
definePageMeta({ layout: false })

const { login, register, loginWithGoogle, linkEmailPassword, authLoading, currentUser } = useAuth()
const router = useRouter()

const isRegister = ref(false)
const email = ref('')
const password = ref('')
const displayName = ref('')
const error = ref('')
const loading = ref(false)

// Linking flow: user signed in with Google but needs to set a password
const linkingMode = ref(false)
// Pending Google credential when account exists with email/password
const pendingGoogleEmail = ref('')

watch(currentUser, (user) => {
  if (user && !linkingMode.value) router.push('/')
}, { immediate: true })

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    // If we're linking a password to a Google account
    if (linkingMode.value) {
      await linkEmailPassword(password.value)
      linkingMode.value = false
      router.push('/')
      return
    }

    // If Google sign-in failed because account exists with email/password,
    // log in with password then the accounts share the same uid
    if (pendingGoogleEmail.value) {
      await login(email.value, password.value)
      pendingGoogleEmail.value = ''
      router.push('/')
      return
    }

    if (isRegister.value) {
      await register(email.value, password.value, displayName.value || undefined)
    } else {
      await login(email.value, password.value)
    }
    router.push('/')
  } catch (e: any) {
    const code = e.code || ''
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      error.value = 'Correo o contraseña incorrectos'
    } else if (code === 'auth/email-already-in-use') {
      error.value = 'Este correo ya está registrado. Intenta iniciar sesión.'
    } else if (code === 'auth/weak-password') {
      error.value = 'La contraseña debe tener al menos 6 caracteres'
    } else if (code === 'auth/invalid-email') {
      error.value = 'Correo inválido'
    } else {
      error.value = e.message || 'Error de autenticación'
    }
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  error.value = ''
  loading.value = true
  try {
    await loginWithGoogle()
    router.push('/')
  } catch (e: any) {
    if (e.code === 'auth/popup-closed-by-user') {
      // User cancelled, do nothing
    } else if (e.code === 'auth/account-exists-with-different-credential') {
      // Account exists with email/password — ask user to sign in with password
      pendingGoogleEmail.value = e.email || ''
      email.value = e.email || ''
      isRegister.value = false
      error.value = `Ya existe una cuenta con ${e.email}. Ingresa tu contraseña para vincular Google.`
    } else {
      error.value = e.message || 'Error al iniciar con Google'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-coffee-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coffee-800 mb-4">
          <Icon name="heroicons:fire" class="w-8 h-8 text-cream-200" />
        </div>
        <h1 class="text-2xl font-bold text-coffee-900">Coffee Tracker</h1>
        <p class="text-coffee-500 mt-1">Tu colección personal de cafés</p>
      </div>

      <!-- Form Card -->
      <div class="card">
        <h2 class="text-lg font-semibold text-coffee-800 mb-6">
          {{ linkingMode ? 'Crear contraseña' : pendingGoogleEmail ? 'Vincular cuenta' : isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}
        </h2>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Linking mode: Google user setting a password -->
        <div v-if="linkingMode" class="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          Iniciaste con Google. Crea una contraseña para también poder acceder con email.
        </div>

        <!-- Pending Google link: email/password user needs to enter password -->
        <div v-if="pendingGoogleEmail" class="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          Ingresa tu contraseña para vincular tu cuenta de Google.
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="isRegister && !linkingMode && !pendingGoogleEmail">
            <label class="label">Nombre</label>
            <input
              v-model="displayName"
              type="text"
              class="input-field"
              placeholder="Tu nombre"
            />
          </div>

          <div v-if="!linkingMode">
            <label class="label">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              class="input-field"
              placeholder="tu@email.com"
              required
              :disabled="!!pendingGoogleEmail"
            />
          </div>

          <div>
            <label class="label">{{ linkingMode ? 'Nueva contraseña' : 'Contraseña' }}</label>
            <input
              v-model="password"
              type="password"
              class="input-field"
              :placeholder="linkingMode ? 'Mínimo 6 caracteres' : '••••••••'"
              required
              minlength="6"
            />
          </div>

          <button
            type="submit"
            class="btn-primary w-full flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <span v-if="loading" class="animate-spin">
              <Icon name="heroicons:arrow-path" class="w-4 h-4" />
            </span>
            {{ linkingMode ? 'Guardar contraseña' : pendingGoogleEmail ? 'Vincular y entrar' : isRegister ? 'Crear cuenta' : 'Entrar' }}
          </button>
        </form>

        <template v-if="!linkingMode && !pendingGoogleEmail">
          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-coffee-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-3 text-coffee-400">o</span>
            </div>
          </div>

          <!-- Google Sign In -->
          <button
            @click="handleGoogle"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-coffee-200 bg-white text-coffee-700 font-medium hover:bg-coffee-50 transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-300 focus:ring-offset-2"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div class="mt-6 text-center text-sm text-coffee-500">
            <template v-if="isRegister">
              ¿Ya tienes cuenta?
              <button @click="isRegister = false; error = ''" class="text-coffee-800 font-medium hover:underline">
                Iniciar sesión
              </button>
            </template>
            <template v-else>
              ¿No tienes cuenta?
              <button @click="isRegister = true; error = ''" class="text-coffee-800 font-medium hover:underline">
                Registrarse
              </button>
            </template>
          </div>
        </template>

        <!-- Cancel linking -->
        <div v-else class="mt-4 text-center">
          <button
            @click="linkingMode = false; pendingGoogleEmail = ''; error = ''"
            class="text-sm text-coffee-500 hover:text-coffee-700 hover:underline"
          >
            Cancelar y volver al inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
