<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

type Variant = 'primary' | 'dark' | 'ghost' | 'secondary'
type Size = 'md' | 'sm'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Render as <a> when an href is provided. */
    href?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    /** Stretch to full width of container */
    block?: boolean
    class?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    block: true,
  },
)

const variantClass: Record<Variant, string> = {
  primary:
    'bg-olive text-paper hover:bg-olive-dark active:bg-olive-dark focus-visible:outline-olive-dark rounded-cta',
  dark:
    'bg-jungle text-paper hover:bg-moss active:bg-moss focus-visible:outline-jungle rounded-cta',
  ghost:
    'bg-transparent text-moss hover:bg-surface-2 active:bg-surface focus-visible:outline-moss-soft rounded-cta',
  secondary:
    'bg-surface-2 text-moss border border-moss/10 hover:bg-surface active:bg-surface focus-visible:outline-moss-soft rounded-card-sm',
}

const sizeClass: Record<Size, string> = {
  md: 'h-[46px] text-label px-md',
  sm: 'h-[38px] text-[12px] px-sm',
}

const tag = computed(() => (props.href ? 'a' : 'button'))
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="!href ? type : undefined"
    :disabled="!href ? disabled || loading : undefined"
    :aria-disabled="(disabled || loading) || undefined"
    :aria-busy="loading || undefined"
    :class="
      cn(
        'inline-flex items-center justify-center gap-xs font-sans font-medium tracking-tight',
        'transition-colors duration-150 ease-sorbo',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        block && 'w-full',
        sizeClass[size],
        variantClass[variant],
        $props.class,
      )
    "
  >
    <span
      v-if="loading"
      aria-hidden="true"
      class="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
    />
    <slot />
  </component>
</template>
