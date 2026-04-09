<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="card">
    <div v-if="title || subtitle || $slots.header" class="mb-4">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-coffee-900">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="mt-1 text-sm text-coffee-500">
          {{ subtitle }}
        </p>
      </slot>
    </div>

    <div>
      <slot />
    </div>

    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-coffee-100">
      <slot name="footer" />
    </div>
  </div>
</template>
