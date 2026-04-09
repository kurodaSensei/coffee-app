<script setup lang="ts">
const { currentUser, logout } = useAuth()
</script>

<template>
  <header
    class="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-14 px-4 bg-coffee-900 text-cream-50 border-b border-coffee-800"
  >
    <div class="flex items-center gap-2">
      <Icon name="heroicons:fire" class="w-6 h-6 text-cream-200" />
      <span class="text-lg font-bold tracking-tight">Coffee Tracker</span>
    </div>
    <button
      @click="logout"
      class="flex items-center gap-1 text-coffee-300 hover:text-cream-100 transition-colors"
    >
      <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
    </button>
  </header>
</template>
