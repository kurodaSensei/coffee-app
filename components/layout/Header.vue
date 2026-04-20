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
      <h1 class="font-serif text-h2 text-foreground truncate">{{ title }}</h1>
      <p v-if="subtitle" class="font-mono text-eyebrow uppercase text-muted-foreground mt-1">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="flex flex-wrap items-center gap-2">
      <slot />
    </div>
  </div>
</template>
