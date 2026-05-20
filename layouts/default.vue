<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const { currentUser } = useAuth()
const friendsStore = useFriendsStore()

// Bottom sheet "Más" del tab bar mobile (overflow de navegación secundaria).
const moreSheetOpen = ref(false)
function onTabSelect(item: { key: string }) {
  if (item.key === 'more') moreSheetOpen.value = true
}

watch(
  () => currentUser.value?.uid,
  (uid) => {
    if (uid) friendsStore.load().catch(() => {})
    else friendsStore.reset()
  },
  { immediate: true },
)

const userName = computed(() => {
  const u = currentUser.value
  if (!u) return ''
  return u.displayName || (u.email ? u.email.split('@')[0] : '')
})

const sidebarUser = computed(() =>
  userName.value
    ? { name: userName.value, photoURL: currentUser.value?.photoURL ?? null }
    : null,
)

const sidebarSections = [
  {
    title: 'Diario',
    items: [
      { key: 'home', label: 'Inicio', to: '/app' },
      { key: 'explore', label: 'Explora', to: '/app/explore' },
      { key: 'coffees', label: 'Cafés', to: '/app/coffees' },
      { key: 'tastings', label: 'Catas', to: '/app/tastings' },
      { key: 'recipes', label: 'Recetas', to: '/app/recipes' },
      { key: 'wishlist', label: 'Wishlist', to: '/app/wishlist' },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { key: 'roasters', label: 'Tostadores', to: '/app/roasters' },
      { key: 'varieties', label: 'Variedades', to: '/app/varieties' },
      { key: 'methods', label: 'Métodos', to: '/app/methods' },
      { key: 'processes', label: 'Procesos', to: '/app/processes' },
      { key: 'notes', label: 'Notas', to: '/app/notes' },
    ],
  },
]

// El tab bar mobile lleva el núcleo del diario; "Más" abre un sheet con la
// navegación secundaria (hoy Wishlist; escalable a catálogos en el futuro).
const mobileTabs = [
  { key: 'home', label: 'Inicio', to: '/app' },
  { key: 'explore', label: 'Explora', to: '/app/explore' },
  { key: 'coffees', label: 'Cafés', to: '/app/coffees' },
  { key: 'tastings', label: 'Catas', to: '/app/tastings' },
  { key: 'recipes', label: 'Recetas', to: '/app/recipes' },
  { key: 'more', label: 'Más', match: ['/app/wishlist'] },
]
</script>

<template>
  <div class="min-h-svh bg-paper text-moss font-sans antialiased flex">
    <UiSidebar
      :sections="sidebarSections"
      :user="sidebarUser"
      class="hidden lg:flex"
    />

    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1 pb-[88px] lg:pb-0 pt-[env(safe-area-inset-top)]">
        <slot />
      </main>
    </div>

    <UiTabBar :items="mobileTabs" class="lg:hidden" @select="onTabSelect" />

    <!-- Overflow de navegación secundaria (mobile) -->
    <UiBottomSheet v-model="moreSheetOpen" title="Más">
      <div class="flex flex-col pt-xs">
        <NuxtLink
          to="/app/wishlist"
          class="group flex items-center gap-md py-md hover:bg-surface-2/40 transition-colors"
          @click="moreSheetOpen = false"
        >
          <Icon
            name="lucide:bookmark"
            class="size-[18px] text-moss-soft group-hover:text-moss transition-colors shrink-0"
            aria-hidden="true"
          />
          <div class="flex flex-col gap-[2px] flex-1 min-w-0">
            <span class="font-sans text-[17px] font-medium text-moss leading-tight">Wishlist</span>
            <span class="font-sans text-[12px] text-moss-soft leading-tight">
              Cafés que quieres probar
            </span>
          </div>
          <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost shrink-0" />
        </NuxtLink>
      </div>
    </UiBottomSheet>
  </div>
</template>
