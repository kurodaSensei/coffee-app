<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

definePageMeta({ layout: 'auth', auth: false })

const { login, loginWithGoogle, currentUser } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

const errors = ref<{ email?: string; password?: string; general?: string }>({})
const loading = ref(false)
const loadingGoogle = ref(false)

const redirectTo = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') ? r : '/app'
})

watchEffect(() => {
  if (currentUser.value) router.replace(redirectTo.value)
})

function validate() {
  errors.value = {}
  if (!email.value) errors.value.email = 'Correo requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    errors.value.email = 'Correo no válido'
  if (!password.value) errors.value.password = 'Contraseña requerida'
  return Object.keys(errors.value).length === 0
}

async function onSubmit(e: Event) {
  e.preventDefault()
  if (!validate()) return
  loading.value = true
  try {
    await login(email.value.trim(), password.value)
    router.replace(redirectTo.value)
  }
  catch (err: any) {
    errors.value = { general: mapAuthError(err?.code) }
  }
  finally {
    loading.value = false
  }
}

async function onGoogle() {
  errors.value = {}
  loadingGoogle.value = true
  try {
    await loginWithGoogle()
    router.replace(redirectTo.value)
  }
  catch (err: any) {
    errors.value = { general: err?.message || mapAuthError(err?.code) }
  }
  finally {
    loadingGoogle.value = false
  }
}

function mapAuthError(code?: string): string {
  switch (code) {
    case 'auth/invalid-email': return 'Correo no válido'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Correo o contraseña incorrectos'
    case 'auth/too-many-requests': return 'Demasiados intentos. Espera un momento.'
    case 'auth/network-request-failed': return 'Sin conexión. Revisa tu red.'
    case 'auth/popup-closed-by-user': return 'Cancelaste el inicio con Google'
    default: return 'No pudimos iniciar sesión. Inténtalo otra vez.'
  }
}
</script>

<template>
  <main class="flex min-h-svh items-center justify-center px-md py-2xl">
    <div class="w-full max-w-[390px]">
      <UiEyebrow>Sorbo · by KurodaCafe</UiEyebrow>

      <h1 class="mt-md font-display text-[46px] leading-[42px] tracking-[-0.01em] text-moss">
        Bienvenido<br>
        de <span class="italic text-olive">vuelta</span>
      </h1>

      <p class="subtitle-italic mt-md">Continúa donde dejaste el sorbo.</p>

      <form class="mt-xl flex flex-col gap-xs" novalidate @submit="onSubmit">
        <UiInput
          v-model="email"
          label="Correo"
          type="email"
          autocomplete="email"
          inputmode="email"
          :error="errors.email"
          required
        />
        <UiInput
          v-model="password"
          label="Contraseña"
          type="password"
          autocomplete="current-password"
          :error="errors.password"
          required
        />

        <p
          v-if="errors.general"
          role="alert"
          class="mt-xs font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
        >
          <span aria-hidden="true">— </span>{{ errors.general }}
        </p>

        <UiButton
          type="submit"
          variant="dark"
          class="mt-lg"
          :loading="loading"
          :disabled="loadingGoogle"
        >
          Entrar
        </UiButton>
      </form>

      <div class="my-md flex items-center gap-md">
        <span aria-hidden="true" class="h-px flex-1 bg-moss/10" />
        <UiEyebrow>o continúa con</UiEyebrow>
        <span aria-hidden="true" class="h-px flex-1 bg-moss/10" />
      </div>

      <UiButton
        variant="secondary"
        :loading="loadingGoogle"
        :disabled="loading"
        @click="onGoogle"
      >
        <span aria-hidden="true" class="font-mono text-[13px] font-bold leading-none">G</span>
        Continuar con Google
      </UiButton>

      <p class="mt-2xl text-center font-display text-[13px] italic text-moss-soft">
        ¿Primera vez?
        <NuxtLink to="/register" class="font-sans font-medium not-italic text-olive">
          Crea tu cuenta
        </NuxtLink>
      </p>
    </div>
  </main>
</template>
