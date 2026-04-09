<script setup lang="ts">
import { formatDate } from '~/utils/formatters'

const route = useRoute()
const router = useRouter()
const roasterStore = useRoastersStore()
const coffeesStore = useCoffeesStore()

const roasterId = computed(() => route.params.id as string)

const showEditModal = ref(false)
const showDeleteConfirm = ref(false)

onMounted(async () => {
  await roasterStore.loadById(roasterId.value)
  await coffeesStore.loadAll({ roasterId: roasterId.value })
})

const roaster = computed(() => roasterStore.current)
const roasterCoffees = computed(() =>
  coffeesStore.list.filter((c) => c.roasterId === roasterId.value),
)

async function onEditSubmit(data: Record<string, any>) {
  try {
    await roasterStore.update(roasterId.value, data)
    showEditModal.value = false
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
    <div v-if="roasterStore.loading && !roaster" class="flex items-center justify-center py-12">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 text-coffee-400 animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="roasterStore.error && !roaster" class="text-center py-12">
      <p class="text-red-600">{{ roasterStore.error }}</p>
      <NuxtLink to="/roasters">
        <UiButton variant="secondary" class="mt-4">Volver a tostadores</UiButton>
      </NuxtLink>
    </div>

    <!-- Content -->
    <template v-else-if="roaster">
      <LayoutPageHeader :title="roaster.name">
        <template #actions>
          <NuxtLink to="/roasters">
            <UiButton variant="ghost" size="sm">
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
              Volver
            </UiButton>
          </NuxtLink>
          <UiButton variant="secondary" size="sm" @click="showEditModal = true">
            <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-1" />
            Editar
          </UiButton>
          <UiButton variant="danger" size="sm" @click="showDeleteConfirm = true">
            <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
            Eliminar
          </UiButton>
        </template>
      </LayoutPageHeader>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Info card -->
        <UiCard class="lg:col-span-2">
          <div class="space-y-4">
            <!-- Location -->
            <div class="flex items-start gap-3">
              <Icon name="heroicons:map-pin" class="w-5 h-5 text-coffee-400 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-coffee-600">Ubicación</p>
                <p class="text-coffee-900">
                  <span v-if="roaster.city">{{ roaster.city }}, </span>
                  {{ roaster.country }}
                </p>
              </div>
            </div>

            <!-- Website -->
            <div v-if="roaster.website" class="flex items-start gap-3">
              <Icon name="heroicons:globe-alt" class="w-5 h-5 text-coffee-400 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-coffee-600">Sitio web</p>
                <a
                  :href="roaster.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-coffee-700 hover:text-coffee-900 underline underline-offset-2 transition-colors"
                >
                  {{ roaster.website }}
                </a>
              </div>
            </div>

            <!-- Instagram -->
            <div v-if="roaster.instagram" class="flex items-start gap-3">
              <Icon name="heroicons:camera" class="w-5 h-5 text-coffee-400 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-coffee-600">Instagram</p>
                <a
                  :href="`https://instagram.com/${roaster.instagram.replace('@', '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-coffee-700 hover:text-coffee-900 underline underline-offset-2 transition-colors"
                >
                  {{ roaster.instagram }}
                </a>
              </div>
            </div>

            <!-- Rating -->
            <div v-if="roaster.rating" class="flex items-start gap-3">
              <Icon name="heroicons:star" class="w-5 h-5 text-coffee-400 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-coffee-600">Calificación</p>
                <UiRating :model-value="roaster.rating" readonly />
              </div>
            </div>

            <!-- Notes -->
            <div v-if="roaster.notes" class="flex items-start gap-3">
              <Icon name="heroicons:document-text" class="w-5 h-5 text-coffee-400 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-coffee-600">Notas</p>
                <p class="text-coffee-900 whitespace-pre-line">{{ roaster.notes }}</p>
              </div>
            </div>

            <!-- Dates -->
            <div class="pt-4 border-t border-coffee-100 text-sm text-coffee-400">
              Agregado el {{ formatDate(roaster.createdAt) }}
            </div>
          </div>
        </UiCard>

        <!-- Coffees sidebar -->
        <div>
          <UiCard title="Cafés de este tostador">
            <div v-if="coffeesStore.loading" class="flex items-center justify-center py-4">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 text-coffee-400 animate-spin" />
            </div>

            <div v-else-if="roasterCoffees.length === 0" class="text-center py-4">
              <p class="text-sm text-coffee-400">No hay cafés registrados</p>
            </div>

            <ul v-else class="space-y-2">
              <li v-for="coffee in roasterCoffees" :key="coffee.id">
                <NuxtLink
                  :to="`/coffees/${coffee.id}`"
                  class="block p-2 rounded-lg hover:bg-coffee-50 transition-colors"
                >
                  <p class="text-sm font-medium text-coffee-900">{{ coffee.name }}</p>
                  <p class="text-xs text-coffee-500">{{ coffee.variety }} · {{ coffee.originRegion }}</p>
                </NuxtLink>
              </li>
            </ul>
          </UiCard>
        </div>
      </div>
    </template>

    <!-- Edit Modal -->
    <UiModal v-model="showEditModal" title="Editar Tostador">
      <RoasterRoasterForm
        v-if="roaster"
        :initial-data="roaster"
        :loading="roasterStore.loading"
        @submit="onEditSubmit"
        @cancel="showEditModal = false"
      />
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal v-model="showDeleteConfirm" title="Eliminar Tostador">
      <p class="text-coffee-700">
        ¿Estás seguro de que deseas eliminar <strong>{{ roaster?.name }}</strong>? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <UiButton variant="ghost" @click="showDeleteConfirm = false">
          Cancelar
        </UiButton>
        <UiButton variant="danger" :loading="roasterStore.loading" @click="onDelete">
          Eliminar
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
