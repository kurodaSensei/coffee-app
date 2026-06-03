<script setup lang="ts">
import { computed, onMounted } from 'vue'

const { currentUser } = useAuth()
const wishlistStore = useWishlistStore()
const {
  items,
  filteredItems,
  counts,
  selectedKind,
  loading,
  error,
  loaded,
  load,
} = useCommunityFeed()

onMounted(() => {
  load()
  // La wishlist se usa para marcar/evitar duplicados en las cards de café.
  if (wishlistStore.list.length === 0) wishlistStore.loadAll().catch(() => {})
})

async function refresh() {
  await load()
}

const userName = computed(() =>
  currentUser.value?.displayName || currentUser.value?.email?.split('@')[0] || '',
)

const isEmpty = computed(() => loaded.value && items.value.length === 0)
const noResults = computed(
  () => loaded.value && items.value.length > 0 && filteredItems.value.length === 0,
)

const kindFilters = computed(() => [
  { key: 'all', label: 'Todos', count: counts.value.all },
  { key: 'coffee', label: 'Cafés', count: counts.value.coffee },
  { key: 'tasting', label: 'Catas', count: counts.value.tasting },
  { key: 'recipe', label: 'Recetas', count: counts.value.recipe },
])
</script>

<template>
  <UiPullToRefresh :on-refresh="refresh">
    <div class="mx-auto w-full max-w-[1200px] px-md pt-md pb-2xl lg:px-xl xl:px-2xl lg:pt-xl">
    <header class="flex items-center justify-between gap-md">
      <UiEyebrow>Explora</UiEyebrow>
      <div class="lg:hidden inline-flex items-center gap-sm">
        <UiNotificationBell size="sm" />
        <NuxtLink to="/app/settings" class="inline-flex">
          <UiAvatar :name="userName" :src="currentUser?.photoURL ?? undefined" size="sm" />
        </NuxtLink>
      </div>
    </header>

    <div class="mt-lg">
      <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[48px] lg:text-[64px]">
        La <span class="italic text-olive">comunidad</span>
      </h1>
      <p class="subtitle-italic mt-xs">
        Cafés, catas y recetas que otros sorbos comparten.
      </p>
    </div>

    <!-- Filtro por tipo (oculto mientras carga o si todo está vacío) -->
    <div v-if="!loading && !isEmpty && !error" class="mt-lg overflow-x-auto -mx-md px-md lg:mx-0 lg:px-0">
      <UiSegmented v-model="selectedKind" :items="kindFilters" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-2xl flex justify-center">
      <span class="size-6 animate-spin rounded-full border-2 border-moss/20 border-t-moss" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="mt-2xl flex flex-col items-center gap-lg">
      <div class="w-full max-w-[360px] rounded-card-lg bg-surface px-lg py-xl text-center">
        <p class="font-display italic text-[15px] text-moss leading-relaxed">
          {{ error }}
        </p>
      </div>
      <UiButton variant="ghost" :block="false" @click="load">
        Reintentar
      </UiButton>
    </div>

    <!-- Empty -->
    <div v-else-if="isEmpty" class="mt-2xl flex flex-col items-center gap-lg">
      <div class="w-full max-w-[360px] rounded-card-lg bg-surface px-lg py-2xl text-center">
        <p class="font-display italic text-[16px] text-moss leading-relaxed">
          "Aún no hay sorbos en la comunidad. Comparte un café como Comunidad y serás el primero."
        </p>
      </div>
      <UiButton variant="dark" :block="false" to="/app/coffees">
        Ir a mis cafés
      </UiButton>
    </div>

    <!-- Sin resultados con el filtro activo -->
    <div v-else-if="noResults" class="mt-2xl flex flex-col items-center gap-lg">
      <div class="w-full max-w-[360px] rounded-card-lg bg-surface px-lg py-xl text-center">
        <p class="font-display italic text-[15px] text-moss leading-relaxed">
          Nada coincide con ese filtro todavía.
        </p>
      </div>
      <UiButton variant="ghost" :block="false" @click="selectedKind = 'all'">
        Ver todo
      </UiButton>
    </div>

    <!-- Feed -->
    <div
      v-else
      class="mt-lg flex flex-col gap-md lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-md"
    >
      <ExploreCard
        v-for="item in filteredItems"
        :key="`${item.kind}-${item.id}`"
        :item="item"
      />
    </div>
    </div>
  </UiPullToRefresh>
</template>
