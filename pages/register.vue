<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

definePageMeta({ layout: 'auth', auth: false })

const { register, loginWithGoogle, currentUser } = useAuth()
const router = useRouter()
const route = useRoute()

const name = ref('')
const email = ref('')
const password = ref('')

const errors = ref<{ name?: string; email?: string; password?: string; general?: string }>({})
const loading = ref(false)
const loadingGoogle = ref(false)

const redirectTo = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') ? r : '/'
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
  return Object.keys(errors.value).length === 0
}

async function onSubmit(e: Event) {
  e.preventDefault()
  if (!validate()) return
  loading.value = true
  try {
    await register(email.value.trim(), password.value, name.value.trim())
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
        <span class="italic text-olive">sorbo</span>.
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

      <button
        type="button"
        :disabled="loading || loadingGoogle"
        class="mt-md w-full py-xs font-mono text-[10px] font-medium uppercase tracking-eyebrow text-olive transition-opacity duration-150 ease-sorbo hover:opacity-80 disabled:opacity-50 disabled:pointer-events-none"
        @click="onGoogle"
      >
        Continuar con Google →
      </button>

      <p class="mt-xl text-center font-display text-[13px] italic text-moss-soft">
        ¿Ya tienes cuenta?
        <NuxtLink to="/login" class="font-sans font-medium not-italic text-olive">
          Inicia sesión
        </NuxtLink>
      </p>
    </div>
  </main>
</template>
