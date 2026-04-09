<script setup lang="ts">
import type { CoffeeProcess } from '~/types'

const coffeesStore = useCoffeesStore()
const router = useRouter()

interface Filters {
  search: string
  process: CoffeeProcess | ''
  variety: string
  region: string
}

const localFilters = ref<Filters>({
  search: '',
  process: '',
  variety: '',
  region: '',
})

onMounted(() => {
  coffeesStore.loadAll()
})

function onFiltersUpdate(filters: Filters) {
  localFilters.value = filters
}

const filteredCoffees = computed(() => {
  let results = coffeesStore.list

  const { search, process, variety, region } = localFilters.value

  if (search) {
    const term = search.toLowerCase()
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.roasterName.toLowerCase().includes(term) ||
        c.flavorNotes.some((n) => n.toLowerCase().includes(term))
    )
  }

  if (process) {
    results = results.filter((c) => c.process === process)
  }

  if (variety) {
    results = results.filter((c) => c.variety === variety)
  }

  if (region) {
    results = results.filter((c) => c.originRegion === region)
  }

  return results
})
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Cafes" subtitle="Tu coleccion de cafes de especialidad">
      <template #actions>
        <UiButton @click="router.push('/coffees/new')">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-1" />
          Agregar
        </UiButton>
      </template>
    </LayoutPageHeader>

    <CoffeeCoffeeFilters @update:filters="onFiltersUpdate" />

    <!-- Loading -->
    <div v-if="coffeesStore.loading" class="flex justify-center py-12">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 text-coffee-400 animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="coffeesStore.error" class="text-center py-12">
      <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p class="text-red-600">{{ coffeesStore.error }}</p>
      <UiButton variant="secondary" class="mt-4" @click="coffeesStore.loadAll()">
        Reintentar
      </UiButton>
    </div>

    <!-- List -->
    <CoffeeCoffeeList v-else :coffees="filteredCoffees" />
  </div>
</template>
