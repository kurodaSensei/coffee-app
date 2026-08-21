import { computed, reactive, readonly, watch } from 'vue'
import type { BrewMethod, Coffee, Recipe } from '~/types'

/**
 * Sesión del Vertido — vive en memoria durante el flow y auto-persiste
 * a sessionStorage para sobrevivir a interrupciones (Casey scenario:
 * tap notif → vuelve → sigue donde iba).
 *
 * Composable de instancia compartida (no useState) — el flow es
 * unitario: solo puede haber UN Vertido activo a la vez.
 *
 * ponytail: persistimos IDs (coffeeId, recipeId), no los objetos
 * completos. Al restaurar, se re-hidratan desde los stores. Recetas
 * "std:*" (sintéticas del StageRecipe) no se persisten — el user
 * las reelige, es rápido.
 */

export type VertidoStage =
  | 'coffee'
  | 'method'
  | 'recipe'
  | 'adjust'
  | 'pour'
  | 'close'

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

// ─────────────────────────────────────────────────────────────────────────────
// Persistencia — sessionStorage con IDs, no objetos completos
// ─────────────────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'sorbo:vertido:draft'
const DRAFT_TTL_MS = 15 * 60 * 1000 // 15 min

interface DraftSnapshot {
  stage: VertidoStage
  coffeeId: string | null
  method: BrewMethod | null
  recipeId: string | null
  doseGrams: number | null
  waterGrams: number | null
  elapsedMs: number
  outcome: VertidoOutcomeAction | null
  savedAt: number
}

function isMeaningful(): boolean {
  // Solo persistimos si el user avanzó del stage inicial o eligió algo.
  return state.stage !== 'coffee'
    || state.coffee !== null
    || state.method !== null
}

function saveDraft() {
  if (typeof window === 'undefined') return
  try {
    if (!isMeaningful()) {
      window.sessionStorage.removeItem(DRAFT_KEY)
      return
    }
    const snap: DraftSnapshot = {
      stage: state.stage,
      coffeeId: state.coffee?.id ?? null,
      method: state.method,
      // No persistimos recetas std:* (sintéticas, no existen en la
      // colección). Se re-eligen al restaurar.
      recipeId: state.recipe?.id && !state.recipe.id.startsWith('std:')
        ? state.recipe.id
        : null,
      doseGrams: state.doseGrams,
      waterGrams: state.waterGrams,
      elapsedMs: state.elapsedMs,
      outcome: state.outcome,
      savedAt: Date.now(),
    }
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(snap))
  }
  catch { /* quota / disabled */ }
}

function clearDraft() {
  if (typeof window === 'undefined') return
  try { window.sessionStorage.removeItem(DRAFT_KEY) }
  catch { /* ignore */ }
}

/**
 * Restaura desde sessionStorage si hay draft válido (<15min).
 * Devuelve true si hubo restauración — el shell puede mostrar un
 * hint sutil "borrador restaurado".
 *
 * Necesita stores hidratados: pasa fetch functions para lookup por ID.
 */
async function restoreDraft(opts: {
  fetchCoffee: (id: string) => Promise<Coffee | null>
  fetchRecipe: (id: string) => Promise<Recipe | null>
}): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return false
    const d = JSON.parse(raw) as DraftSnapshot
    if (!d || Date.now() - d.savedAt > DRAFT_TTL_MS) {
      clearDraft()
      return false
    }
    state.stage = d.stage
    state.method = d.method
    state.doseGrams = d.doseGrams
    state.waterGrams = d.waterGrams
    state.elapsedMs = d.elapsedMs
    state.outcome = d.outcome
    // Re-hydrate objetos vía lookup. Si el café/receta fue borrado del
    // otro lado, cae a null — no bloqueamos la restauración.
    if (d.coffeeId) {
      try { state.coffee = await opts.fetchCoffee(d.coffeeId) }
      catch { state.coffee = null }
    }
    if (d.recipeId) {
      try { state.recipe = await opts.fetchRecipe(d.recipeId) }
      catch { state.recipe = null }
    }
    return true
  }
  catch {
    return false
  }
}

// Watch superficial — cualquier cambio en state dispara save.
// Sin debounce: el ritmo humano en un flow ceremonial (segundos entre
// taps) hace despreciable el costo de escribir.
watch(
  () => ({
    stage: state.stage,
    coffeeId: state.coffee?.id,
    method: state.method,
    recipeId: state.recipe?.id,
    doseGrams: state.doseGrams,
    waterGrams: state.waterGrams,
    elapsedMs: state.elapsedMs,
    outcome: state.outcome,
  }),
  saveDraft,
  { deep: false },
)

// ─────────────────────────────────────────────────────────────────────────────

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
  clearDraft()
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
const hasDraft = computed(() => isMeaningful())

export function useVertidoSession() {
  return {
    state: readonly(state),
    stageIndex,
    progress,
    hasDraft,

    reset,
    restoreDraft,
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
