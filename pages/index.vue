<script setup lang="ts">
const coffeesStore = useCoffeesStore()
const tastingsStore = useTastingsStore()
const { computeStats } = useStats()

onMounted(async () => {
  await Promise.all([
    coffeesStore.loadAll(),
    tastingsStore.loadAll(),
    tastingsStore.loadRecent(5),
  ])
})

const stats = computed(() =>
  computeStats(coffeesStore.list, tastingsStore.list)
)

const hasData = computed(() =>
  coffeesStore.list.length > 0 || tastingsStore.list.length > 0
)

const isLoading = computed(() =>
  coffeesStore.loading || tastingsStore.loading
)
</script>

<template>
  <div>
    <LayoutPageHeader title="Dashboard" subtitle="Resumen de tu experiencia cafetera" />

    <div v-if="isLoading" class="mt-8 text-center text-coffee-500">
      Cargando...
    </div>

    <!-- Welcome message when no data -->
    <div v-else-if="!hasData" class="mt-8 text-center py-16">
      <div class="mx-auto w-20 h-20 rounded-full bg-coffee-100 flex items-center justify-center mb-6">
        <Icon name="heroicons:beaker" class="w-10 h-10 text-coffee-400" />
      </div>
      <h2 class="text-xl font-bold text-coffee-900">Bienvenido a Coffee Tracker</h2>
      <p class="mt-2 text-coffee-500 max-w-md mx-auto">
        Comienza agregando tus cafes y registrando tus degustaciones para ver estadisticas y tendencias.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink to="/coffees">
          <UiButton>
            <Icon name="heroicons:plus" class="w-5 h-5 mr-1" />
            Agregar cafe
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/tastings">
          <UiButton variant="secondary">
            <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 mr-1" />
            Registrar degustacion
          </UiButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Dashboard content -->
    <template v-else>
      <div class="mt-6">
        <DashboardStatsOverview
          :total-coffees="stats.totalCoffees"
          :total-tastings="stats.totalTastings"
          :favorites="stats.favorites"
          :avg-rating="stats.avgRating"
        />
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column: Recent tastings + Favorites -->
        <div class="lg:col-span-2 space-y-6">
          <DashboardRecentTastings :tastings="tastingsStore.recent" />
          <DashboardFavoriteCoffees :tastings="tastingsStore.list" />
        </div>

        <!-- Right column: Charts -->
        <div>
          <DashboardPreferencesChart
            :top-varieties="stats.topVarieties"
            :top-processes="stats.topProcesses"
            :top-brew-methods="stats.topBrewMethods"
          />
        </div>
      </div>
    </template>
  </div>
</template>
