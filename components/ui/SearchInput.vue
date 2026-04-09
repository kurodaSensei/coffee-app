<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  localValue.value = target.value

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', target.value)
  }, 300)
}

function clear() {
  localValue.value = ''
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('update:modelValue', '')
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-coffee-400" />
    </div>
    <input
      type="text"
      :value="localValue"
      :placeholder="placeholder"
      class="input-field pl-10 pr-10 border-coffee-200"
      @input="onInput"
    />
    <button
      v-if="localValue"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-coffee-400 hover:text-coffee-600 transition-colors"
      @click="clear"
    >
      <Icon name="heroicons:x-circle" class="w-5 h-5" />
    </button>
  </div>
</template>
