<script setup lang="ts">
import type { Tasting } from '~/types'
import { formatDate, getBrewMethodLabel } from '~/utils/formatters'

interface Props {
  tasting: Tasting
}

const props = defineProps<Props>()
const router = useRouter()

function navigateToDetail() {
  router.push(`/tastings/${props.tasting.id}`)
}
</script>

<template>
  <UiCard
    class="cursor-pointer hover:shadow-md transition-shadow duration-200 relative"
    @click="navigateToDetail"
  >
    <!-- Favorite heart -->
    <div
      v-if="tasting.isFavorite"
      class="absolute top-3 right-3 text-red-500"
    >
      <Icon name="heroicons:heart-solid" class="w-5 h-5" />
    </div>

    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-coffee-900 truncate">
          {{ tasting.coffeeName }}
        </h3>
        <p class="text-sm text-coffee-500 mt-0.5">
          {{ tasting.roasterName }}
        </p>
      </div>

      <!-- Rating prominent display -->
      <div class="flex-shrink-0 flex flex-col items-center">
        <span class="text-2xl font-bold text-coffee-800">
          {{ tasting.ratingOverall }}
        </span>
        <span class="text-xs text-coffee-400">/10</span>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-2 flex-wrap">
      <UiBadge color="coffee" size="sm">
        {{ getBrewMethodLabel(tasting.brewMethod) }}
      </UiBadge>

      <span class="text-sm text-coffee-400">
        {{ formatDate(tasting.brewDate) }}
      </span>
    </div>

    <div v-if="tasting.wouldBuyAgain" class="mt-2 flex items-center gap-1 text-green-600">
      <Icon name="heroicons:arrow-path" class="w-4 h-4" />
      <span class="text-xs font-medium">Compraría de nuevo</span>
    </div>
  </UiCard>
</template>
