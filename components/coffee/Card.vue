<script setup lang="ts">
import type { Coffee } from '~/types'
import { formatPrice, getProcessLabel } from '~/utils/formatters'

defineProps<{
  coffee: Coffee
}>()
</script>

<template>
  <NuxtLink :to="`/coffees/${coffee.id}`" class="block group">
    <Card class="h-full cursor-pointer border hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <CardHeader class="pb-2">
        <CardTitle class="text-base truncate group-hover:text-primary transition-colors">
          {{ coffee.name }}
        </CardTitle>
        <CardDescription class="truncate">
          {{ coffee.roasterName }}
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-3">
        <!-- Process & Origin -->
        <div class="flex items-center gap-2">
          <Badge variant="secondary">
            {{ getProcessLabel(coffee.process) }}
          </Badge>
          <span v-if="coffee.originRegion || coffee.originCountry" class="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="lucide:map-pin" class="w-3 h-3" />
            <span v-if="coffee.originRegion">{{ coffee.originRegion }}, </span>
            <span v-if="coffee.originCountry">{{ coffee.originCountry }}</span>
          </span>
        </div>

        <!-- Flavor notes -->
        <div v-if="coffee.flavorNotes?.length" class="flex items-center gap-1.5 flex-wrap">
          <Badge
            v-for="note in coffee.flavorNotes.slice(0, 3)"
            :key="note"
            variant="outline"
            class="text-xs"
          >
            {{ note }}
          </Badge>
          <span
            v-if="coffee.flavorNotes.length > 3"
            class="text-xs text-muted-foreground"
          >
            +{{ coffee.flavorNotes.length - 3 }} mas
          </span>
        </div>

        <!-- Price -->
        <p v-if="coffee.price" class="text-sm font-semibold">
          {{ formatPrice(coffee.price) }}
        </p>
      </CardContent>
    </Card>
  </NuxtLink>
</template>
