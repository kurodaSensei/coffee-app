<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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

const { state, next, back, reset, stageIndex, restoreDraft } = useVertidoSession()
const router = useRouter()
const { fetchById: fetchCoffeeById } = useCoffees()
const { fetchById: fetchRecipeById } = useRecipes()

// ─── Restauración de draft — Casey scenario ──────────────────────────
// Si vuelves después de una interrupción (tab switch, notif, refresh)
// y hay draft <15min, retomamos donde ibas. Mostramos un hint sutil
// arriba con la opción "empezar de cero".
const restored = ref(false)

function discardDraft() {
  reset()
  restored.value = false
}

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

// ─── Keyboard nav — Alex ──────────────────────────────────────────────
// Esc = atrás (o salir si estamos en el primer stage). Attached a window
// para funcionar en cold load — el shell no recibe focus por sí solo.
// Ignoramos cuando el user está escribiendo: Esc en input tiene
// semántica nativa (limpiar/blur) y no debemos secuestrarla.
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  const t = e.target as HTMLElement | null
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  e.preventDefault()
  goBack()
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  restored.value = await restoreDraft({
    fetchCoffee: fetchCoffeeById,
    fetchRecipe: fetchRecipeById,
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

// Particles solo en pour
const particlesActive = computed(() => state.stage === 'pour')

// CIERRE es paper claro: invertimos el header
const isPaperStage = computed(() => state.stage === 'close')
const exitColorClass = computed(() =>
  isPaperStage.value
    ? 'text-moss/60 hover:text-moss'
    : 'text-paper/70 hover:text-paper',
)
const restoreHintClass = computed(() =>
  isPaperStage.value
    ? 'bg-moss/10 text-moss'
    : 'bg-paper/10 text-paper',
)
</script>

<template>
  <!-- Flex column con svh: el chrome fluye naturalmente y sobrevive al
       URL-bar collapse de mobile Safari. pb en main respeta safe-area
       inset del home indicator (iPhone standalone PWA). -->
  <div class="relative flex min-h-[100svh] flex-col overflow-x-hidden bg-jungle">
    <VertidoBackground :stage="state.stage" />
    <VertidoParticles :active="particlesActive" />
    <VertidoTransition
      :show="transitioning"
      :origin="tapPoint"
      :duration="STAGE_DURATION"
      @done="onTransitionDone"
    />

    <!-- Top bar: back/exit sin dots. El fondo es el progreso.
         Chrome mono unificado a 10px/0.2em — la jerarquía la hace el color,
         no un 1px de diferencia. -->
    <header class="relative z-20 flex flex-shrink-0 items-center justify-between px-6 py-5">
      <button
        type="button"
        class="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
        :class="exitColorClass"
        @click="goBack"
      >
        ← {{ stageIndex === 0 ? 'salir' : 'atrás' }}
      </button>
      <span
        class="font-mono text-[10px] uppercase tracking-[0.2em] hidden sm:inline"
        :class="isPaperStage ? 'text-moss/35' : 'text-paper/35'"
      >
        Esc para volver
      </span>
    </header>

    <!-- Restauración hint (solo cuando se restaura draft) -->
    <div
      v-if="restored"
      class="relative z-20 mx-auto flex-shrink-0 w-full max-w-[480px] px-6 lg:max-w-[640px]"
      role="status"
      aria-live="polite"
    >
      <div
        class="flex items-center justify-between gap-md rounded-full px-4 py-2"
        :class="restoreHintClass"
      >
        <!-- Display italic a 13px: DM Serif Display necesita ≥12px para
             leerse como serif de personalidad, no como serif genérico. -->
        <span class="font-display italic text-[13px] leading-none">Continuas donde ibas.</span>
        <button
          type="button"
          class="font-mono uppercase tracking-[0.2em] text-[10px] opacity-65 hover:opacity-100 transition-opacity"
          @click="discardDraft"
        >
          empezar de cero
        </button>
      </div>
    </div>

    <main class="relative z-10 flex flex-1 flex-col pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div class="mx-auto flex w-full max-w-[480px] flex-1 flex-col lg:max-w-[640px]">
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
