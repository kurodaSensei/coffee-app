<script setup lang="ts">
import { computed } from 'vue'
import StageHeader from '../StageHeader.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { VertidoOutcomeAction } from '~/composables/useVertidoSession'
import { coffeeToProfile } from '~/utils/coffeeProfile'
import type { RitualOutcomeInput, RitualSatisfaction } from '~/types'

/**
 * CIERRE — la inversión cromática.
 * Toda la pantalla salta a paper, los textos a moss. Es el único stage
 * del Vertido donde el fondo es claro: el "umbral cruzado" se siente
 * en la piel sin requerir animación elaborada.
 */

const { state, setOutcome, reset } = useVertidoSession()
const outcomes = useRitualOutcomesStore()
const toast = useToast()
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

const SATISFACTION_MAP: Record<VertidoOutcomeAction, RitualSatisfaction> = {
  tasting: 'great',
  note:    'good',
  discard: 'discard',
}

async function persistOutcome(action: VertidoOutcomeAction): Promise<boolean> {
  const dose = state.doseGrams
  const water = state.waterGrams
  if (!state.method || !dose || !water) return false
  const payload: RitualOutcomeInput = {
    brewMethod: state.method,
    dose,
    water,
    ratio: water / dose,
    totalMs: state.elapsedMs || 0,
    coffeeId: state.coffee?.id,
    recipeId: state.recipe?.id && !state.recipe.id.startsWith('std:')
      ? state.recipe.id
      : undefined,
    coffeeProfileSnapshot: coffeeToProfile(state.coffee as any),
    satisfaction: SATISFACTION_MAP[action],
    contributesToCommunity: false,
  }
  const id = await outcomes.create(payload)
  return !!id
}

async function choose(action: VertidoOutcomeAction) {
  setOutcome(action)
  // Ahora awaited — necesitamos saber si guardó para dar feedback al
  // usuario si falla. Fase 4 depende de esta telemetría; perder writes
  // silently envenena el algoritmo de Affinity Score.
  const coffeeId = state.coffee?.id
  const saved = await persistOutcome(action)
  reset()
  if (!saved && action !== 'discard') {
    toast.warning('No pudimos guardar el resumen del vertido', 'Puedes seguir; se reintentará más tarde.')
  }
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
        <p class="font-display text-moss leading-none tracking-[-0.02em] text-[26px]">
          {{ state.coffee?.name || 'Tu vertido' }}
        </p>
        <p class="font-mono text-[9px] uppercase tracking-[0.1em] text-olive/55 mt-1.5">
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
            <p class="font-sans font-semibold text-[13px]">Cata completa</p>
            <p class="font-sans text-[10px] text-paper/45 mt-0.5">Registro detallado</p>
          </div>
          <span class="text-[14px] text-paper/35">→</span>
        </button>

        <button
          type="button"
          class="p-3.5 rounded-[12px] bg-moss/[0.08] text-moss flex justify-between items-center hover:bg-moss/15 transition-colors"
          @click="choose('note')"
        >
          <div class="text-left">
            <p class="font-sans font-medium text-[13px]">Nota rápida</p>
            <p class="font-sans text-[10px] text-moss/40 mt-0.5">Una línea, qué sentiste</p>
          </div>
          <span class="text-[14px] text-moss/25">→</span>
        </button>

        <button
          type="button"
          class="px-3.5 py-3 text-center hover:text-moss/55 transition-colors"
          @click="choose('discard')"
        >
          <p class="font-sans text-[12px] text-moss/30">Descartar sesión</p>
        </button>
      </div>
    </div>
  </section>
</template>
