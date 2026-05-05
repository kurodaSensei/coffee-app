<script setup lang="ts">
import { computed } from 'vue'
import type { Coffee, CoffeeProcess, Tasting } from '~/types'

const props = defineProps<{
  tasting: Tasting
  /** Coffee details (for the "natural · process" subtitle). Optional. */
  coffee?: Coffee | null
}>()

const { getBrewMethodLabel } = useCatalog()

const processLabel: Record<CoffeeProcess, string> = {
  washed: 'lavado',
  natural: 'natural',
  honey: 'honey',
  anaerobic: 'anaeróbico',
  carbonic: 'carbónico',
  experimental: 'experimental',
  other: '',
}

const subtitle = computed(() => {
  const t = props.tasting
  const proc = props.coffee?.process ? processLabel[props.coffee.process] || '' : ''
  const roaster = t.roasterName ? `de ${t.roasterName}` : ''
  return [roaster, proc].filter(Boolean).join(' · ')
})

const eyebrow = computed(() => {
  const method = getBrewMethodLabel(props.tasting.brewMethod).toUpperCase()
  return [method, relativeDate(props.tasting.brewDate)].filter(Boolean).join(' · ')
})

function relativeDate(ts: any): string {
  if (!ts) return ''
  const ms = typeof ts.toMillis === 'function'
    ? ts.toMillis()
    : (ts.seconds ? ts.seconds * 1000 : (ts instanceof Date ? ts.getTime() : 0))
  if (!ms) return ''
  const d = new Date(ms)
  const now = Date.now()
  const diffH = (now - ms) / 1000 / 3600
  if (diffH < 1) return 'hace minutos'
  if (diffH < 24) return `hace ${Math.round(diffH)} ${Math.round(diffH) === 1 ? 'hora' : 'horas'}`
  const diffD = diffH / 24
  if (diffD < 7) return `hace ${Math.round(diffD)} ${Math.round(diffD) === 1 ? 'día' : 'días'}`
  const day = d.getDate()
  const month = new Intl.DateTimeFormat('es', { month: 'short' }).format(d).replace('.', '').toUpperCase()
  return `${day} ${month}`
}
</script>

<template>
  <div class="flex flex-col gap-md">
    <UiEyebrow>{{ eyebrow }}</UiEyebrow>

    <div>
      <h2 class="font-display tracking-[-0.02em] leading-[0.95] text-moss text-[56px] sm:text-[64px]">
        {{ tasting.coffeeName.endsWith('.') ? tasting.coffeeName : `${tasting.coffeeName}.` }}
      </h2>
      <p v-if="subtitle" class="subtitle-italic mt-xxs">
        {{ subtitle }}
      </p>
    </div>

    <UiRatingBar
      readonly
      variant="hero"
      label="Puntuación general"
      :model-value="tasting.ratingOverall"
    >
      <template v-if="tasting.isFavorite" #trailing>
        <span aria-label="Favorito" class="text-[20px]">❤️</span>
      </template>
    </UiRatingBar>

    <section v-if="hasAttributes(tasting)" class="mt-xs">
      <UiEyebrow>Atributos</UiEyebrow>
      <div class="mt-sm flex flex-col">
        <UiRatingBar v-if="tasting.ratingAroma !== undefined" readonly label="Aroma" :model-value="tasting.ratingAroma" class="border-b border-moss/10" />
        <UiRatingBar v-if="tasting.ratingAcidity !== undefined" readonly label="Acidez" :model-value="tasting.ratingAcidity" class="border-b border-moss/10" />
        <UiRatingBar v-if="tasting.ratingSweetness !== undefined" readonly label="Dulzura" :model-value="tasting.ratingSweetness" class="border-b border-moss/10" />
        <UiRatingBar v-if="tasting.ratingBody !== undefined" readonly label="Cuerpo" :model-value="tasting.ratingBody" class="border-b border-moss/10" />
        <UiRatingBar v-if="tasting.ratingAftertaste !== undefined" readonly label="Retrogusto" :model-value="tasting.ratingAftertaste" />
      </div>
    </section>

    <section v-if="tasting.personalNotes" class="mt-xs">
      <UiEyebrow>Tu nota</UiEyebrow>
      <p class="mt-xs font-display italic text-[15px] leading-relaxed text-moss">
        "{{ tasting.personalNotes }}"
      </p>
    </section>

    <section v-if="tasting.wouldBuyAgain" class="mt-xs">
      <UiChip variant="active">
        ↻ Repetiría
      </UiChip>
    </section>
  </div>
</template>

<script lang="ts">
function hasAttributes(t: any) {
  return t.ratingAroma !== undefined
    || t.ratingAcidity !== undefined
    || t.ratingSweetness !== undefined
    || t.ratingBody !== undefined
    || t.ratingAftertaste !== undefined
}
</script>
