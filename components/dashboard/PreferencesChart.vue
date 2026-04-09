<script setup lang="ts">
import { getBrewMethodLabel, getProcessLabel } from '~/utils/formatters'

interface ChartItem {
  name: string
  count: number
}

const props = defineProps<{
  topVarieties: ChartItem[]
  topProcesses: ChartItem[]
  topBrewMethods: ChartItem[]
}>()

const barColors = [
  'bg-coffee-600',
  'bg-coffee-500',
  'bg-coffee-400',
  'bg-coffee-300',
  'bg-coffee-200',
]

function getMaxCount(items: ChartItem[]): number {
  return Math.max(...items.map((i) => i.count), 1)
}

function barWidth(count: number, max: number): string {
  return `${Math.max((count / max) * 100, 8)}%`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Varieties -->
    <Card title="Variedades favoritas">
      <div v-if="topVarieties.length === 0" class="py-4 text-center text-sm text-coffee-400">
        Sin datos aun.
      </div>
      <div v-else class="space-y-3">
        <div v-for="(item, index) in topVarieties" :key="item.name" class="flex items-center gap-3">
          <span class="text-sm text-coffee-700 w-24 truncate text-right flex-shrink-0">
            {{ item.name }}
          </span>
          <div class="flex-1 bg-coffee-100 rounded-full h-6 overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2', barColors[index] || barColors[barColors.length - 1]]"
              :style="{ width: barWidth(item.count, getMaxCount(topVarieties)) }"
            >
              <span class="text-xs font-medium text-white">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Top Processes -->
    <Card title="Procesos">
      <div v-if="topProcesses.length === 0" class="py-4 text-center text-sm text-coffee-400">
        Sin datos aun.
      </div>
      <div v-else class="space-y-3">
        <div v-for="(item, index) in topProcesses" :key="item.name" class="flex items-center gap-3">
          <span class="text-sm text-coffee-700 w-24 truncate text-right flex-shrink-0">
            {{ getProcessLabel(item.name) }}
          </span>
          <div class="flex-1 bg-blue-100 rounded-full h-6 overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2', index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-blue-400' : 'bg-blue-300']"
              :style="{ width: barWidth(item.count, getMaxCount(topProcesses)) }"
            >
              <span class="text-xs font-medium text-white">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Top Brew Methods -->
    <Card title="Metodos de preparacion">
      <div v-if="topBrewMethods.length === 0" class="py-4 text-center text-sm text-coffee-400">
        Sin datos aun.
      </div>
      <div v-else class="space-y-3">
        <div v-for="(item, index) in topBrewMethods" :key="item.name" class="flex items-center gap-3">
          <span class="text-sm text-coffee-700 w-24 truncate text-right flex-shrink-0">
            {{ getBrewMethodLabel(item.name) }}
          </span>
          <div class="flex-1 bg-green-100 rounded-full h-6 overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2', index === 0 ? 'bg-green-600' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-green-400' : 'bg-green-300']"
              :style="{ width: barWidth(item.count, getMaxCount(topBrewMethods)) }"
            >
              <span class="text-xs font-medium text-white">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
