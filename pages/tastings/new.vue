<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'

const tastingsStore = useTastingsStore()
const recipesStore = useRecipesStore()
const router = useRouter()
const loading = ref(false)

async function handleSubmit(data: Record<string, any>, saveAsRecipe?: boolean) {
  loading.value = true
  try {
    await tastingsStore.create({
      ...data,
      brewDate: Timestamp.fromDate(new Date(data.brewDate)),
    })
    // Also save as recipe if requested
    if (saveAsRecipe && data.recipeName && data.dose && data.water) {
      await recipesStore.create({
        name: data.recipeName,
        brewMethod: data.brewMethod,
        dose: data.dose,
        water: data.water,
        ratio: data.ratio,
        grindSize: data.grindSize,
        waterTemp: data.waterTemp,
      } as any)
    }
    router.push('/tastings')
  } catch (e) {
    console.error('Error creating tasting:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Nueva Degustación">
      <NuxtLink to="/tastings">
        <Button variant="ghost">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <TastingForm
      :loading="loading"
      @submit="handleSubmit"
      @cancel="router.push('/tastings')"
    />
  </div>
</template>
