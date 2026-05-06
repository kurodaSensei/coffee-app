<script setup lang="ts">
import { Toaster } from 'vue-sonner'
// vue-sonner declares its CSS as a side-effect import; no explicit
// stylesheet path is needed (and doesn't exist in the package exports).
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster
    position="top-center"
    rich-colors
    close-button
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
