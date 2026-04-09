<script setup lang="ts">
const route = useRoute()

interface NavTab {
  label: string
  icon: string
  to: string
}

const tabs: NavTab[] = [
  { label: 'Inicio', icon: 'heroicons:home', to: '/' },
  { label: 'Cafés', icon: 'heroicons:fire', to: '/coffees' },
  { label: 'Tostadores', icon: 'heroicons:building-storefront', to: '/roasters' },
  { label: 'Catas', icon: 'heroicons:star', to: '/tastings' },
  { label: 'Recetas', icon: 'heroicons:document-text', to: '/recipes' },
  { label: 'Wishlist', icon: 'heroicons:heart', to: '/wishlist' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav
    class="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around h-16 bg-coffee-900 border-t border-coffee-800 safe-area-bottom"
  >
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      :class="[
        'flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-[10px] font-medium transition-colors duration-150',
        isActive(tab.to)
          ? 'text-cream-200'
          : 'text-coffee-400 hover:text-coffee-200',
      ]"
    >
      <Icon
        :name="tab.icon"
        :class="[
          'w-5 h-5',
          isActive(tab.to) ? 'text-cream-200' : 'text-coffee-400',
        ]"
      />
      <span>{{ tab.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
