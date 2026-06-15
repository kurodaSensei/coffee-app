<script setup lang="ts">
import { computed } from 'vue'
import StageHeader from '../StageHeader.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { VertidoOutcomeAction } from '~/composables/useVertidoSession'

/**
 * CIERRE — la inversión cromática.
 * Toda la pantalla salta a paper, los textos a moss. Es el único stage
 * del Vertido donde el fondo es claro: el "umbral cruzado" se siente
 * en la piel sin requerir animación elaborada.
 */

const { state, setOutcome, reset } = useVertidoSession()
const router = useRouter()

const meta = computed(() => {
  const c = state.coffee
  const m = state.method?.toUpperCase().replace('_', ' ')
  const dose = state.doseGrams ? `${state.doseGrams}g` : null
  const time = state.elapsedMs
    ? `${Math.floor(state.elapsedMs / 60000)}:${Math.floor((state.elapsedMs / 1000) % 60).toString().padStart(2, '0')}`
    : null
  return [m, dose, time, c?.originCountry].filter(Boolean).join(' · ')
})

async function choose(action: VertidoOutcomeAction) {
  setOutcome(action)
  const coffeeId = state.coffee?.id
  reset()
  if (action === 'tasting' && coffeeId) {
    await router.push(`/app/tastings/new?coffeeId=${coffeeId}`)
  }
  else if (action === 'note' && coffeeId) {
    await router.push(`/app/tastings/new?coffeeId=${coffeeId}&quick=1`)
  }
  else {
    await router.push('/app')
  }
}
</script>

<template>
  <!-- Toda la pantalla en moss/paper — invertimos el chrome con tone="moss" -->
  <section class="relative flex flex-col h-full text-moss">
    <StageHeader :n="6" label="CIERRE" tone="moss" />

    <div class="flex-1 flex flex-col px-md pt-1.5 pb-md">
      <!-- Taza con vapor en honey, centrada arriba -->
      <div class="flex justify-center pt-3 pb-3.5">
        <svg width="52" height="60" viewBox="0 0 52 60" fill="none" aria-hidden="true">
          <path d="M16 28 C16 18,23 16,23 7" stroke="#556B3A" stroke-width="1.4" stroke-linecap="round" opacity=".35" />
          <path d="M26 26 C26 16,20 12,22 4" stroke="#556B3A" stroke-width="1.4" stroke-linecap="round" opacity=".25" />
          <path d="M36 28 C36 18,29 16,29 7" stroke="#556B3A" stroke-width="1.4" stroke-linecap="round" opacity=".35" />
          <path d="M8 33 Q8 45,26 47 Q44 45,44 33 Z" fill="#556B3A" opacity=".15" />
          <path d="M8 33 Q8 45,26 47 Q44 45,44 33" stroke="#556B3A" stroke-width="1.8" fill="none" />
          <path d="M8 33 L12 30 L40 30 L44 33" stroke="#556B3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <ellipse cx="26" cy="51" rx="19" ry="3.5" stroke="#556B3A" stroke-width="1.3" fill="none" opacity=".4" />
          <path d="M44 35 Q50 35,50 39 Q50 43,44 43" stroke="#556B3A" stroke-width="1.8" fill="none" stroke-linecap="round" />
        </svg>
      </div>

      <!-- Identidad de la sesión -->
      <div class="text-center mb-4">
        <p class="font-display text-moss leading-none tracking-[-0.02em]" style="font-size: 26px;">
          {{ state.coffee?.name || 'Tu vertido' }}
        </p>
        <p
          class="font-mono uppercase tracking-[0.1em] text-olive/55 mt-1.5"
          style="font-size: 9px;"
        >
          {{ meta || 'Cata cerrada' }}
        </p>
      </div>

      <div class="h-px bg-moss/10 mb-3.5" />

      <!-- 3 acciones con jerarquía: negro → ghost → texto fantasma -->
      <div class="flex flex-col gap-[7px] flex-1 justify-center">
        <button
          type="button"
          class="p-3.5 rounded-[12px] bg-moss text-paper flex justify-between items-center hover:bg-moss/90 transition-colors"
          @click="choose('tasting')"
        >
          <div class="text-left">
            <p class="font-sans font-semibold" style="font-size: 13px;">Cata completa</p>
            <p class="font-sans text-paper/45 mt-0.5" style="font-size: 10px;">Registro detallado</p>
          </div>
          <span class="text-paper/35" style="font-size: 14px;">→</span>
        </button>

        <button
          type="button"
          class="p-3.5 rounded-[12px] bg-moss/[0.08] text-moss flex justify-between items-center hover:bg-moss/15 transition-colors"
          @click="choose('note')"
        >
          <div class="text-left">
            <p class="font-sans font-medium" style="font-size: 13px;">Nota rápida</p>
            <p class="font-sans text-moss/40 mt-0.5" style="font-size: 10px;">Una línea, qué sentiste</p>
          </div>
          <span class="text-moss/25" style="font-size: 14px;">→</span>
        </button>

        <button
          type="button"
          class="px-3.5 py-3 text-center hover:text-moss/55 transition-colors"
          @click="choose('discard')"
        >
          <p class="font-sans text-moss/30" style="font-size: 12px;">Descartar sesión</p>
        </button>
      </div>
    </div>
  </section>
</template>
