<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-5">
    <div>
      <h1 class="text-xl font-semibold text-foreground tracking-tight">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-muted-foreground mt-0.5">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>
