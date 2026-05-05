<script setup lang="ts">
import { computed } from 'vue'
import type { Coffee, CoffeeProcess } from '~/types'

const props = defineProps<{
  coffee: Coffee
  /** Compact density for desktop grid cells. */
  compact?: boolean
}>()

const processLabel: Record<CoffeeProcess, string> = {
  washed: 'Lavado',
  natural: 'Natural',
  honey: 'Honey',
  anaerobic: 'Anaeróbico',
  carbonic: 'Carbónico',
  experimental: 'Experimental',
  other: 'Otro',
}

const blobTone = computed<'honey' | 'olive-light' | 'surface-2' | 'peach'>(() => {
  switch (props.coffee.process) {
    case 'natural':
      return 'honey'
    case 'honey':
      return 'peach'
    case 'washed':
      return 'olive-light'
    case 'anaerobic':
    case 'carbonic':
      return 'peach'
    case 'experimental':
      return 'olive-light'
    default:
      return 'surface-2'
  }
})

const eyebrow = computed(() => {
  const proc = props.coffee.process ? processLabel[props.coffee.process] : ''
  const region = props.coffee.originRegion || ''
  return [proc, region].filter(Boolean).join(' · ')
})

const name = computed(() => {
  const n = props.coffee.name?.trim() || 'Sin nombre'
  return n.endsWith('.') ? n : `${n}.`
})

const subtitle = computed(() => {
  const r = props.coffee.roasterName?.trim()
  if (!r) return undefined
  const clean = r.endsWith('.') ? r.slice(0, -1) : r
  return `de ${clean}.`
})

function formatPrice(p?: number): string {
  if (!p) return ''
  if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (p >= 1000) return `$${Math.round(p / 1000)}K`
  return `$${p}`
}

const meta = computed(() => {
  const parts: string[] = []
  const price = formatPrice(props.coffee.price)
  if (price) parts.push(price)
  if (props.coffee.weight) parts.push(`${props.coffee.weight}g`)
  return parts.join(' · ')
})

const visibleNotes = computed(() => (props.coffee.flavorNotes || []).slice(0, props.compact ? 2 : 3))
const moreNotes = computed(() =>
  Math.max(0, (props.coffee.flavorNotes || []).length - visibleNotes.value.length),
)
</script>

<template>
  <UiMoodCard
    :to="`/coffees/${coffee.id}`"
    :eyebrow="eyebrow"
    :name="name"
    :subtitle="subtitle"
    :score="coffee.scaScore"
    :meta="meta"
    :blob-tone="blobTone"
    :compact="compact"
  >
    <template v-if="(coffee.flavorNotes || []).length > 0" #notes>
      <UiChip v-for="n in visibleNotes" :key="n" compact>
        {{ n }}
      </UiChip>
      <UiChip v-if="moreNotes > 0" compact variant="ghost">
        +{{ moreNotes }}
      </UiChip>
    </template>
  </UiMoodCard>
</template>
