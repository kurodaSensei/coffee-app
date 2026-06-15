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

definePageMeta({ layout: false })

const { state, next, back, reset, stageIndex } = useVertidoSession()
const router = useRouter()

reset()

// ─── Transition controller ────────────────────────────────────────────
const transitioning = ref(false)
const tapPoint = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const STAGE_DURATION = 600

function onAdvance(origin: { x: number; y: number }) {
  tapPoint.value = origin
  transitioning.value = true
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

// ─── Particles solo en stage Pour, durante la fase pour real ──────────
// (StagePour expone su fase via defineExpose; aquí no podemos verlo
//  directamente, así que prendemos las partículas para todo el stage
//  pour. StagePour CSS las restringe visualmente al área del timer.)
const particlesActive = computed(() => state.stage === 'pour')

// ─── El stage CIERRE es paper claro: invertimos el header ─────────────
const isPaperStage = computed(() => state.stage === 'close')
const exitColorClass = computed(() =>
  isPaperStage.value
    ? 'text-moss/60 hover:text-moss'
    : 'text-paper/70 hover:text-paper',
)
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-jungle">
    <VertidoBackground :stage="state.stage" />
    <VertidoParticles :active="particlesActive" />
    <VertidoTransition
      :show="transitioning"
      :origin="tapPoint"
      :duration="STAGE_DURATION"
      @done="onTransitionDone"
    />

    <!-- Top bar: solo back/exit. Sin progress dots — el color de fondo
         cuenta el avance (principio "el fondo es el tiempo") -->
    <header class="relative z-20 flex items-center px-6 py-5">
      <button
        type="button"
        class="font-mono uppercase tracking-[0.25em] transition-colors"
        :class="exitColorClass"
        style="font-size: 10px;"
        @click="goBack"
      >
        ← {{ stageIndex === 0 ? 'salir' : 'atrás' }}
      </button>
    </header>

    <!-- Stage content: contenedor 480x900 estilo phone-frame del rediseño.
         En desktop se ensancha (queda como TODO de Fase 3) — por ahora
         columna centrada que mantiene la lectura mobile-first. -->
    <main class="relative z-10 pb-md">
      <div
        class="mx-auto max-w-[480px] lg:max-w-[640px] w-full"
        style="min-height: calc(100vh - 80px);"
      >
        <Transition name="stage" mode="out-in">
          <StageCoffee v-if="state.stage === 'coffee'" key="coffee" @advance="onAdvance" />
          <StageMethod v-else-if="state.stage === 'method'" key="method" @advance="onAdvance" />
          <StageRecipe v-else-if="state.stage === 'recipe'" key="recipe" @advance="onAdvance" />
          <StageAdjust v-else-if="state.stage === 'adjust'" key="adjust" @advance="onAdvance" />
          <StagePour v-else-if="state.stage === 'pour'" key="pour" @advance="onAdvance" />
          <StageClose v-else-if="state.stage === 'close'" key="close" />
        </Transition>
      </div>
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
