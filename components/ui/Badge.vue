<script setup lang="ts">
interface Props {
  color?: 'coffee' | 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gray'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'coffee',
  size: 'md',
})

const colorClasses: Record<string, string> = {
  coffee: 'bg-coffee-100 text-coffee-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-cream-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-800',
}

const sizeClasses: Record<string, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
}

const classes = computed(() => [
  'inline-flex items-center rounded-full font-medium',
  colorClasses[props.color],
  sizeClasses[props.size],
])
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
