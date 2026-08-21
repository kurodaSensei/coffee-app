<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    /** Disables click-outside-to-close. */
    persistent?: boolean
    /**
     * Nivel de apilado. Default 'base' (z-50) para sheets normales.
     * 'overlay' (z-[60]) para sheets que deben apilarse por encima de otros
     * sheets — típicamente el Confirm del sistema cuando se dispara desde
     * dentro de otro sheet abierto (ej. ShareSheet → aviso de comunidad).
     */
    layer?: 'base' | 'overlay'
  }>(),
  {
    persistent: false,
    layer: 'base',
  },
)

const backdropZ = computed(() => props.layer === 'overlay' ? 'z-[60]' : 'z-50')
const sheetZ = computed(() => props.layer === 'overlay' ? 'z-[60]' : 'z-50')

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
    // Reset drag state cuando se abre — por si quedó algo del cierre anterior.
    if (open) {
      dragY.value = 0
      isDragging.value = false
    }
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

// ─────────────────────────────────────────────────────────────────────────────
// Drag-to-close (mobile only)
// ─────────────────────────────────────────────────────────────────────────────
// Threshold de cierre: si el usuario arrastra más del 25% de la altura del
// sheet O suelta con velocidad descendente alta, se cierra. Si no, vuelve
// a su posición con un spring-back suave.

const sheetRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragY = ref(0)

// Drag solo en mobile — en desktop el sheet es un modal centrado y aplicarle
// transform translate3d rompería el lg:-translate-x-1/2 lg:-translate-y-1/2.
const { width: vw } = useWindowSize()
const isMobile = computed(() => vw.value < 1024)

let startY = 0
let startTime = 0
let pointerId: number | null = null

function onDragStart(e: PointerEvent) {
  // Solo botón principal del mouse o cualquier touch
  if (e.pointerType === 'mouse' && e.button !== 0) return
  startY = e.clientY
  startTime = performance.now()
  pointerId = e.pointerId
  isDragging.value = true
  // Capturamos el pointer para recibir eventos aunque el dedo salga del handle
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onDragMove(e: PointerEvent) {
  if (!isDragging.value || e.pointerId !== pointerId) return
  const delta = e.clientY - startY
  // Solo arrastre hacia abajo — si tira hacia arriba, no se mueve
  dragY.value = Math.max(0, delta)
}

function onDragEnd(e: PointerEvent) {
  if (!isDragging.value || e.pointerId !== pointerId) return
  const elapsed = performance.now() - startTime
  const distance = dragY.value
  const velocity = distance / Math.max(elapsed, 1) // px/ms

  const sheetHeight = sheetRef.value?.offsetHeight || 600
  const distanceThreshold = sheetHeight * 0.25
  const velocityThreshold = 0.6 // px/ms — un swipe rápido cierra

  const shouldClose = distance > distanceThreshold || velocity > velocityThreshold

  isDragging.value = false
  pointerId = null

  if (shouldClose) {
    // Reset dragY antes de emitir close: el inline style :style desaparece
    // y la leave-to-class translate-y-full puede tomar control para hacer
    // el slide-down completo. Sin esto, el inline transform "100px" ganaría
    // al class translate-y-full y el sheet se quedaría visible.
    dragY.value = 0
    close()
  }
  else {
    // Spring-back animado a 0 — la transition CSS se reactiva cuando
    // isDragging=false, así que basta con setear dragY=0.
    dragY.value = 0
  }
}
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
        :class="['fixed inset-0 bg-[rgba(20,23,18,0.55)] backdrop-blur-[2px]', backdropZ]"
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
        ref="sheetRef"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        :style="isMobile && dragY > 0 ? { transform: `translate3d(0, ${dragY}px, 0)` } : undefined"
        :class="[
          'fixed inset-x-0 bottom-0 max-h-[88svh] flex flex-col rounded-t-sheet bg-paper text-moss',
          sheetZ,
          'shadow-[0_-12px_40px_rgba(20,23,18,0.18)]',
          'lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-[440px] lg:rounded-card-lg lg:max-h-[80vh] lg:shadow-[0_24px_60px_rgba(20,23,18,0.24)]',
          // Mientras el usuario arrastra desactivamos transición para que la
          // posición siga al dedo 1:1. Al soltar, restauramos la transición
          // para que el spring-back sea suave.
          !isDragging && 'transition-transform duration-200 ease-sorbo',
        ]"
      >
        <!-- Drag handle (mobile only) — el touch-action: none reserva el
             gesto vertical para nosotros (sin esto el browser intenta
             scrollear y nuestro pointermove no recibe deltas claros). -->
        <div
          class="lg:hidden flex justify-center pt-sm pb-xs shrink-0 touch-none cursor-grab active:cursor-grabbing"
          @pointerdown="onDragStart"
          @pointermove="onDragMove"
          @pointerup="onDragEnd"
          @pointercancel="onDragEnd"
        >
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
