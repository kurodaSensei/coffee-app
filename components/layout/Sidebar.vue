<script setup lang="ts">
const route = useRoute()
const { currentUser, logout } = useAuth()

const navItems = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', to: '/' },
  { label: 'Cafés', icon: 'lucide:coffee', to: '/coffees' },
  { label: 'Tostadores', icon: 'lucide:store', to: '/roasters' },
  { label: 'Degustaciones', icon: 'lucide:star', to: '/tastings' },
  { label: 'Recetas', icon: 'lucide:book-open', to: '/recipes' },
  { label: 'Wishlist', icon: 'lucide:heart', to: '/wishlist' },
  { label: 'Amigos', icon: 'lucide:users', to: '/friends' },
  { label: 'Configuración', icon: 'lucide:settings', to: '/settings' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const userInitial = computed(() =>
  currentUser.value?.displayName?.[0] || currentUser.value?.email?.[0]?.toUpperCase() || '?'
)
</script>

<template>
  <aside class="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-[240px] bg-neutral-950">
    <!-- Logo -->
    <div class="flex items-center gap-2.5 px-5 h-14 border-b border-white/10">
      <div class="w-8 h-8 rounded-lg bg-[#f5f0e8] flex items-center justify-center">
        <Icon name="lucide:coffee" class="w-4 h-4 text-neutral-950" />
      </div>
      <div class="flex flex-col leading-tight">
        <span class="text-[14px] font-semibold text-white tracking-tight">Coffee Tracker</span>
        <span class="text-[10px] text-white/40 tracking-wider uppercase">by KurodaCafe</span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 flex flex-col gap-0.5 px-3 py-3 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
          isActive(item.to)
            ? 'bg-white/15 text-white'
            : 'text-white/55 hover:bg-white/8 hover:text-white/80',
        ]"
      >
        <Icon :name="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- User -->
    <div class="px-3 py-3 border-t border-white/10">
      <div class="flex items-center gap-2.5 px-2 mb-2">
        <Avatar class="h-7 w-7 rounded-lg">
          <AvatarFallback class="rounded-lg bg-white/15 text-white/90 text-xs font-semibold">
            {{ userInitial }}
          </AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-white/90 truncate">
            {{ currentUser?.displayName || 'Usuario' }}
          </p>
          <p class="text-[10px] text-white/40 truncate">{{ currentUser?.email }}</p>
        </div>
      </div>
      <button
        @click="logout"
        class="flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-[12px] text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors"
      >
        <Icon name="lucide:log-out" class="w-3.5 h-3.5" />
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>
