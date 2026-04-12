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

const stats = computed(() => computeStats(coffeesStore.list, tastingsStore.list))
const hasData = computed(() => coffeesStore.list.length > 0 || tastingsStore.list.length > 0)
const isLoading = computed(() => coffeesStore.loading || tastingsStore.loading)
</script>

<template>
  <div>
    <LayoutHeader title="Dashboard" subtitle="Resumen de tu experiencia cafetera" />

    <!-- Loading -->
    <div v-if="isLoading" class="mt-12 flex flex-col items-center justify-center py-16">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 text-sm text-muted-foreground">Cargando datos...</p>
    </div>

    <template v-else>
      <!-- Quick actions (always shown) -->
      <div class="mb-6">
        <DashboardQuickActions />
      </div>

      <!-- Welcome state (no data) -->
      <Card v-if="!hasData" class="max-w-lg mx-auto border-dashed">
        <CardContent class="flex flex-col items-center text-center py-12 px-6">
          <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Icon name="lucide:coffee" class="w-10 h-10 text-primary" />
          </div>
          <h2 class="text-xl font-bold text-foreground">Bienvenido a Coffee Tracker</h2>
          <p class="mt-2 text-muted-foreground max-w-sm">
            Empieza registrando tu primer café para ver estadísticas, tendencias y recomendaciones.
          </p>
        </CardContent>
      </Card>

      <!-- Dashboard content (has data) -->
      <template v-else>
        <DashboardStats :stats="stats" />

        <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <DashboardRecent :tastings="tastingsStore.recent" />
            <DashboardFavorites :tastings="tastingsStore.list" />
          </div>
          <div class="space-y-6">
            <DashboardFriends />
            <DashboardPreferences :stats="stats" />
          </div>
        </div>
      </template>

      <!-- Friends widget (also when no data) -->
      <div v-if="!hasData" class="mt-6 max-w-lg mx-auto">
        <DashboardFriends />
      </div>
    </template>
  </div>
</template>
