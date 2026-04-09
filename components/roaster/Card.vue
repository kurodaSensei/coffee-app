<script setup lang="ts">
import type { Roaster } from '~/types'

defineProps<{
  roaster: Roaster
}>()
</script>

<template>
  <NuxtLink :to="`/roasters/${roaster.id}`" class="block group">
    <Card class="h-full cursor-pointer border hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <CardHeader class="pb-2">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <CardTitle class="text-base truncate group-hover:text-primary transition-colors">
              {{ roaster.name }}
            </CardTitle>
            <CardDescription class="flex items-center gap-1 mt-1">
              <Icon name="lucide:map-pin" class="w-3.5 h-3.5 shrink-0" />
              <span class="truncate">
                <span v-if="roaster.city">{{ roaster.city }}, </span>{{ roaster.country }}
              </span>
            </CardDescription>
          </div>
          <Badge v-if="roaster.rating" variant="secondary" class="shrink-0 tabular-nums">
            {{ roaster.rating }}/5
          </Badge>
        </div>
      </CardHeader>

      <CardContent v-if="roaster.website" class="pt-0">
        <a
          :href="roaster.website"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          @click.stop
        >
          <Icon name="lucide:globe" class="w-4 h-4" />
          Sitio web
        </a>
      </CardContent>
    </Card>
  </NuxtLink>
</template>
