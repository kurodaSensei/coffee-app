<script setup lang="ts">
import { computed, ref } from 'vue'
import Stamp from '../Stamp.vue'
import StageHeader from '../StageHeader.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { BrewMethod } from '~/types'

const { state, setMethod } = useVertidoSession()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

const METHOD_LABEL: Record<BrewMethod, string> = {
  v60: 'V60',
  kalita: 'Kalita',
  chemex: 'Chemex',
  aeropress: 'AeroPress',
  french_press: 'Prensa francesa',
  origami: 'Origami',
  suiren: 'Suiren',
  espresso: 'Espresso',
  moka_pot: 'Moka',
  phin: 'Phin',
  cold_brew: 'Cold brew',
  other: 'Otro',
}

// Guía italic corta y evocadora por método — invita a experimentar.
const METHOD_NOTE: Record<BrewMethod, string> = {
  v60:          'limpia y elegante, ideal para café lavado',
  chemex:       'filtro grueso, taza limpia y dulce',
  aeropress:    'extracción rápida, cuerpo medio',
  french_press: 'cuerpo pleno, aceites en la superficie',
  kalita:       'extracción pareja, fondo plano',
  origami:      'control de flujo según el papel',
  suiren:       'elegante, contemplativo',
  espresso:     'concentrado, intenso',
  moka_pot:     'tradicional, fuerte y nostálgico',
  phin:         'vietnamita, denso y dulce',
  cold_brew:    'frío, dulce, baja acidez',
  other:        'tu método, tus reglas',
}

// Orden visual de las pills — los de pour-over primero, luego inmersión,
// luego espresso family, luego otros. Más útil que orden alfabético.
const METHOD_ORDER: BrewMethod[] = [
  'v60', 'chemex', 'kalita', 'origami', 'suiren',
  'aeropress', 'french_press',
  'espresso', 'moka_pot',
  'phin', 'cold_brew', 'other',
]

// Stub de sugerencia — Fase 3 (Affinity Score) lo reemplazará.
const suggested: BrewMethod = 'v60'

// Estado local: cuál se muestra como gigante. Default = sugerido.
const current = ref<BrewMethod>(state.method ?? suggested)

const isSuggestedCurrent = computed(() => current.value === suggested)
const note = computed(() => METHOD_NOTE[current.value])
const eyebrowLabel = computed(() =>
  isSuggestedCurrent.value ? '— te sugerimos' : '— experimentas',
)

function select(m: BrewMethod) {
  current.value = m
}

function confirm(e: MouseEvent) {
  setMethod(current.value)
  emit('advance', { x: e.clientX, y: e.clientY })
}
</script>

<template>
  <section class="relative flex flex-col h-full">
    <StageHeader :n="2" label="MÉTODO" />

    <!-- Sello del embudo, off-axis, esquina superior derecha -->
    <Stamp
      name="method"
      :size="120"
      class="absolute top-16 right-4 text-paper pointer-events-none"
      style="opacity: 0.18; transform: rotate(6deg);"
    />

    <!-- Centro: el gigante 68px -->
    <div class="flex-1 flex flex-col justify-center items-center text-center px-md">
      <span
        class="font-mono uppercase tracking-[0.2em] mb-3 transition-colors"
        :class="isSuggestedCurrent ? 'text-honey/65' : 'text-paper/40'"
        style="font-size: 9px;"
      >
        {{ eyebrowLabel }}
      </span>

      <h2
        class="font-display text-paper leading-[0.88] tracking-[-0.03em] mb-4"
        style="font-size: 68px;"
      >
        {{ METHOD_LABEL[current] }}
      </h2>

      <p
        class="font-display italic text-paper/45 leading-[1.4] max-w-[260px] mb-7 transition-opacity"
        style="font-size: 14px;"
      >
        {{ note }}
      </p>

      <!-- Todos los métodos. Sugerido lleva dot honey discreto.
           Activo lleva fondo honey suave. -->
      <div class="flex gap-2 flex-wrap justify-center max-w-[400px]">
        <button
          v-for="m in METHOD_ORDER"
          :key="m"
          type="button"
          class="px-3 py-1.5 rounded-full border font-sans font-medium transition-colors inline-flex items-center gap-1.5"
          :class="current === m
            ? 'border-honey bg-honey/10 text-honey'
            : 'border-paper/15 text-paper/55 bg-paper/[0.02] hover:text-paper hover:border-paper/35'"
          style="font-size: 10px;"
          @click="select(m)"
        >
          <span
            v-if="m === suggested && current !== m"
            class="inline-block w-1 h-1 rounded-full bg-honey"
            aria-hidden="true"
          />
          {{ METHOD_LABEL[m] }}
        </button>
      </div>
    </div>

    <div class="px-md pb-md pt-sm">
      <button
        type="button"
        class="w-full py-3.5 rounded-[11px] bg-honey text-jungle font-sans font-semibold"
        style="font-size: 13px;"
        @click="confirm"
      >
        Elegir {{ METHOD_LABEL[current] }}
      </button>
    </div>
  </section>
</template>
