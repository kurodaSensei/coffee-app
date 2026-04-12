<script setup lang="ts">
const { logout } = useAuth()
</script>

<template>
  <header class="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-14 px-4 bg-neutral-950">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-[#f5f0e8] flex items-center justify-center">
        <Icon name="lucide:coffee" class="w-3.5 h-3.5 text-neutral-950" />
      </div>
      <div class="flex flex-col leading-tight">
        <span class="text-sm font-semibold text-white tracking-tight">Coffee Tracker</span>
        <span class="text-[9px] text-white/40 tracking-wider uppercase">by KurodaCafe</span>
      </div>
    </div>
    <button @click="logout" class="text-white/40 hover:text-white/70 transition-colors p-1.5">
      <Icon name="lucide:log-out" class="w-4 h-4" />
    </button>
  </header>
</template>
