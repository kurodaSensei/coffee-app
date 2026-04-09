<script setup lang="ts">
import type { Tasting } from '~/types'

interface Props {
  tastings: Tasting[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="tastings.length === 0" class="text-center py-12">
    <Icon name="heroicons:beaker" class="w-12 h-12 text-coffee-300 mx-auto" />
    <h3 class="mt-4 text-lg font-medium text-coffee-700">
      Sin degustaciones
    </h3>
    <p class="mt-2 text-sm text-coffee-400">
      Agrega tu primera degustación para comenzar a registrar tus experiencias.
    </p>
  </div>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <TastingCard
      v-for="tasting in tastings"
      :key="tasting.id"
      :tasting="tasting"
    />
  </div>
</template>
