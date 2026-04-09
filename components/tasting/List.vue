<script setup lang="ts">
import type { Tasting } from '~/types'

defineProps<{
  tastings: Tasting[]
}>()
</script>

<template>
  <div v-if="tastings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <TastingCard
      v-for="tasting in tastings"
      :key="tasting.id"
      :tasting="tasting"
    />
  </div>

  <div v-else class="flex flex-col items-center justify-center py-16 text-center">
    <div class="rounded-full bg-muted p-4 mb-4">
      <Icon name="lucide:star" class="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 class="text-lg font-semibold">No hay degustaciones</h3>
    <p class="mt-1 text-sm text-muted-foreground max-w-sm">
      Agrega tu primera degustacion para comenzar a registrar tus experiencias.
    </p>
    <NuxtLink to="/tastings/new" class="mt-4">
      <Button variant="outline" size="sm">
        <Icon name="lucide:plus" class="w-4 h-4 mr-1.5" />
        Nueva degustacion
      </Button>
    </NuxtLink>
  </div>
</template>
