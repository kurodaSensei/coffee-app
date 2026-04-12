<script setup lang="ts">
import type { CoffeeProcess } from '~/types'

const coffeesStore = useCoffeesStore()
const router = useRouter()

interface Filters {
  search: string
  process: CoffeeProcess | ''
  variety: string
  region: string
}

const localFilters = ref<Filters>({
  search: '',
  process: '',
  variety: '',
  region: '',
})

const activeTab = ref('mine')

onMounted(() => {
  coffeesStore.loadAll()
  coffeesStore.loadShared()
})

function onFiltersUpdate(filters: Filters) {
  localFilters.value = filters
}

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

  if (process) {
    results = results.filter((c) => c.process === process)
  }

  if (variety) {
    results = results.filter((c) => c.variety === variety)
  }

  if (region) {
    results = results.filter((c) => c.originRegion === region)
  }

  return results
})
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Cafes" subtitle="Tu coleccion de cafes de especialidad">
      <NuxtLink to="/coffees/new">
        <Button>
          <Icon name="lucide:plus" class="w-4 h-4" />
          Agregar
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList>
        <TabsTrigger value="mine">
          Mis cafés
          <Badge variant="secondary" class="ml-2">{{ coffeesStore.list.length }}</Badge>
        </TabsTrigger>
        <TabsTrigger value="shared">
          Compartidos conmigo
          <Badge variant="secondary" class="ml-2">{{ coffeesStore.sharedList.length }}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mine" class="space-y-4">
        <CoffeeFilters @update:filters="onFiltersUpdate" />

        <div v-if="coffeesStore.loading" class="flex flex-col items-center justify-center py-16">
          <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
          <p class="mt-3 text-sm text-muted-foreground">Cargando cafes...</p>
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

        <CoffeeList v-else :coffees="filteredCoffees" />
      </TabsContent>

      <TabsContent value="shared" class="space-y-4">
        <div v-if="coffeesStore.sharedList.length === 0" class="text-center py-16 border border-dashed rounded-lg">
          <Icon name="lucide:share-2" class="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p class="text-sm font-medium text-foreground">Nadie te ha compartido cafés aún</p>
          <p class="text-xs text-muted-foreground mt-1">Cuando un amigo comparta un café contigo aparecerá aquí.</p>
        </div>
        <CoffeeList v-else :coffees="coffeesStore.sharedList" />
      </TabsContent>
    </Tabs>
  </div>
</template>
