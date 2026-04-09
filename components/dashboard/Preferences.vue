<script setup lang="ts">
import { getBrewMethodLabel, getProcessLabel } from '~/utils/formatters'

interface ChartItem {
  name: string
  count: number
}

interface Props {
  stats: {
    topVarieties: ChartItem[]
    topProcesses: ChartItem[]
    topBrewMethods: ChartItem[]
  }
}

const props = defineProps<Props>()

function getMaxCount(items: ChartItem[]): number {
  return Math.max(...items.map((i) => i.count), 1)
}

function barWidth(count: number, max: number): string {
  return `${Math.max((count / max) * 100, 12)}%`
}
</script>

<template>
  <Tabs default-value="varieties">
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center gap-2">
          <Icon name="lucide:bar-chart-3" class="w-4 h-4 text-muted-foreground" />
          <CardTitle class="text-base">Preferencias</CardTitle>
        </div>
        <TabsList class="mt-3 w-full grid grid-cols-3">
          <TabsTrigger value="varieties">Variedades</TabsTrigger>
          <TabsTrigger value="processes">Procesos</TabsTrigger>
          <TabsTrigger value="methods">Metodos</TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent>
        <!-- Varieties -->
        <TabsContent value="varieties" class="mt-0">
          <div v-if="stats.topVarieties.length === 0" class="flex flex-col items-center py-8 text-center">
            <Icon name="lucide:leaf" class="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p class="text-sm text-muted-foreground">Sin datos aun.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(item, index) in stats.topVarieties" :key="item.name" class="group">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-foreground">{{ item.name }}</span>
                <span class="text-xs text-muted-foreground tabular-nums">{{ item.count }}</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-full rounded-full bg-amber-500 dark:bg-amber-400 transition-all duration-700 ease-out"
                  :style="{ width: barWidth(item.count, getMaxCount(stats.topVarieties)), opacity: 1 - index * 0.12 }"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- Processes -->
        <TabsContent value="processes" class="mt-0">
          <div v-if="stats.topProcesses.length === 0" class="flex flex-col items-center py-8 text-center">
            <Icon name="lucide:flask-conical" class="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p class="text-sm text-muted-foreground">Sin datos aun.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(item, index) in stats.topProcesses" :key="item.name" class="group">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-foreground">{{ getProcessLabel(item.name) }}</span>
                <span class="text-xs text-muted-foreground tabular-nums">{{ item.count }}</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-full rounded-full bg-blue-500 dark:bg-blue-400 transition-all duration-700 ease-out"
                  :style="{ width: barWidth(item.count, getMaxCount(stats.topProcesses)), opacity: 1 - index * 0.12 }"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- Brew Methods -->
        <TabsContent value="methods" class="mt-0">
          <div v-if="stats.topBrewMethods.length === 0" class="flex flex-col items-center py-8 text-center">
            <Icon name="lucide:cup-soda" class="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p class="text-sm text-muted-foreground">Sin datos aun.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(item, index) in stats.topBrewMethods" :key="item.name" class="group">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-foreground">{{ getBrewMethodLabel(item.name) }}</span>
                <span class="text-xs text-muted-foreground tabular-nums">{{ item.count }}</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-full rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-700 ease-out"
                  :style="{ width: barWidth(item.count, getMaxCount(stats.topBrewMethods)), opacity: 1 - index * 0.12 }"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  </Tabs>
</template>
