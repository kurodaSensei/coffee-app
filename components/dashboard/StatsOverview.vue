<script setup lang="ts">
interface StatCard {
  icon: string
  value: number | string
  label: string
  color: string
}

const props = defineProps<{
  totalCoffees: number
  totalTastings: number
  favorites: number
  avgRating: number
}>()

const stats = computed<StatCard[]>(() => [
  {
    icon: 'heroicons:beaker',
    value: props.totalCoffees,
    label: 'Cafes',
    color: 'bg-coffee-100 text-coffee-700',
  },
  {
    icon: 'heroicons:clipboard-document-list',
    value: props.totalTastings,
    label: 'Degustaciones',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: 'heroicons:heart',
    value: props.favorites,
    label: 'Favoritos',
    color: 'bg-red-100 text-red-700',
  },
  {
    icon: 'heroicons:star',
    value: props.avgRating,
    label: 'Rating promedio',
    color: 'bg-cream-100 text-yellow-700',
  },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="card"
    >
      <div class="flex items-center gap-3">
        <div :class="['rounded-lg p-2', stat.color]">
          <Icon :name="stat.icon" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-2xl font-bold text-coffee-900">{{ stat.value }}</p>
          <p class="text-xs text-coffee-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
