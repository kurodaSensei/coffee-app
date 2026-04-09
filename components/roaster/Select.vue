<script setup lang="ts">
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
const router = useRouter()

onMounted(() => {
  if (store.list.length === 0) {
    store.loadAll()
  }
})

function onChange(value: string) {
  if (value === '__new__') {
    router.push('/roasters/new')
    return
  }
  emit('update:modelValue', value)
  const roaster = store.list.find((r) => r.id === value)
  if (roaster) {
    emit('update:roasterName', roaster.name)
  }
}
</script>

<template>
  <div class="space-y-2">
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
        <SelectItem value="__new__" class="text-muted-foreground">
          + Agregar tostador
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
