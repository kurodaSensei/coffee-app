<script setup lang="ts">
interface Props {
  stats: {
    totalCoffees: number
    totalTastings: number
    favorites: number
    avgRating: number
  }
}

const props = defineProps<Props>()

const cards = computed(() => [
  {
    icon: 'lucide:coffee',
    value: props.stats.totalCoffees,
    label: 'Cafés registrados',
    accent: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: 'lucide:clipboard-list',
    value: props.stats.totalTastings,
    label: 'Degustaciones',
    accent: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: 'lucide:heart',
    value: props.stats.favorites,
    label: 'Favoritos',
    accent: 'bg-rose-500/10 text-rose-600',
  },
  {
    icon: 'lucide:star',
    value: props.stats.avgRating,
    label: 'Rating promedio',
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <Card v-for="stat in cards" :key="stat.label" class="border-border/60 shadow-sm hover:shadow transition-shadow">
      <CardContent class="p-4">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">{{ stat.label }}</p>
            <p class="text-3xl font-bold tracking-tight tabular-nums mt-1">{{ stat.value }}</p>
          </div>
          <div :class="['rounded-lg p-2', stat.accent]">
            <Icon :name="stat.icon" class="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
