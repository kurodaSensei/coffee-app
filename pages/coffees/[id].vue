<script setup lang="ts">
import type { Coffee, CoffeeInput } from '~/types'
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

const avgRating = computed(() => {
  if (!tastings.value.length) return null
  const avg = tastings.value.reduce((s, t) => s + t.ratingOverall, 0) / tastings.value.length
  return avg % 1 === 0 ? avg : avg.toFixed(1)
})

const scaDisplay = computed(() => {
  const score = coffee.value?.scaScore
  if (!score) return null
  const str = String(score)
  const dot = str.indexOf('.')
  return {
    integer: dot >= 0 ? str.slice(0, dot) : str,
    decimal: dot >= 0 ? str.slice(dot) : '',
  }
})

const flavorSubtitle = computed(() => {
  const notes = coffee.value?.flavorNotes
  if (!notes?.length) return null
  return notes.join(', ') + '.'
})

async function onEditSubmit(data: Partial<CoffeeInput>) {
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
  <div class="pb-24">
    <!-- Loading -->
    <div v-if="coffeesStore.loading && !coffee" class="flex flex-col items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 font-mono text-eyebrow uppercase text-muted-foreground">Cargando cafe...</p>
    </div>

    <!-- Error -->
    <Card v-else-if="coffeesStore.error" class="max-w-md mx-auto mt-12 border-destructive/30 bg-destructive/5">
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
      <!-- Sticky top bar -->
      <div class="flex items-center gap-2 py-3 mb-6 sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border/20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <NuxtLink to="/coffees">
          <Button variant="ghost" size="icon" class="-ml-2">
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
          </Button>
        </NuxtLink>
        <p class="font-mono text-eyebrow uppercase text-muted-foreground flex-1 truncate">
          {{ coffee.roasterName }}
        </p>
        <Button variant="ghost" size="icon" @click="showShareDialog = true" class="relative">
          <Icon name="lucide:share-2" class="w-4 h-4" />
          <span v-if="coffee?.sharedWith?.length" class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full text-[8px] text-primary-foreground flex items-center justify-center font-mono">
            {{ coffee.sharedWith.length }}
          </span>
        </Button>
        <Button variant="ghost" size="icon" @click="showEditDialog = true">
          <Icon name="lucide:pencil" class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive" @click="showDeleteDialog = true">
          <Icon name="lucide:trash-2" class="w-4 h-4" />
        </Button>
      </div>

      <!-- Hero: process eyebrow + name + subtitle -->
      <div class="mt-3 mb-5">
        <p class="font-mono text-[9px] uppercase tracking-[.14em] text-moss-ghost">
          — {{ getProcessLabel(coffee.process) }} · {{ coffee.variety }}
        </p>
        <h1 class="font-serif text-moss dark:text-paper" style="font-size: clamp(36px, 8vw, 52px); line-height: 0.9; letter-spacing: -0.03em; margin-top: 6px">
          {{ coffee.name }}.
        </h1>
        <p v-if="flavorSubtitle" class="font-serif italic text-[14px] text-moss-ghost mt-2 leading-[1.4]">
          {{ flavorSubtitle }}
        </p>
      </div>

      <!-- Score section (SCA) -->
      <div v-if="scaDisplay" class="py-5 border-t border-b border-moss/10 mb-5 flex items-baseline justify-between">
        <div>
          <span class="font-serif text-olive" style="font-size: 72px; line-height: 0.85; letter-spacing: -0.04em">{{ scaDisplay.integer }}</span>
          <span class="font-serif italic text-moss-ghost" style="font-size: 22px">{{ scaDisplay.decimal }}</span>
        </div>
        <div class="text-right">
          <p class="font-mono text-[9px] uppercase tracking-[.14em] text-moss-ghost">Puntaje</p>
          <p class="font-mono text-[9px] uppercase tracking-[.14em] text-moss-ghost mt-0.5">SCA · {{ new Date().getFullYear() }}</p>
        </div>
      </div>

      <!-- Flavor chips -->
      <div v-if="coffee.flavorNotes.length > 0" class="flex flex-wrap gap-1.5 mb-6">
        <span
          v-for="(note, idx) in coffee.flavorNotes"
          :key="note"
          :class="idx === 0
            ? 'bg-olive text-paper px-2.5 py-1 rounded-pill text-[10px] font-medium'
            : 'bg-surface text-moss dark:bg-muted dark:text-foreground/70 px-2.5 py-1 rounded-pill text-[10px] font-medium'"
        >
          {{ note }}
        </span>
      </div>

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
                  <p class="font-mono text-eyebrow uppercase text-muted-foreground">Pais</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originCountry }}</p>
                </div>
                <div>
                  <p class="font-mono text-eyebrow uppercase text-muted-foreground">Region</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originRegion }}</p>
                </div>
                <div v-if="coffee.originFarm">
                  <p class="font-mono text-eyebrow uppercase text-muted-foreground">Finca</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originFarm }}</p>
                </div>
                <div v-if="coffee.originProducer">
                  <p class="font-mono text-eyebrow uppercase text-muted-foreground">Productor</p>
                  <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.originProducer }}</p>
                </div>
                <div v-if="coffee.altitude">
                  <p class="font-mono text-eyebrow uppercase text-muted-foreground">Altitud</p>
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
                    <span class="font-mono text-data text-foreground">
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
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Variedad</p>
                <p class="text-sm font-medium text-foreground mt-0.5">{{ coffee.variety }}</p>
              </div>
              <Separator />
              <div>
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Proceso</p>
                <Badge variant="secondary" class="mt-1">
                  {{ getProcessLabel(coffee.process) }}
                </Badge>
              </div>
              <Separator />
              <div v-if="coffee.roastLevel">
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Nivel de tueste</p>
                <p class="text-sm font-medium text-foreground mt-0.5">
                  {{ getRoastLevelLabel(coffee.roastLevel) }}
                </p>
              </div>
              <Separator v-if="coffee.roastLevel" />
              <div v-if="coffee.scaScore">
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Puntaje SCA</p>
                <div class="flex items-baseline gap-1 mt-0.5">
                  <span class="font-serif text-h2 text-foreground">{{ coffee.scaScore }}</span>
                  <span class="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <Separator v-if="coffee.scaScore" />
              <div v-if="coffee.roastDate">
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Fecha de tueste</p>
                <p class="text-sm font-medium text-foreground mt-0.5">{{ formatDate(coffee.roastDate) }}</p>
              </div>
              <div>
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Tostador</p>
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
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Precio</p>
                <p class="font-mono text-data text-foreground mt-0.5">
                  {{ formatPrice(coffee.price) }}
                </p>
              </div>
              <div v-if="coffee.weight">
                <p class="font-mono text-eyebrow uppercase text-muted-foreground">Peso</p>
                <p class="text-sm font-medium text-foreground mt-0.5">
                  {{ formatWeight(coffee.weight) }}
                </p>
              </div>
              <div v-if="coffee.price && coffee.weight">
                <Separator />
                <p class="font-mono text-eyebrow uppercase text-muted-foreground mt-4">Precio por gramo</p>
                <p class="text-sm font-medium text-foreground mt-0.5">
                  {{ formatPrice(Math.round(coffee.price / coffee.weight)) }}/g
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Metadata -->
          <div class="rounded-lg bg-muted/50 px-4 py-3 space-y-1">
            <p class="font-mono text-eyebrow text-muted-foreground">Agregado: {{ formatDate(coffee.createdAt) }}</p>
            <p class="font-mono text-eyebrow text-muted-foreground">Actualizado: {{ formatDate(coffee.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Fixed CTA bottom (mobile) -->
      <NuxtLink
        :to="`/tastings/new?coffeeId=${coffeeId}`"
        class="lg:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] inset-x-4 z-30 block"
      >
        <div class="rounded-xl bg-moss text-paper px-4 py-3.5 flex items-center justify-between shadow-fab">
          <div>
            <p class="font-mono text-[8px] uppercase tracking-[.14em] text-paper/50">
              {{ tastings.length }} {{ tastings.length === 1 ? 'catación' : 'cataciones' }}
            </p>
            <p class="font-serif text-[14px] leading-snug mt-0.5">Cata este café</p>
          </div>
          <span class="text-honey text-[18px] font-serif leading-none">+</span>
        </div>
      </NuxtLink>

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
