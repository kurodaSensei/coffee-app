import { computed, reactive, readonly } from 'vue'
import type { BrewMethod, Coffee, Recipe } from '~/types'

/**
 * Sesión efímera del Vertido — vive solo en memoria mientras el usuario
 * recorre los stages. No persiste hasta que el stage de cierre dispara
 * la cata real (Fase 3+). Si el usuario abandona, se descarta.
 *
 * Composable de instancia compartida (no useState) — el flow es
 * unitario: solo puede haber UN Vertido activo a la vez.
 */

export type VertidoStage =
  | 'coffee'   // pick coffee
  | 'method'   // confirm/suggest method
  | 'recipe'   // pick recipe (matched or manual)
  | 'adjust'   // dose + ratio adjustment
  | 'pour'     // active timer
  | 'close'    // outcome + 3 actions

export type VertidoOutcomeAction = 'tasting' | 'note' | 'discard'

interface VertidoState {
  stage: VertidoStage
  coffee: Coffee | null
  method: BrewMethod | null
  recipe: Recipe | null
  doseGrams: number | null
  waterGrams: number | null
  startedAt: number | null
  /** ms transcurridos en el cronómetro. Se actualiza desde el stage Pour. */
  elapsedMs: number
  outcome: VertidoOutcomeAction | null
}

const STAGE_ORDER: VertidoStage[] = ['coffee', 'method', 'recipe', 'adjust', 'pour', 'close']

const state = reactive<VertidoState>({
  stage: 'coffee',
  coffee: null,
  method: null,
  recipe: null,
  doseGrams: null,
  waterGrams: null,
  startedAt: null,
  elapsedMs: 0,
  outcome: null,
})

function reset() {
  state.stage = 'coffee'
  state.coffee = null
  state.method = null
  state.recipe = null
  state.doseGrams = null
  state.waterGrams = null
  state.startedAt = null
  state.elapsedMs = 0
  state.outcome = null
}

function goTo(stage: VertidoStage) {
  state.stage = stage
}

function next() {
  const i = STAGE_ORDER.indexOf(state.stage)
  if (i < STAGE_ORDER.length - 1) state.stage = STAGE_ORDER[i + 1]
}

function back() {
  const i = STAGE_ORDER.indexOf(state.stage)
  if (i > 0) state.stage = STAGE_ORDER[i - 1]
}

function setCoffee(coffee: Coffee | null) {
  state.coffee = coffee
}
function setMethod(method: BrewMethod | null) {
  state.method = method
}
function setRecipe(recipe: Recipe | null) {
  state.recipe = recipe
  if (recipe) {
    if (state.doseGrams == null) state.doseGrams = recipe.dose
    if (state.waterGrams == null) state.waterGrams = recipe.water
  }
}
function setDose(grams: number) {
  state.doseGrams = grams
  // Recalcular agua manteniendo ratio si hay receta.
  if (state.recipe && state.recipe.dose > 0) {
    const ratio = state.recipe.water / state.recipe.dose
    state.waterGrams = Math.round(grams * ratio)
  }
}
function startTimer() {
  state.startedAt = performance.now()
  state.elapsedMs = 0
}
function tickTimer(elapsed: number) {
  state.elapsedMs = elapsed
}
function setOutcome(outcome: VertidoOutcomeAction) {
  state.outcome = outcome
}

const stageIndex = computed(() => STAGE_ORDER.indexOf(state.stage))
const progress = computed(() => stageIndex.value / (STAGE_ORDER.length - 1))

export function useVertidoSession() {
  return {
    state: readonly(state),
    stageIndex,
    progress,

    reset,
    goTo,
    next,
    back,

    setCoffee,
    setMethod,
    setRecipe,
    setDose,
    startTimer,
    tickTimer,
    setOutcome,

    STAGE_ORDER,
  }
}
