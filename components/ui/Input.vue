<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  error?: string
  type?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 9)}`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="[
        'input-field',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-coffee-200',
      ]"
      v-bind="$attrs"
      @input="onInput"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
