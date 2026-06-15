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

// Stub de sugerencia — Fase 3 (Affinity Score) lo reemplazará.
const suggested: BrewMethod = 'v60'

// Estado local: cuál se muestra como gigante. Default = sugerido.
const current = ref<BrewMethod>(state.method ?? suggested)

const alternates: BrewMethod[] = ['chemex', 'aeropress', 'moka_pot']

const note = computed(() => {
  if (current.value === 'v60') return 'funciona muy bien con este café lavado'
  if (current.value === 'chemex') return 'cuerpo limpio y elegante'
  if (current.value === 'aeropress') return 'extracción rápida y dulce'
  return 'método elegido'
})

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
        class="font-mono uppercase tracking-[0.2em] text-honey/55 mb-3"
        style="font-size: 9px;"
      >
        — te sugerimos
      </span>

      <h2
        class="font-display text-paper leading-[0.88] tracking-[-0.03em] mb-4"
        style="font-size: 68px;"
      >
        {{ METHOD_LABEL[current] }}
      </h2>

      <p
        class="font-display italic text-paper/45 leading-[1.4] max-w-[200px] mb-7"
        style="font-size: 14px;"
      >
        {{ note }}
      </p>

      <div class="flex gap-2.5 flex-wrap justify-center">
        <button
          v-for="m in alternates"
          :key="m"
          type="button"
          class="px-3 py-1.5 rounded-full border font-sans font-medium transition-colors"
          :class="current === m
            ? 'border-honey text-honey'
            : 'border-paper/20 text-paper/55 bg-paper/[0.02] hover:text-paper hover:border-paper/40'"
          style="font-size: 10px;"
          @click="select(m)"
        >
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
