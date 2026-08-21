<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/**
 * Wash radial honey desde un origin (x,y) que crece desde 0 hasta cubrir
 * toda la pantalla, luego desvanece. Usado entre stages como cortina
 * orgánica en lugar de fade trivial.
 *
 * Uso:
 *   <RitualTransition :show="transitioning" :origin="tapPoint" @done="onDone" />
 *
 * El componente padre setea `show=true` con un origin (e.g. el click x/y),
 * el wash corre, emite `done` cuando termina para que el padre rote el
 * stage y baje el flag.
 */

const props = withDefaults(
  defineProps<{
    show: boolean
    /** Punto de origen del wash en viewport coords. Default: centro. */
    origin?: { x: number; y: number }
    /** Duración total del wash, ms. */
    duration?: number
  }>(),
  {
    duration: 600,
  },
)

const emit = defineEmits<{ done: [] }>()

const internalShow = ref(false)

watch(
  () => props.show,
  (show) => {
    if (!show) {
      internalShow.value = false
      return
    }
    internalShow.value = true
    setTimeout(() => emit('done'), props.duration)
  },
)

const originStyle = computed(() => {
  if (!props.origin) {
    return { '--origin-x': '50%', '--origin-y': '50%' }
  }
  return {
    '--origin-x': `${props.origin.x}px`,
    '--origin-y': `${props.origin.y}px`,
  }
})
</script>

<template>
  <div
    v-if="internalShow"
    class="ritual-transition fixed inset-0 z-[100] pointer-events-none"
    :style="{ ...originStyle, '--duration': `${duration}ms` }"
    aria-hidden="true"
  >
    <span class="ritual-transition-wash" />
  </div>
</template>

<style scoped>
.ritual-transition-wash {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--origin-x, 50%) var(--origin-y, 50%),
    rgba(229, 184, 75, 0.95) 0%,
    rgba(229, 184, 75, 0.75) 30%,
    rgba(229, 184, 75, 0.3) 60%,
    transparent 80%
  );
  clip-path: circle(0% at var(--origin-x, 50%) var(--origin-y, 50%));
  animation: wash var(--duration, 600ms) cubic-bezier(0.32, 0, 0.18, 1) forwards;
}

@keyframes wash {
  0% {
    clip-path: circle(0% at var(--origin-x, 50%) var(--origin-y, 50%));
    opacity: 1;
  }
  60% {
    clip-path: circle(120% at var(--origin-x, 50%) var(--origin-y, 50%));
    opacity: 1;
  }
  100% {
    clip-path: circle(120% at var(--origin-x, 50%) var(--origin-y, 50%));
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ritual-transition-wash {
    animation: wash-reduced var(--duration, 600ms) ease forwards;
  }
  @keyframes wash-reduced {
    0%   { opacity: 0; clip-path: circle(120% at 50% 50%); }
    50%  { opacity: 0.6; }
    100% { opacity: 0; }
  }
}
</style>
