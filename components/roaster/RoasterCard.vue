<script setup lang="ts">
import type { Roaster } from '~/types'

interface Props {
  roaster: Roaster
}

defineProps<Props>()
</script>

<template>
  <NuxtLink :to="`/roasters/${roaster.id}`" class="block">
    <UiCard class="hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div class="flex items-start justify-between">
        <div class="min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-coffee-900 truncate">
            {{ roaster.name }}
          </h3>
          <p class="mt-1 text-sm text-coffee-500">
            <Icon name="heroicons:map-pin" class="w-4 h-4 inline-block mr-1" />
            <span v-if="roaster.city">{{ roaster.city }}, </span>
            {{ roaster.country }}
          </p>
        </div>
        <UiRating
          v-if="roaster.rating"
          :model-value="roaster.rating"
          size="sm"
          readonly
        />
      </div>

      <div v-if="roaster.website" class="mt-3">
        <a
          :href="roaster.website"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm text-coffee-600 hover:text-coffee-800 transition-colors"
          @click.stop
        >
          <Icon name="heroicons:globe-alt" class="w-4 h-4" />
          Sitio web
        </a>
      </div>
    </UiCard>
  </NuxtLink>
</template>
