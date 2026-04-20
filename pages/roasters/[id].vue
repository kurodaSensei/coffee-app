<script setup lang="ts">
import type { Roaster, RoasterInput } from '~/types'
import { formatDate } from '~/utils/formatters'

const route = useRoute()
const router = useRouter()
const roasterStore = useRoastersStore()
const coffeesStore = useCoffeesStore()

const roasterId = computed(() => route.params.id as string)

const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

onMounted(async () => {
  await roasterStore.loadById(roasterId.value)
  await coffeesStore.loadAll({ roasterId: roasterId.value })
})

const roaster = computed(() => roasterStore.current)
const roasterCoffees = computed(() =>
  coffeesStore.list.filter((c) => c.roasterId === roasterId.value),
)

async function onEditSubmit(data: Partial<RoasterInput>) {
  try {
    await roasterStore.update(roasterId.value, data as Partial<Roaster>)
    showEditDialog.value = false
  } catch {
    // error handled by store
  }
}

async function onDelete() {
  try {
    await roasterStore.remove(roasterId.value)
    router.push('/roasters')
  } catch {
    // error handled by store
  }
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="roasterStore.loading && !roaster" class="flex flex-col items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 text-sm text-muted-foreground">Cargando tostador...</p>
    </div>

    <!-- Error -->
    <Card v-else-if="roasterStore.error && !roaster" class="max-w-md mx-auto mt-12 border-destructive/30 bg-destructive/5">
      <CardContent class="flex flex-col items-center text-center py-10">
        <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icon name="lucide:alert-triangle" class="w-7 h-7 text-destructive" />
        </div>
        <p class="text-destructive font-medium">{{ roasterStore.error }}</p>
        <NuxtLink to="/roasters">
          <Button variant="outline" class="mt-4">
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            Volver a tostadores
          </Button>
        </NuxtLink>
      </CardContent>
    </Card>

    <!-- Content -->
    <template v-else-if="roaster">
      <LayoutHeader :title="roaster.name">
        <NuxtLink to="/roasters">
          <Button variant="ghost" size="sm">
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            Volver
          </Button>
        </NuxtLink>
        <Button variant="outline" size="sm" @click="showEditDialog = true">
          <Icon name="lucide:pencil" class="w-4 h-4" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" @click="showDeleteDialog = true">
          <Icon name="lucide:trash-2" class="w-4 h-4" />
          Eliminar
        </Button>
      </LayoutHeader>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main info card -->
        <Card class="lg:col-span-2">
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Informacion</CardTitle>
          </CardHeader>
          <CardContent class="space-y-5">
            <!-- Location -->
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Icon name="lucide:map-pin" class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Ubicacion</p>
                <p class="text-sm text-foreground mt-0.5">
                  <span v-if="roaster.city">{{ roaster.city }}, </span>
                  {{ roaster.country }}
                </p>
              </div>
            </div>

            <!-- Website -->
            <div v-if="roaster.website" class="flex items-start gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Icon name="lucide:globe" class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Sitio web</p>
                <a
                  :href="roaster.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-primary hover:underline underline-offset-2 transition-colors mt-0.5 inline-block"
                >
                  {{ roaster.website }}
                </a>
              </div>
            </div>

            <!-- Instagram -->
            <div v-if="roaster.instagram" class="flex items-start gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Icon name="lucide:camera" class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Instagram</p>
                <a
                  :href="`https://instagram.com/${roaster.instagram.replace('@', '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-primary hover:underline underline-offset-2 transition-colors mt-0.5 inline-block"
                >
                  {{ roaster.instagram }}
                </a>
              </div>
            </div>

            <!-- Rating -->
            <div v-if="roaster.rating" class="flex items-start gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Icon name="lucide:star" class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Calificacion</p>
                <div class="flex items-center gap-0.5 mt-1">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    name="lucide:star"
                    :class="[
                      'w-4 h-4 transition-colors',
                      i <= roaster.rating
                        ? 'text-honey fill-honey'
                        : 'text-muted-foreground/20',
                    ]"
                  />
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="roaster.notes" class="flex items-start gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Icon name="lucide:file-text" class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Notas</p>
                <p class="text-sm text-foreground whitespace-pre-line mt-0.5">{{ roaster.notes }}</p>
              </div>
            </div>

            <!-- Date -->
            <Separator />
            <p class="text-xs text-muted-foreground">
              Agregado el {{ formatDate(roaster.createdAt) }}
            </p>
          </CardContent>
        </Card>

        <!-- Coffees sidebar -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-base">Cafes de este tostador</CardTitle>
              <Badge variant="secondary" class="text-xs">{{ roasterCoffees.length }}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div v-if="coffeesStore.loading" class="flex items-center justify-center py-6">
              <Icon name="lucide:loader-2" class="w-5 h-5 text-muted-foreground animate-spin" />
            </div>

            <div v-else-if="roasterCoffees.length === 0" class="flex flex-col items-center py-6 text-center">
              <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <Icon name="lucide:coffee" class="w-5 h-5 text-muted-foreground/50" />
              </div>
              <p class="text-sm text-muted-foreground">No hay cafes registrados</p>
            </div>

            <div v-else class="divide-y divide-border">
              <NuxtLink
                v-for="coffee in roasterCoffees"
                :key="coffee.id"
                :to="`/coffees/${coffee.id}`"
                class="block py-3 first:pt-0 last:pb-0 group hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors"
              >
                <p class="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {{ coffee.name }}
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">
                  {{ coffee.variety }} · {{ coffee.originRegion }}
                </p>
              </NuxtLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>

    <!-- Edit Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogScrollContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Tostador</DialogTitle>
          <DialogDescription>Modifica los datos del tostador.</DialogDescription>
        </DialogHeader>
        <RoasterForm
          v-if="roaster"
          :initial-data="roaster"
          :loading="roasterStore.loading"
          @submit="onEditSubmit"
          @cancel="showEditDialog = false"
        />
      </DialogScrollContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Tostador</DialogTitle>
          <DialogDescription>Esta accion es irreversible.</DialogDescription>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">
          Estas seguro de que deseas eliminar <strong class="text-foreground">{{ roaster?.name }}</strong>?
          Todos los datos asociados se perderan permanentemente.
        </p>
        <DialogFooter class="gap-2 sm:gap-0">
          <Button variant="outline" @click="showDeleteDialog = false">
            Cancelar
          </Button>
          <Button variant="destructive" :disabled="roasterStore.loading" @click="onDelete">
            <Icon v-if="roasterStore.loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
