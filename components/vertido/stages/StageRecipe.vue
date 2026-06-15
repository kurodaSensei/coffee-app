<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Stamp from '../Stamp.vue'
import StageHeader from '../StageHeader.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { BrewMethod, Recipe, RecipeStep } from '~/types'

const { state, setRecipe } = useVertidoSession()
const recipesStore = useRecipesStore()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

onMounted(() => {
  if ((recipesStore.list as Recipe[]).length === 0) {
    recipesStore.loadAll().catch(() => {})
  }
})

// ─── Recetas estándar por método ─────────────────────────────────────
// Síntesis local — siempre disponible, sin Firestore. Cada una es una
// receta razonable de "industria" para que el usuario tenga un default
// confiable aunque no haya creado nada todavía.
interface StandardConfig {
  dose: number
  water: number
  temp: number
  totalSec: number
  steps: RecipeStep[]
}

const STANDARD: Record<BrewMethod, StandardConfig> = {
  v60: {
    dose: 18, water: 300, temp: 93, totalSec: 180,
    steps: [
      { timeSeconds: 0,  title: 'Bloom',      description: '36g — humedece y espera' },
      { timeSeconds: 45, title: 'Vertido 1',  description: 'hasta 150g en espiral' },
      { timeSeconds: 90, title: 'Vertido 2',  description: 'hasta 300g' },
    ],
  },
  chemex: {
    dose: 30, water: 500, temp: 96, totalSec: 240,
    steps: [
      { timeSeconds: 0,   title: 'Bloom',     description: '60g — humedece' },
      { timeSeconds: 45,  title: 'Vertido 1', description: 'hasta 250g' },
      { timeSeconds: 120, title: 'Vertido 2', description: 'hasta 500g' },
    ],
  },
  kalita: {
    dose: 22, water: 350, temp: 93, totalSec: 210,
    steps: [
      { timeSeconds: 0,  title: 'Bloom',     description: '44g — humedece' },
      { timeSeconds: 45, title: 'Vertidos',  description: 'pulsos de 80g hasta 350g' },
    ],
  },
  origami: {
    dose: 18, water: 300, temp: 93, totalSec: 180,
    steps: [
      { timeSeconds: 0,  title: 'Bloom',     description: '36g — humedece' },
      { timeSeconds: 45, title: 'Vertidos',  description: 'espiral hasta 300g' },
    ],
  },
  suiren: {
    dose: 15, water: 240, temp: 92, totalSec: 180,
    steps: [
      { timeSeconds: 0,  title: 'Bloom',     description: '30g — humedece' },
      { timeSeconds: 45, title: 'Vertidos',  description: 'lenta espiral hasta 240g' },
    ],
  },
  aeropress: {
    dose: 17, water: 250, temp: 85, totalSec: 120,
    steps: [
      { timeSeconds: 0,  title: 'Vierte',   description: 'todo el agua, agita' },
      { timeSeconds: 60, title: 'Reposo',   description: '30s con tapa' },
      { timeSeconds: 90, title: 'Presiona', description: 'presión constante 30s' },
    ],
  },
  french_press: {
    dose: 30, water: 500, temp: 95, totalSec: 240,
    steps: [
      { timeSeconds: 0,   title: 'Vierte', description: 'todo el agua, agita' },
      { timeSeconds: 240, title: 'Prensa', description: 'baja el émbolo lento' },
    ],
  },
  espresso: {
    dose: 18, water: 36, temp: 93, totalSec: 30,
    steps: [
      { timeSeconds: 0,  title: 'Pre-infusión', description: '5s suaves' },
      { timeSeconds: 5,  title: 'Extracción',   description: '25s, 36g en taza' },
    ],
  },
  moka_pot: {
    dose: 18, water: 200, temp: 100, totalSec: 240,
    steps: [
      { timeSeconds: 0,   title: 'Fuego medio', description: 'espera el gorgoteo' },
      { timeSeconds: 180, title: 'Apaga',       description: 'al primer borboteo fuerte' },
    ],
  },
  phin: {
    dose: 25, water: 120, temp: 95, totalSec: 270,
    steps: [
      { timeSeconds: 0,  title: 'Pre-humedece', description: '30g, espera 30s' },
      { timeSeconds: 30, title: 'Llena',        description: 'agua hasta el borde' },
    ],
  },
  cold_brew: {
    dose: 100, water: 1000, temp: 20, totalSec: 43200,
    steps: [
      { timeSeconds: 0,     title: 'Mezcla', description: 'café grueso + agua fría' },
      { timeSeconds: 43200, title: 'Filtra', description: 'después de 12 horas' },
    ],
  },
  other: {
    dose: 18, water: 300, temp: 93, totalSec: 180,
    steps: [
      { timeSeconds: 0, title: 'Bloom',    description: 'humedece' },
      { timeSeconds: 45, title: 'Vertido', description: 'tu método, tu pulso' },
    ],
  },
}

function makeStandardRecipe(method: BrewMethod): Recipe {
  const c = STANDARD[method]
  const ratio = `1:${Math.round(c.water / c.dose)}`
  return {
    id: `std:${method}`,
    name: 'La Estándar',
    brewMethod: method,
    dose: c.dose,
    water: c.water,
    waterTemp: c.temp,
    ratio,
    steps: c.steps,
    // Timestamps sintéticos — esta receta solo vive en sesión, jamás se persiste.
    createdAt: { toMillis: () => 0 } as any,
    updatedAt: { toMillis: () => 0 } as any,
  }
}

// ─── Opciones disponibles ────────────────────────────────────────────
const userRecipes = computed<Recipe[]>(() => {
  const list = recipesStore.list as Recipe[]
  if (!state.method) return list.slice(0, 5)
  return list.filter(r => r.brewMethod === state.method).slice(0, 5)
})

// Recomendada: el top match de las del usuario. Si no hay ninguna, null.
const recommended = computed<Recipe | null>(() => userRecipes.value[0] ?? null)

// Estándar: siempre disponible, sintética.
const standardRecipe = computed<Recipe>(() => makeStandardRecipe(state.method ?? 'v60'))

// Otras: las recetas restantes del usuario (sin la recomendada).
const otherUserRecipes = computed<Recipe[]>(() => {
  const all = userRecipes.value
  return recommended.value ? all.slice(1) : all
})

// Selección: por defecto, la recomendada si existe; si no, la estándar.
const selectedId = ref<string>(recommended.value?.id ?? standardRecipe.value.id)

const selected = computed<Recipe>(() => {
  if (selectedId.value === standardRecipe.value.id) return standardRecipe.value
  return userRecipes.value.find(r => r.id === selectedId.value) ?? standardRecipe.value
})

function pick(r: Recipe) {
  selectedId.value = r.id
}

function ratioOf(r: Recipe) {
  if (r.ratio) return r.ratio
  if (r.dose > 0) return `1:${Math.round(r.water / r.dose)}`
  return ''
}

function summary(r: Recipe) {
  return `${r.dose}g · ${r.water}ml${r.waterTemp ? ' · ' + r.waterTemp + '°' : ''}`
}

function confirm(e: MouseEvent) {
  setRecipe(selected.value)
  emit('advance', { x: e.clientX, y: e.clientY })
}

function skipRecipe(e: MouseEvent) {
  setRecipe(null)
  emit('advance', { x: e.clientX, y: e.clientY })
}
</script>

<template>
  <section class="relative flex flex-col h-full">
    <StageHeader :n="3" label="RECETA" />

    <Stamp
      name="recipe"
      :size="130"
      class="absolute top-20 -left-3 text-paper pointer-events-none"
      style="opacity: 0.13; transform: rotate(-10deg);"
    />

    <div class="flex-1 px-md flex flex-col overflow-y-auto">
      <h2
        class="font-display text-paper leading-[0.95] tracking-[-0.02em] mb-5 lg:text-[40px]"
        style="font-size: 32px;"
      >
        Elige tu <em class="italic text-honey">guía</em>
      </h2>

      <!-- Recomendada (si el usuario tiene recetas para este método) -->
      <button
        v-if="recommended"
        type="button"
        class="text-left p-4 rounded-[14px] border transition-colors mb-2.5"
        :class="selectedId === recommended.id
          ? 'bg-honey/10 border-honey/35'
          : 'bg-paper/5 border-paper/10 hover:border-paper/25'"
        @click="pick(recommended)"
      >
        <p
          class="font-mono uppercase tracking-[0.25em] mb-2"
          :class="selectedId === recommended.id ? 'text-honey' : 'text-honey/55'"
          style="font-size: 9px;"
        >
          — RECOMENDADA
        </p>
        <p class="font-display text-paper leading-[1.05] mb-1.5" style="font-size: 22px;">
          {{ recommended.name }}
        </p>
        <p class="font-mono text-paper/55" style="font-size: 11px; letter-spacing: 0.05em;">
          {{ summary(recommended) }} · {{ ratioOf(recommended) }}
        </p>
      </button>

      <!-- Estándar (siempre) -->
      <button
        type="button"
        class="text-left p-4 rounded-[14px] border transition-colors mb-2.5"
        :class="selectedId === standardRecipe.id
          ? 'bg-honey/10 border-honey/35'
          : 'bg-paper/5 border-paper/10 hover:border-paper/25'"
        @click="pick(standardRecipe)"
      >
        <p
          class="font-mono uppercase tracking-[0.25em] mb-2"
          :class="selectedId === standardRecipe.id ? 'text-honey' : 'text-paper/45'"
          style="font-size: 9px;"
        >
          — ESTÁNDAR
        </p>
        <p class="font-display text-paper leading-[1.05] mb-1.5" style="font-size: 22px;">
          {{ standardRecipe.name }}
        </p>
        <p class="font-mono text-paper/55" style="font-size: 11px; letter-spacing: 0.05em;">
          {{ summary(standardRecipe) }} · {{ ratioOf(standardRecipe) }}
        </p>
      </button>

      <!-- Otras del usuario, compactas -->
      <div v-if="otherUserRecipes.length > 0" class="mt-3">
        <p class="font-mono uppercase text-paper/35 mb-2" style="font-size: 9px; letter-spacing: 0.22em;">
          — otras tuyas
        </p>
        <button
          v-for="r in otherUserRecipes"
          :key="r.id"
          type="button"
          class="w-full text-left px-3.5 py-2.5 rounded-[12px] border transition-colors mb-1.5 flex items-baseline justify-between gap-3"
          :class="selectedId === r.id
            ? 'bg-honey/10 border-honey/35'
            : 'bg-paper/[0.03] border-paper/10 hover:border-paper/25'"
          @click="pick(r)"
        >
          <p class="font-display text-paper truncate" style="font-size: 16px;">
            {{ r.name }}
          </p>
          <p
            class="font-mono flex-shrink-0"
            :class="selectedId === r.id ? 'text-honey' : 'text-paper/40'"
            style="font-size: 10px; letter-spacing: 0.05em;"
          >
            {{ summary(r) }}
          </p>
        </button>
      </div>
    </div>

    <!-- Footer: CTA + escape "sin receta" -->
    <div class="px-md pb-md pt-sm space-y-2">
      <button
        type="button"
        class="w-full py-3.5 rounded-[11px] bg-honey text-jungle font-sans font-semibold flex items-center justify-center gap-2"
        style="font-size: 13px;"
        @click="confirm"
      >
        <span class="w-[5px] h-[5px] rounded-[1px] bg-jungle inline-block" />
        Iniciar {{ selected.name }}
      </button>
      <button
        type="button"
        class="w-full py-2 font-mono uppercase text-paper/40 hover:text-paper/70 transition-colors"
        style="font-size: 10px; letter-spacing: 0.2em;"
        @click="skipRecipe"
      >
        sin receta · ajuste libre
      </button>
    </div>
  </section>
</template>
