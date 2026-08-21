<script setup lang="ts">
import { cn } from '~/lib/utils'

/**
 * Sello editorial hand-drawn que identifica cada stage del Vertido.
 * Stroke-based SVG con stroke-linecap round para que se vea orgánico
 * (no como icono genérico). Usa currentColor — el padre define el tono.
 *
 * Tamaño base 40×40, escalable con la prop `size`.
 */

type StampName = 'coffee' | 'method' | 'recipe' | 'adjust' | 'pour' | 'cup'

withDefaults(
  defineProps<{
    name: StampName
    /** Tamaño en px. Default 40. */
    size?: number
    class?: string
  }>(),
  {
    size: 40,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    :class="cn('inline-block', $props.class)"
  >
    <!-- ━━━━━━━━ COFFEE: bean + leaf ━━━━━━━━ -->
    <g v-if="name === 'coffee'">
      <!-- Leaf -->
      <path d="M 22 5 Q 28 7 26.5 13" />
      <path d="M 24 8 Q 25 11 23 12" opacity="0.5" />
      <!-- Bean (tilted oval) -->
      <ellipse cx="20" cy="24" rx="8.5" ry="10.5" transform="rotate(-12 20 24)" />
      <!-- Bean center crease, slightly s-curved -->
      <path d="M 18 15 Q 17 22 21 27 Q 20 32 18 34" transform="rotate(-12 20 24)" />
    </g>

    <!-- ━━━━━━━━ METHOD: inverted triangle (pour-over universal) ━━━━━━━━ -->
    <g v-if="name === 'method'">
      <!-- Funnel triangle -->
      <path d="M 9 9 L 31 9 L 21 30 L 19 30 Z" />
      <!-- Drip line below -->
      <path d="M 20 32 L 20 35" />
      <!-- Single drop -->
      <circle cx="20" cy="37" r="0.8" fill="currentColor" />
    </g>

    <!-- ━━━━━━━━ RECIPE: cursive signature flourish ━━━━━━━━ -->
    <g v-if="name === 'recipe'">
      <!-- Flowing signature line -->
      <path d="M 5 25 Q 9 12 14 24 Q 18 11 23 24 Q 28 18 32 23 L 35 21" />
      <!-- Underline flourish -->
      <path d="M 7 30 Q 20 32 33 28" opacity="0.4" />
    </g>

    <!-- ━━━━━━━━ ADJUST: dial / balance ━━━━━━━━ -->
    <g v-if="name === 'adjust'">
      <!-- Outer dial arc (3/4 circle) -->
      <path d="M 10 28 A 11 11 0 1 1 30 28" />
      <!-- Tick marks at extremes -->
      <path d="M 7 22 L 9.5 22" />
      <path d="M 33 22 L 30.5 22" />
      <path d="M 20 11 L 20 13" />
      <!-- Indicator needle (slightly off-center, suggesting active adjustment) -->
      <path d="M 20 20 L 16 13" />
      <!-- Center pivot -->
      <circle cx="20" cy="20" r="1.2" fill="currentColor" />
    </g>

    <!-- ━━━━━━━━ POUR: concentric ripples ━━━━━━━━ -->
    <g v-if="name === 'pour'">
      <!-- Center dot -->
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      <!-- Inner ripple -->
      <circle cx="20" cy="20" r="6.5" opacity="0.7" />
      <!-- Mid ripple -->
      <circle cx="20" cy="20" r="11.5" opacity="0.4" />
      <!-- Outer ripple -->
      <circle cx="20" cy="20" r="16.5" opacity="0.2" />
    </g>

    <!-- ━━━━━━━━ CUP: cup with steam ━━━━━━━━ -->
    <g v-if="name === 'cup'">
      <!-- Steam wisps -->
      <path d="M 14 7 Q 12 10 14 13 Q 16 16 14 18" opacity="0.55" />
      <path d="M 20 5 Q 18 8 20 11 Q 22 14 20 17" />
      <path d="M 26 7 Q 28 10 26 13 Q 24 16 26 18" opacity="0.55" />
      <!-- Cup body -->
      <path d="M 9 21 L 31 21 L 29 33 L 11 33 Z" />
      <!-- Handle -->
      <path d="M 31 24 Q 37 24 37 28.5 Q 37 33 31 33" />
      <!-- Coffee surface -->
      <path d="M 11 24 L 29 24" opacity="0.6" />
    </g>
  </svg>
</template>
