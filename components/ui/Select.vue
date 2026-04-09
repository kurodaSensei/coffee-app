<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Select an option',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).slice(2, 9)}`)

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="selectId" class="label">
      {{ label }}
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :class="[
        'input-field',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-coffee-200',
      ]"
      v-bind="$attrs"
      @change="onChange"
    >
      <option value="" disabled>
        {{ placeholder }}
      </option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
