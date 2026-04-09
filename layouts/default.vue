<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-background font-sans">
    <!-- Desktop sidebar -->
    <LayoutSidebar />

    <!-- Mobile top navbar -->
    <LayoutNavbar />

    <!-- Main content area -->
    <main
      class="
        lg:ml-[240px]
        pt-13 lg:pt-0
        pb-14 lg:pb-0
        min-h-screen
      "
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
        <slot />
      </div>
    </main>

    <!-- Mobile bottom navigation -->
    <LayoutBottomNav />
  </div>
</template>
