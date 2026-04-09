<script setup lang="ts">
const route = useRoute()

const tabs = [
  { label: 'Inicio', icon: 'lucide:layout-dashboard', to: '/' },
  { label: 'Cafés', icon: 'lucide:coffee', to: '/coffees' },
  { label: 'Tostadores', icon: 'lucide:store', to: '/roasters' },
  { label: 'Catas', icon: 'lucide:star', to: '/tastings' },
  { label: 'Recetas', icon: 'lucide:book-open', to: '/recipes' },
  { label: 'Wishlist', icon: 'lucide:heart', to: '/wishlist' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around h-14 bg-coffee-900 safe-area-bottom">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      :class="[
        'flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-[10px] font-medium transition-colors',
        isActive(tab.to) ? 'text-amber-400' : 'text-white/35',
      ]"
    >
      <Icon :name="tab.icon" class="w-[18px] h-[18px]" />
      <span>{{ tab.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
