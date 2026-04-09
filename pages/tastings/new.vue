<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'

const tastingsStore = useTastingsStore()
const router = useRouter()
const loading = ref(false)

async function handleSubmit(data: Record<string, any>) {
  loading.value = true
  try {
    await tastingsStore.create({
      ...data,
      brewDate: Timestamp.fromDate(new Date(data.brewDate)),
    })
    router.push('/tastings')
  } catch (e) {
    console.error('Error creating tasting:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <LayoutPageHeader title="Nueva Degustación" subtitle="Registra una nueva cata">
      <NuxtLink to="/tastings" class="btn-secondary inline-flex items-center gap-2">
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
        Volver
      </NuxtLink>
    </LayoutPageHeader>

    <TastingTastingForm
      :loading="loading"
      @submit="handleSubmit"
      @cancel="router.push('/tastings')"
    />
  </div>
</template>
