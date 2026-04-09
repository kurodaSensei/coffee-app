<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
})

const variantClasses: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'bg-transparent text-coffee-700 hover:bg-coffee-100 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coffee-300 focus:ring-offset-2',
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base',
  lg: 'text-lg px-6 py-3',
}

const classes = computed(() => [
  variantClasses[props.variant],
  sizeClasses[props.size],
  'inline-flex items-center justify-center',
  {
    'opacity-50 cursor-not-allowed': props.disabled || props.loading,
  },
])
</script>

<template>
  <button :class="classes" :disabled="disabled || loading" v-bind="$attrs">
    <span v-if="loading" class="animate-spin mr-2">
      <Icon name="heroicons:arrow-path" class="w-4 h-4" />
    </span>
    <slot />
  </button>
</template>
