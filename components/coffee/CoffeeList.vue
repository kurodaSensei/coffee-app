<script setup lang="ts">
import type { Coffee } from '~/types'

defineProps<{
  coffees: Coffee[]
}>()
</script>

<template>
  <div v-if="coffees.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <CoffeeCard v-for="coffee in coffees" :key="coffee.id" :coffee="coffee" />
  </div>

  <div v-else class="text-center py-12">
    <Icon name="heroicons:beaker" class="w-12 h-12 text-coffee-300 mx-auto mb-3" />
    <h3 class="text-lg font-medium text-coffee-700">
      No hay cafes
    </h3>
    <p class="mt-1 text-sm text-coffee-500">
      Agrega tu primer cafe para comenzar a rastrear tu coleccion.
    </p>
  </div>
</template>
