<script setup lang="ts">
import type { Recipe } from '~/types'

const recipesStore = useRecipesStore()
const router = useRouter()

async function onSubmit(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await recipesStore.create(data)
    router.push('/recipes')
  } catch {
    // error handled by store
  }
}

function onCancel() {
  router.push('/recipes')
}
</script>

<template>
  <div>
    <LayoutPageHeader title="Nueva receta" subtitle="Crea una nueva receta de preparacion" />

    <div class="mt-6 max-w-2xl">
      <UiCard>
        <RecipeRecipeForm
          :loading="recipesStore.loading"
          @submit="onSubmit"
          @cancel="onCancel"
        />
      </UiCard>
    </div>
  </div>
</template>
