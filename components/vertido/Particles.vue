<script setup lang="ts">
import { computed } from 'vue'

/**
 * Gránulos honey cayendo verticalmente, evocando el chorro del vertido
 * sin recurrir a partículas literales. 8-12 puntos pequeños, opacidad
 * baja, delays deterministas (no Math.random — para SSR-stability).
 *
 * - `active=true`: animación corre.
 * - `active=false`: gránulos detenidos (estado por defecto).
 * - `density`: cuántas partículas (default 10).
 */

const props = withDefaults(
  defineProps<{
    active?: boolean
    density?: number
  }>(),
  {
    active: false,
    density: 10,
  },
)

// LCG determinista para posiciones/timings que no cambien entre frames.
// Misma seed = misma distribución; evita hydration mismatch.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const particles = computed(() =>
  Array.from({ length: props.density }, (_, i) => {
    const r1 = pseudoRandom(i + 1)
    const r2 = pseudoRandom(i + 100)
    const r3 = pseudoRandom(i + 1000)
    return {
      id: i,
      left: `${5 + r1 * 90}%`,           // 5-95% horizontal
      size: `${1.5 + r2 * 1.5}px`,        // 1.5-3px
      opacity: 0.15 + r3 * 0.2,           // 0.15-0.35
      duration: 4 + r1 * 4,               // 4-8s
      delay: r2 * 5,                      // 0-5s stagger
    }
  }),
)
</script>

<template>
  <div
    class="ritual-particles pointer-events-none absolute inset-0 overflow-hidden"
    :class="{ 'ritual-particles--active': active }"
    aria-hidden="true"
  >
    <span
      v-for="p in particles"
      :key="p.id"
      class="ritual-particle"
      :style="{
        left: p.left,
        width: p.size,
        height: p.size,
        opacity: p.opacity,
        animationDuration: `${p.duration}s`,
        animationDelay: `${p.delay}s`,
      }"
    />
  </div>
</template>

<style scoped>
.ritual-particle {
  position: absolute;
  top: -20px;
  border-radius: 50%;
  background: #E5B84B; /* honey */
  box-shadow: 0 0 4px rgba(229, 184, 75, 0.4);
  animation-name: fall;
  animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  animation-iteration-count: infinite;
  animation-play-state: paused;
}

.ritual-particles--active .ritual-particle {
  animation-play-state: running;
}

@keyframes fall {
  0%   { transform: translate3d(0, 0, 0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translate3d(0, calc(100vh + 40px), 0); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ritual-particle {
    animation: none;
    opacity: 0 !important;
  }
}
</style>
