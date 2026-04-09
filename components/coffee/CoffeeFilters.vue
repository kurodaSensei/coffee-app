<script setup lang="ts">
import type { CoffeeProcess } from '~/types'
import { PROCESS_OPTIONS, COMMON_VARIETIES, COLOMBIAN_REGIONS } from '~/utils/constants'

interface Filters {
  search: string
  process: CoffeeProcess | ''
  variety: string
  region: string
}

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

const filters = reactive<Filters>({
  search: '',
  process: '',
  variety: '',
  region: '',
})

const varietyOptions = computed(() =>
  COMMON_VARIETIES.map((v) => ({ value: v, label: v }))
)

const regionOptions = computed(() =>
  COLOMBIAN_REGIONS.map((r) => ({ value: r, label: r }))
)

watch(filters, () => {
  emit('update:filters', { ...filters })
}, { deep: true })
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <div class="flex-1">
      <UiSearchInput
        v-model="filters.search"
        placeholder="Buscar cafe..."
      />
    </div>

    <div class="w-full sm:w-44">
      <UiSelect
        v-model="filters.process"
        :options="PROCESS_OPTIONS"
        placeholder="Proceso"
      />
    </div>

    <div class="w-full sm:w-44">
      <UiSelect
        v-model="filters.variety"
        :options="varietyOptions"
        placeholder="Variedad"
      />
    </div>

    <div class="w-full sm:w-44">
      <UiSelect
        v-model="filters.region"
        :options="regionOptions"
        placeholder="Region"
      />
    </div>
  </div>
</template>
