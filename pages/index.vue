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
  computeStats(coffeesStore.list, tastingsStore.list),
)

const hasData = computed(() =>
  coffeesStore.list.length > 0 || tastingsStore.list.length > 0,
)

const isLoading = computed(() =>
  coffeesStore.loading || tastingsStore.loading,
)
</script>

<template>
  <div>
    <LayoutHeader title="Dashboard" subtitle="Resumen de tu experiencia cafetera" />

    <!-- Loading -->
    <div v-if="isLoading" class="mt-12 flex flex-col items-center justify-center py-16">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 text-sm text-muted-foreground">Cargando datos...</p>
    </div>

    <!-- Welcome state (no data) -->
    <div v-else-if="!hasData" class="mt-8">
      <Card class="max-w-lg mx-auto border-dashed">
        <CardContent class="flex flex-col items-center text-center py-12 px-6">
          <div class="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
            <Icon name="lucide:coffee" class="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 class="text-xl font-bold text-foreground">
            Bienvenido a Coffee Tracker
          </h2>
          <p class="mt-2 text-muted-foreground max-w-sm">
            Empieza registrando tu primer cafe para ver estadisticas, tendencias y recomendaciones.
          </p>
          <div class="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <NuxtLink to="/coffees/new">
              <Button>
                <Icon name="lucide:plus" class="w-4 h-4" />
                Agregar cafe
              </Button>
            </NuxtLink>
            <NuxtLink to="/tastings/new">
              <Button variant="outline">
                <Icon name="lucide:clipboard-list" class="w-4 h-4" />
                Registrar degustacion
              </Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Dashboard content -->
    <template v-else>
      <div class="mt-6">
        <DashboardStats :stats="stats" />
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column -->
        <div class="lg:col-span-2 space-y-6">
          <DashboardRecent :tastings="tastingsStore.recent" />
          <DashboardFavorites :tastings="tastingsStore.list" />
        </div>

        <!-- Right column -->
        <div>
          <DashboardPreferences :stats="stats" />
        </div>
      </div>
    </template>
  </div>
</template>
