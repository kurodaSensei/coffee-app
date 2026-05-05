<script setup lang="ts">
import { cn } from '~/lib/utils'

withDefaults(
  defineProps<{
    destructive?: boolean
    icon?: string
    disabled?: boolean
    class?: string
  }>(),
  {
    destructive: false,
    disabled: false,
  },
)
</script>

<template>
  <button
    type="button"
    role="menuitem"
    :disabled="disabled"
    :class="
      cn(
        'flex items-center gap-sm w-full text-left px-md py-sm font-sans text-label transition-colors duration-150 ease-sorbo',
        'disabled:opacity-50 disabled:pointer-events-none',
        destructive
          ? 'text-terracotta hover:bg-terracotta/10'
          : 'text-moss hover:bg-surface-2',
        $props.class,
      )
    "
  >
    <Icon v-if="icon" :name="icon" class="size-4 shrink-0" />
    <span class="flex-1"><slot /></span>
  </button>
</template>
