<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    autocomplete?: string
    inputmode?: 'text' | 'email' | 'numeric' | 'decimal' | 'tel' | 'url' | 'search'
    disabled?: boolean
    readonly?: boolean
    error?: string
    /** Hide leading em-dash on the label */
    bareLabel?: boolean
    name?: string
    id?: string
    class?: string
  }>(),
  {
    type: 'text',
    bareLabel: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? `field-${generatedId}`)
const errorId = computed(() => `${fieldId.value}-error`)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div :class="cn('flex flex-col gap-xxs', $props.class)">
    <label
      v-if="label"
      :for="fieldId"
      class="font-mono text-eyebrow font-medium uppercase text-moss-soft"
    >
      <span v-if="!bareLabel" aria-hidden="true">— </span>{{ label }}
    </label>

    <input
      :id="fieldId"
      :name="name"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      class="w-full bg-transparent border-0 border-b border-moss/15 py-xs text-[20px] leading-[25px] font-sans text-moss placeholder:text-moss-ghost focus:outline-none focus:border-moss transition-colors duration-150 ease-sorbo disabled:opacity-50 disabled:cursor-not-allowed read-only:cursor-default"
      :class="error && 'border-terracotta focus:border-terracotta'"
      @input="onInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />

    <p
      v-if="error"
      :id="errorId"
      class="font-mono text-eyebrow font-medium uppercase text-terracotta"
    >
      <span aria-hidden="true">— </span>{{ error }}
    </p>
  </div>
</template>
