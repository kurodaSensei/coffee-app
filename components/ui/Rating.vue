<script setup lang="ts">
interface Props {
  modelValue?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 5,
  size: 'md',
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoveredIndex = ref(0)

const sizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const gapClasses: Record<string, string> = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
}

function select(index: number) {
  if (!props.readonly) {
    emit('update:modelValue', index)
  }
}

function isActive(index: number): boolean {
  return index <= (hoveredIndex.value || props.modelValue)
}
</script>

<template>
  <div
    class="inline-flex items-center"
    :class="gapClasses[size]"
    @mouseleave="hoveredIndex = 0"
  >
    <button
      v-for="i in max"
      :key="i"
      type="button"
      :class="[
        'transition-colors duration-150 focus:outline-none',
        readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transform',
      ]"
      :disabled="readonly"
      @click="select(i)"
      @mouseenter="!readonly && (hoveredIndex = i)"
    >
      <svg
        :class="[
          sizeClasses[size],
          isActive(i) ? 'text-coffee-600 fill-coffee-600' : 'text-coffee-200 fill-coffee-200',
        ]"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Coffee bean shape -->
        <ellipse cx="12" cy="12" rx="7" ry="10" />
        <path
          d="M12 3C11 6 11 18 12 21"
          stroke="white"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>
