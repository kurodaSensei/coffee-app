<script setup lang="ts">
import type { Coffee } from '~/types'

defineProps<{
  coffees: Coffee[]
}>()
</script>

<template>
  <div v-if="coffees.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <CoffeeCard v-for="coffee in coffees" :key="coffee.id" :coffee="coffee" />
  </div>

  <div v-else class="flex flex-col items-center justify-center py-16 text-center">
    <div class="rounded-full bg-muted p-4 mb-4">
      <Icon name="lucide:coffee" class="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 class="text-lg font-semibold">No hay cafes</h3>
    <p class="mt-1 text-sm text-muted-foreground max-w-sm">
      Agrega tu primer cafe para comenzar a rastrear tu coleccion.
    </p>
    <NuxtLink to="/coffees/new" class="mt-4">
      <Button variant="outline" size="sm">
        <Icon name="lucide:plus" class="w-4 h-4 mr-1.5" />
        Nuevo cafe
      </Button>
    </NuxtLink>
  </div>
</template>
