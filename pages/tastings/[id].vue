<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'
import { formatDate, getBrewMethodLabel, formatBrewTime } from '~/utils/formatters'

const route = useRoute()
const router = useRouter()
const tastingsStore = useTastingsStore()
const showEdit = ref(false)
const loading = ref(false)

const id = route.params.id as string

onMounted(() => {
  tastingsStore.loadById(id)
})

const tasting = computed(() => tastingsStore.current)

async function handleDelete() {
  if (!confirm('¿Eliminar esta degustación?')) return
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
    showEdit.value = false
    await tastingsStore.loadById(id)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="tasting">
    <LayoutPageHeader :title="tasting.coffeeName" :subtitle="`por ${tasting.roasterName}`">
      <div class="flex gap-2">
        <button @click="showEdit = true" class="btn-secondary inline-flex items-center gap-2">
          <Icon name="heroicons:pencil" class="w-4 h-4" />
          Editar
        </button>
        <button @click="handleDelete" class="btn-danger inline-flex items-center gap-2">
          <Icon name="heroicons:trash" class="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </LayoutPageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Info principal -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <UiBadge color="coffee">{{ getBrewMethodLabel(tasting.brewMethod) }}</UiBadge>
            <span class="text-sm text-coffee-500">{{ formatDate(tasting.brewDate) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon v-if="tasting.isFavorite" name="heroicons:heart-solid" class="w-5 h-5 text-red-500" />
            <Icon v-if="tasting.wouldBuyAgain" name="heroicons:arrow-path" class="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div class="text-center py-4">
          <div class="text-5xl font-bold text-coffee-800">{{ tasting.ratingOverall }}</div>
          <div class="text-sm text-coffee-500 mt-1">/ 10</div>
        </div>

        <div v-if="tasting.dose || tasting.water || tasting.waterTemp" class="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-coffee-100">
          <div v-if="tasting.dose" class="text-center">
            <div class="text-sm text-coffee-500">Dosis</div>
            <div class="font-medium">{{ tasting.dose }}g</div>
          </div>
          <div v-if="tasting.water" class="text-center">
            <div class="text-sm text-coffee-500">Agua</div>
            <div class="font-medium">{{ tasting.water }}g</div>
          </div>
          <div v-if="tasting.ratio" class="text-center">
            <div class="text-sm text-coffee-500">Ratio</div>
            <div class="font-medium">{{ tasting.ratio }}</div>
          </div>
          <div v-if="tasting.waterTemp" class="text-center">
            <div class="text-sm text-coffee-500">Temp</div>
            <div class="font-medium">{{ tasting.waterTemp }}°C</div>
          </div>
          <div v-if="tasting.grindSize" class="text-center">
            <div class="text-sm text-coffee-500">Molienda</div>
            <div class="font-medium">{{ tasting.grindSize }} clicks</div>
          </div>
          <div v-if="tasting.brewTime" class="text-center">
            <div class="text-sm text-coffee-500">Tiempo</div>
            <div class="font-medium">{{ formatBrewTime(tasting.brewTime) }}</div>
          </div>
        </div>

        <div v-if="tasting.personalNotes" class="mt-4 pt-4 border-t border-coffee-100">
          <h4 class="text-sm font-medium text-coffee-500 mb-1">Notas</h4>
          <p class="text-coffee-700">{{ tasting.personalNotes }}</p>
        </div>

        <div class="mt-4">
          <NuxtLink :to="`/coffees/${tasting.coffeeId}`" class="text-sm text-coffee-600 hover:text-coffee-800 underline">
            Ver detalle del café
          </NuxtLink>
        </div>
      </div>

      <!-- Ratings -->
      <TastingTastingRatings :tasting="tasting" />
    </div>

    <UiModal v-model="showEdit" title="Editar Degustación">
      <TastingTastingForm
        :initial-data="tasting"
        :loading="loading"
        @submit="handleUpdate"
        @cancel="showEdit = false"
      />
    </UiModal>
  </div>

  <div v-else class="text-center py-12 text-coffee-500">
    Cargando...
  </div>
</template>
