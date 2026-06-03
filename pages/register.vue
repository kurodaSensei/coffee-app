<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

definePageMeta({ layout: 'auth', auth: false })

const { register, loginWithGoogle, currentUser } = useAuth()
const { trackEvent } = useAnalytics()
const router = useRouter()
const route = useRoute()

const name = ref('')
const email = ref('')
const password = ref('')
const acceptedTerms = ref(false)

const errors = ref<{ name?: string; email?: string; password?: string; terms?: string; general?: string }>({})
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
  if (!name.value.trim()) errors.value.name = 'Cuéntanos tu nombre'
  if (!email.value) errors.value.email = 'Correo requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    errors.value.email = 'Correo no válido'
  if (!password.value) errors.value.password = 'Contraseña requerida'
  else if (password.value.length < 8)
    errors.value.password = 'Mínimo 8 caracteres'
  if (!acceptedTerms.value) errors.value.terms = 'Debes aceptar los términos para continuar'
  return Object.keys(errors.value).length === 0
}

async function onSubmit(e: Event) {
  e.preventDefault()
  if (!validate()) return
  loading.value = true
  try {
    await register(email.value.trim(), password.value, name.value.trim())
    trackEvent('signup_success', { method: 'email' })
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
  if (!acceptedTerms.value) {
    errors.value = { terms: 'Debes aceptar los términos para continuar' }
    return
  }
  loadingGoogle.value = true
  try {
    await loginWithGoogle()
    // Desde /register asumimos signup; Firebase no distingue first-time vs
    // returning para Google en el mismo flow, pero la intención del usuario
    // al estar en /register es crear cuenta.
    trackEvent('signup_success', { method: 'google' })
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
    case 'auth/email-already-in-use': return 'Ese correo ya tiene cuenta. Inicia sesión.'
    case 'auth/weak-password': return 'Contraseña muy débil. Mínimo 8 caracteres.'
    case 'auth/network-request-failed': return 'Sin conexión. Revisa tu red.'
    case 'auth/popup-closed-by-user': return 'Cancelaste el registro con Google'
    default: return 'No pudimos crear tu cuenta. Inténtalo otra vez.'
  }
}
</script>

<template>
  <main class="flex min-h-svh items-center justify-center px-md py-xl">
    <div class="w-full max-w-[390px]">
      <UiLogo variant="mark" size="md" />

      <h1 class="mt-lg font-display text-[34px] leading-[34px] tracking-[-0.01em] text-moss">
        Un diario<br>
        para cada<br>
        <span class="italic text-olive">sorbo</span>
      </h1>

      <p class="subtitle-italic mt-md">
        Colecciona, cata y recuerda cada café que pase por tu taza.
      </p>

      <form class="mt-lg flex flex-col gap-[6px]" novalidate @submit="onSubmit">
        <UiInput
          v-model="name"
          label="Nombre"
          type="text"
          autocomplete="name"
          placeholder="Cómo te llamas"
          :error="errors.name"
          required
        />
        <UiInput
          v-model="email"
          label="Correo"
          type="email"
          autocomplete="email"
          inputmode="email"
          placeholder="tucorreo@ejemplo.com"
          :error="errors.email"
          required
        />
        <UiInput
          v-model="password"
          label="Contraseña"
          type="password"
          autocomplete="new-password"
          placeholder="Mínimo 8 caracteres"
          :error="errors.password"
          required
        />

        <label class="mt-md flex items-start gap-sm cursor-pointer">
          <input
            v-model="acceptedTerms"
            type="checkbox"
            class="mt-[3px] size-[16px] accent-olive shrink-0 cursor-pointer"
          >
          <span class="font-sans text-[13px] text-moss-soft leading-relaxed">
            He leído y acepto los
            <NuxtLink to="/terms" target="_blank" class="text-olive font-medium hover:underline">
              Términos de uso
            </NuxtLink>
            y la
            <NuxtLink to="/privacy" target="_blank" class="text-olive font-medium hover:underline">Política de Privacidad</NuxtLink>.
          </span>
        </label>
        <p
          v-if="errors.terms"
          class="mt-xxs font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
        >
          <span aria-hidden="true">— </span>{{ errors.terms }}
        </p>

        <p
          v-if="errors.general"
          role="alert"
          class="mt-xs font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
        >
          <span aria-hidden="true">— </span>{{ errors.general }}
        </p>

        <UiButton
          type="submit"
          variant="primary"
          class="mt-lg"
          :loading="loading"
          :disabled="loadingGoogle"
        >
          Empezar mi diario
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
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        Continuar con Google
      </UiButton>

      <p class="mt-xl text-center font-display text-[13px] italic text-moss-soft">
        ¿Ya tienes cuenta?
        <NuxtLink to="/login" class="font-sans font-medium not-italic text-olive">
          Inicia sesión
        </NuxtLink>
      </p>
    </div>
  </main>
</template>
