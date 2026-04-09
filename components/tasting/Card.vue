<script setup lang="ts">
import type { Tasting } from '~/types'
import { formatDate, getBrewMethodLabel } from '~/utils/formatters'

defineProps<{
  tasting: Tasting
}>()
</script>

<template>
  <NuxtLink :to="`/tastings/${tasting.id}`" class="block group">
    <Card class="h-full cursor-pointer border hover:shadow-md hover:border-primary/20 transition-all duration-200 relative overflow-hidden">
      <!-- Rating badge top-right -->
      <div class="absolute top-4 right-4 flex flex-col items-center">
        <span class="text-2xl font-bold tracking-tight leading-none">
          {{ tasting.ratingOverall }}
        </span>
        <span class="text-[10px] text-muted-foreground">/10</span>
      </div>

      <CardHeader class="pb-2 pr-16">
        <CardTitle class="text-base truncate group-hover:text-primary transition-colors">
          {{ tasting.coffeeName }}
        </CardTitle>
        <CardDescription class="truncate">
          {{ tasting.roasterName }}
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-2">
        <div class="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">
            {{ getBrewMethodLabel(tasting.brewMethod) }}
          </Badge>
          <span class="text-xs text-muted-foreground">
            {{ formatDate(tasting.brewDate) }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <Icon
            v-if="tasting.isFavorite"
            name="lucide:heart"
            class="w-4 h-4 text-red-500 fill-red-500"
          />
          <Icon
            v-if="tasting.wouldBuyAgain"
            name="lucide:refresh-cw"
            class="w-4 h-4 text-green-500"
          />
        </div>
      </CardContent>
    </Card>
  </NuxtLink>
</template>
