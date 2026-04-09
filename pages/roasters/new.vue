<script setup lang="ts">
const store = useRoastersStore()
const router = useRouter()

async function onSubmit(data: Record<string, any>) {
  try {
    await store.create(data as any)
    router.push('/roasters')
  } catch {
    // error is handled by the store
  }
}
</script>

<template>
  <div>
    <LayoutPageHeader title="Nuevo Tostador">
      <template #actions>
        <NuxtLink to="/roasters">
          <UiButton variant="ghost">
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-1" />
            Volver
          </UiButton>
        </NuxtLink>
      </template>
    </LayoutPageHeader>

    <div v-if="store.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      {{ store.error }}
    </div>

    <UiCard>
      <RoasterRoasterForm
        :loading="store.loading"
        @submit="onSubmit"
        @cancel="router.push('/roasters')"
      />
    </UiCard>
  </div>
</template>
