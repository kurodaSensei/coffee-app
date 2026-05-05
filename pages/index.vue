<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Coffee, Tasting } from '~/types'

const { currentUser } = useAuth()
const coffeesStore = useCoffeesStore()
const tastingsStore = useTastingsStore()

onMounted(() => {
  coffeesStore.loadAll().catch(() => {})
  tastingsStore.loadAll().catch(() => {})
})

const userName = computed(() => {
  const u = currentUser.value
  return u?.displayName || u?.email?.split('@')[0] || ''
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const today = computed(() => {
  const d = new Date()
  const dayName = new Intl.DateTimeFormat('es', { weekday: 'long' }).format(d).toUpperCase()
  const day = d.getDate()
  const month = new Intl.DateTimeFormat('es', { month: 'short' }).format(d).replace('.', '').toUpperCase()
  const year = d.getFullYear()
  return { dayName, day, month, year }
})

const processLabel: Record<string, string> = {
  washed: 'lavado',
  natural: 'natural',
  honey: 'honey',
  anaerobic: 'anaeróbico',
  carbonic: 'carbónico',
  experimental: 'experimental',
  other: '',
}

function tsMillis(ts: any): number {
  if (!ts) return 0
  if (typeof ts.toMillis === 'function') return ts.toMillis()
  if (typeof ts.seconds === 'number') return ts.seconds * 1000
  if (ts instanceof Date) return ts.getTime()
  return 0
}

const lastTasting = computed<Tasting | null>(() => {
  const list = (tastingsStore.list as Tasting[]) ?? []
  if (list.length === 0) return null
  return [...list].sort((a, b) => {
    const ta = tsMillis(a.brewDate) || tsMillis(a.createdAt)
    const tb = tsMillis(b.brewDate) || tsMillis(b.createdAt)
    return tb - ta
  })[0]
})

const lastCoffee = computed<Coffee | null>(() => {
  const t = lastTasting.value
  if (!t) return null
  return (coffeesStore.list as Coffee[]).find(c => c.id === t.coffeeId) ?? null
})

const lastTastingLine = computed(() => {
  const t = lastTasting.value
  if (!t) return null
  const proc = lastCoffee.value?.process ? processLabel[lastCoffee.value.process] || '' : ''
  return {
    coffeeName: t.coffeeName,
    process: proc,
    roasterName: t.roasterName,
    score: typeof t.ratingOverall === 'number' ? t.ratingOverall : null,
  }
})

const monthStartMs = computed(() => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime()
})

const stats = computed(() => {
  const start = monthStartMs.value
  const monthCoffees = (coffeesStore.list as Coffee[]).filter(c => tsMillis(c.createdAt) >= start)
  const monthTastings = (tastingsStore.list as Tasting[]).filter(t =>
    (tsMillis(t.brewDate) || tsMillis(t.createdAt)) >= start,
  )
  const scores = monthTastings.map(t => t.ratingOverall).filter((s): s is number => typeof s === 'number')
  const avg = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : null
  return {
    coffees: monthCoffees.length,
    tastings: monthTastings.length,
    avgScore: avg,
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-md pt-md pb-xl lg:px-xl xl:px-2xl lg:pt-xl lg:pb-2xl">
    <!-- Header row: date + (mobile avatar | desktop search) -->
    <header class="flex items-center justify-between gap-md">
      <UiEyebrow>
        {{ today.dayName }} · {{ today.day }} {{ today.month }}<span class="hidden lg:inline"> · {{ today.year }}</span>
      </UiEyebrow>

      <div class="flex items-center gap-md">
        <button
          type="button"
          class="hidden lg:inline-flex items-center hover:opacity-80 transition-opacity"
          aria-label="Buscar"
        >
          <UiEyebrow>Buscar (⌘K)</UiEyebrow>
        </button>
        <NuxtLink to="/settings" class="lg:hidden inline-flex">
          <UiAvatar :name="userName" :src="currentUser?.photoURL ?? undefined" size="sm" />
        </NuxtLink>
      </div>
    </header>

    <!-- Greeting -->
    <h1
      class="mt-lg font-display tracking-[-0.02em] leading-[1.05] text-moss
             text-[40px] sm:text-[48px] lg:text-[80px] xl:text-[96px]"
    >
      {{ greeting }},<br>
      <span class="italic text-olive">{{ userName || 'Samuel' }}</span><span>.</span>
    </h1>

    <p
      v-if="lastTastingLine"
      class="mt-md font-display italic text-[14px] lg:text-[18px] text-moss-soft max-w-prose"
    >
      Tu última taza fue un {{ lastTastingLine.coffeeName
      }}<template v-if="lastTastingLine.process"> {{ lastTastingLine.process }}</template>
      de {{ lastTastingLine.roasterName
      }}<template v-if="lastTastingLine.score !== null">, con {{ lastTastingLine.score }} puntos</template>.
    </p>
    <p v-else class="mt-md font-display italic text-[14px] lg:text-[18px] text-moss-soft max-w-prose">
      Aún no has registrado ninguna cata. ¿Empezamos hoy?
    </p>

    <!-- Hero + quick actions -->
    <section class="mt-xl grid grid-cols-2 lg:grid-cols-3 gap-sm lg:gap-md">
      <UiHeroCard
        eyebrow="Hoy"
        title="¿Preparas café?"
        subtitle="Inicia una cata o registra una preparación."
        to="/tastings/new"
        class="col-span-2 lg:row-span-2"
      />
      <UiQuickCard eyebrow="Rápido" label="Nueva cata" to="/tastings/new" />
      <UiQuickCard eyebrow="Rápido" label="+ Café" to="/coffees/new" />
    </section>

    <!-- Stats -->
    <section class="mt-2xl">
      <div class="border-t border-moss/10 pt-lg">
        <UiEyebrow>Este mes</UiEyebrow>
      </div>

      <!-- Mobile: row list -->
      <div class="lg:hidden mt-md flex flex-col">
        <div class="flex items-center justify-between border-b border-moss/10 py-md">
          <span class="font-display italic text-[16px] text-moss">Cafés nuevos</span>
          <span class="font-mono text-[15px] text-moss">{{ stats.coffees }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-moss/10 py-md">
          <span class="font-display italic text-[16px] text-moss">Catas</span>
          <span class="font-mono text-[15px] text-moss">{{ stats.tastings }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-moss/10 py-md">
          <span class="font-display italic text-[16px] text-moss">Score promedio</span>
          <span class="font-mono text-[15px] text-olive">{{ stats.avgScore !== null ? stats.avgScore : '—' }}</span>
        </div>
      </div>

      <!-- Desktop: 3-col big numbers -->
      <div class="hidden lg:grid mt-lg grid-cols-3 gap-lg">
        <div class="flex flex-col gap-sm">
          <span class="font-display text-[64px] leading-none text-moss">{{ stats.coffees }}</span>
          <span class="font-display italic text-[14px] text-moss-soft">{{ stats.coffees === 1 ? 'café nuevo' : 'cafés nuevos' }}</span>
        </div>
        <div class="flex flex-col gap-sm">
          <span class="font-display text-[64px] leading-none text-moss">{{ stats.tastings }}</span>
          <span class="font-display italic text-[14px] text-moss-soft">{{ stats.tastings === 1 ? 'cata registrada' : 'catas registradas' }}</span>
        </div>
        <div class="flex flex-col gap-sm">
          <span class="font-display text-[64px] leading-none text-olive">{{ stats.avgScore !== null ? stats.avgScore : '—' }}</span>
          <span class="font-display italic text-[14px] text-moss-soft">score promedio</span>
        </div>
      </div>
    </section>
  </div>
</template>
