<script setup lang="ts">
import type { RoasterInput } from '~/types'

const store = useRoastersStore()
const router = useRouter()

async function onSubmit(data: Partial<RoasterInput>) {
  try {
    await store.create(data as RoasterInput)
    router.push('/roasters')
  } catch {
    // error is handled by the store
  }
}
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Nuevo Tostador">
      <NuxtLink to="/roasters">
        <Button variant="ghost">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <div v-if="store.error" class="max-w-2xl mx-auto p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
      {{ store.error }}
    </div>

    <RoasterForm
      :loading="store.loading"
      @submit="onSubmit"
      @cancel="router.push('/roasters')"
    />
  </div>
</template>
