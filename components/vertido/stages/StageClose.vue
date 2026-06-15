<script setup lang="ts">
import StageFrame from '../StageFrame.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { VertidoOutcomeAction } from '~/composables/useVertidoSession'

const { state, setOutcome, reset } = useVertidoSession()
const router = useRouter()

// Fase 3+ persistirá el RitualOutcome y alimentará el algoritmo.
async function choose(action: VertidoOutcomeAction) {
  setOutcome(action)
  const coffeeId = state.coffee?.id
  // Snapshot antes de resetear.
  reset()
  if (action === 'tasting' && coffeeId) {
    await router.push(`/app/tastings/new?coffeeId=${coffeeId}`)
  }
  else if (action === 'note' && coffeeId) {
    // TODO Fase 5: nota rápida sin abrir wizard completo.
    await router.push(`/app/tastings/new?coffeeId=${coffeeId}&quick=1`)
  }
  else {
    await router.push('/app')
  }
}
</script>

<template>
  <StageFrame stamp="cup" eyebrow="Listo" headline="¿Cómo quedó?">
    <p class="font-display italic text-paper/70 mb-8">
      Cierra el ritual como prefieras.
    </p>

    <div class="space-y-3">
      <button
        type="button"
        class="w-full text-left p-5 rounded-2xl border border-honey/40 hover:border-honey hover:bg-honey/5 transition-colors"
        @click="choose('tasting')"
      >
        <p class="font-display italic text-paper text-[22px]">
          Catarlo en detalle
        </p>
        <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60 mt-2">
          abrir wizard de cata
        </p>
      </button>

      <button
        type="button"
        class="w-full text-left p-5 rounded-2xl border border-paper/20 hover:border-paper/50 transition-colors"
        @click="choose('note')"
      >
        <p class="font-display italic text-paper text-[22px]">
          Solo una nota rápida
        </p>
        <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60 mt-2">
          score + comentario corto
        </p>
      </button>

      <button
        type="button"
        class="w-full text-left p-5 rounded-2xl border border-paper/30 hover:border-paper/60 transition-colors"
        @click="choose('discard')"
      >
        <p class="font-display italic text-paper/70 text-[22px]">
          Descartar
        </p>
        <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40 mt-2">
          no guardar nada
        </p>
      </button>
    </div>
  </StageFrame>
</template>
