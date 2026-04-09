<script setup lang="ts">
import type { Recipe } from '~/types'
import { getBrewMethodLabel, formatRatio } from '~/utils/formatters'

defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <Card class="h-full cursor-pointer border hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between gap-3">
        <CardTitle class="text-base truncate group-hover:text-primary transition-colors">
          {{ recipe.name }}
        </CardTitle>
        <Badge variant="secondary" class="shrink-0">
          {{ getBrewMethodLabel(recipe.brewMethod) }}
        </Badge>
      </div>
    </CardHeader>

    <CardContent class="space-y-3">
      <!-- Dose / Water / Ratio grid -->
      <div class="grid grid-cols-3 gap-2">
        <div class="text-center rounded-lg bg-muted/60 px-2 py-2">
          <p class="text-[11px] text-muted-foreground mb-0.5">Dosis</p>
          <p class="text-sm font-semibold">{{ recipe.dose }}g</p>
        </div>
        <div class="text-center rounded-lg bg-muted/60 px-2 py-2">
          <p class="text-[11px] text-muted-foreground mb-0.5">Agua</p>
          <p class="text-sm font-semibold">{{ recipe.water }}ml</p>
        </div>
        <div class="text-center rounded-lg bg-muted/60 px-2 py-2">
          <p class="text-[11px] text-muted-foreground mb-0.5">Ratio</p>
          <p class="text-sm font-semibold">
            {{ recipe.ratio || formatRatio(recipe.dose, recipe.water) }}
          </p>
        </div>
      </div>

      <!-- Temperature & Grind -->
      <div v-if="recipe.waterTemp || recipe.grindSize" class="flex items-center gap-4 text-sm text-muted-foreground">
        <span v-if="recipe.waterTemp" class="inline-flex items-center gap-1.5">
          <Icon name="lucide:thermometer" class="w-4 h-4" />
          {{ recipe.waterTemp }}&deg;C
        </span>
        <span v-if="recipe.grindSize" class="inline-flex items-center gap-1.5">
          <Icon name="lucide:settings-2" class="w-4 h-4" />
          Molienda: {{ recipe.grindSize }}
        </span>
      </div>

      <!-- Best for -->
      <div v-if="recipe.bestFor" class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon name="lucide:star" class="w-3.5 h-3.5" />
        {{ recipe.bestFor }}
      </div>
    </CardContent>
  </Card>
</template>
