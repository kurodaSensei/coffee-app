<script setup lang="ts">
import type { Recipe, BrewMethod } from '~/types'
import { BREW_METHOD_OPTIONS } from '~/utils/constants'
import { formatRatio } from '~/utils/formatters'

interface Props {
  initialData?: Partial<Recipe>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>]
  cancel: []
}>()

const form = reactive({
  name: props.initialData?.name ?? '',
  brewMethod: (props.initialData?.brewMethod ?? '') as BrewMethod | '',
  dose: props.initialData?.dose ?? 0,
  water: props.initialData?.water ?? 0,
  grindSize: props.initialData?.grindSize ?? undefined as number | undefined,
  waterTemp: props.initialData?.waterTemp ?? undefined as number | undefined,
  instructions: props.initialData?.instructions ?? '',
  bestFor: props.initialData?.bestFor ?? '',
})

const computedRatio = computed(() => {
  if (form.dose > 0 && form.water > 0) {
    return formatRatio(form.dose, form.water)
  }
  return ''
})

function onSubmit() {
  if (!form.name || !form.brewMethod || !form.dose || !form.water) return

  emit('submit', {
    name: form.name,
    brewMethod: form.brewMethod as BrewMethod,
    dose: form.dose,
    water: form.water,
    ratio: computedRatio.value,
    grindSize: form.grindSize,
    waterTemp: form.waterTemp,
    instructions: form.instructions || undefined,
    bestFor: form.bestFor || undefined,
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-5">
    <Input
      v-model="form.name"
      label="Nombre de la receta"
      placeholder="Ej: V60 para Gesha"
      required
    />

    <Select
      v-model="form.brewMethod"
      label="Metodo de preparacion"
      :options="BREW_METHOD_OPTIONS"
      placeholder="Selecciona un metodo"
      required
    />

    <div class="grid grid-cols-3 gap-4">
      <Input
        v-model="form.dose"
        label="Dosis (g)"
        type="number"
        placeholder="15"
        :min="0"
        :step="0.1"
        required
      />
      <Input
        v-model="form.water"
        label="Agua (ml)"
        type="number"
        placeholder="250"
        :min="0"
        required
      />
      <div>
        <label class="label">Ratio</label>
        <div class="input-field bg-coffee-50 text-coffee-600 flex items-center border-coffee-200">
          {{ computedRatio || '--' }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <Input
        v-model="form.grindSize"
        label="Molienda (clicks)"
        type="number"
        placeholder="24"
        :min="0"
      />
      <Input
        v-model="form.waterTemp"
        label="Temperatura (&deg;C)"
        type="number"
        placeholder="93"
        :min="0"
        :max="100"
      />
    </div>

    <Textarea
      v-model="form.instructions"
      label="Instrucciones"
      placeholder="Describe los pasos de preparacion..."
      :rows="4"
    />

    <Input
      v-model="form.bestFor"
      label="Mejor para"
      placeholder="Ej: Cafes frutales, acidez alta"
    />

    <div class="flex justify-end gap-3 pt-4 border-t border-coffee-100">
      <Button variant="secondary" type="button" @click="emit('cancel')">
        Cancelar
      </Button>
      <Button type="submit" :loading="loading">
        Guardar receta
      </Button>
    </div>
  </form>
</template>
