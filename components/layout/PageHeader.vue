<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-coffee-200">
    <div>
      <h1 class="text-2xl font-bold text-coffee-900 tracking-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-sm text-coffee-500">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
