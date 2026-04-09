<script setup lang="ts">
import { BREW_METHOD_OPTIONS } from '~/utils/constants'

const tastingsStore = useTastingsStore()
const filterMethod = ref('')
const searchQuery = ref('')

onMounted(() => {
  tastingsStore.loadAll()
})

const filteredTastings = computed(() => {
  let result = tastingsStore.list
  if (filterMethod.value) {
    result = result.filter(t => t.brewMethod === filterMethod.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.coffeeName.toLowerCase().includes(q) ||
      t.roasterName.toLowerCase().includes(q)
    )
  }
  return result
})
</script>

<template>
  <div>
    <LayoutPageHeader title="Degustaciones" subtitle="Tu historial de catas">
      <NuxtLink to="/tastings/new" class="btn-primary inline-flex items-center gap-2">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Agregar
      </NuxtLink>
    </LayoutPageHeader>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <UiSearchInput
        v-model="searchQuery"
        placeholder="Buscar por café o tostador..."
        class="flex-1"
      />
      <select v-model="filterMethod" class="input-field sm:w-48">
        <option value="">Todos los métodos</option>
        <option v-for="opt in BREW_METHOD_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div v-if="tastingsStore.loading" class="text-center py-12 text-coffee-500">
      Cargando degustaciones...
    </div>

    <div v-else-if="filteredTastings.length === 0" class="text-center py-12">
      <Icon name="heroicons:star" class="w-12 h-12 text-coffee-300 mx-auto mb-3" />
      <p class="text-coffee-500">No hay degustaciones aún</p>
      <NuxtLink to="/tastings/new" class="text-coffee-800 font-medium hover:underline">
        Registra tu primera cata
      </NuxtLink>
    </div>

    <TastingTastingList v-else :tastings="filteredTastings" />
  </div>
</template>
