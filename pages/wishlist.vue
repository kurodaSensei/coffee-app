<script setup lang="ts">
import type { WishlistItem, WishlistStatus } from '~/types'
import { PRIORITY_OPTIONS, WISHLIST_STATUS_OPTIONS } from '~/utils/constants'

const wishlistStore = useWishlistStore()

const showAddModal = ref(false)
const activeTab = ref<'all' | WishlistStatus>('all')

const form = reactive({
  coffeeName: '',
  roasterName: '',
  variety: '',
  notes: '',
  priority: 2,
  status: 'pending' as WishlistStatus,
})

onMounted(() => {
  wishlistStore.loadAll()
})

const filteredItems = computed(() => {
  if (activeTab.value === 'all') return wishlistStore.list
  return wishlistStore.list.filter((item) => item.status === activeTab.value)
})

const tabs = [
  { key: 'all' as const, label: 'Todos' },
  { key: 'pending' as const, label: 'Pendiente' },
  { key: 'purchased' as const, label: 'Comprado' },
  { key: 'unavailable' as const, label: 'No disponible' },
]

function getStatusOption(status: WishlistStatus) {
  return WISHLIST_STATUS_OPTIONS.find((o) => o.value === status)
}

function getPriorityLabel(priority: number) {
  return PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? ''
}

function getPriorityColor(priority: number): 'gray' | 'green' | 'blue' | 'yellow' | 'red' {
  if (priority <= 1) return 'gray'
  if (priority === 2) return 'green'
  if (priority === 3) return 'blue'
  if (priority === 4) return 'yellow'
  return 'red'
}

function getStatusColor(status: WishlistStatus): 'yellow' | 'green' | 'gray' {
  const opt = getStatusOption(status)
  return (opt?.color as 'yellow' | 'green' | 'gray') ?? 'gray'
}

function resetForm() {
  form.coffeeName = ''
  form.roasterName = ''
  form.variety = ''
  form.notes = ''
  form.priority = 2
  form.status = 'pending'
}

async function onSubmitAdd() {
  if (!form.coffeeName) return
  try {
    await wishlistStore.create({
      coffeeName: form.coffeeName,
      roasterName: form.roasterName || undefined,
      variety: form.variety || undefined,
      notes: form.notes || undefined,
      priority: form.priority,
      status: form.status,
    })
    showAddModal.value = false
    resetForm()
  } catch {
    // error handled by store
  }
}

async function changeStatus(item: WishlistItem, status: WishlistStatus) {
  await wishlistStore.changeStatus(item.id, status)
}

async function removeItem(item: WishlistItem) {
  await wishlistStore.remove(item.id)
}
</script>

<template>
  <div>
    <LayoutPageHeader title="Wishlist" subtitle="Cafes que quieres probar">
      <template #actions>
        <UiButton @click="showAddModal = true">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-1" />
          Agregar
        </UiButton>
      </template>
    </LayoutPageHeader>

    <!-- Filter tabs -->
    <div class="mt-6 flex gap-1 bg-coffee-100 rounded-lg p-1 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150',
          activeTab === tab.key
            ? 'bg-white text-coffee-900 shadow-sm'
            : 'text-coffee-600 hover:text-coffee-800',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="wishlistStore.loading" class="mt-8 text-center text-coffee-500">
      Cargando...
    </div>

    <div v-else-if="filteredItems.length === 0" class="mt-8 text-center py-12">
      <Icon name="heroicons:heart" class="w-12 h-12 text-coffee-300 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-coffee-800">
        {{ activeTab === 'all' ? 'Wishlist vacia' : 'Sin resultados' }}
      </h3>
      <p class="mt-2 text-sm text-coffee-500">
        {{ activeTab === 'all' ? 'Agrega cafes que te gustaria probar.' : 'No hay items con este estado.' }}
      </p>
      <UiButton v-if="activeTab === 'all'" class="mt-4" @click="showAddModal = true">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-1" />
        Agregar cafe
      </UiButton>
    </div>

    <div v-else class="mt-6 space-y-3">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="card hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-coffee-900 truncate">
              {{ item.coffeeName }}
            </h3>
            <p v-if="item.roasterName" class="text-sm text-coffee-500 truncate">
              {{ item.roasterName }}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <UiBadge :color="getPriorityColor(item.priority)" size="sm">
              {{ getPriorityLabel(item.priority) }}
            </UiBadge>
            <UiBadge :color="getStatusColor(item.status)" size="sm">
              {{ getStatusOption(item.status)?.label }}
            </UiBadge>
          </div>
        </div>

        <p v-if="item.variety" class="mt-1 text-xs text-coffee-500">
          Variedad: {{ item.variety }}
        </p>
        <p v-if="item.notes" class="mt-2 text-sm text-coffee-600">
          {{ item.notes }}
        </p>

        <!-- Quick actions -->
        <div class="mt-3 flex items-center gap-2 pt-3 border-t border-coffee-100">
          <span class="text-xs text-coffee-400 mr-auto">Cambiar estado:</span>
          <button
            v-if="item.status !== 'pending'"
            class="text-xs px-2 py-1 rounded-md text-yellow-700 bg-cream-100 hover:bg-cream-200 transition-colors"
            @click="changeStatus(item, 'pending')"
          >
            Pendiente
          </button>
          <button
            v-if="item.status !== 'purchased'"
            class="text-xs px-2 py-1 rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
            @click="changeStatus(item, 'purchased')"
          >
            Comprado
          </button>
          <button
            v-if="item.status !== 'unavailable'"
            class="text-xs px-2 py-1 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            @click="changeStatus(item, 'unavailable')"
          >
            No disponible
          </button>
          <button
            class="text-xs px-2 py-1 rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors ml-2"
            @click="removeItem(item)"
          >
            <Icon name="heroicons:trash" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add item modal -->
    <UiModal v-model="showAddModal" title="Agregar a wishlist">
      <form @submit.prevent="onSubmitAdd" class="space-y-4">
        <UiInput
          v-model="form.coffeeName"
          label="Nombre del cafe"
          placeholder="Ej: Ethiopia Yirgacheffe"
          required
        />
        <UiInput
          v-model="form.roasterName"
          label="Tostador"
          placeholder="Ej: Azahar Coffee"
        />
        <UiInput
          v-model="form.variety"
          label="Variedad"
          placeholder="Ej: Gesha, Caturra"
        />
        <UiTextarea
          v-model="form.notes"
          label="Notas"
          placeholder="Por que quieres probar este cafe?"
          :rows="3"
        />
        <UiSelect
          v-model="form.priority"
          label="Prioridad"
          :options="PRIORITY_OPTIONS"
          placeholder="Selecciona prioridad"
        />
        <UiSelect
          v-model="form.status"
          label="Estado"
          :options="WISHLIST_STATUS_OPTIONS"
          placeholder="Selecciona estado"
        />
      </form>

      <template #footer>
        <UiButton variant="secondary" @click="showAddModal = false">
          Cancelar
        </UiButton>
        <UiButton :loading="wishlistStore.loading" @click="onSubmitAdd">
          Agregar
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
