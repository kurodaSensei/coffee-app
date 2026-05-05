<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Coffee, Tasting } from '~/types'

const { currentUser } = useAuth()
const tastingsStore = useTastingsStore()
const coffeesStore = useCoffeesStore()
const { getBrewMethodLabel } = useCatalog()

onMounted(() => {
  tastingsStore.loadAll().catch(() => {})
  coffeesStore.loadAll().catch(() => {})
})

const userName = computed(() =>
  currentUser.value?.displayName || currentUser.value?.email?.split('@')[0] || '',
)

const items = computed<Tasting[]>(() => {
  const list = (tastingsStore.list as Tasting[]) || []
  return [...list].sort((a, b) => {
    const ta = tsMillis(a.brewDate) || tsMillis(a.createdAt)
    const tb = tsMillis(b.brewDate) || tsMillis(b.createdAt)
    return tb - ta
  })
})

const isEmpty = computed(() => items.value.length === 0)

function tsMillis(ts: any): number {
  if (!ts) return 0
  if (typeof ts.toMillis === 'function') return ts.toMillis()
  if (typeof ts.seconds === 'number') return ts.seconds * 1000
  return 0
}

function relativeDate(ts: any): string {
  const ms = tsMillis(ts)
  if (!ms) return ''
  const d = new Date(ms)
  const diffH = (Date.now() - ms) / 1000 / 3600
  if (diffH < 1) return 'hace minutos'
  if (diffH < 24) return `hace ${Math.round(diffH)} ${Math.round(diffH) === 1 ? 'hora' : 'horas'}`
  const diffD = diffH / 24
  if (diffD < 7) return `hace ${Math.round(diffD)} ${Math.round(diffD) === 1 ? 'día' : 'días'}`
  const day = d.getDate()
  const month = new Intl.DateTimeFormat('es', { month: 'short' }).format(d).replace('.', '').toUpperCase()
  return `${day} ${month}`
}

function rowEyebrow(t: Tasting): string {
  const method = getBrewMethodLabel(t.brewMethod).toUpperCase()
  return [method, relativeDate(t.brewDate)].filter(Boolean).join(' · ')
}

// Sheet state
const sheetOpen = ref(false)
const activeTasting = ref<Tasting | null>(null)

function openSheet(t: Tasting) {
  activeTasting.value = t
  sheetOpen.value = true
}

const activeCoffee = computed<Coffee | null>(() => {
  if (!activeTasting.value) return null
  return (coffeesStore.list as Coffee[]).find(c => c.id === activeTasting.value!.coffeeId) ?? null
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-md pt-md pb-2xl lg:px-xl xl:px-2xl lg:pt-xl">
    <header class="flex items-center justify-between gap-md">
      <UiEyebrow>Catas{{ items.length > 0 ? ` · ${items.length}` : '' }}</UiEyebrow>
      <NuxtLink to="/settings" class="lg:hidden inline-flex">
        <UiAvatar :name="userName" :src="currentUser?.photoURL ?? undefined" size="sm" />
      </NuxtLink>
    </header>

    <div class="mt-lg flex items-end justify-between gap-md flex-wrap">
      <div>
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[48px] lg:text-[64px]">
          Catas<span>.</span>
        </h1>
        <p v-if="items.length > 0" class="subtitle-italic mt-xs">
          {{ items.length }} sorbo{{ items.length === 1 ? '' : 's' }} registrado{{ items.length === 1 ? '' : 's' }}.
        </p>
        <p v-else class="subtitle-italic mt-xs">
          Tu memoria de taza.
        </p>
      </div>
      <UiButton
        variant="primary"
        :block="false"
        to="/tastings/new"
        size="sm"
        class="hidden lg:inline-flex"
      >
        + Nueva cata
      </UiButton>
    </div>

    <!-- Empty -->
    <div v-if="isEmpty" class="mt-2xl flex flex-col items-center gap-lg">
      <p class="font-display italic text-[16px] text-moss text-center max-w-[300px] leading-relaxed">
        "Cada sorbo es un pequeño viaje. Empieza el tuyo registrando uno."
      </p>
      <UiButton variant="dark" :block="false" to="/tastings/new">
        + Nueva cata
      </UiButton>
    </div>

    <!-- List -->
    <ul v-else class="mt-lg flex flex-col gap-sm lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-md">
      <li v-for="t in items" :key="t.id">
        <button
          type="button"
          class="w-full text-left rounded-card-lg bg-surface p-md transition-colors duration-150 ease-sorbo hover:bg-surface-2"
          @click="openSheet(t)"
        >
          <div class="flex items-start justify-between gap-md">
            <div class="min-w-0 flex flex-col gap-xs">
              <UiEyebrow>{{ rowEyebrow(t) }}</UiEyebrow>
              <div class="font-display text-[28px] leading-none tracking-[-0.01em] truncate">
                {{ t.coffeeName.endsWith('.') ? t.coffeeName : `${t.coffeeName}.` }}
              </div>
              <p v-if="t.personalNotes" class="font-display italic text-[13px] text-moss-soft line-clamp-1">
                "{{ t.personalNotes }}"
              </p>
            </div>
            <div class="shrink-0 flex flex-col items-end gap-xxs">
              <span class="font-display text-[28px] leading-none text-olive">
                {{ t.ratingOverall.toFixed(1) }}
              </span>
              <span class="font-mono text-[10px] tracking-eyebrow uppercase text-moss-soft">
                /10
              </span>
            </div>
          </div>
        </button>
      </li>
    </ul>

    <!-- Mobile FAB -->
    <NuxtLink
      v-if="!isEmpty"
      to="/tastings/new"
      class="lg:hidden fixed bottom-[96px] right-md z-20 inline-flex size-[56px] items-center justify-center rounded-pill bg-olive text-paper shadow-[0_8px_24px_rgba(47,53,40,0.18)] transition-transform duration-150 ease-sorbo hover:-translate-y-[2px]"
      aria-label="Nueva cata"
    >
      <Icon name="lucide:plus" class="size-6" />
    </NuxtLink>

    <!-- Detail sheet -->
    <UiBottomSheet v-model="sheetOpen">
      <TastingDetail
        v-if="activeTasting"
        :tasting="activeTasting"
        :coffee="activeCoffee"
      />
      <div v-if="activeTasting" class="mt-lg flex flex-col gap-xs">
        <UiButton
          variant="primary"
          :block="true"
          :to="`/tastings/${activeTasting.id}`"
          @click="sheetOpen = false"
        >
          Ver completa
        </UiButton>
      </div>
    </UiBottomSheet>
  </div>
</template>
