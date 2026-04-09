<script setup lang="ts">
import type { Tasting } from '~/types'

const props = defineProps<{
  tastings: Tasting[]
}>()

const favoriteTastings = computed(() =>
  props.tastings.filter((t) => t.isFavorite),
)
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center gap-2">
        <Icon name="lucide:heart" class="w-4 h-4 text-rose-500" />
        <CardTitle class="text-base">Cafes favoritos</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="favoriteTastings.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
        <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-3">
          <Icon name="lucide:heart" class="w-6 h-6 text-rose-400/60" />
        </div>
        <p class="text-sm text-muted-foreground">Aun no tienes favoritos.</p>
        <p class="text-xs text-muted-foreground mt-1">Marca una degustacion como favorita.</p>
      </div>

      <div v-else class="divide-y divide-border">
        <NuxtLink
          v-for="tasting in favoriteTastings"
          :key="tasting.id"
          :to="`/tastings/${tasting.id}`"
          class="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors duration-150"
        >
          <div class="flex-shrink-0 w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <Icon name="lucide:heart" class="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {{ tasting.coffeeName }}
            </h4>
            <p class="text-xs text-muted-foreground truncate mt-0.5">
              {{ tasting.roasterName }}
            </p>
          </div>

          <div class="flex-shrink-0 text-right">
            <span class="text-lg font-bold tabular-nums text-foreground">{{ tasting.ratingOverall }}</span>
            <span class="text-[10px] text-muted-foreground">/10</span>
          </div>
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
