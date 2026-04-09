<script setup lang="ts">
const coffeesStore = useCoffeesStore()
const router = useRouter()

const submitting = ref(false)

async function onSubmit(data: Record<string, any>) {
  submitting.value = true
  try {
    await coffeesStore.create(data as any)
    router.push('/coffees')
  } catch {
    // Error is handled by the store
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.back()
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Nuevo Cafe" />

    <div class="max-w-3xl">
      <UiCard>
        <CoffeeCoffeeForm
          :loading="submitting"
          @submit="onSubmit"
          @cancel="onCancel"
        />
      </UiCard>
    </div>
  </div>
</template>
