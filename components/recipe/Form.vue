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
  <form @submit.prevent="onSubmit" class="max-w-2xl mx-auto space-y-8">
    <!-- Receta -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:book-open" class="w-5 h-5 text-muted-foreground" />
          Receta
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Define los parámetros de tu receta de preparación</p>
      </div>

      <!-- Name & Method -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="recipe-name">Nombre de la receta *</Label>
          <Input
            id="recipe-name"
            v-model="form.name"
            placeholder="Ej: V60 para Gesha"
            required
          />
        </div>

        <div class="space-y-1.5">
          <Label>Método de preparación *</Label>
          <Select v-model="form.brewMethod">
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in BREW_METHOD_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Dose, Water, Ratio -->
      <div class="grid grid-cols-3 gap-4">
        <div class="space-y-1.5">
          <Label for="recipe-dose">Dosis (g) *</Label>
          <Input
            id="recipe-dose"
            v-model.number="form.dose"
            type="number"
            placeholder="15"
            :min="0"
            :step="0.1"
            required
          />
        </div>

        <div class="space-y-1.5">
          <Label for="recipe-water">Agua (ml) *</Label>
          <Input
            id="recipe-water"
            v-model.number="form.water"
            type="number"
            placeholder="250"
            :min="0"
            required
          />
        </div>

        <div class="space-y-1.5">
          <Label>Ratio</Label>
          <div class="flex h-10 w-full items-center rounded-md bg-muted px-3 text-sm font-medium tabular-nums text-muted-foreground">
            {{ computedRatio || '--' }}
          </div>
        </div>
      </div>

      <!-- Grind & Temp -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="recipe-grind">Molienda (clicks)</Label>
          <Input
            id="recipe-grind"
            v-model.number="form.grindSize"
            type="number"
            placeholder="24"
            :min="0"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="recipe-temp">Temperatura (°C)</Label>
          <Input
            id="recipe-temp"
            v-model.number="form.waterTemp"
            type="number"
            placeholder="93"
            :min="0"
            :max="100"
          />
        </div>
      </div>
    </section>

    <Separator />

    <!-- Instrucciones -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:list" class="w-5 h-5 text-muted-foreground" />
          Instrucciones
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Pasos de preparación y notas adicionales</p>
      </div>

      <div class="space-y-1.5">
        <Label for="recipe-instructions">Pasos</Label>
        <Textarea
          id="recipe-instructions"
          v-model="form.instructions"
          placeholder="Describe los pasos de preparación..."
          :rows="6"
        />
      </div>

      <div class="space-y-1.5">
        <Label for="recipe-bestfor">Mejor para</Label>
        <Input
          id="recipe-bestfor"
          v-model="form.bestFor"
          placeholder="Ej: Cafés frutales, acidez alta"
        />
      </div>
    </section>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <Button variant="ghost" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit" :disabled="loading">
        <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        Guardar receta
      </Button>
    </div>
  </form>
</template>
