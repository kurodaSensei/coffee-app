<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Stamp from '../Stamp.vue'
import StageHeader from '../StageHeader.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { Recipe, RecipeStep } from '~/types'

const { state, setRecipe } = useVertidoSession()
const recipesStore = useRecipesStore()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

onMounted(() => {
  if ((recipesStore.list as Recipe[]).length === 0) {
    recipesStore.loadAll().catch(() => {})
  }
})

// Pick top match: por método. Fase 3 = Affinity Score.
const top = computed<Recipe | null>(() => {
  const list = recipesStore.list as Recipe[]
  const matched = list.filter(r => !state.method || r.brewMethod === state.method)
  return matched[0] ?? list[0] ?? null
})

const steps = computed<RecipeStep[]>(() => top.value?.steps?.slice(0, 4) ?? [])

function mmss(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function confirm(e: MouseEvent) {
  if (top.value) setRecipe(top.value)
  emit('advance', { x: e.clientX, y: e.clientY })
}

function skipRecipe(e: MouseEvent) {
  setRecipe(null)
  emit('advance', { x: e.clientX, y: e.clientY })
}

const dose = computed(() => top.value?.dose ?? 18)
const water = computed(() => top.value?.water ?? 300)
const temp = computed(() => top.value?.waterTemp ?? 93)
</script>

<template>
  <section class="relative flex flex-col h-full">
    <StageHeader :n="3" label="RECETA" />

    <!-- Sello firma flotando arriba izquierda -->
    <Stamp
      name="recipe"
      :size="130"
      class="absolute top-20 -left-3 text-paper pointer-events-none"
      style="opacity: 0.13; transform: rotate(-10deg);"
    />

    <div class="flex-1 px-md flex flex-col overflow-hidden">
      <h2
        class="font-display text-paper leading-[0.95] tracking-[-0.02em] mb-4"
        style="font-size: 30px;"
      >
        La <em class="italic text-honey">{{ top?.name?.split(' ')[0] || 'Clásica' }}</em><br>
        de la casa
      </h2>

      <!-- Bloque 3 números en mono -->
      <div class="grid grid-cols-3 gap-1 mb-4 p-3 rounded-[11px] bg-paper/5">
        <div class="text-center">
          <p class="font-mono uppercase text-paper/35 mb-0.5" style="font-size: 7px; letter-spacing: 0.12em;">
            CAFÉ
          </p>
          <p class="font-mono font-medium text-paper leading-none" style="font-size: 25px;">
            {{ dose }}<span class="text-paper/40" style="font-size: 11px;">g</span>
          </p>
        </div>
        <div class="text-center">
          <p class="font-mono uppercase text-paper/35 mb-0.5" style="font-size: 7px; letter-spacing: 0.12em;">
            AGUA
          </p>
          <p class="font-mono font-medium text-paper leading-none" style="font-size: 25px;">
            {{ water }}<span class="text-paper/40" style="font-size: 11px;">ml</span>
          </p>
        </div>
        <div class="text-center">
          <p class="font-mono uppercase text-paper/35 mb-0.5" style="font-size: 7px; letter-spacing: 0.12em;">
            TEMP
          </p>
          <p class="font-mono font-medium text-paper leading-none" style="font-size: 25px;">
            {{ temp }}<span class="text-paper/40" style="font-size: 11px;">°</span>
          </p>
        </div>
      </div>

      <p class="font-mono uppercase text-paper/30 mb-2" style="font-size: 7px; letter-spacing: 0.15em;">
        — PASOS
      </p>

      <div v-if="steps.length > 0" class="flex flex-col">
        <div
          v-for="(st, i) in steps"
          :key="i"
          class="flex gap-2.5 items-start py-1.5 border-t"
          :class="i === 0 ? 'border-paper/15' : 'border-paper/[0.06]'"
        >
          <span
            class="font-mono min-w-[36px] mt-px"
            :class="i === 0 ? 'text-honey' : 'text-paper/30'"
            style="font-size: 9px;"
          >
            {{ mmss(st.timeSeconds) }}
          </span>
          <div>
            <p
              class="font-sans font-medium"
              :class="i === 0 ? 'text-paper' : 'text-paper/60'"
              style="font-size: 12px;"
            >
              {{ st.title }}
            </p>
            <p v-if="st.description" class="font-mono text-paper/30 mt-0.5" style="font-size: 9px;">
              {{ st.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-md pb-md pt-sm space-y-2">
      <button
        type="button"
        class="w-full py-3.5 rounded-[11px] bg-honey text-jungle font-sans font-semibold flex items-center justify-center gap-2"
        style="font-size: 13px;"
        @click="confirm"
      >
        <span class="w-[5px] h-[5px] rounded-[1px] bg-jungle inline-block" />
        Iniciar
      </button>
      <button
        type="button"
        class="w-full py-2 font-mono uppercase text-paper/40 hover:text-paper/70 transition-colors"
        style="font-size: 10px; letter-spacing: 0.2em;"
        @click="skipRecipe"
      >
        sin receta
      </button>
    </div>
  </section>
</template>
