<script setup lang="ts">
const { logout, currentUser } = useAuth()

const userInitial = computed(() =>
  currentUser.value?.displayName?.[0] || currentUser.value?.email?.[0]?.toUpperCase() || '?'
)
</script>

<template>
  <header class="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-14 px-4 bg-jungle">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-paper flex items-center justify-center">
        <Icon name="lucide:coffee" class="w-3.5 h-3.5 text-jungle" />
      </div>
      <div class="flex flex-col leading-tight">
        <span class="text-sm font-semibold text-paper tracking-tight">Sorbo</span>
        <span class="text-[9px] text-paper/40 tracking-wider uppercase font-mono">by KurodaCafe</span>
      </div>
    </div>
    <NuxtLink to="/settings" class="w-7 h-7 rounded-full bg-paper/15 flex items-center justify-center hover:bg-paper/25 transition-colors">
      <span class="font-mono text-[10px] text-paper font-medium">{{ userInitial }}</span>
    </NuxtLink>
  </header>
</template>
