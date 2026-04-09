<script setup lang="ts">
import type { Tasting, Coffee } from '~/types'
import { BREW_METHOD_OPTIONS } from '~/utils/constants'

const props = defineProps<{
  initialData?: Partial<Tasting>
  loading?: boolean
  coffeeId?: string
}>()

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  cancel: []
}>()

const coffeesStore = useCoffeesStore()

const form = reactive({
  coffeeId: props.initialData?.coffeeId || props.coffeeId || '',
  coffeeName: props.initialData?.coffeeName || '',
  roasterName: props.initialData?.roasterName || '',
  brewMethod: props.initialData?.brewMethod || 'v60',
  brewDate: props.initialData?.brewDate
    ? props.initialData.brewDate.toDate().toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
  dose: props.initialData?.dose || undefined,
  water: props.initialData?.water || undefined,
  grindSize: props.initialData?.grindSize || undefined,
  waterTemp: props.initialData?.waterTemp || undefined,
  brewTime: props.initialData?.brewTime || undefined,
  recipeName: props.initialData?.recipeName || '',
  ratingOverall: props.initialData?.ratingOverall || 7,
  ratingAroma: props.initialData?.ratingAroma || undefined,
  ratingAcidity: props.initialData?.ratingAcidity || undefined,
  ratingSweetness: props.initialData?.ratingSweetness || undefined,
  ratingBody: props.initialData?.ratingBody || undefined,
  ratingAftertaste: props.initialData?.ratingAftertaste || undefined,
  ratingBalance: props.initialData?.ratingBalance || undefined,
  personalNotes: props.initialData?.personalNotes || '',
  wouldBuyAgain: props.initialData?.wouldBuyAgain || false,
  isFavorite: props.initialData?.isFavorite || false,
})

const coffees = ref<Coffee[]>([])

onMounted(async () => {
  await coffeesStore.load()
  coffees.value = coffeesStore.list
})

const computedRatio = computed(() => {
  if (form.dose && form.water) {
    const ratio = Math.round(form.water / form.dose)
    return `1:${ratio}`
  }
  return ''
})

function onCoffeeChange(coffeeId: string) {
  const coffee = coffees.value.find(c => c.id === coffeeId)
  if (coffee) {
    form.coffeeName = coffee.name
    form.roasterName = coffee.roasterName
  }
}

function handleSubmit() {
  if (!form.coffeeId || !form.ratingOverall) return
  emit('submit', {
    ...form,
    ratio: computedRatio.value,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Café y Método -->
    <div class="card">
      <h3 class="text-lg font-semibold text-coffee-800 mb-4">Café y Preparación</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label">Café *</label>
          <select
            v-model="form.coffeeId"
            @change="onCoffeeChange(form.coffeeId)"
            class="input-field"
            required
          >
            <option value="">Seleccionar café...</option>
            <option v-for="coffee in coffees" :key="coffee.id" :value="coffee.id">
              {{ coffee.name }} — {{ coffee.roasterName }}
            </option>
          </select>
        </div>
        <UiSelect
          v-model="form.brewMethod"
          label="Método de preparación *"
          :options="BREW_METHOD_OPTIONS"
        />
        <UiInput
          v-model="form.brewDate"
          label="Fecha *"
          type="date"
        />
        <UiInput
          v-model="form.recipeName"
          label="Nombre de receta"
          placeholder="Ej: Flujo Sereno"
        />
      </div>
    </div>

    <!-- Parámetros de preparación -->
    <div class="card">
      <h3 class="text-lg font-semibold text-coffee-800 mb-4">Parámetros</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UiInput
          v-model.number="form.dose"
          label="Dosis (g)"
          type="number"
          placeholder="15"
        />
        <UiInput
          v-model.number="form.water"
          label="Agua (g)"
          type="number"
          placeholder="250"
        />
        <div>
          <label class="label">Ratio</label>
          <div class="input-field bg-coffee-50 text-coffee-600">
            {{ computedRatio || '—' }}
          </div>
        </div>
        <UiInput
          v-model.number="form.grindSize"
          label="Molienda (clicks)"
          type="number"
          placeholder="24"
        />
        <UiInput
          v-model.number="form.waterTemp"
          label="Temperatura (°C)"
          type="number"
          placeholder="93"
        />
        <UiInput
          v-model.number="form.brewTime"
          label="Tiempo (seg)"
          type="number"
          placeholder="180"
        />
      </div>
    </div>

    <!-- Puntuaciones -->
    <div class="card">
      <h3 class="text-lg font-semibold text-coffee-800 mb-4">Puntuación</h3>
      <div class="space-y-4">
        <div>
          <label class="label">Puntuación General * ({{ form.ratingOverall }}/10)</label>
          <UiRating v-model="form.ratingOverall" :max="10" size="lg" />
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label class="label">Aroma ({{ form.ratingAroma || '—' }}/10)</label>
            <UiRating v-model="form.ratingAroma" :max="10" />
          </div>
          <div>
            <label class="label">Acidez ({{ form.ratingAcidity || '—' }}/10)</label>
            <UiRating v-model="form.ratingAcidity" :max="10" />
          </div>
          <div>
            <label class="label">Dulzura ({{ form.ratingSweetness || '—' }}/10)</label>
            <UiRating v-model="form.ratingSweetness" :max="10" />
          </div>
          <div>
            <label class="label">Cuerpo ({{ form.ratingBody || '—' }}/10)</label>
            <UiRating v-model="form.ratingBody" :max="10" />
          </div>
          <div>
            <label class="label">Retrogusto ({{ form.ratingAftertaste || '—' }}/10)</label>
            <UiRating v-model="form.ratingAftertaste" :max="10" />
          </div>
          <div>
            <label class="label">Balance ({{ form.ratingBalance || '—' }}/10)</label>
            <UiRating v-model="form.ratingBalance" :max="10" />
          </div>
        </div>
      </div>
    </div>

    <!-- Notas -->
    <div class="card">
      <h3 class="text-lg font-semibold text-coffee-800 mb-4">Notas</h3>
      <UiTextarea
        v-model="form.personalNotes"
        label="Notas personales"
        placeholder="¿Qué destacas de esta taza?"
        :rows="3"
      />
      <div class="flex gap-6 mt-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="form.wouldBuyAgain" class="rounded border-coffee-300 text-coffee-800 focus:ring-coffee-500" />
          <span class="text-sm text-coffee-700">Compraría de nuevo</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="form.isFavorite" class="rounded border-coffee-300 text-coffee-800 focus:ring-coffee-500" />
          <span class="text-sm text-coffee-700">Favorito</span>
        </label>
      </div>
    </div>

    <!-- Acciones -->
    <div class="flex gap-3 justify-end">
      <UiButton variant="secondary" type="button" @click="emit('cancel')">
        Cancelar
      </UiButton>
      <UiButton variant="primary" type="submit" :loading="loading">
        {{ initialData?.id ? 'Actualizar' : 'Guardar' }} Degustación
      </UiButton>
    </div>
  </form>
</template>
