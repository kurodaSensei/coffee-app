<script setup lang="ts">
import type { WishlistItem, WishlistStatus } from '~/types'
import { PRIORITY_OPTIONS, WISHLIST_STATUS_OPTIONS } from '~/utils/constants'

const wishlistStore = useWishlistStore()

const showAddDialog = ref(false)
const activeTab = ref('all')

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

function getPriorityLabel(priority: number) {
  return PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? ''
}

function getPriorityVariant(priority: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (priority >= 4) return 'destructive'
  if (priority === 3) return 'default'
  return 'secondary'
}

function getStatusVariant(status: WishlistStatus): 'default' | 'secondary' | 'outline' {
  if (status === 'purchased') return 'default'
  if (status === 'pending') return 'secondary'
  return 'outline'
}

function getStatusLabel(status: WishlistStatus) {
  return WISHLIST_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
}

function getStatusIcon(status: WishlistStatus) {
  if (status === 'purchased') return 'lucide:check-circle-2'
  if (status === 'pending') return 'lucide:clock'
  return 'lucide:x-circle'
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
    showAddDialog.value = false
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
  <div class="space-y-6">
    <LayoutHeader title="Wishlist" subtitle="Cafes que quieres probar">
      <Button @click="showAddDialog = true">
        <Icon name="lucide:plus" class="w-4 h-4" />
        Agregar
      </Button>
    </LayoutHeader>

    <!-- Filter tabs -->
    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-4 max-w-lg">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="pending">Pendiente</TabsTrigger>
        <TabsTrigger value="purchased">Comprado</TabsTrigger>
        <TabsTrigger value="unavailable">No disponible</TabsTrigger>
      </TabsList>
    </Tabs>

    <!-- Loading -->
    <div v-if="wishlistStore.loading" class="flex flex-col items-center justify-center py-16">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 text-sm text-muted-foreground">Cargando wishlist...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredItems.length === 0" class="text-center py-16">
      <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:heart" class="w-8 h-8 text-muted-foreground/50" />
      </div>
      <h3 class="font-medium text-foreground">
        {{ activeTab === 'all' ? 'Wishlist vacia' : 'Sin resultados' }}
      </h3>
      <p class="text-sm text-muted-foreground mt-1">
        {{ activeTab === 'all' ? 'Agrega cafes que te gustaria probar.' : 'No hay items con este estado.' }}
      </p>
      <Button v-if="activeTab === 'all'" class="mt-4" @click="showAddDialog = true">
        <Icon name="lucide:plus" class="w-4 h-4" />
        Agregar cafe
      </Button>
    </div>

    <!-- Items list -->
    <div v-else class="space-y-3">
      <Card
        v-for="item in filteredItems"
        :key="item.id"
        class="group hover:shadow-md transition-all duration-200"
      >
        <CardContent class="pt-5 pb-4">
          <div class="flex items-start justify-between gap-4">
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-serif text-h3 text-foreground truncate">
                  {{ item.coffeeName }}
                </h3>
              </div>
              <p v-if="item.roasterName" class="text-sm text-muted-foreground truncate mt-0.5">
                {{ item.roasterName }}
              </p>
            </div>

            <!-- Badges -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <Badge :variant="getPriorityVariant(item.priority)" class="text-xs">
                {{ getPriorityLabel(item.priority) }}
              </Badge>
              <Badge :variant="getStatusVariant(item.status)" class="text-xs gap-1">
                <Icon :name="getStatusIcon(item.status)" class="w-3 h-3" />
                {{ getStatusLabel(item.status) }}
              </Badge>
            </div>
          </div>

          <p v-if="item.variety" class="text-xs text-muted-foreground mt-2">
            <span class="font-medium">Variedad:</span> {{ item.variety }}
          </p>
          <p v-if="item.notes" class="text-sm text-muted-foreground mt-2 leading-relaxed">
            {{ item.notes }}
          </p>

          <!-- Quick actions -->
          <div class="mt-4 flex items-center gap-2 pt-3 border-t">
            <span class="font-mono text-eyebrow uppercase text-muted-foreground mr-auto">Cambiar estado:</span>
            <Button
              v-if="item.status !== 'pending'"
              variant="outline"
              size="sm"
              class="h-7 text-xs"
              @click="changeStatus(item, 'pending')"
            >
              <Icon name="lucide:clock" class="w-3 h-3" />
              Pendiente
            </Button>
            <Button
              v-if="item.status !== 'purchased'"
              variant="outline"
              size="sm"
              class="h-7 text-xs"
              @click="changeStatus(item, 'purchased')"
            >
              <Icon name="lucide:check" class="w-3 h-3" />
              Comprado
            </Button>
            <Button
              v-if="item.status !== 'unavailable'"
              variant="outline"
              size="sm"
              class="h-7 text-xs"
              @click="changeStatus(item, 'unavailable')"
            >
              <Icon name="lucide:x" class="w-3 h-3" />
              No disponible
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 ml-1"
              @click="removeItem(item)"
            >
              <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Add item dialog -->
    <Dialog v-model:open="showAddDialog">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Agregar a wishlist</DialogTitle>
          <DialogDescription>Registra un cafe que quieras probar.</DialogDescription>
        </DialogHeader>
        <form @submit.prevent="onSubmitAdd" class="space-y-4">
          <div class="space-y-2">
            <Label for="coffeeName">Nombre del cafe *</Label>
            <Input
              id="coffeeName"
              v-model="form.coffeeName"
              placeholder="Ej: Ethiopia Yirgacheffe"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="roasterName">Tostador</Label>
              <Input
                id="roasterName"
                v-model="form.roasterName"
                placeholder="Ej: Azahar Coffee"
              />
            </div>
            <div class="space-y-2">
              <Label for="variety">Variedad</Label>
              <Input
                id="variety"
                v-model="form.variety"
                placeholder="Ej: Gesha, Caturra"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="notes">Notas</Label>
            <Textarea
              id="notes"
              v-model="form.notes"
              placeholder="Por que quieres probar este cafe?"
              :rows="3"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Prioridad</Label>
              <Select v-model="form.priority">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="opt in PRIORITY_OPTIONS"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Estado</Label>
              <Select v-model="form.status">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="opt in WISHLIST_STATUS_OPTIONS"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter class="gap-2 sm:gap-0">
          <Button variant="outline" @click="showAddDialog = false">
            Cancelar
          </Button>
          <Button :disabled="wishlistStore.loading || !form.coffeeName" @click="onSubmitAdd">
            <Icon v-if="wishlistStore.loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            Agregar
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </div>
</template>
