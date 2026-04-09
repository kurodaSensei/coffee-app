<script setup lang="ts">
import type { Coffee } from '~/types'

const route = useRoute()
const router = useRouter()
const coffeesStore = useCoffeesStore()
const tastingsStore = useTastingsStore()

const coffeeId = computed(() => route.params.id as string)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editLoading = ref(false)

onMounted(async () => {
  await coffeesStore.loadById(coffeeId.value)
  await tastingsStore.loadAll({ coffeeId: coffeeId.value })
})

const coffee = computed(() => coffeesStore.current)
const tastings = computed(() => tastingsStore.list)

// Edit
async function onEditSubmit(data: Record<string, any>) {
  editLoading.value = true
  try {
    await coffeesStore.update(coffeeId.value, data as Partial<Coffee>)
    showEditModal.value = false
  } catch {
    // Error handled by store
  } finally {
    editLoading.value = false
  }
}

// Delete
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
    <div v-if="coffeesStore.loading && !coffee" class="flex justify-center py-12">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 text-coffee-400 animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="coffeesStore.error" class="text-center py-12">
      <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p class="text-red-600">{{ coffeesStore.error }}</p>
      <UiButton variant="secondary" class="mt-4" @click="router.push('/coffees')">
        Volver a cafes
      </UiButton>
    </div>

    <!-- Content -->
    <template v-else-if="coffee">
      <LayoutPageHeader :title="coffee.name" :subtitle="coffee.roasterName">
        <template #actions>
          <UiButton variant="secondary" @click="showEditModal = true">
            <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-1" />
            Editar
          </UiButton>
          <UiButton variant="danger" @click="showDeleteModal = true">
            <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
            Eliminar
          </UiButton>
        </template>
      </LayoutPageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Photo -->
          <div
            v-if="coffee.photoUrl"
            class="rounded-xl overflow-hidden bg-coffee-100 max-h-72"
          >
            <img
              :src="coffee.photoUrl"
              :alt="coffee.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Origin card -->
          <UiCard title="Origen">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Pais</p>
                <p class="font-medium text-coffee-900">{{ coffee.originCountry }}</p>
              </div>
              <div>
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Region</p>
                <p class="font-medium text-coffee-900">{{ coffee.originRegion }}</p>
              </div>
              <div v-if="coffee.originFarm">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Finca</p>
                <p class="font-medium text-coffee-900">{{ coffee.originFarm }}</p>
              </div>
              <div v-if="coffee.originProducer">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Productor</p>
                <p class="font-medium text-coffee-900">{{ coffee.originProducer }}</p>
              </div>
              <div v-if="coffee.altitude">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Altitud</p>
                <p class="font-medium text-coffee-900">{{ formatAltitude(coffee.altitude) }}</p>
              </div>
            </div>
          </UiCard>

          <!-- Flavor notes -->
          <UiCard v-if="coffee.flavorNotes.length > 0" title="Notas de sabor">
            <div class="flex flex-wrap gap-2">
              <UiBadge
                v-for="note in coffee.flavorNotes"
                :key="note"
                color="coffee"
              >
                {{ note }}
              </UiBadge>
            </div>
          </UiCard>

          <!-- Tastings for this coffee -->
          <UiCard title="Cataciones">
            <div v-if="tastings.length > 0" class="space-y-3">
              <div
                v-for="tasting in tastings"
                :key="tasting.id"
                class="flex items-center justify-between p-3 rounded-lg bg-coffee-50 hover:bg-coffee-100 transition-colors cursor-pointer"
                @click="router.push(`/tastings/${tasting.id}`)"
              >
                <div>
                  <p class="font-medium text-coffee-900">
                    {{ getBrewMethodLabel(tasting.brewMethod) }}
                  </p>
                  <p class="text-sm text-coffee-500">
                    {{ formatDate(tasting.brewDate) }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-coffee-800">
                    {{ tasting.ratingOverall }}
                  </span>
                  <span class="text-sm text-coffee-400">/10</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6">
              <Icon name="heroicons:clipboard-document-list" class="w-8 h-8 text-coffee-300 mx-auto mb-2" />
              <p class="text-sm text-coffee-500">
                No hay cataciones registradas para este cafe
              </p>
              <UiButton
                variant="secondary"
                size="sm"
                class="mt-3"
                @click="router.push(`/tastings/new?coffeeId=${coffee.id}`)"
              >
                Agregar catacion
              </UiButton>
            </div>
          </UiCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick info -->
          <UiCard title="Detalles">
            <div class="space-y-3">
              <div>
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Variedad</p>
                <p class="font-medium text-coffee-900">{{ coffee.variety }}</p>
              </div>
              <div>
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Proceso</p>
                <UiBadge color="blue" class="mt-0.5">
                  {{ getProcessLabel(coffee.process) }}
                </UiBadge>
              </div>
              <div v-if="coffee.roastLevel">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Nivel de tueste</p>
                <p class="font-medium text-coffee-900">
                  {{ getRoastLevelLabel(coffee.roastLevel) }}
                </p>
              </div>
              <div v-if="coffee.scaScore">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Puntaje SCA</p>
                <p class="font-medium text-coffee-900">{{ coffee.scaScore }}</p>
              </div>
              <div v-if="coffee.roastDate">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Fecha de tueste</p>
                <p class="font-medium text-coffee-900">{{ formatDate(coffee.roastDate) }}</p>
              </div>
            </div>
          </UiCard>

          <!-- Price/Weight -->
          <UiCard v-if="coffee.price || coffee.weight" title="Compra">
            <div class="space-y-3">
              <div v-if="coffee.price">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Precio</p>
                <p class="text-xl font-bold text-coffee-800">
                  {{ formatPrice(coffee.price) }}
                </p>
              </div>
              <div v-if="coffee.weight">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Peso</p>
                <p class="font-medium text-coffee-900">
                  {{ formatWeight(coffee.weight) }}
                </p>
              </div>
              <div v-if="coffee.price && coffee.weight">
                <p class="text-xs text-coffee-500 uppercase tracking-wide">Precio por gramo</p>
                <p class="font-medium text-coffee-900">
                  {{ formatPrice(Math.round(coffee.price / coffee.weight)) }}/g
                </p>
              </div>
            </div>
          </UiCard>

          <!-- Metadata -->
          <div class="text-xs text-coffee-400 space-y-1">
            <p>Agregado: {{ formatDate(coffee.createdAt) }}</p>
            <p>Actualizado: {{ formatDate(coffee.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <UiModal v-model="showEditModal" title="Editar Cafe">
        <CoffeeCoffeeForm
          :initial-data="coffee"
          :loading="editLoading"
          @submit="onEditSubmit"
          @cancel="showEditModal = false"
        />
      </UiModal>

      <!-- Delete confirmation Modal -->
      <UiModal v-model="showDeleteModal" title="Eliminar Cafe">
        <p class="text-coffee-700">
          Estas seguro de que deseas eliminar
          <strong>{{ coffee.name }}</strong>?
          Esta accion no se puede deshacer.
        </p>
        <template #footer>
          <UiButton variant="ghost" @click="showDeleteModal = false">
            Cancelar
          </UiButton>
          <UiButton variant="danger" @click="confirmDelete">
            Eliminar
          </UiButton>
        </template>
      </UiModal>
    </template>
  </div>
</template>
