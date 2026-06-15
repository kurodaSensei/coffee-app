<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import VertidoBackground from '~/components/vertido/Background.vue'
import VertidoParticles from '~/components/vertido/Particles.vue'
import VertidoTransition from '~/components/vertido/Transition.vue'
import StageAdjust from '~/components/vertido/stages/StageAdjust.vue'
import StageClose from '~/components/vertido/stages/StageClose.vue'
import StageCoffee from '~/components/vertido/stages/StageCoffee.vue'
import StageMethod from '~/components/vertido/stages/StageMethod.vue'
import StagePour from '~/components/vertido/stages/StagePour.vue'
import StageRecipe from '~/components/vertido/stages/StageRecipe.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'

// Layout false: el Vertido es full-bleed, sin chrome de la app.
definePageMeta({ layout: false })

const { state, next, back, reset, STAGE_ORDER, stageIndex } = useVertidoSession()
const router = useRouter()

// Cada vez que se entra al Vertido empieza desde cero.
// (Si en el futuro queremos "resume" se cambia aquí.)
reset()

// ─── Transition controller ────────────────────────────────────────────
const transitioning = ref(false)
const tapPoint = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const STAGE_DURATION = 600

function onAdvance(origin: { x: number; y: number }) {
  tapPoint.value = origin
  transitioning.value = true
  // El cambio de stage ocurre cuando el wash llegó al 60% para que el
  // contenido nuevo aparezca dentro del flash, no después.
  setTimeout(() => next(), STAGE_DURATION * 0.5)
}

function onTransitionDone() {
  transitioning.value = false
}

function goBack() {
  if (stageIndex.value === 0) {
    router.push('/app')
    return
  }
  back()
}

onBeforeUnmount(() => reset())

// ─── Particles solo en stage Pour ─────────────────────────────────────
const particlesActive = computed(() => state.stage === 'pour')

// ─── Mini progress dots ───────────────────────────────────────────────
const dots = STAGE_ORDER
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <VertidoBackground :stage="state.stage" />
    <VertidoParticles :active="particlesActive" />
    <VertidoTransition
      :show="transitioning"
      :origin="tapPoint"
      :duration="STAGE_DURATION"
      @done="onTransitionDone"
    />

    <!-- ━━━ Top bar: back + progress dots ━━━ -->
    <header class="relative z-20 flex items-center justify-between px-6 py-5">
      <button
        type="button"
        class="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/70 hover:text-paper transition-colors"
        @click="goBack"
      >
        ← {{ stageIndex === 0 ? 'salir' : 'atrás' }}
      </button>

      <div class="flex items-center gap-1.5" aria-label="Progreso del ritual">
        <span
          v-for="(d, i) in dots"
          :key="d"
          class="block rounded-full transition-all duration-500"
          :class="[
            i === stageIndex ? 'w-6 h-1.5 bg-honey' : i < stageIndex ? 'w-1.5 h-1.5 bg-honey/60' : 'w-1.5 h-1.5 bg-paper/20',
          ]"
        />
      </div>

      <span class="w-12" />
    </header>

    <!-- ━━━ Stage content ━━━ -->
    <main class="relative z-10 pb-16">
      <Transition name="stage" mode="out-in">
        <StageCoffee v-if="state.stage === 'coffee'" key="coffee" @advance="onAdvance" />
        <StageMethod v-else-if="state.stage === 'method'" key="method" @advance="onAdvance" />
        <StageRecipe v-else-if="state.stage === 'recipe'" key="recipe" @advance="onAdvance" />
        <StageAdjust v-else-if="state.stage === 'adjust'" key="adjust" @advance="onAdvance" />
        <StagePour v-else-if="state.stage === 'pour'" key="pour" @advance="onAdvance" />
        <StageClose v-else-if="state.stage === 'close'" key="close" />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.stage-enter-active,
.stage-leave-active {
  transition: opacity 250ms ease, transform 250ms ease;
}
.stage-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.stage-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
