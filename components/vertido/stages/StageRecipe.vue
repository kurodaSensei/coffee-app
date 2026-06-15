<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StageFrame from '../StageFrame.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { Recipe } from '~/types'

const { state, setRecipe } = useVertidoSession()
const recipesStore = useRecipesStore()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

onMounted(() => {
  if ((recipesStore.list as Recipe[]).length === 0) {
    recipesStore.loadAll().catch(() => {})
  }
})

// Filtra por método elegido. Stub — Fase 3 añade score de afinidad.
const matched = computed<Recipe[]>(() => {
  const list = recipesStore.list as Recipe[]
  if (!state.method) return list.slice(0, 6)
  return list.filter(r => r.brewMethod === state.method).slice(0, 6)
})

function pick(r: Recipe | null, e: MouseEvent) {
  setRecipe(r)
  emit('advance', { x: e.clientX, y: e.clientY })
}
</script>

<template>
  <StageFrame stamp="recipe" eyebrow="Receta" headline="Elige una guía">
    <p v-if="matched.length > 0" class="font-display italic text-paper/70 mb-6">
      Estas recetas funcionan con el método que elegiste.
    </p>

    <ul v-if="matched.length > 0" class="space-y-1 mb-6">
      <li v-for="r in matched" :key="r.id">
        <button
          type="button"
          class="w-full text-left py-4 px-1 border-b border-paper/10 hover:border-honey/50 transition-colors"
          :class="state.recipe?.id === r.id ? 'border-honey' : ''"
          @click="pick(r, $event)"
        >
          <div class="flex items-baseline justify-between gap-4">
            <div class="min-w-0">
              <p class="font-display italic text-paper text-[20px] truncate">
                {{ r.name }}
              </p>
              <p class="font-mono text-[10px] uppercase tracking-widest text-paper/50 mt-1">
                {{ r.dose }}g · {{ r.water }}g
                <template v-if="r.ratio"> · {{ r.ratio }}</template>
              </p>
            </div>
          </div>
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="w-full text-left py-4 px-1 border-t border-paper/15"
      @click="pick(null, $event)"
    >
      <p class="font-display italic text-paper/80 text-[18px]">
        Prefiero ir sin receta
      </p>
      <p class="font-mono text-[10px] uppercase tracking-widest text-paper/50 mt-1">
        ajuste libre
      </p>
    </button>
  </StageFrame>
</template>
