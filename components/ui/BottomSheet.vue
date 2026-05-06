<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    /** Disables click-outside-to-close. */
    persistent?: boolean
  }>(),
  {
    persistent: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  if (!props.persistent) emit('update:modelValue', false)
}

// Lock body scroll while open
watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

// Esc to close
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeydown)
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}

onUnmounted(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-sorbo"
      leave-active-class="transition-opacity duration-150 ease-sorbo"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-[rgba(20,23,18,0.55)] backdrop-blur-[2px]"
        @click="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-sorbo"
      leave-active-class="transition-transform duration-200 ease-sorbo"
      enter-from-class="translate-y-full lg:translate-y-0 lg:opacity-0 lg:scale-95"
      leave-to-class="translate-y-full lg:translate-y-0 lg:opacity-0 lg:scale-95"
    >
      <div
        v-if="modelValue"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="fixed inset-x-0 bottom-0 z-50 max-h-[88svh] flex flex-col rounded-t-sheet bg-paper text-moss
               shadow-[0_-12px_40px_rgba(20,23,18,0.18)]
               lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-[440px] lg:rounded-card-lg lg:max-h-[80vh] lg:shadow-[0_24px_60px_rgba(20,23,18,0.24)]"
      >
        <!-- Drag handle (mobile only) -->
        <div class="lg:hidden flex justify-center pt-sm pb-xs shrink-0">
          <span aria-hidden="true" class="h-[5px] w-12 rounded-pill bg-moss-ghost" />
        </div>

        <div class="flex items-center justify-between px-md pt-xs pb-sm shrink-0">
          <h2 v-if="title" class="font-display text-[24px] leading-none text-moss">
            {{ title }}
          </h2>
          <button
            type="button"
            class="ml-auto inline-flex size-[40px] items-center justify-center rounded-pill text-moss hover:bg-surface-2/60 transition-colors"
            aria-label="Cerrar"
            @click="close"
          >
            <Icon name="lucide:x" class="size-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-md pb-[calc(env(safe-area-inset-bottom)+24px)]">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
