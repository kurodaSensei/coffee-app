<script setup lang="ts">
import { cn } from '~/lib/utils'

withDefaults(
  defineProps<{
    /** Hide the leading em-dash prefix */
    bare?: boolean
    /** Override default 10px size */
    size?: 'xs' | 'sm'
    /** Override default moss-soft color */
    tone?: 'default' | 'moss' | 'olive' | 'paper'
    class?: string
  }>(),
  {
    bare: false,
    size: 'xs',
    tone: 'default',
  },
)

const sizeClass: Record<'xs' | 'sm', string> = {
  xs: 'text-eyebrow',
  sm: 'text-[13px] tracking-eyebrow',
}

const toneClass: Record<'default' | 'moss' | 'olive' | 'paper', string> = {
  default: 'text-moss-soft',
  moss: 'text-moss',
  olive: 'text-olive',
  paper: 'text-paper',
}
</script>

<template>
  <span
    :class="
      cn(
        'inline-block font-mono font-medium uppercase',
        sizeClass[size],
        toneClass[tone],
        $props.class,
      )
    "
  >
    <span v-if="!bare" aria-hidden="true">— </span>
    <slot />
  </span>
</template>
