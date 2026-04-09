<script setup lang="ts">
import type { Recipe } from '~/types'
import { getBrewMethodLabel, formatRatio } from '~/utils/formatters'

defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <div class="card cursor-pointer hover:shadow-md hover:border-coffee-200 transition-all duration-200 group">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-coffee-900 truncate group-hover:text-coffee-700 transition-colors">
          {{ recipe.name }}
        </h3>
      </div>
      <Badge size="sm" color="blue">
        {{ getBrewMethodLabel(recipe.brewMethod) }}
      </Badge>
    </div>

    <div class="mt-3 grid grid-cols-3 gap-3">
      <div class="text-center">
        <p class="text-xs text-coffee-500">Dosis</p>
        <p class="text-sm font-medium text-coffee-800">{{ recipe.dose }}g</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-coffee-500">Agua</p>
        <p class="text-sm font-medium text-coffee-800">{{ recipe.water }}ml</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-coffee-500">Ratio</p>
        <p class="text-sm font-medium text-coffee-800">
          {{ recipe.ratio || formatRatio(recipe.dose, recipe.water) }}
        </p>
      </div>
    </div>

    <div v-if="recipe.waterTemp || recipe.grindSize" class="mt-3 flex items-center gap-4 text-sm text-coffee-600">
      <span v-if="recipe.waterTemp" class="flex items-center gap-1">
        <Icon name="heroicons:fire" class="w-4 h-4 text-coffee-400" />
        {{ recipe.waterTemp }}&deg;C
      </span>
      <span v-if="recipe.grindSize" class="flex items-center gap-1">
        <Icon name="heroicons:adjustments-horizontal" class="w-4 h-4 text-coffee-400" />
        Molienda: {{ recipe.grindSize }}
      </span>
    </div>

    <div v-if="recipe.bestFor" class="mt-3 text-xs text-coffee-500">
      <Icon name="heroicons:star" class="w-3.5 h-3.5 inline-block mr-1" />
      {{ recipe.bestFor }}
    </div>
  </div>
</template>
