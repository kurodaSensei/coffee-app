<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { cn } from '~/lib/utils'

withDefaults(
  defineProps<{
    /** Accessible label for the trigger button. */
    ariaLabel?: string
    /** Lucide icon name for the trigger. */
    icon?: string
    /** Where to align the dropdown horizontally. */
    align?: 'left' | 'right'
    class?: string
  }>(),
  {
    ariaLabel: 'Más acciones',
    icon: 'lucide:more-horizontal',
    align: 'right',
  },
)

const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)

onClickOutside(containerRef, () => {
  open.value = false
})

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

defineExpose({ close, open: () => (open.value = true) })
</script>

<template>
  <div
    ref="containerRef"
    :class="cn('relative inline-block', $props.class)"
  >
    <button
      type="button"
      :aria-label="ariaLabel"
      :aria-haspopup="true"
      :aria-expanded="open"
      class="inline-flex items-center justify-center size-[40px] rounded-pill text-moss hover:bg-surface-2/60 transition-colors duration-150 ease-sorbo"
      @click="toggle"
    >
      <Icon :name="icon" class="size-5" />
    </button>

    <Transition
      enter-active-class="transition-all duration-150 ease-sorbo"
      leave-active-class="transition-all duration-100 ease-sorbo"
      enter-from-class="opacity-0 -translate-y-1"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="open"
        :class="
          cn(
            'absolute mt-xs z-40 min-w-[180px] flex flex-col rounded-card-sm bg-paper border border-moss/10 shadow-[0_8px_24px_rgba(47,53,40,0.14)] py-xxs overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0',
          )
        "
        role="menu"
        @click="close"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
