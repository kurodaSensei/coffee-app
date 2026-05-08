<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const { currentUser } = useAuth()
const coffeesStore = useCoffeesStore()

onMounted(() => {
  coffeesStore.loadAll().catch(() => {})
  coffeesStore.loadShared().catch(() => {})
})

const tab = ref<'mine' | 'shared'>('mine')

const mineCount = computed(() => coffeesStore.list.length)
const sharedCount = computed(() => coffeesStore.sharedList.length)

const items = computed(() =>
  tab.value === 'mine' ? coffeesStore.list : coffeesStore.sharedList,
)

const userName = computed(() => {
  const u = currentUser.value
  return u?.displayName || u?.email?.split('@')[0] || ''
})

const segments = computed(() => [
  { key: 'mine', label: 'Míos', count: mineCount.value },
  { key: 'shared', label: 'Compartidos', count: sharedCount.value },
])

const isEmpty = computed(() => items.value.length === 0)
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-md pt-md pb-2xl lg:px-xl xl:px-2xl lg:pt-xl lg:pb-2xl">
    <header class="flex items-center justify-between gap-md">
      <UiEyebrow>Cafés · {{ mineCount }}</UiEyebrow>
      <NuxtLink to="/app/settings" class="lg:hidden inline-flex">
        <UiAvatar :name="userName" :src="currentUser?.photoURL ?? undefined" size="sm" />
      </NuxtLink>
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
          <template v-if="tab === 'shared'">
            Aún no te han compartido cafés. Pide a un amigo que comparta uno.
          </template>
          <template v-else>
            "El próximo café espera en tu cafetera."
          </template>
        </p>
      </div>
      <UiButton
        v-if="tab === 'mine'"
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
  </div>
</template>
