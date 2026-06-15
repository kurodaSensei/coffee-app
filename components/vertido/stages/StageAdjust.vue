<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StageFrame from '../StageFrame.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'

const { state, setDose } = useVertidoSession()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

// Si no hay receta, valores por defecto razonables.
onMounted(() => {
  if (state.doseGrams == null) setDose(15)
})

const ratioLabel = computed(() => {
  if (!state.doseGrams || !state.waterGrams) return ''
  const r = state.waterGrams / state.doseGrams
  return `1:${r.toFixed(1)}`
})

function confirm(e: MouseEvent) {
  emit('advance', { x: e.clientX, y: e.clientY })
}
</script>

<template>
  <StageFrame stamp="adjust" eyebrow="Calibra" headline="Ajusta la dosis">
    <p class="font-display italic text-paper/70 mb-8">
      El agua se recalcula manteniendo el ratio.
    </p>

    <div class="space-y-8">
      <div class="text-center">
        <p class="font-display text-paper text-[88px] leading-none">
          {{ state.doseGrams ?? 15 }}<span class="font-display italic text-[36px] text-paper/60">g</span>
        </p>
        <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mt-3">
          café molido
        </p>
      </div>

      <input
        :value="state.doseGrams ?? 15"
        type="range"
        min="8"
        max="40"
        step="0.5"
        class="block w-full accent-honey"
        @input="setDose(Number(($event.target as HTMLInputElement).value))"
      >

      <div class="flex items-center justify-between gap-4 pt-6 border-t border-paper/10">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">Agua</p>
          <p class="font-display text-paper text-[28px] mt-1">{{ state.waterGrams ?? '—' }}<span class="italic text-[16px] text-paper/60">g</span></p>
        </div>
        <div class="text-right">
          <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">Ratio</p>
          <p class="font-display text-paper text-[28px] mt-1">{{ ratioLabel || '—' }}</p>
        </div>
      </div>

      <button
        type="button"
        class="w-full mt-10 py-4 rounded-full bg-honey text-jungle font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-honey/90 transition-colors"
        @click="confirm"
      >
        Comenzar el vertido
      </button>
    </div>
  </StageFrame>
</template>
