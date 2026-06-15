<script setup lang="ts">
import { computed } from 'vue'

/**
 * Sustrato dinámico de El Vertido — niebla derivante con temperatura
 * cromática que evoluciona conforme avanza el journey.
 *
 * Implementación: 2 blobs radiales muy desenfocados (blur 80px) que se
 * desplazan en loop de 30s y 45s a contrapunto. La temperatura cambia
 * en 800ms con transición CSS al variar la prop `stage`.
 *
 * Respeta prefers-reduced-motion: animación pausada, niebla estática.
 */

type Stage = 'coffee' | 'method' | 'recipe' | 'adjust' | 'pour' | 'close'

const props = defineProps<{ stage: Stage }>()

// Cada stage define las dos posiciones (blob A, blob B) y sus colores.
// Color principal evoluciona: cool moss → warm honey → resolution paper.
const STAGE_PALETTE: Record<Stage, {
  blobA: string  // rgba
  blobB: string
  bg: string     // background color CSS variable hex
}> = {
  coffee: { blobA: 'rgba(85, 107, 58, 0.30)',  blobB: 'rgba(150, 179, 106, 0.18)', bg: '#2F3528' },
  method: { blobA: 'rgba(85, 107, 58, 0.32)',  blobB: 'rgba(229, 184, 75, 0.10)',  bg: '#2F3528' },
  recipe: { blobA: 'rgba(150, 179, 106, 0.22)', blobB: 'rgba(229, 184, 75, 0.18)', bg: '#2F3528' },
  adjust: { blobA: 'rgba(229, 184, 75, 0.30)',  blobB: 'rgba(150, 179, 106, 0.18)', bg: '#3A3A28' },
  pour:   { blobA: 'rgba(229, 184, 75, 0.50)',  blobB: 'rgba(255, 200, 100, 0.25)', bg: '#3D3520' },
  close:  { blobA: 'rgba(229, 184, 75, 0.20)',  blobB: 'rgba(244, 242, 235, 0.08)', bg: '#2F3528' },
}

const palette = computed(() => STAGE_PALETTE[props.stage])
</script>

<template>
  <div
    class="ritual-bg fixed inset-0 z-0 overflow-hidden transition-colors duration-[800ms] ease-sorbo"
    :style="{ backgroundColor: palette.bg }"
    aria-hidden="true"
  >
    <!-- Blob A: drifts slowly in a diagonal -->
    <span
      class="ritual-bg-blob ritual-bg-blob-a"
      :style="{ background: `radial-gradient(circle, ${palette.blobA} 0%, transparent 65%)` }"
    />
    <!-- Blob B: counterpoint, slower, opposite direction -->
    <span
      class="ritual-bg-blob ritual-bg-blob-b"
      :style="{ background: `radial-gradient(circle, ${palette.blobB} 0%, transparent 65%)` }"
    />
  </div>
</template>

<style scoped>
.ritual-bg {
  /* prefers-reduced-motion handled below */
}

.ritual-bg-blob {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  transition: background 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ritual-bg-blob-a {
  top: -10%;
  left: -10%;
  animation: drift-a 30s ease-in-out infinite alternate;
}

.ritual-bg-blob-b {
  bottom: -15%;
  right: -10%;
  animation: drift-b 45s ease-in-out infinite alternate;
}

@keyframes drift-a {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  50%  { transform: translate3d(15%, 25%, 0) scale(1.15); }
  100% { transform: translate3d(30%, 10%, 0) scale(1); }
}

@keyframes drift-b {
  0%   { transform: translate3d(0, 0, 0) scale(1.1); }
  50%  { transform: translate3d(-20%, -15%, 0) scale(0.95); }
  100% { transform: translate3d(-10%, -30%, 0) scale(1.1); }
}

@media (prefers-reduced-motion: reduce) {
  .ritual-bg-blob {
    animation: none;
  }
}
</style>
