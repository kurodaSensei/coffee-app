<script setup lang="ts">
import type { Roaster } from '~/types'

interface Props {
  modelValue?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'Tostador',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:roasterName': [value: string]
}>()

const store = useRoastersStore()
const showNewRoasterDialog = ref(false)
const creatingRoaster = ref(false)

onMounted(() => {
  if (store.list.length === 0) store.loadAll()
})

function onChange(value: string) {
  if (value === '__new__') {
    showNewRoasterDialog.value = true
    return
  }
  emit('update:modelValue', value)
  const roaster = store.list.find(r => r.id === value)
  if (roaster) emit('update:roasterName', roaster.name)
}

async function handleCreateRoaster(data: Record<string, any>) {
  creatingRoaster.value = true
  try {
    const id = await store.create(data as Omit<Roaster, 'id' | 'createdAt' | 'updatedAt'>)
    await store.loadAll()
    showNewRoasterDialog.value = false
    emit('update:modelValue', id!)
    const roaster = store.list.find(r => r.id === id)
    if (roaster) emit('update:roasterName', roaster.name)
  } finally {
    creatingRoaster.value = false
  }
}
</script>

<template>
  <div class="space-y-1.5">
    <Label>{{ label }}</Label>
    <Select :model-value="modelValue" @update:model-value="onChange">
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar tostador" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="roaster in store.list"
          :key="roaster.id"
          :value="roaster.id"
        >
          {{ roaster.name }}
        </SelectItem>
        <SelectSeparator />
        <SelectItem value="__new__" class="text-primary font-medium">
          + Nuevo tostador
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Dialog para crear tostador sin salir del form -->
    <Dialog v-model:open="showNewRoasterDialog">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo Tostador</DialogTitle>
          <DialogDescription>Registra un tostador para asociarlo a este café.</DialogDescription>
        </DialogHeader>
        <RoasterForm
          :loading="creatingRoaster"
          @submit="handleCreateRoaster"
          @cancel="showNewRoasterDialog = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
