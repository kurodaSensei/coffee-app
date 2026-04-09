<script setup lang="ts">
import type { Recipe } from '~/types'
import { getBrewMethodLabel, formatRatio } from '~/utils/formatters'

const recipesStore = useRecipesStore()
const router = useRouter()

const showDetailModal = ref(false)
const showEditMode = ref(false)
const selectedRecipe = ref<Recipe | null>(null)

onMounted(() => {
  recipesStore.loadAll()
})

function openDetail(recipe: Recipe) {
  selectedRecipe.value = recipe
  showEditMode.value = false
  showDetailModal.value = true
}

function startEdit() {
  showEditMode.value = true
}

async function onUpdate(data: Record<string, any>) {
  if (!selectedRecipe.value) return
  await recipesStore.update(selectedRecipe.value.id, data)
  showDetailModal.value = false
  selectedRecipe.value = null
}

async function onDelete() {
  if (!selectedRecipe.value || !confirm('¿Eliminar esta receta?')) return
  await recipesStore.remove(selectedRecipe.value.id)
  showDetailModal.value = false
  selectedRecipe.value = null
}
</script>

<template>
  <div>
    <LayoutPageHeader title="Recetas" subtitle="Tus recetas de preparación favoritas">
      <NuxtLink to="/recipes/new" class="btn-primary inline-flex items-center gap-2">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Agregar
      </NuxtLink>
    </LayoutPageHeader>

    <div v-if="recipesStore.loading" class="mt-8 text-center text-coffee-500">
      Cargando recetas...
    </div>

    <div v-else-if="recipesStore.list.length === 0" class="mt-8 text-center py-12">
      <Icon name="heroicons:beaker" class="w-12 h-12 text-coffee-300 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-coffee-800">No hay recetas aún</h3>
      <p class="mt-2 text-sm text-coffee-500">Agrega tu primera receta de preparación.</p>
      <NuxtLink to="/recipes/new" class="btn-primary inline-block mt-4">
        Crear receta
      </NuxtLink>
    </div>

    <div v-else class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="recipe in recipesStore.list" :key="recipe.id" @click="openDetail(recipe)" class="cursor-pointer">
        <RecipeRecipeCard :recipe="recipe" />
      </div>
    </div>

    <!-- Detail / Edit Modal -->
    <UiModal v-model="showDetailModal" :title="showEditMode ? 'Editar receta' : (selectedRecipe?.name || '')">
      <div v-if="selectedRecipe && !showEditMode" class="space-y-4">
        <div class="flex items-center gap-2">
          <UiBadge color="blue">{{ getBrewMethodLabel(selectedRecipe.brewMethod) }}</UiBadge>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="text-center bg-coffee-50 rounded-lg p-3">
            <p class="text-xs text-coffee-500">Dosis</p>
            <p class="text-lg font-semibold text-coffee-800">{{ selectedRecipe.dose }}g</p>
          </div>
          <div class="text-center bg-coffee-50 rounded-lg p-3">
            <p class="text-xs text-coffee-500">Agua</p>
            <p class="text-lg font-semibold text-coffee-800">{{ selectedRecipe.water }}ml</p>
          </div>
          <div class="text-center bg-coffee-50 rounded-lg p-3">
            <p class="text-xs text-coffee-500">Ratio</p>
            <p class="text-lg font-semibold text-coffee-800">
              {{ selectedRecipe.ratio || formatRatio(selectedRecipe.dose, selectedRecipe.water) }}
            </p>
          </div>
        </div>

        <div v-if="selectedRecipe.waterTemp || selectedRecipe.grindSize" class="flex gap-4 text-sm text-coffee-600">
          <span v-if="selectedRecipe.waterTemp">{{ selectedRecipe.waterTemp }}°C</span>
          <span v-if="selectedRecipe.grindSize">Molienda: {{ selectedRecipe.grindSize }}</span>
        </div>

        <div v-if="selectedRecipe.instructions" class="bg-coffee-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-coffee-700 mb-2">Instrucciones</h4>
          <p class="text-sm text-coffee-600 whitespace-pre-line">{{ selectedRecipe.instructions }}</p>
        </div>

        <div v-if="selectedRecipe.bestFor" class="text-sm text-coffee-600">
          <span class="font-medium text-coffee-700">Mejor para:</span> {{ selectedRecipe.bestFor }}
        </div>

        <div class="flex gap-2 pt-4 border-t border-coffee-100">
          <button @click="onDelete" class="btn-danger text-sm">Eliminar</button>
          <button @click="startEdit" class="btn-secondary text-sm">Editar</button>
        </div>
      </div>

      <div v-if="selectedRecipe && showEditMode">
        <RecipeRecipeForm
          :initial-data="selectedRecipe"
          :loading="recipesStore.loading"
          @submit="onUpdate"
          @cancel="showEditMode = false"
        />
      </div>
    </UiModal>
  </div>
</template>
