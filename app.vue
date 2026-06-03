<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Toaster } from 'vue-sonner'

const { authLoading } = useAuth()
const { iosSheetOpen, androidSheetOpen } = usePwaInstall()

// Hold the splash for at least MIN_SPLASH_MS so it nunca flashea ni se pierde
// en cargas rápidas. Con 1500ms el usuario ve el splash a full opacity ~1
// segundo (descontando los 300ms del fade-in inicial), suficiente para que
// el detalle editorial (badge S. + mensaje rotativo) sea perceptible.
const MIN_SPLASH_MS = 1500
const splashHeld = ref(true)

onMounted(() => {
  setTimeout(() => {
    splashHeld.value = false
  }, MIN_SPLASH_MS)
})

const showSplash = computed(() => authLoading.value || splashHeld.value)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Transition
    enter-active-class="transition-opacity duration-300 ease-sorbo"
    leave-active-class="transition-opacity duration-500 ease-sorbo"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <UiSplash v-if="showSplash" />
  </Transition>

  <UiPwaIosInstructions v-model="iosSheetOpen" />
  <UiPwaAndroidInstructions v-model="androidSheetOpen" />
  <UiConfirm />
  <UiInfoSheet />

  <Toaster
    position="bottom-center"
    rich-colors
    :offset="120"
    :mobile-offset="{ bottom: '110px' }"
    :toast-options="{
      style: {
        fontFamily: 'Geist, ui-sans-serif, system-ui, sans-serif',
        background: 'var(--paper)',
        color: 'var(--moss)',
        border: '1px solid rgba(47, 53, 40, 0.12)',
      },
    }"
  />
</template>
