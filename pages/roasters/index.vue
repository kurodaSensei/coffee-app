<script setup lang="ts">
const store = useRoastersStore()

const search = ref('')

onMounted(() => {
  store.loadAll()
})

const filteredRoasters = computed(() => {
  if (!search.value) return store.list
  const query = search.value.toLowerCase()
  return store.list.filter((r) =>
    r.name.toLowerCase().includes(query),
  )
})
</script>

<template>
  <div>
    <LayoutPageHeader title="Tostadores">
      <template #actions>
        <NuxtLink to="/roasters/new">
          <UiButton>
            <Icon name="heroicons:plus" class="w-5 h-5 mr-1" />
            Agregar
          </UiButton>
        </NuxtLink>
      </template>
    </LayoutPageHeader>

    <div class="mb-6">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar tostador..."
      />
    </div>

    <!-- Loading state -->
    <div v-if="store.loading" class="flex items-center justify-center py-12">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 text-coffee-400 animate-spin" />
    </div>

    <!-- Error state -->
    <div v-else-if="store.error" class="text-center py-12">
      <p class="text-red-600">{{ store.error }}</p>
      <UiButton variant="secondary" class="mt-4" @click="store.loadAll()">
        Reintentar
      </UiButton>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredRoasters.length === 0" class="text-center py-12">
      <Icon name="heroicons:building-storefront" class="w-12 h-12 text-coffee-300 mx-auto mb-4" />
      <p v-if="search" class="text-coffee-500">
        No se encontraron tostadores para "{{ search }}"
      </p>
      <template v-else>
        <p class="text-coffee-500 mb-4">
          Aun no tienes tostadores registrados
        </p>
        <NuxtLink to="/roasters/new">
          <UiButton>Agregar tostador</UiButton>
        </NuxtLink>
      </template>
    </div>

    <!-- Roasters grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RoasterRoasterCard
        v-for="roaster in filteredRoasters"
        :key="roaster.id"
        :roaster="roaster"
      />
    </div>
  </div>
</template>
