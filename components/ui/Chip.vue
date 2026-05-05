<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

type Variant = 'default' | 'active' | 'ghost' | 'honey'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    /** Renders as <button> when interactive (clickable / has @click). */
    interactive?: boolean
    /** Render as <a> when href is provided. */
    href?: string
    disabled?: boolean
    /** Slightly smaller chip used inside cards (matches notes-row in Mood card) */
    compact?: boolean
    class?: string
  }>(),
  {
    variant: 'default',
    interactive: false,
    disabled: false,
    compact: false,
  },
)

const variantClass: Record<Variant, string> = {
  default: 'bg-surface-2 text-moss',
  active: 'bg-olive text-paper',
  ghost: 'bg-transparent text-moss-soft border border-moss/20',
  honey: 'bg-honey text-jungle',
}

const tag = computed(() => {
  if (props.href) return 'a'
  if (props.interactive) return 'button'
  return 'span'
})
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :class="
      cn(
        'inline-flex items-center gap-xxs rounded-pill font-mono font-medium uppercase tracking-eyebrow whitespace-nowrap',
        compact ? 'h-[22px] px-sm text-[10px]' : 'h-[25px] px-sm text-[11px]',
        (interactive || href) && 'cursor-pointer transition-colors duration-150 ease-sorbo hover:opacity-90',
        disabled && 'opacity-50 pointer-events-none',
        variantClass[variant],
        $props.class,
      )
    "
  >
    <slot />
  </component>
</template>
