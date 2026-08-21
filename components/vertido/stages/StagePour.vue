<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useVertidoSession } from '~/composables/useVertidoSession'

const { state, tickTimer, startTimer } = useVertidoSession()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

// Timings derivados de la receta seleccionada (o defaults si el usuario
// eligió "sin receta"). El último step marca el fin del vertido; los steps
// entre bloom y drain se agrupan como "pour".
// ponytail: heurística simple — primer step = bloom, último = drain, medio
// = pour. Sirve para recetas 3-5 steps que es lo típico. Si el usuario tiene
// una receta con 1 solo step, todo es "pour".
const DEFAULT_BLOOM_MS = 45 * 1000
const DEFAULT_POUR_END_MS = 2.5 * 60 * 1000
const DEFAULT_TOTAL_MS = 3 * 60 * 1000

interface Phases {
  bloomMs: number
  pourEndMs: number
  totalMs: number
}

const phases = computed<Phases>(() => {
  const steps = state.recipe?.steps
  if (!steps || steps.length === 0) {
    return {
      bloomMs: DEFAULT_BLOOM_MS,
      pourEndMs: DEFAULT_POUR_END_MS,
      totalMs: DEFAULT_TOTAL_MS,
    }
  }
  const sorted = [...steps].sort((a, b) => a.timeSeconds - b.timeSeconds)
  const last = sorted[sorted.length - 1]
  // Total = último step + un buffer estimado (30s si no hay más info).
  // Fase 5 puede pedir un `totalSeconds` explícito en RecipeStep.
  const totalMs = (last.timeSeconds + 30) * 1000
  // Bloom = duración hasta el 2do step (o el 40% del total si hay 1 solo).
  const bloomMs = sorted.length >= 2
    ? sorted[1].timeSeconds * 1000
    : Math.round(totalMs * 0.4)
  // Drain empieza en el último step; pour termina justo antes.
  const pourEndMs = sorted.length >= 3
    ? sorted[sorted.length - 1].timeSeconds * 1000
    : Math.round(totalMs * 0.85)
  return { bloomMs, pourEndMs, totalMs }
})

const running = ref(false)
const elapsed = ref(0)
let rafId: number | null = null
let startedAt = 0

const phase = computed<'bloom' | 'pour' | 'drain'>(() => {
  if (elapsed.value < phases.value.bloomMs) return 'bloom'
  if (elapsed.value < phases.value.pourEndMs) return 'pour'
  return 'drain'
})

// Label de fase — si la receta trae description en el step activo, la usamos;
// si no, cae a copy editorial genérica.
const phaseLabel = computed(() => {
  const steps = state.recipe?.steps
  if (steps && steps.length > 0) {
    const sorted = [...steps].sort((a, b) => a.timeSeconds - b.timeSeconds)
    const active = sorted.filter(s => s.timeSeconds * 1000 <= elapsed.value).pop()
    if (active?.description) return active.description
    if (active?.title) return active.title
  }
  if (phase.value === 'bloom') return 'humedece el grano'
  if (phase.value === 'pour') return 'vierte en espiral desde el centro'
  return 'deja drenar sin tocar'
})

const mm = computed(() => Math.floor(elapsed.value / 1000 / 60).toString().padStart(2, '0'))
const ss = computed(() => Math.floor((elapsed.value / 1000) % 60).toString().padStart(2, '0'))

// Tiempo restante de la fase actual.
const remaining = computed(() => {
  const p = phases.value
  const end = phase.value === 'bloom' ? p.bloomMs : phase.value === 'pour' ? p.pourEndMs : p.totalMs
  const r = Math.max(0, Math.floor((end - elapsed.value) / 1000))
  const m = Math.floor(r / 60)
  const s = r % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

// Anchos relativos derivados de las duraciones reales de cada fase.
const segments = computed(() => {
  const p = phases.value
  return [
    { key: 'bloom', flex: Math.max(0.5, p.bloomMs / 1000) },
    { key: 'pour', flex: Math.max(0.5, (p.pourEndMs - p.bloomMs) / 1000) },
    { key: 'drain', flex: Math.max(0.5, (p.totalMs - p.pourEndMs) / 1000) },
  ] as const
})

function isActive(key: string) { return phase.value === key }

function tick() {
  elapsed.value = performance.now() - startedAt
  tickTimer(elapsed.value)
  if (elapsed.value < phases.value.totalMs) {
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
        class="font-mono uppercase tracking-[0.2em] font-medium text-honey text-[9px]"
        aria-live="polite"
      >
        {{ phase.toUpperCase() }}
      </span>
      <span class="font-mono uppercase tracking-[0.16em] text-paper/25 text-[9px]">
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
      <div
        class="flex items-baseline leading-[0.88] tracking-[-0.04em]"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        :aria-label="`${mm} minutos ${ss} segundos`"
      >
        <span class="font-display text-paper text-[98px]">{{ mm }}</span>
        <span class="font-display text-honey text-[70px]">:</span>
        <span class="font-display text-paper text-[98px]">{{ ss }}</span>
      </div>

      <!-- Gradient hairline separador -->
      <div
        class="w-[1.5px] h-[34px] my-3 mb-3.5"
        style="background: linear-gradient(#e5b84b, transparent);"
      />

      <p class="font-display italic text-paper/35 text-center text-[17px]">
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
          class="font-mono uppercase tracking-[0.12em] text-[8px]"
          :class="isActive(seg.key) ? 'text-honey' : 'text-paper/28'"
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
        class="w-full py-3.5 rounded-[11px] bg-honey text-jungle font-sans font-semibold text-[13px]"
        @click="start"
      >
        Iniciar
      </button>
      <button
        v-else
        type="button"
        class="w-full py-3.5 rounded-[11px] border border-paper/30 text-paper font-mono uppercase tracking-[0.25em] text-[11px] hover:border-paper transition-colors"
        @click="finish"
      >
        Terminar
      </button>
    </div>
  </section>
</template>
