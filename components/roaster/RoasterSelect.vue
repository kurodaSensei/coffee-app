<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  error?: string
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

const options = computed(() => [
  ...store.list.map((r) => ({
    value: r.id,
    label: r.name,
  })),
  { value: '__new__', label: '+ Agregar tostador' },
])

function onChange(value: string | number) {
  const id = String(value)
  if (id === '__new__') {
    router.push('/roasters/new')
    return
  }
  emit('update:modelValue', id)
  const roaster = store.list.find((r) => r.id === id)
  if (roaster) {
    emit('update:roasterName', roaster.name)
  }
}
</script>

<template>
  <UiSelect
    :model-value="modelValue"
    :label="label"
    :error="error"
    :options="options"
    placeholder="Seleccionar tostador"
    @update:model-value="onChange"
  />
</template>
