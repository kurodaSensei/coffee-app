<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
    <div class="min-w-0">
      <h1 class="text-xl font-semibold text-foreground tracking-tight truncate">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-muted-foreground mt-0.5">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="flex flex-wrap items-center gap-2">
      <slot />
    </div>
  </div>
</template>
