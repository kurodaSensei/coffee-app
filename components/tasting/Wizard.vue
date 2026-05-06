<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Timestamp } from 'firebase/firestore'
import type { BrewMethod, Coffee, Tasting, TastingInput } from '~/types'

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    initialTasting?: Tasting | null
    tastingId?: string
    /** Pre-select a coffee in step 1 (create mode). */
    initialCoffeeId?: string | null
  }>(),
  {
    mode: 'create',
    initialTasting: null,
    initialCoffeeId: null,
  },
)

const router = useRouter()
const tastingsStore = useTastingsStore()
const coffeesStore = useCoffeesStore()
const { brewMethodOptions, getBrewMethodLabel } = useCatalog()

onMounted(() => {
  if (!coffeesStore.list.length) coffeesStore.loadAll().catch(() => {})
})

// ─────────────────────────────────────────────────────────────────────────────
// Wizard state
// ─────────────────────────────────────────────────────────────────────────────

const step = ref<1 | 2 | 3>(1)
const totalSteps = 3

// Step 1
const coffeeId = ref<string>('')
const brewMethod = ref<BrewMethod | ''>('')

// Step 2
const ratingOverall = ref<number | null>(null)
const ratingAroma = ref<number | null>(null)
const ratingAcidity = ref<number | null>(null)
const ratingSweetness = ref<number | null>(null)
const ratingBody = ref<number | null>(null)
const ratingAftertaste = ref<number | null>(null)

// Step 3
const personalNotes = ref('')
const isFavorite = ref(false)
const wouldBuyAgain = ref(false)

const errors = ref<Record<string, string>>({})

// ─────────────────────────────────────────────────────────────────────────────
// Prefill (edit mode)
// ─────────────────────────────────────────────────────────────────────────────

watch(
  () => props.initialTasting,
  (t) => {
    if (!t) return
    coffeeId.value = t.coffeeId
    brewMethod.value = t.brewMethod
    ratingOverall.value = t.ratingOverall ?? null
    ratingAroma.value = t.ratingAroma ?? null
    ratingAcidity.value = t.ratingAcidity ?? null
    ratingSweetness.value = t.ratingSweetness ?? null
    ratingBody.value = t.ratingBody ?? null
    ratingAftertaste.value = t.ratingAftertaste ?? null
    personalNotes.value = t.personalNotes || ''
    isFavorite.value = !!t.isFavorite
    wouldBuyAgain.value = !!t.wouldBuyAgain
  },
  { immediate: true },
)

// Prefill coffee from query param (create mode)
watch(
  () => props.initialCoffeeId,
  (id) => {
    if (id && !coffeeId.value) coffeeId.value = id
  },
  { immediate: true },
)

// ─────────────────────────────────────────────────────────────────────────────
// Derived
// ─────────────────────────────────────────────────────────────────────────────

const coffees = computed<Coffee[]>(() => (coffeesStore.list as Coffee[]) || [])
const selectedCoffee = computed<Coffee | null>(
  () => coffees.value.find(c => c.id === coffeeId.value) ?? null,
)

const activeMethods = computed(() => brewMethodOptions.value)

// ─────────────────────────────────────────────────────────────────────────────
// Step navigation + validation
// ─────────────────────────────────────────────────────────────────────────────

function validateStep1(): boolean {
  errors.value = {}
  if (!coffeeId.value) errors.value.coffee = 'Selecciona el café que probaste'
  if (!brewMethod.value) errors.value.method = 'Selecciona el método de extracción'
  return Object.keys(errors.value).length === 0
}

function validateStep2(): boolean {
  errors.value = {}
  if (ratingOverall.value === null) {
    errors.value.overall = 'Asigna una puntuación general'
  }
  return Object.keys(errors.value).length === 0
}

function next() {
  if (step.value === 1 && !validateStep1()) return
  if (step.value === 2 && !validateStep2()) return
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
  if (props.mode === 'edit' && props.tastingId) {
    router.push(`/tastings/${props.tastingId}`)
  }
  else {
    router.push('/tastings')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Submit
// ─────────────────────────────────────────────────────────────────────────────

const submitting = ref(false)

async function submit() {
  if (submitting.value) return
  if (!validateStep2()) return
  if (!selectedCoffee.value || !brewMethod.value) return
  submitting.value = true
  try {
    const c = selectedCoffee.value
    const payload: TastingInput = {
      coffeeId: c.id,
      coffeeName: c.name,
      roasterName: c.roasterName || '',
      brewMethod: brewMethod.value,
      brewDate: props.initialTasting?.brewDate ?? Timestamp.now(),
      ratingOverall: ratingOverall.value as number,
      ratingAroma: ratingAroma.value ?? undefined,
      ratingAcidity: ratingAcidity.value ?? undefined,
      ratingSweetness: ratingSweetness.value ?? undefined,
      ratingBody: ratingBody.value ?? undefined,
      ratingAftertaste: ratingAftertaste.value ?? undefined,
      personalNotes: personalNotes.value.trim() || undefined,
      isFavorite: isFavorite.value || undefined,
      wouldBuyAgain: wouldBuyAgain.value || undefined,
    } as TastingInput

    if (props.mode === 'edit' && props.tastingId) {
      await tastingsStore.update(props.tastingId, payload as Partial<Tasting>)
      router.replace(`/tastings/${props.tastingId}`)
    }
    else {
      const id = await tastingsStore.create(payload)
      router.replace(`/tastings/${id}`)
    }
  }
  catch {
    // Toast surfaced by store
  }
  finally {
    submitting.value = false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Display helpers
// ─────────────────────────────────────────────────────────────────────────────

const stepTitles: Record<1 | 2 | 3, string> = {
  1: 'El café',
  2: 'Sentidos',
  3: 'Memoria',
}

const stepEyebrow = computed(
  () => `${step.value} / ${totalSteps} · ${stepTitles[step.value].toUpperCase()}`,
)

const submitLabel = computed(() =>
  props.mode === 'edit' ? '✓ Guardar cambios' : '✓ Guardar cata',
)

const processLabel: Record<string, string> = {
  washed: 'LAVADO',
  natural: 'NATURAL',
  honey: 'HONEY',
  anaerobic: 'ANAERÓBICO',
  carbonic: 'CARBÓNICO',
  experimental: 'EXPERIMENTAL',
  other: 'OTRO',
}

function coffeeEyebrow(c: Coffee): string {
  const proc = c.process ? processLabel[c.process] || c.process.toUpperCase() : ''
  const roaster = c.roasterName?.toUpperCase() || ''
  return [proc, roaster].filter(Boolean).join(' · ')
}
</script>

<template>
  <div class="min-h-svh bg-paper text-moss font-sans antialiased flex flex-col">
    <!-- Header -->
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
      <!-- ━━━━━━━━━━ STEP 1 — EL CAFÉ ━━━━━━━━━━ -->
      <section v-if="step === 1">
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[34px] sm:text-[40px]">
          ¿Qué <span class="italic text-olive">café</span><br>probaste?
        </h1>

        <!-- Coffee picker -->
        <div class="mt-xl flex flex-col gap-xs">
          <button
            v-for="c in coffees"
            :key="c.id"
            type="button"
            class="group relative overflow-hidden rounded-cta px-md py-md text-left transition-colors duration-150 ease-sorbo"
            :class="
              coffeeId === c.id
                ? 'bg-olive text-paper'
                : 'bg-surface text-moss hover:bg-surface-2'
            "
            @click="coffeeId = c.id"
          >
            <div class="flex items-center justify-between gap-md">
              <div class="min-w-0">
                <UiEyebrow :class="coffeeId === c.id ? 'text-paper/70' : ''">
                  {{ coffeeEyebrow(c) }}
                </UiEyebrow>
                <div class="mt-xxs font-display text-[24px] leading-none truncate">
                  {{ c.name.endsWith('.') ? c.name : `${c.name}.` }}
                </div>
              </div>
              <span
                v-if="coffeeId === c.id"
                aria-hidden="true"
                class="inline-block size-[10px] rounded-pill bg-honey shrink-0"
              />
            </div>
          </button>

          <NuxtLink
            to="/coffees/new"
            class="rounded-cta border border-dashed border-moss/30 bg-surface/50 px-md py-md text-center font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft hover:bg-surface transition-colors"
          >
            + Agregar café nuevo
          </NuxtLink>
        </div>

        <p
          v-if="errors.coffee"
          class="mt-sm font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
        >
          <span aria-hidden="true">— </span>{{ errors.coffee }}
        </p>

        <!-- Brew method -->
        <div class="mt-xl flex flex-col gap-xs">
          <UiEyebrow>Método</UiEyebrow>
          <div class="flex flex-wrap gap-xxs">
            <UiChip
              v-for="m in activeMethods"
              :key="m.value"
              interactive
              :variant="brewMethod === m.value ? 'active' : 'default'"
              @click="brewMethod = brewMethod === m.value ? '' : (m.value as BrewMethod)"
            >
              {{ m.label }}
            </UiChip>
          </div>
          <p
            v-if="errors.method"
            class="mt-xxs font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
          >
            <span aria-hidden="true">— </span>{{ errors.method }}
          </p>
        </div>
      </section>

      <!-- ━━━━━━━━━━ STEP 2 — SENTIDOS ━━━━━━━━━━ -->
      <section v-if="step === 2">
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[34px] sm:text-[40px]">
          ¿Cómo se <span class="italic text-olive">siente</span>?
        </h1>

        <UiRatingBar
          v-model="ratingOverall"
          variant="hero"
          label="Puntuación general"
          class="mt-xl"
        />
        <p
          v-if="errors.overall"
          class="mt-xs font-mono text-[10px] font-medium uppercase tracking-eyebrow text-terracotta"
        >
          <span aria-hidden="true">— </span>{{ errors.overall }}
        </p>

        <div class="mt-lg flex flex-col">
          <UiRatingBar v-model="ratingAroma" label="Aroma" class="border-b border-moss/10" />
          <UiRatingBar v-model="ratingAcidity" label="Acidez" class="border-b border-moss/10" />
          <UiRatingBar v-model="ratingSweetness" label="Dulzura" class="border-b border-moss/10" />
          <UiRatingBar v-model="ratingBody" label="Cuerpo" class="border-b border-moss/10" />
          <UiRatingBar v-model="ratingAftertaste" label="Retrogusto" />
        </div>

        <p class="mt-md font-display italic text-[13px] text-moss-soft">
          Los atributos son opcionales — tap o arrastra para puntuar.
        </p>
      </section>

      <!-- ━━━━━━━━━━ STEP 3 — MEMORIA ━━━━━━━━━━ -->
      <section v-if="step === 3">
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[34px] sm:text-[40px]">
          ¿Qué <span class="italic text-olive">recordarás</span><br>de esta taza?
        </h1>

        <!-- Note card -->
        <div class="mt-xl rounded-card-lg bg-surface-2 p-md">
          <UiEyebrow>Tu nota</UiEyebrow>
          <textarea
            v-model="personalNotes"
            rows="3"
            placeholder="Dulce como postre, con un final a panela…"
            class="mt-xs w-full bg-transparent border-0 p-0 outline-none resize-none font-display italic text-[16px] text-moss placeholder:text-moss-ghost"
          />
        </div>

        <!-- Toggles -->
        <div class="mt-md flex gap-xs">
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center gap-xs rounded-cta px-md py-sm text-[14px] font-sans transition-colors duration-150 ease-sorbo"
            :class="
              isFavorite
                ? 'bg-olive text-paper'
                : 'bg-surface-2 text-moss hover:bg-surface'
            "
            @click="isFavorite = !isFavorite"
          >
            <span aria-hidden="true">{{ isFavorite ? '❤️' : '🤍' }}</span>
            Favorito
          </button>
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center gap-xs rounded-cta px-md py-sm text-[14px] font-sans transition-colors duration-150 ease-sorbo border"
            :class="
              wouldBuyAgain
                ? 'bg-olive text-paper border-olive'
                : 'bg-transparent text-moss border-moss/15 hover:bg-surface-2'
            "
            @click="wouldBuyAgain = !wouldBuyAgain"
          >
            <Icon name="lucide:rotate-ccw" class="size-4" />
            Repetiría
          </button>
        </div>

        <!-- Preview -->
        <div v-if="selectedCoffee && ratingOverall !== null" class="mt-xl rounded-card-lg bg-moss p-md">
          <div class="flex items-center justify-between gap-md">
            <UiEyebrow class="text-paper">Vista previa</UiEyebrow>
            <span class="font-display text-[28px] leading-none text-paper">
              {{ ratingOverall.toFixed(1) }}
            </span>
          </div>
          <div class="mt-xs font-display text-[24px] leading-none text-paper">
            {{ selectedCoffee.name.endsWith('.') ? selectedCoffee.name : `${selectedCoffee.name}.` }}
          </div>
        </div>
      </section>
    </main>

    <!-- Sticky bottom CTA -->
    <div class="fixed inset-x-0 bottom-0 z-20 px-md pb-[calc(env(safe-area-inset-bottom)+12px)] pt-sm bg-paper/95 backdrop-blur-md border-t border-moss/5 lg:px-xl">
      <div class="mx-auto w-full max-w-[640px]">
        <UiButton
          v-if="step < totalSteps"
          variant="primary"
          @click="next"
        >
          Siguiente →
          <span class="font-mono text-[10px] uppercase tracking-eyebrow opacity-70 ml-xs">
            {{ stepTitles[(step + 1) as 1 | 2 | 3] }}
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
