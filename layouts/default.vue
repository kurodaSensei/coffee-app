<script setup lang="ts">
import { computed, watch } from 'vue'

const { currentUser } = useAuth()
const friendsStore = useFriendsStore()

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

// Tab bar mobile: 5 items, el núcleo del diario. Wishlist se accede desde
// el header de la página Cafés (ícono bookmark) — ver pages/app/coffees.
const mobileTabs = [
  { key: 'home', label: 'Inicio', to: '/app' },
  { key: 'explore', label: 'Explora', to: '/app/explore' },
  { key: 'coffees', label: 'Cafés', to: '/app/coffees' },
  { key: 'tastings', label: 'Catas', to: '/app/tastings' },
  { key: 'recipes', label: 'Recetas', to: '/app/recipes' },
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

    <UiTabBar :items="mobileTabs" class="lg:hidden" />
  </div>
</template>
