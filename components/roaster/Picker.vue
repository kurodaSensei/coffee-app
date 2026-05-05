<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { Roaster, RoasterInput } from '~/types'
import { cn } from '~/lib/utils'

export interface RoasterValue {
  id?: string
  name: string
}

const props = withDefaults(
  defineProps<{
    modelValue: RoasterValue | null
    label?: string
    placeholder?: string
    error?: string
    /** Default country used when creating a roaster on the fly. */
    defaultCountry?: string
    class?: string
  }>(),
  {
    placeholder: 'Selecciona o crea uno…',
    defaultCountry: 'Colombia',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: RoasterValue | null]
}>()

const roastersStore = useRoastersStore()

const generatedId = useId()
const fieldId = computed(() => `roaster-${generatedId}`)
const errorId = computed(() => `${fieldId.value}-error`)

const open = ref(false)
const isCreating = ref(false)
const query = ref(props.modelValue?.name || '')
const inputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!roastersStore.list.length && !roastersStore.loading) {
    roastersStore.loadAll().catch(() => {})
  }
})

onClickOutside(containerRef, () => {
  open.value = false
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = (roastersStore.list as Roaster[]) || []
  if (!q) return list
  return list.filter(r => (r.name || '').toLowerCase().includes(q))
})

const showCreate = computed(() => {
  const q = query.value.trim()
  if (!q) return false
  return !filtered.value.some(r => (r.name || '').toLowerCase() === q.toLowerCase())
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
  // Sync model immediately so typing alone is enough to satisfy "name set".
  if (!v.trim()) {
    emit('update:modelValue', null)
    return
  }
  const matched = filtered.value.find(
    r => (r.name || '').toLowerCase() === v.trim().toLowerCase(),
  )
  if (matched) {
    emit('update:modelValue', { id: matched.id, name: matched.name })
  }
  else {
    emit('update:modelValue', { name: v.trim() })
  }
}

function pick(r: Roaster) {
  query.value = r.name
  emit('update:modelValue', { id: r.id, name: r.name })
  collapse()
}

async function createNew() {
  const name = query.value.trim()
  if (!name || isCreating.value) return
  isCreating.value = true
  try {
    const id = await roastersStore.create({
      name,
      country: props.defaultCountry,
    } as RoasterInput)
    emit('update:modelValue', { id, name })
    query.value = name
    collapse()
  }
  catch {
    // Toast surfaced by the store
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
  () => props.modelValue?.name,
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
          <li v-for="r in filtered" :key="r.id">
            <button
              type="button"
              role="option"
              :aria-selected="modelValue?.id === r.id"
              class="w-full text-left px-md py-sm font-display text-[16px] text-moss hover:bg-surface-2 transition-colors duration-150 ease-sorbo"
              @click="pick(r)"
            >
              {{ r.name }}
              <span v-if="r.country" class="ml-xs font-mono text-[10px] uppercase tracking-eyebrow text-moss-ghost">
                · {{ r.country }}
              </span>
            </button>
          </li>
        </ul>
        <p
          v-else-if="!query.trim()"
          class="px-md py-md font-display italic text-[13px] text-moss-soft"
        >
          {{ roastersStore.loading ? 'Cargando tostadores…' : 'Aún no tienes tostadores guardados.' }}
        </p>

        <div v-if="showCreate" :class="filtered.length > 0 ? 'border-t border-moss/10' : ''">
          <button
            type="button"
            :disabled="isCreating"
            class="w-full text-left px-md py-sm font-mono text-[10px] font-medium uppercase tracking-eyebrow text-olive hover:bg-surface-2 transition-colors duration-150 ease-sorbo disabled:opacity-50"
            @click="createNew"
          >
            {{ isCreating ? '+ creando…' : `+ crear «${query.trim()}»` }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
