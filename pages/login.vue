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
    if (code === 'auth/weak-password') {
      error.value = 'La contrasena debe tener al menos 6 caracteres'
    } else if (code === 'auth/invalid-email') {
      error.value = 'Correo invalido'
    } else if (code === 'auth/too-many-requests') {
      error.value = 'Demasiados intentos. Intenta mas tarde.'
    } else {
      // Generic message to prevent user enumeration
      error.value = isRegister.value
        ? 'No se pudo crear la cuenta. Verifica tus datos.'
        : 'Correo o contrasena incorrectos'
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
      error.value = `Ya existe una cuenta con ${e.email}. Ingresa tu contrasena para vincular Google.`
    } else {
      error.value = e.message || 'Error al iniciar con Google'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo & branding -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-jungle mb-5">
          <Icon name="lucide:coffee" class="w-8 h-8 text-paper" />
        </div>
        <h1 class="font-serif text-h2 text-foreground">Sorbo</h1>
        <p class="font-mono text-eyebrow text-muted-foreground mt-1 uppercase">by KurodaCafe</p>
        <p class="font-sans text-body text-muted-foreground mt-3">Tu colección personal de cafés de especialidad</p>
      </div>

      <!-- Form Card -->
      <Card class="shadow-xl shadow-black/5 border-border/60">
        <CardHeader class="pb-4">
          <CardTitle class="text-lg">
            {{ linkingMode ? 'Crear contrasena' : pendingGoogleEmail ? 'Vincular cuenta' : isRegister ? 'Crear cuenta' : 'Iniciar sesion' }}
          </CardTitle>
          <CardDescription v-if="!linkingMode && !pendingGoogleEmail">
            {{ isRegister ? 'Registrate para comenzar tu viaje cafetero.' : 'Ingresa para continuar donde lo dejaste.' }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Error alert -->
          <div
            v-if="error"
            class="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            <Icon name="lucide:alert-circle" class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{{ error }}</span>
          </div>

          <!-- Linking mode info -->
          <div
            v-if="linkingMode"
            class="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-300"
          >
            <Icon name="lucide:info" class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Iniciaste con Google. Crea una contrasena para tambien poder acceder con email.</span>
          </div>

          <!-- Pending Google link info -->
          <div
            v-if="pendingGoogleEmail"
            class="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-300"
          >
            <Icon name="lucide:link" class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Ingresa tu contrasena para vincular tu cuenta de Google.</span>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div v-if="isRegister && !linkingMode && !pendingGoogleEmail" class="space-y-2">
              <Label for="displayName">Nombre</Label>
              <Input
                id="displayName"
                v-model="displayName"
                type="text"
                placeholder="Tu nombre"
              />
            </div>

            <div v-if="!linkingMode" class="space-y-2">
              <Label for="email">Correo electronico</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="tu@email.com"
                required
                :disabled="!!pendingGoogleEmail"
              />
            </div>

            <div class="space-y-2">
              <Label for="password">{{ linkingMode ? 'Nueva contrasena' : 'Contrasena' }}</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                :placeholder="linkingMode ? 'Minimo 6 caracteres' : '********'"
                required
                minlength="6"
              />
            </div>

            <Button
              type="submit"
              class="w-full h-10"
              :disabled="loading"
            >
              <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ linkingMode ? 'Guardar contrasena' : pendingGoogleEmail ? 'Vincular y entrar' : isRegister ? 'Crear cuenta' : 'Entrar' }}
            </Button>
          </form>

          <template v-if="!linkingMode && !pendingGoogleEmail">
            <!-- Divider -->
            <div class="relative my-2">
              <Separator />
              <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                o
              </span>
            </div>

            <!-- Google Sign In -->
            <Button
              variant="outline"
              class="w-full h-10"
              :disabled="loading"
              @click="handleGoogle"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </Button>

            <!-- Toggle auth mode -->
            <div class="text-center text-sm text-muted-foreground pt-2">
              <template v-if="isRegister">
                Ya tienes cuenta?
                <button
                  @click="isRegister = false; error = ''"
                  class="text-primary font-medium hover:underline underline-offset-2 transition-colors"
                >
                  Iniciar sesion
                </button>
              </template>
              <template v-else>
                No tienes cuenta?
                <button
                  @click="isRegister = true; error = ''"
                  class="text-primary font-medium hover:underline underline-offset-2 transition-colors"
                >
                  Registrarse
                </button>
              </template>
            </div>
          </template>

          <!-- Cancel linking -->
          <div v-else class="text-center pt-2">
            <button
              @click="linkingMode = false; pendingGoogleEmail = ''; error = ''"
              class="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors"
            >
              Cancelar y volver al inicio
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Footer -->
      <p class="text-center text-xs text-muted-foreground/60 mt-6">
        Hecho con amor por un amante del cafe
      </p>
    </div>
  </div>
</template>
