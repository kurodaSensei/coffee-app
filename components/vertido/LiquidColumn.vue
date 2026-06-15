<script setup lang="ts">
import { computed } from 'vue'

/**
 * Cronómetro vertical en forma de vasija que se llena de líquido honey
 * conforme avanza el progreso (0→1). Reemplaza la barra circular típica
 * con algo que conecta visualmente con el acto de verter.
 *
 * - `progress` (0..1): nivel del líquido.
 * - `phase` opcional: 'bloom' | 'pour' | 'drain' — afecta sutilmente
 *   el matiz del líquido (más amarillo en bloom, más ámbar en pour).
 *
 * El líquido oscila ligeramente con una sinusoide CSS (efecto "calm
 * meniscus") para que no se vea estático.
 */

const props = withDefaults(
  defineProps<{
    progress: number
    phase?: 'bloom' | 'pour' | 'drain'
  }>(),
  {
    phase: 'pour',
  },
)

// Clamp 0..1
const clamped = computed(() => Math.max(0, Math.min(1, props.progress)))

// Y del nivel del líquido en el viewBox (0..240). 240 = lleno, 0 = vacío.
// Vasija interior va de y=20 (top) a y=220 (bottom). Range = 200.
const liquidY = computed(() => 20 + (1 - clamped.value) * 200)

const fillColor = computed(() => {
  switch (props.phase) {
    case 'bloom': return '#F2C955' // honey claro, casi amarillo
    case 'drain': return '#B8902B' // honey oscuro, casi terracota
    default:      return '#E5B84B' // honey base
  }
})
</script>

<template>
  <svg
    viewBox="0 0 100 240"
    width="100"
    height="240"
    fill="none"
    aria-hidden="true"
    class="ritual-liquid"
  >
    <!-- Clip-path: silueta interior de la vasija. Borde redondeado abajo. -->
    <defs>
      <clipPath id="vessel-clip">
        <path d="M 20 20
                 L 80 20
                 L 78 200
                 Q 78 220 60 220
                 L 40 220
                 Q 22 220 22 200
                 Z" />
      </clipPath>
    </defs>

    <!-- Vessel outline (hairline) -->
    <path
      d="M 20 20
         L 80 20
         L 78 200
         Q 78 220 60 220
         L 40 220
         Q 22 220 22 200
         Z"
      stroke="rgba(244, 242, 235, 0.4)"
      stroke-width="1"
      stroke-linejoin="round"
    />

    <!-- Líquido (clipeado a la silueta de la vasija) -->
    <g clip-path="url(#vessel-clip)">
      <!-- Bloque líquido principal -->
      <rect
        x="0"
        y="0"
        width="100"
        height="240"
        :fill="fillColor"
        :style="{ transform: `translateY(${liquidY}px)` }"
        class="ritual-liquid-fill"
      />
      <!-- Menisco: línea ondulante en la superficie del líquido -->
      <path
        :d="`M -10 ${liquidY} Q 25 ${liquidY - 2} 50 ${liquidY} T 110 ${liquidY}`"
        :stroke="fillColor"
        stroke-width="3"
        fill="none"
        class="ritual-liquid-meniscus"
        opacity="0.7"
      />
    </g>

    <!-- Tick marks laterales (escala silenciosa) -->
    <g stroke="rgba(244, 242, 235, 0.15)" stroke-width="0.5">
      <line x1="16" y1="70"  x2="20" y2="70" />
      <line x1="16" y1="120" x2="20" y2="120" />
      <line x1="16" y1="170" x2="20" y2="170" />
    </g>
  </svg>
</template>

<style scoped>
.ritual-liquid {
  display: block;
}

.ritual-liquid-fill {
  transition: transform 200ms linear, fill 800ms ease;
}

.ritual-liquid-meniscus {
  animation: meniscus-wobble 3s ease-in-out infinite;
  transition: stroke 800ms ease;
}

@keyframes meniscus-wobble {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .ritual-liquid-meniscus {
    animation: none;
  }
  .ritual-liquid-fill {
    transition: transform 400ms linear, fill 800ms ease;
  }
}
</style>
