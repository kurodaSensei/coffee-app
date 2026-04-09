<script setup lang="ts">
import type { Tasting } from '~/types'
import { getBrewMethodLabel, formatDate } from '~/utils/formatters'

defineProps<{
  tastings: Tasting[]
}>()

const router = useRouter()

function goToTasting(id: string) {
  router.push(`/tastings/${id}`)
}
</script>

<template>
  <Card title="Degustaciones recientes">
    <div v-if="tastings.length === 0" class="py-6 text-center text-sm text-coffee-400">
      Sin degustaciones aun.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="tasting in tastings"
        :key="tasting.id"
        class="flex items-center gap-3 p-3 rounded-lg bg-coffee-50 hover:bg-coffee-100 cursor-pointer transition-colors duration-150"
        @click="goToTasting(tasting.id)"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-coffee-200 flex items-center justify-center">
          <Icon name="heroicons:beaker" class="w-5 h-5 text-coffee-600" />
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-coffee-900 truncate">
            {{ tasting.coffeeName }}
          </h4>
          <p class="text-xs text-coffee-500 truncate">
            {{ tasting.roasterName }} &middot; {{ getBrewMethodLabel(tasting.brewMethod) }}
          </p>
        </div>

        <div class="flex-shrink-0 text-right">
          <div class="flex items-center gap-1">
            <Rating :model-value="tasting.ratingOverall" size="sm" readonly />
          </div>
          <p class="text-xs text-coffee-400 mt-0.5">
            {{ formatDate(tasting.brewDate) }}
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>
