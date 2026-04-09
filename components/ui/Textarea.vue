<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  error?: string
  placeholder?: string
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaId = computed(() => `textarea-${Math.random().toString(36).slice(2, 9)}`)

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="textareaId" class="label">
      {{ label }}
    </label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :class="[
        'input-field resize-y',
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
