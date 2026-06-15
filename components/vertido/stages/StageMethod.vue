<script setup lang="ts">
import StageFrame from '../StageFrame.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { BrewMethod } from '~/types'

const { state, setMethod } = useVertidoSession()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

const METHODS: { value: BrewMethod; label: string }[] = [
  { value: 'v60', label: 'V60' },
  { value: 'chemex', label: 'Chemex' },
  { value: 'aeropress', label: 'AeroPress' },
  { value: 'french_press', label: 'Prensa francesa' },
  { value: 'kalita', label: 'Kalita' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'moka_pot', label: 'Moka' },
  { value: 'cold_brew', label: 'Cold brew' },
]

// Stub de recomendación — Fase 3 implementa Affinity Score real.
const suggested: BrewMethod = 'v60'

function pick(m: BrewMethod, e: MouseEvent) {
  setMethod(m)
  emit('advance', { x: e.clientX, y: e.clientY })
}
</script>

<template>
  <StageFrame
    stamp="method"
    eyebrow="Sugerencia para este café"
    :headline="state.coffee ? `Para tu ${state.coffee.name}` : '¿Cómo lo preparas?'"
  >
    <p class="font-display italic text-paper/70 mb-6">
      Te proponemos un método. Cámbialo si prefieres otro.
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="m in METHODS"
        :key="m.value"
        type="button"
        class="px-4 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all"
        :class="[
          state.method === m.value
            ? 'bg-honey text-jungle'
            : m.value === suggested
              ? 'border border-honey text-honey'
              : 'border border-paper/20 text-paper/70 hover:border-paper/50 hover:text-paper',
        ]"
        @click="pick(m.value, $event)"
      >
        {{ m.label }}
        <span v-if="m.value === suggested && state.method !== m.value" class="ml-1 opacity-60">·</span>
      </button>
    </div>
  </StageFrame>
</template>
