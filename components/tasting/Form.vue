<script setup lang="ts">
import type { Tasting, TastingInput, Coffee, Recipe } from '~/types'

const catalog = useCatalog()
const BREW_METHOD_OPTIONS = catalog.brewMethodOptions

const props = defineProps<{
  initialData?: Partial<Tasting>
  loading?: boolean
  coffeeId?: string
}>()

const emit = defineEmits<{
  submit: [data: Partial<TastingInput> & { brewDate: string }, saveAsRecipe?: boolean]
  cancel: []
}>()

const coffeesStore = useCoffeesStore()
const recipesStore = useRecipesStore()

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
const selectedRecipeId = ref<string>('__none__')
const saveAsRecipe = ref(false)

onMounted(async () => {
  await Promise.all([coffeesStore.loadAll(), recipesStore.loadAll()])
  coffees.value = coffeesStore.list
})

function applyRecipe(recipeId: string) {
  selectedRecipeId.value = recipeId
  if (recipeId === '__none__') return
  const recipe = recipesStore.list.find(r => r.id === recipeId)
  if (!recipe) return
  form.brewMethod = recipe.brewMethod
  form.dose = recipe.dose
  form.water = recipe.water
  form.grindSize = recipe.grindSize
  form.waterTemp = recipe.waterTemp
  form.recipeName = recipe.name
}

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
  }, saveAsRecipe.value)
}

const optionalRatings = [
  { key: 'ratingAroma' as const, label: 'Aroma' },
  { key: 'ratingAcidity' as const, label: 'Acidez' },
  { key: 'ratingSweetness' as const, label: 'Dulzura' },
  { key: 'ratingBody' as const, label: 'Cuerpo' },
  { key: 'ratingAftertaste' as const, label: 'Retrogusto' },
  { key: 'ratingBalance' as const, label: 'Balance' },
]
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto space-y-8">
    <!-- Café -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:coffee" class="w-5 h-5 text-muted-foreground" />
          Cafe
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Selecciona el cafe y metodo de preparacion</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label>Café *</Label>
          <Select
            :model-value="form.coffeeId"
            @update:model-value="(v: string) => { form.coffeeId = v; onCoffeeChange(v) }"
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar café..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="coffee in coffees"
                :key="coffee.id"
                :value="coffee.id"
              >
                {{ coffee.name }} — {{ coffee.roasterName }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label>Método de preparación *</Label>
          <Select v-model="form.brewMethod">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
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

        <div class="space-y-1.5">
          <Label for="tasting-date">Fecha *</Label>
          <Input
            id="tasting-date"
            v-model="form.brewDate"
            type="date"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="tasting-recipe">Nombre de receta</Label>
          <Input
            id="tasting-recipe"
            v-model="form.recipeName"
            placeholder="Ej: Flujo Sereno"
          />
        </div>
      </div>
    </section>

    <Separator />

    <!-- Parámetros -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:sliders-horizontal" class="w-5 h-5 text-muted-foreground" />
          Parametros
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Variables de la preparacion</p>
      </div>

      <!-- Recipe selector -->
      <div v-if="recipesStore.list.length > 0" class="space-y-1.5">
        <Label class="flex items-center gap-1.5">
          <Icon name="lucide:book-open" class="w-3.5 h-3.5 text-muted-foreground" />
          Usar una receta guardada
        </Label>
        <Select :model-value="selectedRecipeId" @update:model-value="applyRecipe">
          <SelectTrigger>
            <SelectValue placeholder="Ninguna" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Sin receta (parámetros manuales)</SelectItem>
            <SelectItem v-for="r in recipesStore.list" :key="r.id" :value="r.id">
              {{ r.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div class="space-y-1.5">
          <Label for="tasting-dose">Dosis (g)</Label>
          <Input
            id="tasting-dose"
            v-model.number="form.dose"
            type="number"
            placeholder="15"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="tasting-water">Agua (g)</Label>
          <Input
            id="tasting-water"
            v-model.number="form.water"
            type="number"
            placeholder="250"
          />
        </div>

        <div class="space-y-1.5">
          <Label>Ratio</Label>
          <div class="flex h-10 w-full items-center rounded-md bg-muted px-3 text-sm text-muted-foreground">
            {{ computedRatio || '—' }}
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for="tasting-grind">Molienda (clicks)</Label>
          <Input
            id="tasting-grind"
            v-model.number="form.grindSize"
            type="number"
            placeholder="24"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="tasting-temp">Temperatura (°C)</Label>
          <Input
            id="tasting-temp"
            v-model.number="form.waterTemp"
            type="number"
            placeholder="93"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="tasting-time">Tiempo (seg)</Label>
          <Input
            id="tasting-time"
            v-model.number="form.brewTime"
            type="number"
            placeholder="180"
          />
        </div>
      </div>
    </section>

    <Separator />

    <!-- Puntuacion -->
    <section class="space-y-6">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:star" class="w-5 h-5 text-muted-foreground" />
          Puntuacion
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Evalua tu experiencia con esta taza</p>
      </div>

      <!-- Overall rating - prominent -->
      <div class="rounded-lg bg-muted/50 p-5 space-y-3">
        <div class="flex items-center justify-between">
          <Label class="text-base font-medium">Puntuacion General *</Label>
          <span class="text-3xl font-bold tabular-nums">{{ form.ratingOverall }}<span class="text-lg font-normal text-muted-foreground">/10</span></span>
        </div>
        <Slider
          :model-value="[form.ratingOverall]"
          :max="10"
          :min="1"
          :step="1"
          @update:model-value="(v: number[]) => form.ratingOverall = v[0]"
        />
      </div>

      <!-- Optional ratings -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div
          v-for="r in optionalRatings"
          :key="r.key"
          class="space-y-2"
        >
          <div class="flex items-center justify-between">
            <Label>{{ r.label }}</Label>
            <span class="text-sm font-semibold tabular-nums text-muted-foreground">{{ form[r.key] ?? '---' }}<span class="font-normal">/10</span></span>
          </div>
          <Slider
            :model-value="[form[r.key] ?? 1]"
            :max="10"
            :min="1"
            :step="1"
            @update:model-value="(v: number[]) => form[r.key] = v[0]"
          />
        </div>
      </div>
    </section>

    <Separator />

    <!-- Notas -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:notebook-pen" class="w-5 h-5 text-muted-foreground" />
          Notas
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Observaciones personales de la degustacion</p>
      </div>

      <div class="space-y-1.5">
        <Label for="tasting-notes">Notas personales</Label>
        <Textarea
          id="tasting-notes"
          v-model="form.personalNotes"
          placeholder="Que destacas de esta taza?"
          :rows="4"
        />
      </div>

      <div class="flex flex-wrap items-center gap-6 py-1">
        <label for="would-buy" class="flex items-center gap-2.5 cursor-pointer select-none">
          <Checkbox
            id="would-buy"
            :checked="form.wouldBuyAgain"
            @update:checked="(v: boolean) => form.wouldBuyAgain = v"
          />
          <span class="text-sm font-medium">Compraria de nuevo</span>
        </label>

        <label for="is-favorite" class="flex items-center gap-2.5 cursor-pointer select-none">
          <Checkbox
            id="is-favorite"
            :checked="form.isFavorite"
            @update:checked="(v: boolean) => form.isFavorite = v"
          />
          <span class="text-sm font-medium flex items-center gap-1">
            <Icon name="lucide:heart" class="w-3.5 h-3.5" />
            Favorito
          </span>
        </label>
      </div>

      <!-- Save as recipe -->
      <div v-if="!initialData?.id && selectedRecipeId === '__none__' && form.dose && form.water" class="rounded-lg border border-dashed p-4">
        <label for="save-recipe" class="flex items-start gap-2.5 cursor-pointer select-none">
          <Checkbox
            id="save-recipe"
            :checked="saveAsRecipe"
            @update:checked="(v: boolean) => saveAsRecipe = v"
            class="mt-0.5"
          />
          <div class="flex-1">
            <span class="text-sm font-medium flex items-center gap-1.5">
              <Icon name="lucide:book-plus" class="w-3.5 h-3.5 text-primary" />
              Guardar estos parámetros como receta
            </span>
            <p class="text-xs text-muted-foreground mt-0.5">
              Crea una nueva receta <span v-if="form.recipeName" class="font-medium">"{{ form.recipeName }}"</span> para reutilizarla en futuras catas.
            </p>
          </div>
        </label>
        <div v-if="saveAsRecipe && !form.recipeName" class="mt-2 ml-7">
          <Input v-model="form.recipeName" placeholder="Nombre de la receta (requerido)" class="h-8 text-xs" />
        </div>
      </div>
    </section>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <Button variant="ghost" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit" :disabled="loading">
        <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        {{ initialData?.id ? 'Actualizar' : 'Guardar' }} Degustación
      </Button>
    </div>
  </form>
</template>
