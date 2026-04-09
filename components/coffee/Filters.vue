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

const processModel = computed({
  get: () => filters.process || '__all__',
  set: (v: string) => { filters.process = (v === '__all__' ? '' : v) as CoffeeProcess | '' },
})
const varietyModel = computed({
  get: () => filters.variety || '__all__',
  set: (v: string) => { filters.variety = v === '__all__' ? '' : v },
})
const regionModel = computed({
  get: () => filters.region || '__all__',
  set: (v: string) => { filters.region = v === '__all__' ? '' : v },
})

watch(filters, () => {
  emit('update:filters', { ...filters })
}, { deep: true })
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <!-- Search -->
    <div class="relative flex-1">
      <Icon
        name="lucide:search"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      />
      <Input
        v-model="filters.search"
        placeholder="Buscar cafe..."
        class="pl-9 h-9"
      />
    </div>

    <!-- Process -->
    <div class="w-full sm:w-44">
      <Select v-model="processModel">
        <SelectTrigger class="h-9">
          <SelectValue placeholder="Proceso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__" class="text-muted-foreground">
            Todos los procesos
          </SelectItem>
          <SelectItem
            v-for="option in PROCESS_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Variety -->
    <div class="w-full sm:w-44">
      <Select v-model="varietyModel">
        <SelectTrigger class="h-9">
          <SelectValue placeholder="Variedad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__" class="text-muted-foreground">
            Todas las variedades
          </SelectItem>
          <SelectItem
            v-for="v in COMMON_VARIETIES"
            :key="v"
            :value="v"
          >
            {{ v }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Region -->
    <div class="w-full sm:w-44">
      <Select v-model="regionModel">
        <SelectTrigger class="h-9">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__" class="text-muted-foreground">
            Todas las regiones
          </SelectItem>
          <SelectItem
            v-for="r in COLOMBIAN_REGIONS"
            :key="r"
            :value="r"
          >
            {{ r }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
