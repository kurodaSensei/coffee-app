<script setup lang="ts">
import { computed } from 'vue'

const { currentUser } = useAuth()

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
      { key: 'home', label: 'Inicio', to: '/' },
      { key: 'coffees', label: 'Cafés', to: '/coffees' },
      { key: 'tastings', label: 'Catas', to: '/tastings' },
      { key: 'recipes', label: 'Recetas', to: '/recipes' },
      { key: 'wishlist', label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { key: 'roasters', label: 'Tostadores', to: '/roasters' },
      { key: 'varieties', label: 'Variedades', to: '/varieties' },
      { key: 'methods', label: 'Métodos', to: '/methods' },
      { key: 'processes', label: 'Procesos', to: '/processes' },
    ],
  },
]

const mobileTabs = [
  { key: 'home', label: 'Inicio', to: '/' },
  { key: 'coffees', label: 'Cafés', to: '/coffees' },
  { key: 'tastings', label: 'Catas', to: '/tastings' },
  { key: 'recipes', label: 'Recetas', to: '/recipes' },
  { key: 'wishlist', label: 'Wishlist', to: '/wishlist' },
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
