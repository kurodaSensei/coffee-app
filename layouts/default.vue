<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-coffee-50 font-sans">
    <!-- Desktop sidebar -->
    <LayoutSidebar />

    <!-- Mobile top navbar -->
    <LayoutNavbar />

    <!-- Main content area -->
    <main
      class="
        lg:ml-[260px]
        pt-14 lg:pt-0
        pb-20 lg:pb-0
        min-h-screen
      "
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <slot />
      </div>
    </main>

    <!-- Mobile bottom navigation -->
    <LayoutBottomNav />
  </div>
</template>
