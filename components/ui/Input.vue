<script setup lang="ts">
import { computed, ref, useId } from 'vue'
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
    required?: boolean
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
    required: false,
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
const isFocused = ref(false)
const isPassword = computed(() => props.type === 'password')

const hasValue = computed(() => {
  const v = props.modelValue
  return v !== null && v !== undefined && String(v).length > 0
})

const borderClass = computed(() => {
  if (props.error) return 'border-terracotta'
  if (isFocused.value || hasValue.value) return 'border-moss'
  return 'border-moss/10'
})

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onFocus(e: FocusEvent) {
  isFocused.value = true
  emit('focus', e)
}

function onBlur(e: FocusEvent) {
  isFocused.value = false
  emit('blur', e)
}
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col gap-xs pt-[14px] pb-[13px] border-b transition-colors duration-150 ease-sorbo',
        borderClass,
        $props.class,
      )
    "
  >
    <label
      v-if="label"
      :for="fieldId"
      class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft"
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
      :required="required"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      :class="
        cn(
          'w-full bg-transparent border-0 p-0 leading-none text-moss outline-none',
          'placeholder:text-moss-ghost placeholder:font-display placeholder:italic',
          'disabled:opacity-50 disabled:cursor-not-allowed read-only:cursor-default',
          isPassword
            ? 'font-mono text-[18px] tracking-[0.3em] placeholder:tracking-normal placeholder:font-display'
            : 'font-display text-[18px]',
        )
      "
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />

    <p
      v-if="error"
      :id="errorId"
      class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
    >
      <span aria-hidden="true">— </span>{{ error }}
    </p>
  </div>
</template>
