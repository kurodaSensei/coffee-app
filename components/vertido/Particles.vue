<script setup lang="ts">
import { computed } from 'vue'

/**
 * Gránulos honey que caen desde el centro de la pantalla (donde vive
 * el timer) hacia abajo, evocando el chorro del vertido. Antes era
 * "lluvia desde arriba"; ahora son específicos al momento — emergen
 * desde los dígitos del timer durante la fase pour.
 *
 * - `active=true`: animación corre.
 * - `density`: cuántas partículas (default 8 — menos es más).
 *
 * Delays deterministas (PRNG seedeado) para no romper SSR.
 */

const props = withDefaults(
  defineProps<{
    active?: boolean
    density?: number
  }>(),
  {
    active: false,
    density: 8,
  },
)

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
      // Centradas en el rango 35-65% para emerger desde el área del timer.
      left: `${35 + r1 * 30}%`,
      size: `${1.5 + r2 * 1.5}px`,
      opacity: 0.25 + r3 * 0.2,
      duration: 2.5 + r1 * 2, // más rápidas que antes — vertido activo
      delay: r2 * 3,
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
  /* Empiezan en el centro vertical — desde los dígitos del timer. */
  top: 50%;
  border-radius: 50%;
  background: #E5B84B; /* honey */
  box-shadow: 0 0 4px rgba(229, 184, 75, 0.5);
  animation-name: fall-from-center;
  animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  animation-iteration-count: infinite;
  animation-play-state: paused;
}

.ritual-particles--active .ritual-particle {
  animation-play-state: running;
}

@keyframes fall-from-center {
  0%   { transform: translate3d(0, 0, 0); opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translate3d(0, 60vh, 0); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ritual-particle {
    animation: none;
    opacity: 0 !important;
  }
}
</style>
