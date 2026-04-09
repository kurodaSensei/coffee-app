<script setup lang="ts">
import type { Tasting } from '~/types'

const props = defineProps<{
  tasting: Tasting
}>()

interface RatingCategory {
  key: keyof Tasting
  label: string
}

const categories: RatingCategory[] = [
  { key: 'ratingOverall', label: 'General' },
  { key: 'ratingAroma', label: 'Aroma' },
  { key: 'ratingAcidity', label: 'Acidez' },
  { key: 'ratingSweetness', label: 'Dulzura' },
  { key: 'ratingBody', label: 'Cuerpo' },
  { key: 'ratingAftertaste', label: 'Postgusto' },
  { key: 'ratingBalance', label: 'Balance' },
]

const activeRatings = computed(() =>
  categories.filter((cat) => {
    const val = props.tasting[cat.key]
    return val !== undefined && val !== null
  })
)

function getRatingValue(key: keyof Tasting): number {
  return (props.tasting[key] as number) ?? 0
}

function getBarWidth(value: number): string {
  return `${(value / 10) * 100}%`
}

function getBarColor(value: number): string {
  if (value >= 8) return 'bg-green-500'
  if (value >= 6) return 'bg-amber-500'
  return 'bg-red-400'
}
</script>

<template>
  <Card class="border">
    <CardHeader>
      <CardTitle class="text-base">Puntuaciones</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-3">
        <div
          v-for="cat in activeRatings"
          :key="cat.key"
          class="flex items-center gap-3"
        >
          <span class="text-sm text-muted-foreground w-20 shrink-0 text-right">
            {{ cat.label }}
          </span>
          <div class="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all duration-500', getBarColor(getRatingValue(cat.key))]"
              :style="{ width: getBarWidth(getRatingValue(cat.key)) }"
            />
          </div>
          <span class="text-sm font-semibold w-8 text-right tabular-nums">
            {{ getRatingValue(cat.key) }}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
