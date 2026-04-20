<script setup lang="ts">
import type { CoffeeProcess } from '~/types'

const coffeesStore = useCoffeesStore()

const activeTab = ref('mine')
const localFilters = ref({
  search: '',
  process: '' as CoffeeProcess | '',
  variety: '',
  region: '',
})

onMounted(() => {
  coffeesStore.loadAll()
  coffeesStore.loadShared()
})

const filteredCoffees = computed(() => {
  let results = coffeesStore.list
  const { search, process, variety, region } = localFilters.value
  if (search) {
    const term = search.toLowerCase()
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.roasterName.toLowerCase().includes(term) ||
        c.flavorNotes.some((n) => n.toLowerCase().includes(term)),
    )
  }
  if (process) results = results.filter((c) => c.process === process)
  if (variety) results = results.filter((c) => c.variety === variety)
  if (region)  results = results.filter((c) => c.originRegion === region)
  return results
})

const pillOptions = computed(() => [
  { value: 'mine',   label: 'Míos',        count: coffeesStore.list.length },
  { value: 'shared', label: 'Compartidos', count: coffeesStore.sharedList.length },
])
</script>

<template>
  <div class="space-y-6">
    <!-- Header editorial -->
    <div class="pb-5 border-b border-border/20">
      <h1 class="font-serif text-h2 text-foreground">Mi colección.</h1>
      <p class="font-mono text-eyebrow uppercase text-muted-foreground mt-1">
        {{ coffeesStore.list.length }} cafés registrados
      </p>
    </div>

    <!-- PillToggle + Add button -->
    <div class="flex items-center justify-between">
      <UiPillToggle v-model="activeTab" :options="pillOptions" />
      <NuxtLink to="/coffees/new">
        <Button size="sm">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Agregar
        </Button>
      </NuxtLink>
    </div>

    <!-- Mis cafés -->
    <div v-if="activeTab === 'mine'" class="space-y-4">
      <CoffeeFilters @update:filters="localFilters = $event" />

      <div v-if="coffeesStore.loading" class="flex flex-col items-center justify-center py-16">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
        <p class="mt-3 font-mono text-eyebrow uppercase text-muted-foreground">Cargando cafes...</p>
      </div>

      <Card v-else-if="coffeesStore.error" class="border-destructive/30 bg-destructive/5">
        <CardContent class="flex flex-col items-center text-center py-10">
          <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Icon name="lucide:alert-triangle" class="w-7 h-7 text-destructive" />
          </div>
          <p class="text-destructive font-medium">{{ coffeesStore.error }}</p>
          <Button variant="outline" class="mt-4" @click="coffeesStore.loadAll()">
            <Icon name="lucide:refresh-cw" class="w-4 h-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>

      <div v-else-if="filteredCoffees.length === 0" class="text-center py-16 border border-dashed rounded-xl">
        <Icon name="lucide:coffee" class="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p class="font-sans text-body text-muted-foreground">Sin cafés que mostrar</p>
        <NuxtLink to="/coffees/new">
          <Button variant="outline" size="sm" class="mt-4">Agregar el primero</Button>
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoffeeCard v-for="coffee in filteredCoffees" :key="coffee.id" :coffee="coffee" />
      </div>
    </div>

    <!-- Compartidos -->
    <div v-if="activeTab === 'shared'" class="space-y-4">
      <div v-if="coffeesStore.sharedList.length === 0" class="text-center py-16 border border-dashed rounded-xl">
        <Icon name="lucide:share-2" class="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p class="font-sans text-body text-foreground/70">Nadie te ha compartido cafés aún</p>
        <p class="font-mono text-eyebrow uppercase text-muted-foreground mt-1">
          Cuando un amigo comparta, aparecerá aquí
        </p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoffeeCard v-for="coffee in coffeesStore.sharedList" :key="coffee.id" :coffee="coffee" />
      </div>
    </div>
  </div>
</template>
