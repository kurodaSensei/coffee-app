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
    <LayoutHeader title="Nuevo Café">
      <NuxtLink to="/coffees">
        <Button variant="ghost">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <CoffeeForm
      :loading="submitting"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </div>
</template>
