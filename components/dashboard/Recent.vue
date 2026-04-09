<script setup lang="ts">
import type { Tasting } from '~/types'
import { getBrewMethodLabel, formatDate } from '~/utils/formatters'

defineProps<{
  tastings: Tasting[]
}>()
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center gap-2">
        <Icon name="lucide:clock" class="w-4 h-4 text-muted-foreground" />
        <CardTitle class="text-base">Ultimas degustaciones</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="tastings.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
        <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Icon name="lucide:clipboard-list" class="w-6 h-6 text-muted-foreground/60" />
        </div>
        <p class="text-sm text-muted-foreground">Sin degustaciones aun.</p>
        <NuxtLink to="/tastings/new">
          <Button variant="link" size="sm" class="mt-1">Registra tu primera cata</Button>
        </NuxtLink>
      </div>

      <div v-else class="divide-y divide-border">
        <NuxtLink
          v-for="tasting in tastings"
          :key="tasting.id"
          :to="`/tastings/${tasting.id}`"
          class="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors duration-150"
        >
          <div class="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Icon name="lucide:coffee" class="w-4 h-4 text-primary" />
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {{ tasting.coffeeName }}
            </h4>
            <div class="flex items-center gap-1.5 mt-0.5">
              <Badge variant="outline" class="text-[10px] px-1.5 py-0 font-normal">
                {{ getBrewMethodLabel(tasting.brewMethod) }}
              </Badge>
              <span class="text-[11px] text-muted-foreground">
                {{ formatDate(tasting.brewDate) }}
              </span>
            </div>
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
