<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'
import { formatDate, getBrewMethodLabel, formatBrewTime } from '~/utils/formatters'

const route = useRoute()
const router = useRouter()
const tastingsStore = useTastingsStore()
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const loading = ref(false)

const id = route.params.id as string

onMounted(() => {
  tastingsStore.loadById(id)
})

const tasting = computed(() => tastingsStore.current)

async function handleDelete() {
  await tastingsStore.remove(id)
  router.push('/tastings')
}

async function handleUpdate(data: Record<string, any>) {
  loading.value = true
  try {
    await tastingsStore.update(id, {
      ...data,
      brewDate: Timestamp.fromDate(new Date(data.brewDate)),
    })
    showEditDialog.value = false
    await tastingsStore.loadById(id)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="tasting" class="space-y-6">
    <LayoutHeader :title="tasting.coffeeName" :subtitle="`por ${tasting.roasterName}`">
      <NuxtLink to="/tastings">
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Info principal -->
      <Card>
        <CardContent class="pt-6">
          <!-- Top bar: method + date + badges -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <Badge>{{ getBrewMethodLabel(tasting.brewMethod) }}</Badge>
              <span class="text-sm text-muted-foreground">{{ formatDate(tasting.brewDate) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div v-if="tasting.isFavorite" class="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Icon name="lucide:heart" class="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
              <div v-if="tasting.wouldBuyAgain" class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Icon name="lucide:refresh-cw" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <!-- Rating hero -->
          <div class="text-center py-6 bg-muted/50 rounded-xl">
            <div class="text-5xl font-bold text-foreground tabular-nums">{{ tasting.ratingOverall }}</div>
            <div class="text-sm text-muted-foreground mt-1">/ 10</div>
          </div>

          <!-- Brew parameters -->
          <div v-if="tasting.dose || tasting.water || tasting.waterTemp" class="grid grid-cols-3 gap-3 mt-6 pt-6 border-t">
            <div v-if="tasting.dose" class="text-center rounded-lg bg-muted/50 py-2.5">
              <div class="text-[11px] text-muted-foreground uppercase tracking-wider">Dosis</div>
              <div class="font-semibold text-foreground text-sm mt-0.5">{{ tasting.dose }}g</div>
            </div>
            <div v-if="tasting.water" class="text-center rounded-lg bg-muted/50 py-2.5">
              <div class="text-[11px] text-muted-foreground uppercase tracking-wider">Agua</div>
              <div class="font-semibold text-foreground text-sm mt-0.5">{{ tasting.water }}g</div>
            </div>
            <div v-if="tasting.ratio" class="text-center rounded-lg bg-muted/50 py-2.5">
              <div class="text-[11px] text-muted-foreground uppercase tracking-wider">Ratio</div>
              <div class="font-semibold text-foreground text-sm mt-0.5">{{ tasting.ratio }}</div>
            </div>
            <div v-if="tasting.waterTemp" class="text-center rounded-lg bg-muted/50 py-2.5">
              <div class="text-[11px] text-muted-foreground uppercase tracking-wider">Temp</div>
              <div class="font-semibold text-foreground text-sm mt-0.5">{{ tasting.waterTemp }}°C</div>
            </div>
            <div v-if="tasting.grindSize" class="text-center rounded-lg bg-muted/50 py-2.5">
              <div class="text-[11px] text-muted-foreground uppercase tracking-wider">Molienda</div>
              <div class="font-semibold text-foreground text-sm mt-0.5">{{ tasting.grindSize }} clicks</div>
            </div>
            <div v-if="tasting.brewTime" class="text-center rounded-lg bg-muted/50 py-2.5">
              <div class="text-[11px] text-muted-foreground uppercase tracking-wider">Tiempo</div>
              <div class="font-semibold text-foreground text-sm mt-0.5">{{ formatBrewTime(tasting.brewTime) }}</div>
            </div>
          </div>

          <!-- Personal notes -->
          <div v-if="tasting.personalNotes" class="mt-6 pt-6 border-t">
            <h4 class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Notas personales</h4>
            <p class="text-sm text-foreground leading-relaxed">{{ tasting.personalNotes }}</p>
          </div>

          <!-- Link to coffee -->
          <div class="mt-6 pt-4 border-t">
            <NuxtLink :to="`/coffees/${tasting.coffeeId}`">
              <Button variant="ghost" size="sm" class="px-0 text-primary hover:text-primary/80">
                <Icon name="lucide:coffee" class="w-4 h-4" />
                Ver detalle del cafe
              </Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>

      <!-- Ratings -->
      <TastingRatings :tasting="tasting" />
    </div>

    <!-- Edit Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogScrollContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Degustacion</DialogTitle>
          <DialogDescription>Modifica los datos de la catacion.</DialogDescription>
        </DialogHeader>
        <TastingForm
          :initial-data="tasting"
          :loading="loading"
          @submit="handleUpdate"
          @cancel="showEditDialog = false"
        />
      </DialogScrollContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Degustacion</DialogTitle>
          <DialogDescription>Esta accion es irreversible.</DialogDescription>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">
          Estas seguro de que deseas eliminar esta degustacion?
          Los datos se perderan permanentemente.
        </p>
        <DialogFooter class="gap-2 sm:gap-0">
          <Button variant="outline" @click="showDeleteDialog = false">
            Cancelar
          </Button>
          <Button variant="destructive" @click="handleDelete">
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>

  <!-- Loading -->
  <div v-else class="flex flex-col items-center justify-center py-20">
    <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
    <p class="mt-3 text-sm text-muted-foreground">Cargando degustacion...</p>
  </div>
</template>
