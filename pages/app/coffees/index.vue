<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Coffee } from '~/types'

const { currentUser } = useAuth()
const coffeesStore = useCoffeesStore()
const view = useCoffeeViewStore()

onMounted(() => {
  coffeesStore.loadAll().catch(() => {})
  coffeesStore.loadShared().catch(() => {})
})

const tab = ref<'mine' | 'shared'>('mine')

const mineCount = computed(() => coffeesStore.list.length)
const sharedCount = computed(() => coffeesStore.sharedList.length)

const rawItems = computed(() =>
  tab.value === 'mine' ? coffeesStore.list : coffeesStore.sharedList,
)

const items = computed<Coffee[]>(() => {
  const list = [...(rawItems.value as Coffee[])]

  // Filtros (sólo se aplican a la pestaña Míos; en Compartidos los datos vienen
  // de fuentes que el usuario no posee y filtrarlos rompería la intuición).
  const f = view.state
  const filtered = tab.value === 'mine'
    ? list.filter((c) => {
        if (f.process && c.process !== f.process) return false
        if (f.variety && c.variety !== f.variety) return false
        if (f.roasterId && c.roasterId !== f.roasterId) return false
        if (f.country && c.originCountry !== f.country) return false
        return true
      })
    : list

  switch (f.sortBy) {
    case 'nameAsc':
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'scaDesc':
      filtered.sort((a, b) => (b.scaScore ?? -Infinity) - (a.scaScore ?? -Infinity))
      break
    case 'priceAsc':
      filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      break
    case 'priceDesc':
      filtered.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
      break
    case 'recent':
    default:
      filtered.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0
        const tb = b.createdAt?.toMillis?.() ?? 0
        return tb - ta
      })
      break
  }
  return filtered
})

const userName = computed(() => {
  const u = currentUser.value
  return u?.displayName || u?.email?.split('@')[0] || ''
})

const segments = computed(() => [
  { key: 'mine', label: 'Míos', count: mineCount.value },
  { key: 'shared', label: 'Compartidos', count: sharedCount.value },
])

const isEmpty = computed(() => items.value.length === 0)
const isFilteredEmpty = computed(
  () => isEmpty.value && tab.value === 'mine' && view.hasActiveFilters,
)

const filtersOpen = ref(false)
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-md pt-md pb-2xl lg:px-xl xl:px-2xl lg:pt-xl lg:pb-2xl">
    <header class="flex items-center justify-between gap-md">
      <UiEyebrow>Cafés · {{ mineCount }}</UiEyebrow>
      <div class="lg:hidden inline-flex items-center gap-sm">
        <UiNotificationBell size="sm" />
        <NuxtLink to="/app/settings" class="inline-flex">
          <UiAvatar :name="userName" :src="currentUser?.photoURL ?? undefined" size="sm" />
        </NuxtLink>
      </div>
    </header>

    <div class="mt-lg flex items-end justify-between gap-md flex-wrap">
      <div>
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[48px] lg:text-[64px]">
          Mi <span class="italic text-olive">colección</span>
        </h1>
        <p class="subtitle-italic mt-xs">
          <template v-if="tab === 'shared'">Lo que tus amigos comparten contigo.</template>
          <template v-else>Cafés que has descubierto.</template>
        </p>
      </div>

      <div class="flex items-center gap-md">
        <UiSegmented v-model="tab" :items="segments" />
        <button
          type="button"
          class="relative inline-flex items-center justify-center size-[40px] rounded-pill text-moss bg-surface-2 hover:bg-surface transition-colors"
          aria-label="Filtros y vista"
          @click="filtersOpen = true"
        >
          <Icon name="lucide:sliders-horizontal" class="size-5" />
          <span
            v-if="view.activeFilterCount > 0"
            aria-hidden="true"
            class="absolute -top-[2px] -right-[2px] inline-flex items-center justify-center min-w-[16px] h-[16px] px-[4px] rounded-pill bg-olive text-paper font-mono text-[10px] leading-none"
          >
            {{ view.activeFilterCount }}
          </span>
        </button>
        <UiButton
          variant="primary"
          :block="false"
          to="/app/coffees/new"
          size="sm"
          class="hidden lg:inline-flex"
        >
          + Nuevo café
        </UiButton>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="isEmpty" class="mt-2xl flex flex-col items-center gap-lg">
      <div class="w-full max-w-[340px] rounded-card-lg bg-surface px-lg py-2xl text-center">
        <p class="font-display italic text-[16px] text-moss leading-relaxed">
          <template v-if="isFilteredEmpty">
            Ningún café coincide con los filtros activos.
          </template>
          <template v-else-if="tab === 'shared'">
            Aún no te han compartido cafés. Pide a un amigo que comparta uno.
          </template>
          <template v-else>
            "El próximo café espera en tu cafetera."
          </template>
        </p>
      </div>
      <UiButton
        v-if="isFilteredEmpty"
        variant="ghost"
        :block="false"
        @click="view.clearFilters"
      >
        Limpiar filtros
      </UiButton>
      <UiButton
        v-else-if="tab === 'mine'"
        variant="dark"
        :block="false"
        to="/app/coffees/new"
        class="lg:hidden"
      >
        + Registra tu primer café
      </UiButton>
    </div>

    <!-- Grid -->
    <div
      v-else
      class="mt-lg flex flex-col gap-md lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-md"
    >
      <CoffeeCard
        v-for="c in items"
        :key="c.id"
        :coffee="c"
        :mode="view.state.viewMode"
        class="lg:[&_h3]:text-[28px]"
      />
    </div>

    <!-- Mobile FAB (only when list has items) -->
    <NuxtLink
      v-if="!isEmpty"
      to="/app/coffees/new"
      class="lg:hidden fixed bottom-[96px] right-md z-20 inline-flex size-[56px] items-center justify-center rounded-pill bg-olive text-paper shadow-[0_8px_24px_rgba(47,53,40,0.18)] transition-transform duration-150 ease-sorbo hover:-translate-y-[2px] active:translate-y-0"
      aria-label="Nuevo café"
    >
      <Icon name="lucide:plus" class="size-6" />
    </NuxtLink>

    <CoffeeFiltersSheet v-model="filtersOpen" />
  </div>
</template>
