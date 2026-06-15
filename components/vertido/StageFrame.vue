<script setup lang="ts">
import Stamp from './Stamp.vue'

/**
 * Marco común de cada stage: sello editorial + eyebrow + headline.
 * Mantiene rítmica tipográfica consistente entre stages.
 */
defineProps<{
  stamp: 'coffee' | 'method' | 'recipe' | 'adjust' | 'pour' | 'cup'
  eyebrow: string
  headline: string
}>()
</script>

<template>
  <section class="relative w-full max-w-[640px] mx-auto px-6 py-10">
    <header class="space-y-4">
      <Stamp :name="stamp" :size="48" class="text-honey" />
      <p class="font-mono text-[10px] tracking-[0.25em] text-honey/80 uppercase">
        {{ eyebrow }}
      </p>
      <h2 class="font-display italic text-paper text-[34px] sm:text-[42px] leading-[1.05] tracking-[-0.02em]">
        {{ headline }}
      </h2>
    </header>
    <div class="mt-10">
      <slot />
    </div>
  </section>
</template>
