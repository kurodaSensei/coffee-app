<script setup lang="ts">
import { cn } from '~/lib/utils'

type Variant = 'primary' | 'dark' | 'ghost' | 'secondary'
type Size = 'md' | 'sm'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Internal route — renders as NuxtLink when provided. */
    to?: string
    /** External href — renders as <a>. */
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
    'bg-moss text-paper hover:bg-jungle active:bg-jungle focus-visible:outline-moss rounded-cta',
  ghost:
    'bg-transparent text-moss hover:bg-surface-2 active:bg-surface focus-visible:outline-moss-soft rounded-cta',
  secondary:
    'bg-surface-2 text-moss border border-moss/10 hover:bg-surface active:bg-surface focus-visible:outline-moss-soft rounded-card-sm',
}

const sizeClass: Record<Size, string> = {
  md: 'h-[46px] text-label px-md',
  sm: 'h-[38px] text-[12px] px-sm',
}

const baseClass = cn(
  'inline-flex items-center justify-center gap-xs font-sans font-medium tracking-tight',
  'transition-colors duration-150 ease-sorbo',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  'disabled:opacity-50 disabled:pointer-events-none',
)

const fullClass = cn(
  baseClass,
  props.block && 'w-full',
  sizeClass[props.size],
  variantClass[props.variant],
  props.class,
)
</script>

<template>
  <NuxtLink
    v-if="to && !disabled && !loading"
    :to="to"
    :aria-disabled="(disabled || loading) || undefined"
    :class="fullClass"
  >
    <span
      v-if="loading"
      aria-hidden="true"
      class="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
    />
    <slot />
  </NuxtLink>
  <a
    v-else-if="href && !disabled && !loading"
    :href="href"
    :aria-disabled="(disabled || loading) || undefined"
    :class="fullClass"
  >
    <span
      v-if="loading"
      aria-hidden="true"
      class="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
    />
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :aria-disabled="(disabled || loading) || undefined"
    :aria-busy="loading || undefined"
    :class="fullClass"
  >
    <span
      v-if="loading"
      aria-hidden="true"
      class="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
    />
    <slot />
  </button>
</template>
