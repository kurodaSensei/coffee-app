<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    /** Variety name as a plain string. */
    modelValue: string
    label?: string
    placeholder?: string
    error?: string
    class?: string
  }>(),
  {
    placeholder: 'Caturra, Geisha…',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { varieties } = useCatalog()
const settings = useSettingsStore()

const generatedId = useId()
const fieldId = computed(() => `variety-${generatedId}`)
const errorId = computed(() => `${fieldId.value}-error`)

const open = ref(false)
const isCreating = ref(false)
const query = ref(props.modelValue || '')
const inputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

onClickOutside(containerRef, () => {
  open.value = false
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = varieties.value || []
  if (!q) return list
  return list.filter(v => v.toLowerCase().includes(q))
})

const showCreate = computed(() => {
  const q = query.value.trim()
  if (!q) return false
  return !filtered.value.some(v => v.toLowerCase() === q.toLowerCase())
})

const borderClass = computed(() => {
  if (props.error) return 'border-terracotta'
  if (open.value || query.value) return 'border-moss'
  return 'border-moss/10'
})

function expand() {
  open.value = true
}

function collapse() {
  open.value = false
}

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  query.value = v
  emit('update:modelValue', v.trim())
}

function pick(v: string) {
  query.value = v
  emit('update:modelValue', v)
  collapse()
}

async function createNew() {
  const name = query.value.trim()
  if (!name || isCreating.value) return
  isCreating.value = true
  try {
    await settings.addVariety(name)
    emit('update:modelValue', name)
    query.value = name
    collapse()
  }
  catch {
    // settings.save logs internally; fall through silently
  }
  finally {
    isCreating.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (filtered.value.length > 0) {
      pick(filtered.value[0])
    }
    else if (showCreate.value) {
      createNew()
    }
  }
  else if (e.key === 'Escape') {
    collapse()
    inputRef.value?.blur()
  }
}

watch(
  () => props.modelValue,
  (n) => {
    if ((n || '') !== query.value) query.value = n || ''
  },
)
</script>

<template>
  <div ref="containerRef" :class="cn('relative', $props.class)">
    <div
      :class="
        cn(
          'flex flex-col gap-xs pt-[14px] pb-[13px] border-b transition-colors duration-150 ease-sorbo',
          borderClass,
        )
      "
    >
      <label
        v-if="label"
        :for="fieldId"
        class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft"
      >
        <span aria-hidden="true">— </span>{{ label }}
      </label>

      <input
        :id="fieldId"
        ref="inputRef"
        :value="query"
        type="text"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
        :aria-invalid="!!error || undefined"
        :aria-describedby="error ? errorId : undefined"
        :aria-expanded="open"
        aria-autocomplete="list"
        role="combobox"
        class="w-full bg-transparent border-0 p-0 leading-none text-moss outline-none font-display text-[18px] placeholder:text-moss-ghost placeholder:font-display placeholder:italic"
        @input="onInput"
        @focus="expand"
        @keydown="onKeydown"
      >
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="mt-xs font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
    >
      <span aria-hidden="true">— </span>{{ error }}
    </p>

    <Transition
      enter-active-class="transition-opacity duration-150 ease-sorbo"
      leave-active-class="transition-opacity duration-100 ease-sorbo"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="absolute left-0 right-0 top-full mt-xs z-30 max-h-[280px] overflow-y-auto rounded-card-sm bg-paper border border-moss/10 shadow-[0_8px_24px_rgba(47,53,40,0.12)]"
        role="listbox"
      >
        <ul v-if="filtered.length > 0" class="flex flex-col py-xxs">
          <li v-for="v in filtered" :key="v">
            <button
              type="button"
              role="option"
              :aria-selected="modelValue === v"
              class="w-full text-left px-md py-sm font-display text-[16px] text-moss hover:bg-surface-2 transition-colors duration-150 ease-sorbo"
              @click="pick(v)"
            >
              {{ v }}
            </button>
          </li>
        </ul>
        <p
          v-else-if="!query.trim()"
          class="px-md py-md font-display italic text-[13px] text-moss-soft"
        >
          Aún no hay variedades en tu catálogo.
        </p>

        <div v-if="showCreate" :class="filtered.length > 0 ? 'border-t border-moss/10' : ''">
          <button
            type="button"
            :disabled="isCreating"
            class="w-full text-left px-md py-sm font-mono text-[10px] font-medium uppercase tracking-eyebrow text-olive hover:bg-surface-2 transition-colors duration-150 ease-sorbo disabled:opacity-50"
            @click="createNew"
          >
            {{ isCreating ? '+ guardando…' : `+ guardar «${query.trim()}» en catálogo` }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
