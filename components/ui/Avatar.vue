<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

type Size = 'xs' | 'sm' | 'md' | 'lg'
type Tone = 'olive' | 'jungle' | 'surface' | 'honey'

const props = withDefaults(
  defineProps<{
    name?: string
    src?: string | null
    size?: Size
    tone?: Tone
    class?: string
  }>(),
  {
    size: 'md',
    tone: 'olive',
  },
)

const initial = computed(() => {
  if (!props.name) return '?'
  return props.name.trim().charAt(0).toUpperCase()
})

const sizeClass: Record<Size, string> = {
  xs: 'size-[28px] text-[11px]',
  sm: 'size-[32px] text-[12px]',
  md: 'size-[40px] text-[14px]',
  lg: 'size-[48px] text-[16px]',
}

const toneClass: Record<Tone, string> = {
  olive: 'bg-olive text-paper',
  jungle: 'bg-jungle text-paper',
  surface: 'bg-surface-2 text-moss',
  honey: 'bg-honey text-jungle',
}
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center justify-center rounded-pill font-sans font-medium leading-none overflow-hidden select-none',
        sizeClass[size],
        !src && toneClass[tone],
        $props.class,
      )
    "
    role="img"
    :aria-label="name || 'Usuario'"
  >
    <img v-if="src" :src="src" :alt="name || 'Usuario'" class="size-full object-cover" referrerpolicy="no-referrer">
    <span v-else>{{ initial }}</span>
  </span>
</template>
