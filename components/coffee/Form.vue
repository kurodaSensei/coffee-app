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

const form = reactive({
  name: props.initialData?.name ?? '',
  roasterId: props.initialData?.roasterId ?? '',
  roasterName: props.initialData?.roasterName ?? '',
  brand: props.initialData?.brand ?? '',
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
const varietyOptions = computed(() => COMMON_VARIETIES.map(v => ({ value: v, label: v })))
const regionOptions = computed(() => COLOMBIAN_REGIONS.map(r => ({ value: r, label: r })))

if (props.initialData?.variety && !COMMON_VARIETIES.includes(props.initialData.variety)) {
  customVariety.value = true
}

function toggleCustomVariety() {
  customVariety.value = !customVariety.value
  if (!customVariety.value) form.variety = ''
}

const newNote = ref('')
function addNote() {
  const note = newNote.value.trim()
  if (note && !form.flavorNotes.includes(note)) form.flavorNotes.push(note)
  newNote.value = ''
}
function removeNote(index: number) { form.flavorNotes.splice(index, 1) }
function onNoteKeydown(e: KeyboardEvent) { if (e.key === 'Enter') { e.preventDefault(); addNote() } }
function onRoasterNameUpdate(name: string) { form.roasterName = name }

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
    brand: form.brand || undefined,
    altitude: form.altitude || undefined,
    scaScore: form.scaScore ? Number(form.scaScore) : undefined,
    price: form.price || undefined,
    weight: form.weight || undefined,
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
        <p class="text-sm text-muted-foreground mt-0.5">Nombre, tostador, marca, variedad y proceso</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="coffee-name">Nombre *</Label>
          <Input id="coffee-name" v-model="form.name" placeholder="Ej: Gesha Finca El Paraíso" />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>
        <div class="space-y-1.5">
          <RoasterSelect v-model="form.roasterId" @update:roaster-name="onRoasterNameUpdate" />
        </div>
        <div class="space-y-1.5">
          <Label for="coffee-brand">Marca</Label>
          <Input id="coffee-brand" v-model="form.brand" placeholder="Ej: Selvanegra, Libertario..." />
        </div>
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
          <Input id="coffee-sca" v-model="form.scaScore" type="number" step="0.1" placeholder="Ej: 86.5" />
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
      <div class="flex gap-2">
        <Input v-model="newNote" class="flex-1" placeholder="Ej: Manzana verde, panela, jazmín..." @keydown="onNoteKeydown" />
        <Button type="button" variant="secondary" @click="addNote">Agregar</Button>
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
      <p v-if="form.flavorNotes.length > 0" class="text-xs text-muted-foreground">Clic en una nota para eliminarla</p>
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
