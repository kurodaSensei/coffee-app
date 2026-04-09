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
  <div class="space-y-6">
    <LayoutHeader title="Nueva receta">
      <NuxtLink to="/recipes">
        <Button variant="ghost">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <RecipeForm
      :loading="recipesStore.loading"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </div>
</template>
