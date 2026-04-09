<script setup lang="ts">
const route = useRoute()
const { currentUser, logout } = useAuth()

interface NavItem {
  label: string
  icon: string
  to: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'heroicons:home', to: '/' },
  { label: 'Cafés', icon: 'heroicons:fire', to: '/coffees' },
  { label: 'Tostadores', icon: 'heroicons:building-storefront', to: '/roasters' },
  { label: 'Degustaciones', icon: 'heroicons:star', to: '/tastings' },
  { label: 'Recetas', icon: 'heroicons:document-text', to: '/recipes' },
  { label: 'Wishlist', icon: 'heroicons:heart', to: '/wishlist' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-[260px] bg-coffee-900 text-cream-50 border-r border-coffee-800"
  >
    <!-- Logo / Title -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-coffee-800">
      <Icon name="heroicons:fire" class="w-8 h-8 text-cream-200" />
      <span class="text-xl font-bold tracking-tight text-cream-50">
        Coffee Tracker
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
          isActive(item.to)
            ? 'bg-coffee-800 text-cream-50'
            : 'text-coffee-300 hover:bg-coffee-800/60 hover:text-cream-100',
        ]"
      >
        <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User & Logout -->
    <div class="px-4 py-4 border-t border-coffee-800">
      <div class="flex items-center gap-3 px-2 mb-3">
        <div class="w-8 h-8 rounded-full bg-coffee-700 flex items-center justify-center text-cream-200 text-sm font-bold">
          {{ currentUser?.displayName?.[0] || currentUser?.email?.[0]?.toUpperCase() || '?' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-cream-100 truncate">
            {{ currentUser?.displayName || 'Usuario' }}
          </p>
          <p class="text-xs text-coffee-400 truncate">{{ currentUser?.email }}</p>
        </div>
      </div>
      <button
        @click="logout"
        class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-coffee-400 hover:bg-coffee-800 hover:text-cream-100 transition-colors"
      >
        <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>
