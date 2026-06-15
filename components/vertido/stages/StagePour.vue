<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import LiquidColumn from '../LiquidColumn.vue'
import StageFrame from '../StageFrame.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'

const { state, tickTimer, startTimer } = useVertidoSession()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

// Stub: 3 min total. Fase 4 leerá los steps de la receta.
const TOTAL_MS = 3 * 60 * 1000
const BLOOM_END_MS = 45 * 1000
const POUR_END_MS = 2 * 60 * 1000

const running = ref(false)
const elapsed = ref(0)
let rafId: number | null = null
let startedAt = 0

const progress = computed(() => Math.min(1, elapsed.value / TOTAL_MS))

const phase = computed<'bloom' | 'pour' | 'drain'>(() => {
  if (elapsed.value < BLOOM_END_MS) return 'bloom'
  if (elapsed.value < POUR_END_MS) return 'pour'
  return 'drain'
})

const phaseLabel = computed(() => {
  if (phase.value === 'bloom') return 'Floración'
  if (phase.value === 'pour') return 'Vertido principal'
  return 'Drenaje'
})

const mmss = computed(() => {
  const s = Math.floor(elapsed.value / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
})

function tick() {
  elapsed.value = performance.now() - startedAt
  tickTimer(elapsed.value)
  if (elapsed.value < TOTAL_MS) {
    rafId = requestAnimationFrame(tick)
  } else {
    running.value = false
  }
}

function start() {
  startedAt = performance.now()
  startTimer()
  running.value = true
  rafId = requestAnimationFrame(tick)
}

function finish(e: MouseEvent) {
  if (rafId != null) cancelAnimationFrame(rafId)
  emit('advance', { x: e.clientX, y: e.clientY })
}

onBeforeUnmount(() => {
  if (rafId != null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <StageFrame stamp="pour" eyebrow="Vertido" :headline="phaseLabel">
    <div class="flex flex-col items-center gap-8">
      <LiquidColumn :progress="progress" :phase="phase" />

      <div class="text-center space-y-1">
        <p class="font-display text-paper text-[56px] leading-none tabular-nums">
          {{ mmss }}
        </p>
        <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
          {{ state.doseGrams }}g · {{ state.waterGrams }}g
        </p>
      </div>

      <button
        v-if="!running"
        type="button"
        class="px-8 py-4 rounded-full bg-honey text-jungle font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-honey/90 transition-colors"
        @click="start"
      >
        Iniciar cronómetro
      </button>
      <button
        v-else
        type="button"
        class="px-8 py-4 rounded-full border border-paper/40 text-paper font-mono text-[11px] uppercase tracking-[0.25em] hover:border-paper transition-colors"
        @click="finish"
      >
        Terminar vertido
      </button>
    </div>
  </StageFrame>
</template>
