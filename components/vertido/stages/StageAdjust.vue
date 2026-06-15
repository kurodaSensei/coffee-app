<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StageHeader from '../StageHeader.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'

const { state, setDose } = useVertidoSession()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

onMounted(() => {
  if (state.doseGrams == null) setDose(18)
})

// Dosis entera y decimal separados para el render serif.
const doseWhole = computed(() => Math.floor(state.doseGrams ?? 18))
const doseDecimal = computed(() => {
  const d = (state.doseGrams ?? 18) - doseWhole.value
  return d.toFixed(1).slice(2) // "0" o "5"
})

const ratioLabel = computed(() => {
  if (!state.doseGrams || !state.waterGrams) return '—'
  return `1:${(state.waterGrams / state.doseGrams).toFixed(0)}`
})

// Posición del thumb del slider en porcentaje (10g..30g).
const sliderPct = computed(() => {
  const v = state.doseGrams ?? 18
  return Math.min(100, Math.max(0, ((v - 10) / 20) * 100))
})

function nudge(delta: number) {
  const next = Math.round(((state.doseGrams ?? 18) + delta) * 10) / 10
  setDose(Math.min(30, Math.max(10, next)))
}

function confirm(e: MouseEvent) {
  emit('advance', { x: e.clientX, y: e.clientY })
}
</script>

<template>
  <section class="relative flex flex-col h-full">
    <StageHeader :n="4" label="AJUSTE" />

    <div class="flex-1 flex flex-col justify-center items-center text-center px-md">
      <span
        class="font-mono uppercase tracking-[0.2em] text-honey/65 mb-3.5"
        style="font-size: 9px;"
      >
        — DOSIS
      </span>

      <!-- El gigante: dosis a 88px serif -->
      <div class="font-display text-paper flex items-baseline gap-[3px] leading-[0.85] tracking-[-0.04em]">
        <span style="font-size: 88px;">{{ doseWhole }}</span>
        <span class="text-paper/50" style="font-size: 36px;">
          .{{ doseDecimal }}<small style="font-size: 18px;">g</small>
        </span>
      </div>

      <!-- Agua calculada en mono honey -->
      <div class="mt-4 flex items-center gap-2">
        <span class="font-mono text-paper/30" style="font-size: 9px; letter-spacing: 0.06em;">
          → AGUA
        </span>
        <span class="font-mono font-medium text-honey" style="font-size: 26px;">
          {{ state.waterGrams ?? '—' }}<small class="opacity-65" style="font-size: 11px;">ml</small>
        </span>
        <span class="font-mono text-paper/25" style="font-size: 8px;">
          {{ ratioLabel }}
        </span>
      </div>

      <!-- Slider 1px susurrante -->
      <div class="w-full mt-8 relative">
        <div class="relative h-px bg-paper/12 rounded-[1px]">
          <div
            class="absolute left-0 top-0 bottom-0 bg-honey rounded-[1px]"
            :style="{ width: `${sliderPct}%` }"
          />
          <span
            class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-paper"
            :style="{
              left: `${sliderPct}%`,
              boxShadow: '0 0 0 3px rgba(229,184,75,0.27)',
            }"
          />
          <input
            type="range"
            min="10"
            max="30"
            step="0.5"
            :value="state.doseGrams ?? 18"
            class="absolute inset-0 opacity-0 cursor-pointer w-full"
            style="height: 32px; top: -16px;"
            @input="setDose(Number(($event.target as HTMLInputElement).value))"
          >
        </div>
        <div class="flex justify-between mt-2.5 font-mono text-paper/25" style="font-size: 8px;">
          <span>10g</span>
          <span>30g</span>
        </div>
      </div>

      <!-- Nudge buttons -->
      <div class="flex gap-[18px] mt-5 items-center">
        <button
          type="button"
          class="w-[34px] h-[34px] rounded-full border border-paper/12 text-paper/45 flex items-center justify-center hover:border-paper/40 hover:text-paper transition-colors"
          style="font-size: 17px;"
          @click="nudge(-0.5)"
        >
          −
        </button>
        <span class="font-mono text-paper/25" style="font-size: 9px; letter-spacing: 0.1em;">
          0.5g
        </span>
        <button
          type="button"
          class="w-[34px] h-[34px] rounded-full border border-paper/12 text-paper/45 flex items-center justify-center hover:border-paper/40 hover:text-paper transition-colors"
          style="font-size: 17px;"
          @click="nudge(0.5)"
        >
          +
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
        Confirmar
      </button>
    </div>
  </section>
</template>
