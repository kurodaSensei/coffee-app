<script setup lang="ts">
import type { Coffee } from '~/types'
import { formatDate, getBrewMethodLabel, getProcessLabel, getRoastLevelLabel, formatPrice, formatWeight, formatAltitude } from '~/utils/formatters'

const route = useRoute()
const router = useRouter()
const coffeesStore = useCoffeesStore()
const tastingsStore = useTastingsStore()

const coffeeId = computed(() => route.params.id as string)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const showShareDialog = ref(false)
const editLoading = ref(false)

onMounted(async () => {
  await coffeesStore.loadById(coffeeId.value)
  await tastingsStore.loadAll({ coffeeId: coffeeId.value })
})

const coffee = computed(() => coffeesStore.current)
const tastings = computed(() => tastingsStore.list)

async function onEditSubmit(data: Record<string, any>) {
  editLoading.value = true
  try {
    await coffeesStore.update(coffeeId.value, data as Partial<Coffee>)
    showEditDialog.value = false
  } catch {
    // Error handled by store
  } finally {
    editLoading.value = false
  }
}

async function confirmDelete() {
  try {
    await coffeesStore.remove(coffeeId.value)
    router.push('/coffees')
  } catch {
    // Error handled by store
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="coffeesStore.loading && !coffee" class="flex flex-col items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 text-sm text-muted-foreground">Cargando cafe...</p>
    </div>

    <!-- Error -->
    <Card v-else-if="coffeesStore.error" class="max-w-md mx-auto border-destructive/30 bg-destructive/5">
      <CardContent class="flex flex-col items-center text-center py-10">
        <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icon name="lucide:alert-triangle" class="w-7 h-7 text-destructive" />
        </div>
        <p class="text-destructive font-medium">{{ coffeesStore.error }}</p>
        <Button variant="outline" class="mt-4" @click="router.push('/coffees')">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver a cafes
        </Button>
      </CardContent>
    </Card>

    <!-- Content -->
    <template v-else-if="coffee">
      <LayoutHeader :title="coffee.name" :subtitle="coffee.roasterName">
        <NuxtLink to="/coffees">
          <Button variant="ghost" size="sm">
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            Volver
          </Button>
        </NuxtLink>
        <Button variant="outline" size="sm" @click="showShareDialog = true">
          <Icon name="lucide:share-2" class="w-4 h-4" />
          Compartir
          <Badge v-if="coffee?.sharedWith?.length" variant="secondary" class="ml-1 h-5 px-1.5">
            {{ coffee.sharedWith.length }}
          </Badge>
        </Button>
        <Button variant="outline" size="sm" @click="showEditDialog = true">
          <Icon name="lucide:pencil" class="w-4 h-4" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" @click="showDeleteDialog = true">
          <Icon name="lucide:trash-2" class="w-4 h-4" />
          Eliminar
        </Button>
      </LayoutHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Photo -->
          <div
            v-if="coffee.photoUrl"
            class="rounded-xl overflow-hidden bg-muted max-h-72 ring-1 ring-border"
          >
            <img
              :src="coffee.photoUrl"
              :alt="coffee.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Origin card -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center gap-2">
                <Icon name="lucide:map-pin" class="w-4 h-4 text-muted-foreground" />
                <CardTitle class="text-base">Origen</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pais</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originCountry }}</p>
                </div>
                <div>
                  <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Region</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originRegion }}</p>
                </div>
                <div v-if="coffee.originFarm">
                  <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Finca</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originFarm }}</p>
                </div>
                <div v-if="coffee.originProducer">
                  <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Productor</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originProducer }}</p>
                </div>
                <div v-if="coffee.altitude">
                  <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Altitud</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ formatAltitude(coffee.altitude) }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Flavor notes -->
          <Card v-if="coffee.flavorNotes.length > 0">
            <CardHeader class="pb-3">
              <div class="flex items-center gap-2">
                <Icon name="lucide:palette" class="w-4 h-4 text-muted-foreground" />
                <CardTitle class="text-base">Notas de sabor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="note in coffee.flavorNotes"
                  :key="note"
                  variant="secondary"
                  class="px-3 py-1"
                >
                  {{ note }}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <!-- Tastings for this coffee -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:clipboard-list" class="w-4 h-4 text-muted-foreground" />
                  <CardTitle class="text-base">Cataciones</CardTitle>
                </div>
                <Badge variant="secondary" class="text-xs">{{ tastings.length }}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div v-if="tastings.length > 0" class="divide-y divide-border">
                <div
                  v-for="tasting in tastings"
                  :key="tasting.id"
                  class="flex items-center justify-between py-3 first:pt-0 last:pb-0 group cursor-pointer hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors"
                  @click="router.push(`/tastings/${tasting.id}`)"
                >
                  <div>
                    <p class="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {{ getBrewMethodLabel(tasting.brewMethod) }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      {{ formatDate(tasting.brewDate) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Icon v-if="tasting.isFavorite" name="lucide:heart" class="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span class="text-lg font-bold tabular-nums text-foreground">
                      {{ tasting.ratingOverall }}
                    </span>
                    <span class="text-xs text-muted-foreground">/10</span>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center py-8 text-center">
                <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Icon name="lucide:clipboard-list" class="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p class="text-sm text-muted-foreground">
                  No hay cataciones registradas para este cafe
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  class="mt-3"
                  @click="router.push(`/tastings/new?coffeeId=${coffee.id}`)"
                >
                  <Icon name="lucide:plus" class="w-4 h-4" />
                  Agregar catacion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick info -->
          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-base">Detalles</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Variedad</p>
                <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.variety }}</p>
              </div>
              <Separator />
              <div>
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Proceso</p>
                <Badge variant="secondary" class="mt-1">
                  {{ getProcessLabel(coffee.process) }}
                </Badge>
              </div>
              <Separator />
              <div v-if="coffee.roastLevel">
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Nivel de tueste</p>
                <p class="text-sm font-medium text-foreground mt-0.5">
                  {{ getRoastLevelLabel(coffee.roastLevel) }}
                </p>
              </div>
              <Separator v-if="coffee.roastLevel" />
              <div v-if="coffee.scaScore">
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Puntaje SCA</p>
                <div class="flex items-baseline gap-1 mt-0.5">
                  <span class="text-2xl font-bold text-foreground tabular-nums">{{ coffee.scaScore }}</span>
                  <span class="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <Separator v-if="coffee.scaScore" />
              <div v-if="coffee.roastDate">
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fecha de tueste</p>
                <p class="text-sm font-medium text-foreground mt-0.5">{{ formatDate(coffee.roastDate) }}</p>
              </div>
              <div>
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Tostador</p>
                <NuxtLink
                  :to="`/roasters/${coffee.roasterId}`"
                  class="text-sm font-medium text-primary hover:underline underline-offset-2 mt-0.5 inline-block"
                >
                  {{ coffee.roasterName }}
                </NuxtLink>
              </div>
            </CardContent>
          </Card>

          <!-- Price/Weight -->
          <Card v-if="coffee.price || coffee.weight">
            <CardHeader class="pb-3">
              <div class="flex items-center gap-2">
                <Icon name="lucide:tag" class="w-4 h-4 text-muted-foreground" />
                <CardTitle class="text-base">Compra</CardTitle>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-if="coffee.price">
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Precio</p>
                <p class="text-xl font-bold text-foreground tabular-nums mt-0.5">
                  {{ formatPrice(coffee.price) }}
                </p>
              </div>
              <div v-if="coffee.weight">
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Peso</p>
                <p class="text-sm font-medium text-foreground mt-0.5">
                  {{ formatWeight(coffee.weight) }}
                </p>
              </div>
              <div v-if="coffee.price && coffee.weight">
                <Separator />
                <p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-4">Precio por gramo</p>
                <p class="text-sm font-medium text-foreground mt-0.5">
                  {{ formatPrice(Math.round(coffee.price / coffee.weight)) }}/g
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Metadata -->
          <div class="rounded-lg bg-muted/50 px-4 py-3 space-y-1">
            <p class="text-[11px] text-muted-foreground">Agregado: {{ formatDate(coffee.createdAt) }}</p>
            <p class="text-[11px] text-muted-foreground">Actualizado: {{ formatDate(coffee.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Dialog -->
      <Dialog v-model:open="showEditDialog">
        <DialogScrollContent class="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cafe</DialogTitle>
            <DialogDescription>Modifica los datos del cafe.</DialogDescription>
          </DialogHeader>
          <CoffeeForm
            :initial-data="coffee"
            :loading="editLoading"
            @submit="onEditSubmit"
            @cancel="showEditDialog = false"
          />
        </DialogScrollContent>
      </Dialog>

      <!-- Delete confirmation Dialog -->
      <Dialog v-model:open="showDeleteDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cafe</DialogTitle>
            <DialogDescription>Esta accion es irreversible.</DialogDescription>
          </DialogHeader>
          <p class="text-sm text-muted-foreground">
            Estas seguro de que deseas eliminar
            <strong class="text-foreground">{{ coffee.name }}</strong>?
            Todas las cataciones asociadas se perderan.
          </p>
          <DialogFooter class="gap-2 sm:gap-0">
            <Button variant="outline" @click="showDeleteDialog = false">
              Cancelar
            </Button>
            <Button variant="destructive" @click="confirmDelete">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Share Dialog -->
      <ShareDialog
        v-if="coffee"
        v-model:open="showShareDialog"
        collection="coffees"
        :item-id="coffee.id"
        :item-name="coffee.name"
        :current-shared="coffee.sharedWith"
        @shared="coffeesStore.loadById(coffeeId)"
      />
    </template>
  </div>
</template>
