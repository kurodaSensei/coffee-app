<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useVertidoSession } from '~/composables/useVertidoSession'

const { state, tickTimer, startTimer } = useVertidoSession()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

// Stub: 3 min. Fase 4 leerá los steps reales.
const TOTAL_MS = 3 * 60 * 1000
const BLOOM_MS = 45 * 1000   // 0:45
const POUR_END_MS = 2.5 * 60 * 1000

const running = ref(false)
const elapsed = ref(0)
let rafId: number | null = null
let startedAt = 0

const phase = computed<'bloom' | 'pour' | 'drain'>(() => {
  if (elapsed.value < BLOOM_MS) return 'bloom'
  if (elapsed.value < POUR_END_MS) return 'pour'
  return 'drain'
})

const phaseLabel = computed(() => {
  if (phase.value === 'bloom') return 'humedece el grano'
  if (phase.value === 'pour') return 'vierte en espiral desde el centro'
  return 'deja drenar sin tocar'
})

const mm = computed(() => Math.floor(elapsed.value / 1000 / 60).toString().padStart(2, '0'))
const ss = computed(() => Math.floor((elapsed.value / 1000) % 60).toString().padStart(2, '0'))

// Tiempo restante de la fase actual.
const remaining = computed(() => {
  const end = phase.value === 'bloom' ? BLOOM_MS : phase.value === 'pour' ? POUR_END_MS : TOTAL_MS
  const r = Math.max(0, Math.floor((end - elapsed.value) / 1000))
  const m = Math.floor(r / 60)
  const s = r % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

// Anchos relativos de la barra segmentada arriba (proporciones bloom : pour : drain)
const segments = [
  { key: 'bloom', flex: 1 },
  { key: 'pour', flex: 2.5 },
  { key: 'drain', flex: 1.3 },
] as const

function isActive(key: string) { return phase.value === key }

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

defineExpose({ phase })

onBeforeUnmount(() => {
  if (rafId != null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section class="relative flex flex-col h-full px-md">
    <!-- Header: fase activa + tiempo restante -->
    <div class="flex justify-between items-center pt-xs pb-2">
      <span
        class="font-mono uppercase tracking-[0.2em] font-medium text-honey"
        style="font-size: 9px;"
      >
        {{ phase.toUpperCase() }}
      </span>
      <span class="font-mono uppercase tracking-[0.16em] text-paper/25" style="font-size: 9px;">
        {{ remaining }} rest.
      </span>
    </div>

    <!-- Barra segmentada (no es progreso lineal — son las 3 fases) -->
    <div class="grid gap-[3px]" :style="{ gridTemplateColumns: '1fr 2.5fr 1.3fr' }">
      <div
        v-for="seg in segments"
        :key="seg.key"
        class="h-[2px] rounded-[1px] transition-colors"
        :class="isActive(seg.key) ? 'bg-honey' : 'bg-paper/10'"
      />
    </div>

    <!-- El corazón: el tiempo a 98px (Alt A tipográfico) -->
    <div class="flex-1 flex flex-col justify-center items-center">
      <div class="flex items-baseline leading-[0.88] tracking-[-0.04em]">
        <span class="font-display text-paper" style="font-size: 98px;">{{ mm }}</span>
        <span class="font-display text-honey" style="font-size: 70px;">:</span>
        <span class="font-display text-paper" style="font-size: 98px;">{{ ss }}</span>
      </div>

      <!-- Gradient hairline separador -->
      <div
        class="w-[1.5px] h-[34px] my-3 mb-3.5"
        style="background: linear-gradient(#e5b84b, transparent);"
      />

      <p
        class="font-display italic text-paper/35 text-center"
        style="font-size: 17px;"
      >
        {{ phaseLabel }}
      </p>
    </div>

    <!-- Mini-cards de fases (no tabs — referencias) -->
    <div class="grid grid-cols-3 gap-1 pb-md">
      <div
        v-for="seg in segments"
        :key="seg.key"
        class="text-center py-2 rounded-[9px] border transition-colors"
        :class="isActive(seg.key)
          ? 'bg-honey/10 border-honey/25'
          : 'bg-paper/[0.03] border-paper/[0.06]'"
      >
        <p
          class="font-mono uppercase tracking-[0.12em]"
          :class="isActive(seg.key) ? 'text-honey' : 'text-paper/28'"
          style="font-size: 8px;"
        >
          {{ seg.key }}
        </p>
      </div>
    </div>

    <!-- CTA -->
    <div class="pb-md">
      <button
        v-if="!running"
        type="button"
        class="w-full py-3.5 rounded-[11px] bg-honey text-jungle font-sans font-semibold"
        style="font-size: 13px;"
        @click="start"
      >
        Iniciar
      </button>
      <button
        v-else
        type="button"
        class="w-full py-3.5 rounded-[11px] border border-paper/30 text-paper font-mono uppercase tracking-[0.25em] hover:border-paper transition-colors"
        style="font-size: 11px;"
        @click="finish"
      >
        Terminar
      </button>
    </div>
  </section>
</template>
