<script setup lang="ts">
import { BREW_METHOD_OPTIONS } from '~/utils/constants'

const tastingsStore = useTastingsStore()
const filterMethod = ref('__all__')
const searchQuery = ref('')
const activeTab = ref('mine')

onMounted(() => {
  tastingsStore.loadAll()
  tastingsStore.loadShared()
})

const filteredTastings = computed(() => {
  let result = tastingsStore.list
  if (filterMethod.value && filterMethod.value !== '__all__') {
    result = result.filter(t => t.brewMethod === filterMethod.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.coffeeName.toLowerCase().includes(q) ||
      t.roasterName.toLowerCase().includes(q),
    )
  }
  return result
})
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Degustaciones" subtitle="Tu historial de catas">
      <NuxtLink to="/tastings/new">
        <Button>
          <Icon name="lucide:plus" class="w-4 h-4" />
          Agregar
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid grid-cols-2 w-full">
        <TabsTrigger value="mine">
          Mis catas
          <Badge variant="secondary" class="ml-2">{{ tastingsStore.list.length }}</Badge>
        </TabsTrigger>
        <TabsTrigger value="shared">
          Compartidas conmigo
          <Badge variant="secondary" class="ml-2">{{ tastingsStore.sharedList.length }}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mine" class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input v-model="searchQuery" placeholder="Buscar por cafe o tostador..." class="pl-9" />
          </div>
          <Select v-model="filterMethod">
            <SelectTrigger class="sm:w-52">
              <SelectValue placeholder="Todos los metodos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los metodos</SelectItem>
              <SelectItem v-for="opt in BREW_METHOD_OPTIONS" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-if="tastingsStore.loading" class="flex flex-col items-center justify-center py-16">
          <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
          <p class="mt-3 text-sm text-muted-foreground">Cargando degustaciones...</p>
        </div>

        <div v-else-if="filteredTastings.length === 0" class="text-center py-16">
          <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:clipboard-list" class="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 class="font-medium text-foreground">
            {{ searchQuery || filterMethod !== '__all__' ? 'Sin resultados' : 'No hay degustaciones aun' }}
          </h3>
          <p class="text-sm text-muted-foreground mt-1">
            {{ searchQuery || filterMethod !== '__all__' ? 'Intenta con otros filtros.' : 'Registra tu primera cata para empezar.' }}
          </p>
          <NuxtLink v-if="!searchQuery && filterMethod === '__all__'" to="/tastings/new">
            <Button class="mt-4">
              <Icon name="lucide:plus" class="w-4 h-4" />
              Registrar cata
            </Button>
          </NuxtLink>
        </div>

        <TastingList v-else :tastings="filteredTastings" />
      </TabsContent>

      <TabsContent value="shared" class="space-y-4">
        <div v-if="tastingsStore.sharedList.length === 0" class="text-center py-16 border border-dashed rounded-lg">
          <Icon name="lucide:share-2" class="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p class="text-sm font-medium text-foreground">Nadie te ha compartido catas aún</p>
          <p class="text-xs text-muted-foreground mt-1">Cuando un amigo comparta una cata contigo aparecerá aquí.</p>
        </div>
        <TastingList v-else :tastings="tastingsStore.sharedList" />
      </TabsContent>
    </Tabs>
  </div>
</template>
