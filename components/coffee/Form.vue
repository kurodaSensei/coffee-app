<script setup lang="ts">
import type { Coffee, CoffeeProcess, RoastLevel } from '~/types'
import { coffeeSchema } from '~/utils/validators'
import { ROAST_LEVEL_OPTIONS, COLOMBIAN_REGIONS } from '~/utils/constants'

const catalog = useCatalog()
const PROCESS_OPTIONS = catalog.processOptions
const COMMON_VARIETIES = catalog.varieties

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
const customVariety = ref(false)
const varietyOptions = computed(() => COMMON_VARIETIES.value.map(v => ({ value: v, label: v })))
const regionOptions = computed(() => COLOMBIAN_REGIONS.map(r => ({ value: r, label: r })))

// Flavor notes: load existing notes from all coffees for autocomplete
const coffeesStore = useCoffeesStore()
const existingNotes = computed(() => {
  const all = new Set<string>()
  coffeesStore.list.forEach(c => c.flavorNotes?.forEach(n => all.add(n)))
  return [...all].sort()
})
const newNote = ref('')
const showNoteSuggestions = ref(false)
const filteredSuggestions = computed(() => {
  if (!newNote.value.trim()) return []
  const q = newNote.value.toLowerCase()
  return existingNotes.value
    .filter(n => n.toLowerCase().includes(q) && !form.flavorNotes.includes(n))
    .slice(0, 6)
})

onMounted(() => {
  if (coffeesStore.list.length === 0) coffeesStore.loadAll()
})

if (props.initialData?.variety && !COMMON_VARIETIES.value.includes(props.initialData.variety)) {
  customVariety.value = true
}

function toggleCustomVariety() {
  customVariety.value = !customVariety.value
  if (!customVariety.value) form.variety = ''
}

function addNote(note?: string) {
  const value = (note || newNote.value).trim()
  if (value && !form.flavorNotes.includes(value)) form.flavorNotes.push(value)
  newNote.value = ''
  showNoteSuggestions.value = false
}
function removeNote(index: number) { form.flavorNotes.splice(index, 1) }
function onNoteKeydown(e: KeyboardEvent) { if (e.key === 'Enter') { e.preventDefault(); addNote() } }
function onRoasterNameUpdate(name: string) { form.roasterName = name }
function clearRoaster() {
  form.roasterId = ''
  form.roasterName = ''
}

function validate(): boolean {
  errors.value = {}
  const data = {
    ...form,
    roasterId: form.roasterId || undefined,
    roasterName: form.roasterName || undefined,
    altitude: form.altitude ? Number(form.altitude) : undefined,
    scaScore: form.scaScore ? Number(form.scaScore) : undefined,
    price: form.price ? Number(form.price) : undefined,
    weight: form.weight ? Number(form.weight) : undefined,
    roastLevel: form.roastLevel || undefined,
  }
  const result = coffeeSchema.safeParse(data)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path[0] as string
      if (path && !errors.value[path]) errors.value[path] = issue.message
    }
    return false
  }
  return true
}

function onSubmit() {
  if (!validate()) return
  emit('submit', {
    ...form,
    roasterId: form.roasterId || undefined,
    roasterName: form.roasterName || undefined,
    altitude: form.altitude ? Number(form.altitude) : undefined,
    scaScore: form.scaScore ? Number(form.scaScore) : undefined,
    price: form.price ? Number(form.price) : undefined,
    weight: form.weight ? Number(form.weight) : undefined,
    roastLevel: form.roastLevel || undefined,
    originFarm: form.originFarm || undefined,
    originProducer: form.originProducer || undefined,
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="max-w-2xl mx-auto space-y-8">
    <!-- Básico -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:coffee" class="w-5 h-5 text-muted-foreground" />
          Información básica
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Nombre, tostador, variedad y proceso</p>
      </div>

      <div class="space-y-4">
        <!-- Nombre - full width -->
        <div class="space-y-1.5">
          <Label for="coffee-name">Nombre *</Label>
          <Input id="coffee-name" v-model="form.name" placeholder="Ej: Gesha Finca El Paraíso" />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>

        <!-- Tostador/Marca con opción de limpiar -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Label>Tostador / Marca</Label>
            <button
              v-if="form.roasterId"
              type="button"
              class="text-xs text-muted-foreground hover:text-destructive transition-colors"
              @click="clearRoaster"
            >
              Quitar
            </button>
          </div>
          <RoasterSelect v-model="form.roasterId" @update:roaster-name="onRoasterNameUpdate" label="" />
        </div>

        <!-- Variedad + Proceso -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <Label>Variedad *</Label>
              <button type="button" class="text-xs text-primary hover:underline" @click="toggleCustomVariety">
                {{ customVariety ? 'Seleccionar de lista' : 'Escribir manual' }}
              </button>
            </div>
            <Input v-if="customVariety" v-model="form.variety" placeholder="Escribir variedad" />
            <Select v-else v-model="form.variety">
              <SelectTrigger><SelectValue placeholder="Seleccionar variedad" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in varietyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.variety" class="text-xs text-destructive">{{ errors.variety }}</p>
          </div>
          <div class="space-y-1.5">
            <Label>Proceso *</Label>
            <Select v-model="form.process">
              <SelectTrigger><SelectValue placeholder="Seleccionar proceso" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in PROCESS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.process" class="text-xs text-destructive">{{ errors.process }}</p>
          </div>
        </div>
      </div>
    </section>

    <Separator />

    <!-- Origen -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:map-pin" class="w-5 h-5 text-muted-foreground" />
          Origen
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">País, región, finca y altitud</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="coffee-country">País *</Label>
          <Input id="coffee-country" v-model="form.originCountry" placeholder="Colombia" />
          <p v-if="errors.originCountry" class="text-xs text-destructive">{{ errors.originCountry }}</p>
        </div>
        <div class="space-y-1.5">
          <Label>Región *</Label>
          <Select v-model="form.originRegion">
            <SelectTrigger><SelectValue placeholder="Seleccionar región" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in regionOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.originRegion" class="text-xs text-destructive">{{ errors.originRegion }}</p>
        </div>
        <div class="space-y-1.5">
          <Label for="coffee-farm">Finca</Label>
          <Input id="coffee-farm" v-model="form.originFarm" placeholder="Ej: El Paraíso" />
        </div>
        <div class="space-y-1.5">
          <Label for="coffee-producer">Productor</Label>
          <Input id="coffee-producer" v-model="form.originProducer" placeholder="Ej: Wilton Benítez" />
        </div>
        <div class="space-y-1.5">
          <Label for="coffee-alt">Altitud (msnm)</Label>
          <Input id="coffee-alt" v-model="form.altitude" type="number" placeholder="1800" />
        </div>
      </div>
    </section>

    <Separator />

    <!-- Tueste -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:flame" class="w-5 h-5 text-muted-foreground" />
          Tueste y precio
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Nivel de tueste, puntaje SCA y detalles de compra</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label>Nivel de tueste</Label>
          <Select v-model="form.roastLevel">
            <SelectTrigger><SelectValue placeholder="Seleccionar nivel" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in ROAST_LEVEL_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="space-y-1.5">
          <Label for="coffee-sca">Puntaje SCA</Label>
          <Input id="coffee-sca" v-model="form.scaScore" type="number" step="0.1" min="60" max="100" placeholder="Ej: 86.5" />
        </div>
        <div class="space-y-1.5">
          <Label for="coffee-price">Precio (COP)</Label>
          <Input id="coffee-price" v-model="form.price" type="number" placeholder="45000" />
        </div>
        <div class="space-y-1.5">
          <Label for="coffee-weight">Peso (g)</Label>
          <Input id="coffee-weight" v-model="form.weight" type="number" placeholder="250" />
        </div>
      </div>
    </section>

    <Separator />

    <!-- Sabor -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:sparkles" class="w-5 h-5 text-muted-foreground" />
          Notas de sabor
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Agrega las notas que percibes</p>
      </div>
      <div class="relative">
        <div class="flex gap-2">
          <Input
            v-model="newNote"
            class="flex-1"
            placeholder="Ej: Manzana verde, panela, jazmín..."
            @keydown="onNoteKeydown"
            @focus="showNoteSuggestions = true"
            @blur="setTimeout(() => showNoteSuggestions = false, 200)"
          />
          <Button type="button" variant="secondary" @click="addNote()">Agregar</Button>
        </div>
        <!-- Autocomplete suggestions -->
        <div
          v-if="showNoteSuggestions && filteredSuggestions.length > 0"
          class="absolute z-10 top-full left-0 right-12 mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden"
        >
          <button
            v-for="suggestion in filteredSuggestions"
            :key="suggestion"
            type="button"
            class="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
            @mousedown.prevent="addNote(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
      <div v-if="form.flavorNotes.length > 0" class="flex flex-wrap gap-1.5">
        <Badge
          v-for="(note, i) in form.flavorNotes" :key="note"
          variant="secondary"
          class="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors gap-1"
          @click="removeNote(i)"
        >
          {{ note }}
          <Icon name="lucide:x" class="w-3 h-3" />
        </Badge>
      </div>
      <!-- Quick suggestions from existing notes -->
      <div v-if="existingNotes.length > 0 && form.flavorNotes.length === 0" class="space-y-1.5">
        <p class="text-xs text-muted-foreground">Notas usadas anteriormente:</p>
        <div class="flex flex-wrap gap-1.5">
          <Badge
            v-for="note in existingNotes.slice(0, 10)" :key="note"
            variant="outline"
            class="cursor-pointer hover:bg-accent transition-colors"
            @click="addNote(note)"
          >
            + {{ note }}
          </Badge>
        </div>
      </div>
    </section>

    <!-- Submit -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <Button variant="ghost" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit" :disabled="loading">
        <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        {{ initialData?.id ? 'Guardar cambios' : 'Crear café' }}
      </Button>
    </div>
  </form>
</template>
