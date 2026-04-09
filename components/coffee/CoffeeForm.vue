<script setup lang="ts">
import type { Coffee, CoffeeProcess, RoastLevel } from '~/types'
import { coffeeSchema } from '~/utils/validators'
import { PROCESS_OPTIONS, ROAST_LEVEL_OPTIONS, COMMON_VARIETIES, COLOMBIAN_REGIONS } from '~/utils/constants'

const props = withDefaults(defineProps<{
  initialData?: Partial<Coffee>
  loading?: boolean
}>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  cancel: []
}>()

// Form state
const form = reactive({
  name: props.initialData?.name ?? '',
  roasterId: props.initialData?.roasterId ?? '',
  roasterName: props.initialData?.roasterName ?? '',
  variety: props.initialData?.variety ?? '',
  process: (props.initialData?.process ?? 'washed') as CoffeeProcess,
  originCountry: props.initialData?.originCountry ?? 'Colombia',
  originRegion: props.initialData?.originRegion ?? '',
  originFarm: props.initialData?.originFarm ?? '',
  originProducer: props.initialData?.originProducer ?? '',
  altitude: props.initialData?.altitude ?? undefined,
  scaScore: props.initialData?.scaScore ?? undefined,
  roastLevel: (props.initialData?.roastLevel ?? undefined) as RoastLevel | undefined,
  price: props.initialData?.price ?? undefined,
  weight: props.initialData?.weight ?? undefined,
  flavorNotes: [...(props.initialData?.flavorNotes ?? [])],
})

const errors = ref<Record<string, string>>({})

// Variety: combo of select + custom input
const customVariety = ref(false)
const varietyOptions = computed(() =>
  COMMON_VARIETIES.map((v) => ({ value: v, label: v }))
)

const regionOptions = computed(() =>
  COLOMBIAN_REGIONS.map((r) => ({ value: r, label: r }))
)

// If initial variety is not in COMMON_VARIETIES, mark as custom
if (props.initialData?.variety && !COMMON_VARIETIES.includes(props.initialData.variety)) {
  customVariety.value = true
}

function toggleCustomVariety() {
  customVariety.value = !customVariety.value
  if (!customVariety.value) {
    form.variety = ''
  }
}

// Flavor notes tag input
const newNote = ref('')

function addNote() {
  const note = newNote.value.trim()
  if (note && !form.flavorNotes.includes(note)) {
    form.flavorNotes.push(note)
  }
  newNote.value = ''
}

function removeNote(index: number) {
  form.flavorNotes.splice(index, 1)
}

function onNoteKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    addNote()
  }
}

// Roaster name sync
function onRoasterNameUpdate(name: string) {
  form.roasterName = name
}

// Validation and submit
function validate(): boolean {
  errors.value = {}

  const result = coffeeSchema.safeParse({
    ...form,
    altitude: form.altitude || undefined,
    scaScore: form.scaScore || undefined,
    price: form.price || undefined,
    weight: form.weight || undefined,
    roastLevel: form.roastLevel || undefined,
  })

  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path[0] as string
      if (path && !errors.value[path]) {
        errors.value[path] = issue.message
      }
    }
    return false
  }

  return true
}

function onSubmit() {
  if (!validate()) return

  emit('submit', {
    ...form,
    altitude: form.altitude || undefined,
    scaScore: form.scaScore || undefined,
    price: form.price || undefined,
    weight: form.weight || undefined,
    roastLevel: form.roastLevel || undefined,
    originFarm: form.originFarm || undefined,
    originProducer: form.originProducer || undefined,
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-8">
    <!-- Basico -->
    <div>
      <h3 class="text-lg font-semibold text-coffee-900 mb-4">
        Basico
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiInput
          v-model="form.name"
          label="Nombre"
          placeholder="Ej: Gesha Finca El Paraiso"
          :error="errors.name"
        />

        <RoasterSelect
          v-model="form.roasterId"
          :error="errors.roasterId"
          @update:roaster-name="onRoasterNameUpdate"
        />

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="label mb-0">Variedad</label>
            <button
              type="button"
              class="text-xs text-coffee-500 hover:text-coffee-700 transition-colors"
              @click="toggleCustomVariety"
            >
              {{ customVariety ? 'Seleccionar de lista' : 'Escribir manualmente' }}
            </button>
          </div>
          <UiInput
            v-if="customVariety"
            v-model="form.variety"
            placeholder="Escribir variedad"
            :error="errors.variety"
          />
          <UiSelect
            v-else
            v-model="form.variety"
            :options="varietyOptions"
            placeholder="Seleccionar variedad"
            :error="errors.variety"
          />
        </div>

        <UiSelect
          v-model="form.process"
          label="Proceso"
          :options="PROCESS_OPTIONS"
          placeholder="Seleccionar proceso"
          :error="errors.process"
        />
      </div>
    </div>

    <!-- Origen -->
    <div>
      <h3 class="text-lg font-semibold text-coffee-900 mb-4">
        Origen
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiInput
          v-model="form.originCountry"
          label="Pais"
          placeholder="Colombia"
          :error="errors.originCountry"
        />

        <UiSelect
          v-model="form.originRegion"
          label="Region"
          :options="regionOptions"
          placeholder="Seleccionar region"
          :error="errors.originRegion"
        />

        <UiInput
          v-model="form.originFarm"
          label="Finca"
          placeholder="Ej: El Paraiso"
        />

        <UiInput
          v-model="form.originProducer"
          label="Productor"
          placeholder="Ej: Wilton Benitez"
        />

        <UiInput
          v-model="form.altitude"
          label="Altitud (msnm)"
          type="number"
          placeholder="Ej: 1800"
          :error="errors.altitude"
        />
      </div>
    </div>

    <!-- Tueste -->
    <div>
      <h3 class="text-lg font-semibold text-coffee-900 mb-4">
        Tueste
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiSelect
          v-model="form.roastLevel"
          label="Nivel de tueste"
          :options="ROAST_LEVEL_OPTIONS"
          placeholder="Seleccionar nivel"
        />

        <UiInput
          v-model="form.scaScore"
          label="Puntaje SCA"
          type="number"
          placeholder="80 - 100"
          :error="errors.scaScore"
        />

        <UiInput
          v-model="form.price"
          label="Precio (COP)"
          type="number"
          placeholder="Ej: 45000"
          :error="errors.price"
        />

        <UiInput
          v-model="form.weight"
          label="Peso (g)"
          type="number"
          placeholder="Ej: 250"
          :error="errors.weight"
        />
      </div>
    </div>

    <!-- Sabor -->
    <div>
      <h3 class="text-lg font-semibold text-coffee-900 mb-4">
        Sabor
      </h3>
      <div>
        <label class="label">Notas de sabor</label>
        <div class="flex gap-2">
          <input
            v-model="newNote"
            type="text"
            class="input-field border-coffee-200 flex-1"
            placeholder="Escribir nota y presionar Enter"
            @keydown="onNoteKeydown"
          />
          <UiButton type="button" variant="secondary" size="sm" @click="addNote">
            Agregar
          </UiButton>
        </div>
        <div v-if="form.flavorNotes.length > 0" class="flex flex-wrap gap-2 mt-3">
          <UiBadge
            v-for="(note, index) in form.flavorNotes"
            :key="note"
            color="coffee"
            class="cursor-pointer hover:bg-coffee-200 transition-colors"
            @click="removeNote(index)"
          >
            {{ note }}
            <Icon name="heroicons:x-mark" class="w-3 h-3 ml-1" />
          </UiBadge>
        </div>
        <p class="mt-1 text-xs text-coffee-400">
          Haz clic en una nota para eliminarla
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4 border-t border-coffee-100">
      <UiButton type="button" variant="ghost" @click="emit('cancel')">
        Cancelar
      </UiButton>
      <UiButton type="submit" :loading="loading">
        {{ initialData?.id ? 'Guardar cambios' : 'Crear cafe' }}
      </UiButton>
    </div>
  </form>
</template>
