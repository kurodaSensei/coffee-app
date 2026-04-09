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
