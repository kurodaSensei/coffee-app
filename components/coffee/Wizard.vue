<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Coffee, CoffeeInput, CoffeeProcess, RoastLevel } from '~/types'
import type { RoasterValue } from '~/components/roaster/Picker.vue'

const props = withDefaults(
  defineProps<{
    /** When 'edit', submits via update; otherwise creates a new coffee. */
    mode?: 'create' | 'edit'
    /** Existing coffee to prefill the form with (edit mode). */
    initialCoffee?: Coffee | null
    /** Required when mode === 'edit'. */
    coffeeId?: string
  }>(),
  {
    mode: 'create',
    initialCoffee: null,
  },
)

const router = useRouter()
const coffeesStore = useCoffeesStore()

// ─────────────────────────────────────────────────────────────────────────────
// Wizard state
// ─────────────────────────────────────────────────────────────────────────────

const step = ref<1 | 2 | 3>(1)
const totalSteps = 3

// Step 1 — IDENTIDAD
const name = ref('')
const roaster = ref<RoasterValue | null>(null)
const variety = ref('')
const process = ref<CoffeeProcess | ''>('')
const showMoreIdentity = ref(false)

// Step 2 — ORIGEN
const country = ref('')
const region = ref('')
const altitude = ref<number | null>(null)
const farm = ref('')
const producer = ref('')
const showMoreOrigin = ref(false)

// Step 3 — SABOR
const flavorNotes = ref<string[]>([])
const customNote = ref('')
const showCustomNoteInput = ref(false)
const roastLevel = ref<RoastLevel | ''>('')
const price = ref<number | null>(null)
const weight = ref<number | null>(null)
const scaScore = ref<number | null>(null)
const showSca = ref(false)

// ─────────────────────────────────────────────────────────────────────────────
// Prefill from initialCoffee (edit mode)
// ─────────────────────────────────────────────────────────────────────────────

watch(
  () => props.initialCoffee,
  (c) => {
    if (!c) return
    name.value = c.name || ''
    roaster.value = c.roasterName
      ? { id: c.roasterId, name: c.roasterName }
      : null
    variety.value = c.variety || ''
    process.value = (c.process as CoffeeProcess) || ''
    if (c.variety || c.process) showMoreIdentity.value = true

    country.value = c.originCountry || ''
    region.value = c.originRegion || ''
    altitude.value = c.altitude ?? null
    farm.value = c.originFarm || ''
    producer.value = c.originProducer || ''
    if (c.originFarm || c.originProducer) showMoreOrigin.value = true

    flavorNotes.value = [...(c.flavorNotes || [])]
    roastLevel.value = (c.roastLevel as RoastLevel) || ''
    price.value = c.price ?? null
    weight.value = c.weight ?? null
    scaScore.value = c.scaScore ?? null
    if (c.scaScore !== undefined) showSca.value = true
  },
  { immediate: true },
)

// ─────────────────────────────────────────────────────────────────────────────
// Static options
// ─────────────────────────────────────────────────────────────────────────────

const COUNTRIES = ['Colombia', 'Etiopía', 'Kenia', 'Brasil', 'Costa Rica', 'Guatemala']
const PROCESSES: { value: CoffeeProcess; label: string }[] = [
  { value: 'washed', label: 'Lavado' },
  { value: 'natural', label: 'Natural' },
  { value: 'honey', label: 'Honey' },
  { value: 'anaerobic', label: 'Anaeróbico' },
]
const ROAST_LEVELS: { value: RoastLevel; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'medium', label: 'Medio' },
  { value: 'dark', label: 'Oscuro' },
]
const FLAVOR_OPTIONS = [
  'Cereza', 'Vainilla', 'Chocolate', 'Caramelo', 'Naranja', 'Panela',
  'Jazmín', 'Floral', 'Cítrico', 'Nuez', 'Miel', 'Cacao',
]

// ─────────────────────────────────────────────────────────────────────────────
// Step navigation + validation
// ─────────────────────────────────────────────────────────────────────────────

const errors = ref<Record<string, string>>({})

function validateStep1(): boolean {
  errors.value = {}
  if (!name.value.trim()) errors.value.name = 'El nombre es obligatorio'
  if (!roaster.value?.name?.trim()) errors.value.roaster = 'El tostador es obligatorio'
  return Object.keys(errors.value).length === 0
}

function next() {
  if (step.value === 1 && !validateStep1()) return
  if (step.value < totalSteps) step.value = (step.value + 1) as 1 | 2 | 3
}

function back() {
  if (step.value > 1) {
    step.value = (step.value - 1) as 1 | 2 | 3
    return
  }
  router.back()
}

function close() {
  if (props.mode === 'edit' && props.coffeeId) {
    router.push(`/coffees/${props.coffeeId}`)
  }
  else {
    router.push('/coffees')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Flavor chips
// ─────────────────────────────────────────────────────────────────────────────

function toggleFlavor(note: string) {
  const idx = flavorNotes.value.indexOf(note)
  if (idx === -1) flavorNotes.value.push(note)
  else flavorNotes.value.splice(idx, 1)
}

function commitCustomNote() {
  const v = customNote.value.trim()
  if (v && !flavorNotes.value.includes(v)) flavorNotes.value.push(v)
  customNote.value = ''
  showCustomNoteInput.value = false
}

// ─────────────────────────────────────────────────────────────────────────────
// Submit
// ─────────────────────────────────────────────────────────────────────────────

const submitting = ref(false)

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    const payload: CoffeeInput = {
      name: name.value.trim(),
      roasterId: roaster.value?.id,
      roasterName: roaster.value?.name?.trim() || undefined,
      variety: variety.value.trim() || '',
      process: (process.value || 'other') as CoffeeProcess,
      originRegion: region.value.trim() || '',
      originCountry: country.value || '',
      originFarm: farm.value.trim() || undefined,
      originProducer: producer.value.trim() || undefined,
      altitude: altitude.value ?? undefined,
      scaScore: scaScore.value ?? undefined,
      roastLevel: (roastLevel.value || undefined) as RoastLevel | undefined,
      price: price.value ?? undefined,
      weight: weight.value ?? undefined,
      flavorNotes: flavorNotes.value.slice(),
    } as CoffeeInput

    if (props.mode === 'edit' && props.coffeeId) {
      await coffeesStore.update(props.coffeeId, payload as Partial<Coffee>)
      router.replace(`/coffees/${props.coffeeId}`)
    }
    else {
      const id = await coffeesStore.create(payload)
      router.replace(`/coffees/${id}`)
    }
  }
  catch {
    // Toast already surfaced by store
  }
  finally {
    submitting.value = false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Display helpers
// ─────────────────────────────────────────────────────────────────────────────

const stepTitles: Record<1 | 2 | 3, string> = {
  1: 'Identidad',
  2: 'Origen',
  3: 'Sabor',
}

const stepEyebrow = computed(
  () => `${step.value} / ${totalSteps} · ${stepTitles[step.value].toUpperCase()}`,
)

const submitLabel = computed(() =>
  props.mode === 'edit' ? '✓ Guardar cambios' : '✓ Crear café',
)
</script>

<template>
  <div class="min-h-svh bg-paper text-moss font-sans antialiased flex flex-col">
    <header class="px-md pt-md lg:px-xl">
      <div class="mx-auto w-full max-w-[640px] flex items-center justify-between gap-md">
        <button
          v-if="step === 1"
          type="button"
          class="inline-flex items-center justify-center size-[40px] rounded-pill text-moss hover:bg-surface-2/60 transition-colors"
          aria-label="Cerrar"
          @click="close"
        >
          <Icon name="lucide:x" class="size-5" />
        </button>
        <button
          v-else
          type="button"
          class="inline-flex items-center justify-center size-[40px] rounded-pill text-moss hover:bg-surface-2/60 transition-colors"
          aria-label="Atrás"
          @click="back"
        >
          <Icon name="lucide:arrow-left" class="size-5" />
        </button>

        <UiEyebrow class="text-center flex-1">
          {{ stepEyebrow }}
        </UiEyebrow>

        <div class="size-[40px]" aria-hidden="true" />
      </div>

      <div class="mx-auto w-full max-w-[640px] mt-md">
        <UiProgressBar :current="step" :total="totalSteps" />
      </div>
    </header>

    <main class="flex-1 mx-auto w-full max-w-[640px] px-md pt-xl pb-[120px] lg:px-xl">
      <!-- ━━━━━━━━━━━━ STEP 1 — IDENTIDAD ━━━━━━━━━━━━ -->
      <section v-if="step === 1">
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[34px] sm:text-[40px]">
          ¿Cómo se llama<br>este <span class="italic text-olive">café</span>?
        </h1>
        <p class="subtitle-italic mt-sm">
          Nombre y tostador es lo único obligatorio.
        </p>

        <div class="mt-xl flex flex-col gap-xs">
          <UiInput
            v-model="name"
            label="Nombre"
            placeholder="Rock natural"
            :error="errors.name"
          />
          <RoasterPicker
            v-model="roaster"
            label="Tostador"
            placeholder="Selecciona o crea uno…"
            :error="errors.roaster"
          />
        </div>

        <button
          v-if="!showMoreIdentity"
          type="button"
          class="mt-lg inline-flex items-center font-mono text-[10px] font-medium uppercase tracking-eyebrow text-olive hover:opacity-80 transition-opacity"
          @click="showMoreIdentity = true"
        >
          + más detalles (variedad, proceso)
        </button>

        <div v-else class="mt-lg flex flex-col gap-md">
          <UiInput
            v-model="variety"
            label="Variedad"
            placeholder="Caturra, Geisha…"
          />
          <div class="flex flex-col gap-xs">
            <UiEyebrow>Proceso</UiEyebrow>
            <div class="flex flex-wrap gap-xxs">
              <UiChip
                v-for="p in PROCESSES"
                :key="p.value"
                interactive
                :variant="process === p.value ? 'active' : 'default'"
                @click="process = process === p.value ? '' : p.value"
              >
                {{ p.label }}
              </UiChip>
            </div>
          </div>
        </div>
      </section>

      <!-- ━━━━━━━━━━━━ STEP 2 — ORIGEN ━━━━━━━━━━━━ -->
      <section v-if="step === 2">
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[34px] sm:text-[40px]">
          ¿De dónde<br><span class="italic text-olive">viene</span>?
        </h1>

        <div class="mt-xl flex flex-col gap-lg">
          <div class="flex flex-col gap-xs">
            <UiEyebrow>País</UiEyebrow>
            <div class="flex flex-wrap gap-xxs">
              <UiChip
                v-for="c in COUNTRIES"
                :key="c"
                interactive
                :variant="country === c ? 'active' : 'default'"
                @click="country = country === c ? '' : c"
              >
                {{ c }}
              </UiChip>
              <UiChip variant="ghost" interactive @click="country = ''">
                +
              </UiChip>
            </div>
          </div>

          <UiInput v-model="region" label="Región" placeholder="Tarqui, Huila" />

          <div class="flex flex-col gap-xs pt-[14px] pb-[13px] border-b border-moss/10">
            <div class="flex items-baseline justify-between gap-md">
              <label for="altitude" class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft">
                <span aria-hidden="true">— </span>Altitud
                <span class="lowercase normal-case font-display italic text-moss-soft">opcional</span>
              </label>
              <span class="font-mono text-[12px] text-moss">
                {{ altitude ?? '—' }} msnm
              </span>
            </div>
            <input
              id="altitude"
              v-model.number="altitude"
              type="range"
              min="600"
              max="2400"
              step="50"
              class="mt-xs w-full accent-olive"
            >
            <div class="flex justify-between font-mono text-[10px] text-moss-ghost">
              <span>600</span><span>2,400</span>
            </div>
          </div>

          <button
            v-if="!showMoreOrigin"
            type="button"
            class="inline-flex items-center font-mono text-[10px] font-medium uppercase tracking-eyebrow text-olive hover:opacity-80 transition-opacity"
            @click="showMoreOrigin = true"
          >
            + finca, productor
          </button>

          <div v-else class="flex flex-col gap-md">
            <UiInput v-model="farm" label="Finca" placeholder="Nombre de la finca" />
            <UiInput v-model="producer" label="Productor" placeholder="Nombre del productor" />
          </div>
        </div>
      </section>

      <!-- ━━━━━━━━━━━━ STEP 3 — SABOR ━━━━━━━━━━━━ -->
      <section v-if="step === 3">
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[34px] sm:text-[40px]">
          ¿A qué<br><span class="italic text-olive">sabe</span>?
        </h1>
        <p class="subtitle-italic mt-sm">
          Toca las que reconoces en taza.
        </p>

        <div class="mt-xl flex flex-col gap-lg">
          <div class="flex flex-wrap gap-xxs">
            <UiChip
              v-for="opt in FLAVOR_OPTIONS"
              :key="opt"
              interactive
              :variant="flavorNotes.includes(opt) ? 'active' : 'default'"
              @click="toggleFlavor(opt)"
            >
              {{ opt }}
            </UiChip>
            <UiChip
              v-for="custom in flavorNotes.filter(n => !FLAVOR_OPTIONS.includes(n))"
              :key="custom"
              interactive
              variant="active"
              @click="toggleFlavor(custom)"
            >
              {{ custom }}
            </UiChip>
            <template v-if="!showCustomNoteInput">
              <UiChip
                variant="ghost"
                interactive
                @click="showCustomNoteInput = true"
              >
                + propia
              </UiChip>
            </template>
            <template v-else>
              <input
                v-model="customNote"
                type="text"
                placeholder="Nota personalizada"
                class="rounded-pill bg-surface-2 px-md h-[25px] font-mono text-[11px] uppercase tracking-eyebrow text-moss outline-none focus:bg-paper border border-moss/20"
                autofocus
                @keydown.enter.prevent="commitCustomNote"
                @blur="commitCustomNote"
              >
            </template>
          </div>

          <div class="flex flex-col gap-xs">
            <UiEyebrow>Tueste</UiEyebrow>
            <div class="flex flex-wrap gap-xxs">
              <UiChip
                v-for="r in ROAST_LEVELS"
                :key="r.value"
                interactive
                :variant="roastLevel === r.value ? 'active' : 'default'"
                @click="roastLevel = roastLevel === r.value ? '' : r.value"
              >
                {{ r.label }}
              </UiChip>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-md">
            <UiInput
              v-model.number="price"
              label="Precio"
              placeholder="$60,000"
              type="number"
              inputmode="numeric"
            />
            <UiInput
              v-model.number="weight"
              label="Peso"
              placeholder="250 g"
              type="number"
              inputmode="numeric"
            />
          </div>

          <button
            v-if="!showSca"
            type="button"
            class="inline-flex items-center font-mono text-[10px] font-medium uppercase tracking-eyebrow text-olive hover:opacity-80 transition-opacity"
            @click="showSca = true"
          >
            + SCA score (avanzado)
          </button>
          <UiInput
            v-else
            v-model.number="scaScore"
            label="Puntaje SCA"
            placeholder="86.5"
            type="number"
            inputmode="decimal"
          />
        </div>
      </section>
    </main>

    <div class="fixed inset-x-0 bottom-0 z-20 px-md pb-[calc(env(safe-area-inset-bottom)+12px)] pt-sm bg-paper/95 backdrop-blur-md border-t border-moss/5 lg:px-xl">
      <div class="mx-auto w-full max-w-[640px]">
        <UiButton
          v-if="step < totalSteps"
          variant="primary"
          @click="next"
        >
          Siguiente →
          <span v-if="step === 2" class="font-mono text-[10px] uppercase tracking-eyebrow opacity-70 ml-xs">
            Sabor
          </span>
        </UiButton>
        <UiButton
          v-else
          variant="dark"
          :loading="submitting"
          @click="submit"
        >
          {{ submitLabel }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
