<script setup lang="ts">
import type { Coffee } from '~/types'

defineProps<{
  coffee: Coffee
}>()

const router = useRouter()

function navigateToDetail(id: string) {
  router.push(`/coffees/${id}`)
}
</script>

<template>
  <div
    class="card cursor-pointer hover:shadow-md hover:border-coffee-200 transition-all duration-200"
    @click="navigateToDetail(coffee.id)"
  >
    <div class="flex gap-4">
      <!-- Thumbnail -->
      <div
        v-if="coffee.photoUrl"
        class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-coffee-100"
      >
        <img
          :src="coffee.photoUrl"
          :alt="coffee.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        v-else
        class="flex-shrink-0 w-16 h-16 rounded-lg bg-coffee-100 flex items-center justify-center"
      >
        <Icon name="heroicons:beaker" class="w-7 h-7 text-coffee-400" />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-coffee-900 truncate">
          {{ coffee.name }}
        </h3>
        <p class="text-sm text-coffee-600 truncate">
          {{ coffee.roasterName }}
        </p>
        <div class="flex items-center gap-2 mt-1 flex-wrap">
          <span class="text-xs text-coffee-500">
            {{ coffee.variety }}
          </span>
          <span class="text-coffee-300">&#183;</span>
          <span class="text-xs text-coffee-500">
            {{ coffee.originRegion }}, {{ coffee.originCountry }}
          </span>
        </div>
      </div>

      <!-- Price -->
      <div v-if="coffee.price" class="flex-shrink-0 text-right">
        <span class="text-sm font-medium text-coffee-700">
          {{ formatPrice(coffee.price) }}
        </span>
      </div>
    </div>

    <!-- Bottom row: process badge + flavor notes -->
    <div class="mt-3 flex items-center gap-2 flex-wrap">
      <UiBadge color="blue" size="sm">
        {{ getProcessLabel(coffee.process) }}
      </UiBadge>
      <UiBadge
        v-for="note in coffee.flavorNotes.slice(0, 3)"
        :key="note"
        color="coffee"
        size="sm"
      >
        {{ note }}
      </UiBadge>
      <span
        v-if="coffee.flavorNotes.length > 3"
        class="text-xs text-coffee-400"
      >
        +{{ coffee.flavorNotes.length - 3 }}
      </span>
    </div>
  </div>
</template>
