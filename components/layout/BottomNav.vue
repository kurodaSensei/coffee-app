<script setup lang="ts">
const route = useRoute()

const tabs = [
  { label: 'Inicio',   to: '/' },
  { label: 'Cafés',   to: '/coffees' },
  { label: 'Catas',   to: '/tastings' },
  { label: 'Recetas', to: '/recipes' },
  { label: 'Wishlist', to: '/wishlist' },
]

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-moss/10 safe-area-bottom">
    <div class="flex items-center justify-around px-1 pt-2.5">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        :class="[
          'flex-1 text-center py-1 transition-colors duration-fast leading-tight',
          isActive(tab.to)
            ? 'font-serif italic text-[13px] text-primary'
            : 'font-mono text-eyebrow uppercase text-foreground/40',
        ]"
      >
        {{ tab.label }}
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 12px);
}
</style>
