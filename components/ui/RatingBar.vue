<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '~/lib/utils'

type Variant = 'compact' | 'hero'

const props = withDefaults(
  defineProps<{
    /** Current value. `null` means "unset" — bar empty, value shows "—". */
    modelValue: number | null
    label?: string
    min?: number
    max?: number
    step?: number
    variant?: Variant
    unitSuffix?: string
    /** Disable interaction — used in detail/preview views. */
    readonly?: boolean
    class?: string
  }>(),
  {
    min: 0,
    max: 10,
    step: 0.1,
    variant: 'compact',
    unitSuffix: '/10',
    readonly: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const trackRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

const fillPercent = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return 0
  const v = (props.modelValue - props.min) / (props.max - props.min)
  return Math.max(0, Math.min(100, v * 100))
})

const displayValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return '—'
  return props.modelValue.toFixed(1)
})

function valueFromClient(clientX: number): number {
  if (!trackRef.value) return props.modelValue ?? props.min
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = (clientX - rect.left) / rect.width
  const clamped = Math.max(0, Math.min(1, ratio))
  const raw = props.min + clamped * (props.max - props.min)
  const snapped = Math.round(raw / props.step) * props.step
  return Math.max(props.min, Math.min(props.max, Math.round(snapped * 10) / 10))
}

function onPointerDown(e: PointerEvent) {
  if (props.readonly) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  dragging.value = true
  emit('update:modelValue', valueFromClient(e.clientX))
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || props.readonly) return
  e.preventDefault()
  emit('update:modelValue', valueFromClient(e.clientX))
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return
  try {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }
  catch { /* already released */ }
  dragging.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (props.readonly) return
  const v = props.modelValue ?? props.min
  let next = v
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = v + props.step
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = v - props.step
  else if (e.key === 'Home') next = props.min
  else if (e.key === 'End') next = props.max
  else if (e.key === 'PageUp') next = v + props.step * 10
  else if (e.key === 'PageDown') next = v - props.step * 10
  else return
  e.preventDefault()
  next = Math.max(props.min, Math.min(props.max, Math.round(next * 10) / 10))
  emit('update:modelValue', next)
}
</script>

<template>
  <!-- ━━━━━━━━━━ HERO VARIANT ━━━━━━━━━━ -->
  <div
    v-if="variant === 'hero'"
    :class="cn('rounded-card-lg bg-moss p-md flex flex-col gap-sm', $props.class)"
  >
    <div class="flex items-center justify-between gap-md">
      <UiEyebrow class="text-paper">{{ label }}</UiEyebrow>
      <slot name="trailing" />
    </div>

    <div class="flex items-baseline gap-xxs">
      <span class="font-display text-[48px] sm:text-[56px] leading-none text-paper">
        {{ displayValue }}
      </span>
      <span class="font-mono text-[13px] text-paper">{{ unitSuffix }}</span>
    </div>

    <div
      ref="trackRef"
      :role="readonly ? 'progressbar' : 'slider'"
      :tabindex="readonly ? -1 : 0"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue ?? min"
      :aria-label="label"
      :aria-readonly="readonly || undefined"
      class="group relative h-[6px] rounded-pill bg-moss-soft touch-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-honey"
      :class="readonly ? 'cursor-default' : 'cursor-pointer'"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
    >
      <span
        class="absolute inset-y-0 left-0 rounded-pill bg-honey transition-[width] duration-100 ease-sorbo"
        :style="{ width: `${fillPercent}%` }"
      />
      <span
        v-if="!readonly"
        aria-hidden="true"
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-[14px] rounded-pill bg-honey ring-2 ring-moss transition-[left] duration-100 ease-sorbo"
        :style="{ left: `${fillPercent}%` }"
      />
    </div>
  </div>

  <!-- ━━━━━━━━━━ COMPACT VARIANT ━━━━━━━━━━ -->
  <div
    v-else
    :class="cn('flex items-center gap-md py-sm', $props.class)"
  >
    <span class="font-sans text-[14px] text-moss shrink-0 w-[88px] truncate">{{ label }}</span>

    <div
      ref="trackRef"
      :role="readonly ? 'progressbar' : 'slider'"
      :tabindex="readonly ? -1 : 0"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue ?? min"
      :aria-label="label"
      :aria-readonly="readonly || undefined"
      class="relative flex-1 h-[3px] rounded-pill bg-moss-ghost touch-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss-soft"
      :class="readonly ? 'cursor-default' : 'cursor-pointer'"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
    >
      <span
        class="absolute inset-y-0 left-0 rounded-pill bg-olive transition-[width] duration-100 ease-sorbo"
        :style="{ width: `${fillPercent}%` }"
      />
      <span
        v-if="!readonly"
        aria-hidden="true"
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-[12px] rounded-pill bg-olive ring-2 ring-paper transition-[left] duration-100 ease-sorbo"
        :style="{ left: `${fillPercent}%` }"
      />
    </div>

    <span
      class="font-mono text-[13px] shrink-0 w-[40px] text-right tabular-nums"
      :class="modelValue === null ? 'text-moss-ghost' : 'text-moss'"
    >
      {{ displayValue }}
    </span>
  </div>
</template>
