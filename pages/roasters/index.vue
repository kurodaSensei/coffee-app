<script setup lang="ts">
const store = useRoastersStore()

const search = ref('')

onMounted(() => {
  store.loadAll()
})

const filteredRoasters = computed(() => {
  if (!search.value) return store.list
  const query = search.value.toLowerCase()
  return store.list.filter((r) =>
    r.name.toLowerCase().includes(query),
  )
})
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Tostadores" subtitle="Tus tostadores favoritos">
      <NuxtLink to="/roasters/new">
        <Button>
          <Icon name="lucide:plus" class="w-4 h-4" />
          Agregar
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <!-- Search -->
    <div class="relative max-w-sm">
      <Icon
        name="lucide:search"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      />
      <Input
        v-model="search"
        placeholder="Buscar tostador..."
        class="pl-9"
      />
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex flex-col items-center justify-center py-16">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 text-sm text-muted-foreground">Cargando tostadores...</p>
    </div>

    <!-- Error -->
    <Card v-else-if="store.error" class="border-destructive/30 bg-destructive/5">
      <CardContent class="flex flex-col items-center text-center py-10">
        <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icon name="lucide:alert-triangle" class="w-7 h-7 text-destructive" />
        </div>
        <p class="text-destructive font-medium">{{ store.error }}</p>
        <Button variant="outline" class="mt-4" @click="store.loadAll()">
          <Icon name="lucide:refresh-cw" class="w-4 h-4" />
          Reintentar
        </Button>
      </CardContent>
    </Card>

    <!-- Empty state -->
    <div v-else-if="filteredRoasters.length === 0" class="text-center py-16">
      <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:store" class="w-8 h-8 text-muted-foreground/50" />
      </div>
      <template v-if="search">
        <h3 class="font-medium text-foreground">Sin resultados</h3>
        <p class="text-sm text-muted-foreground mt-1">
          No se encontraron tostadores para "{{ search }}"
        </p>
      </template>
      <template v-else>
        <h3 class="font-medium text-foreground">Aun no tienes tostadores</h3>
        <p class="text-sm text-muted-foreground mt-1">
          Registra tu primer tostador para empezar.
        </p>
        <NuxtLink to="/roasters/new">
          <Button class="mt-4">
            <Icon name="lucide:plus" class="w-4 h-4" />
            Agregar tostador
          </Button>
        </NuxtLink>
      </template>
    </div>

    <!-- Roasters grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RoasterCard
        v-for="roaster in filteredRoasters"
        :key="roaster.id"
        :roaster="roaster"
      />
    </div>
  </div>
</template>
