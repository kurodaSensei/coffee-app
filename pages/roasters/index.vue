<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Roaster, RoasterInput } from '~/types'

const router = useRouter()
const roastersStore = useRoastersStore()
const coffeesStore = useCoffeesStore()

onMounted(() => {
  roastersStore.loadAll().catch(() => {})
  coffeesStore.loadAll().catch(() => {})
})

const search = ref('')

const filtered = computed<Roaster[]>(() => {
  const list = (roastersStore.list as Roaster[]) || []
  const q = search.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    r =>
      (r.name || '').toLowerCase().includes(q)
      || (r.city || '').toLowerCase().includes(q)
      || (r.country || '').toLowerCase().includes(q),
  )
})

function coffeesCount(roasterId: string): number {
  return (coffeesStore.list as { roasterId?: string }[]).filter(c => c.roasterId === roasterId).length
}

function avatarTone(name: string): 'olive' | 'honey' | 'jungle' | 'surface' {
  // simple deterministic pick based on first char
  const c = (name || '?').charCodeAt(0)
  const tones: Array<'olive' | 'honey' | 'jungle' | 'surface'> = ['olive', 'honey', 'jungle', 'surface']
  return tones[c % tones.length]
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom sheet form (create / edit)
// ─────────────────────────────────────────────────────────────────────────────

const sheetOpen = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  name: '',
  country: 'Colombia',
  city: '',
  website: '',
  instagram: '',
  rating: null as number | null,
})

const formErrors = ref<{ name?: string; country?: string }>({})
const submitting = ref(false)

function openCreate() {
  editingId.value = null
  form.value = {
    name: '',
    country: 'Colombia',
    city: '',
    website: '',
    instagram: '',
    rating: null,
  }
  formErrors.value = {}
  sheetOpen.value = true
}

function openEdit(r: Roaster) {
  editingId.value = r.id
  form.value = {
    name: r.name || '',
    country: r.country || 'Colombia',
    city: r.city || '',
    website: r.website || '',
    instagram: r.instagram || '',
    rating: r.rating ?? null,
  }
  formErrors.value = {}
  sheetOpen.value = true
}

function validateForm(): boolean {
  formErrors.value = {}
  if (!form.value.name.trim()) formErrors.value.name = 'El nombre es obligatorio'
  if (!form.value.country.trim()) formErrors.value.country = 'El país es obligatorio'
  return Object.keys(formErrors.value).length === 0
}

async function save() {
  if (submitting.value || !validateForm()) return
  submitting.value = true
  try {
    const payload: RoasterInput = {
      name: form.value.name.trim(),
      country: form.value.country.trim(),
      city: form.value.city.trim() || undefined,
      website: form.value.website.trim() || undefined,
      instagram: form.value.instagram.trim() || undefined,
      rating: form.value.rating ?? undefined,
    } as RoasterInput

    if (editingId.value) {
      await roastersStore.update(editingId.value, payload as Partial<Roaster>)
    }
    else {
      await roastersStore.create(payload)
    }
    sheetOpen.value = false
  }
  catch {
    // toast surfaced by store
  }
  finally {
    submitting.value = false
  }
}

async function deleteRoaster() {
  if (!editingId.value) return
  const ok = window.confirm('¿Eliminar este tostador? Los cafés asociados conservarán su nombre actual.')
  if (!ok) return
  try {
    await roastersStore.remove(editingId.value)
    sheetOpen.value = false
  }
  catch {
    // toast
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[640px] px-md pt-md pb-2xl lg:px-xl lg:pt-xl">
    <header class="flex items-center justify-between gap-md">
      <button
        type="button"
        class="inline-flex items-center justify-center size-[40px] rounded-pill text-moss hover:bg-surface-2/60 transition-colors"
        aria-label="Volver"
        @click="router.back()"
      >
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>
      <UiEyebrow>Catálogo</UiEyebrow>
      <button
        type="button"
        class="inline-flex items-center justify-center size-[40px] rounded-pill text-moss hover:bg-surface-2/60 transition-colors"
        aria-label="Nuevo tostador"
        @click="openCreate"
      >
        <Icon name="lucide:plus" class="size-5" />
      </button>
    </header>

    <h1 class="mt-md font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[48px]">
      Tostadores<span>.</span>
    </h1>
    <p class="subtitle-italic mt-xs">
      De dónde viene tu taza.
    </p>

    <!-- Search -->
    <div class="mt-lg">
      <div class="flex items-center gap-sm rounded-pill bg-surface-2 px-md py-sm">
        <Icon name="lucide:search" class="size-4 text-moss-ghost shrink-0" />
        <input
          v-model="search"
          type="search"
          placeholder="Buscar tostador…"
          class="flex-1 bg-transparent border-0 p-0 outline-none font-mono text-[12px] uppercase tracking-eyebrow text-moss placeholder:text-moss-ghost"
        >
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="mt-2xl flex flex-col items-center gap-lg">
      <p class="font-display italic text-[15px] text-moss-soft text-center max-w-[280px]">
        <template v-if="search">No encontramos tostadores con ese nombre.</template>
        <template v-else>"Detrás de cada taza hay un tostador. Empecemos por el primero."</template>
      </p>
      <UiButton v-if="!search" variant="dark" :block="false" @click="openCreate">
        + Nuevo tostador
      </UiButton>
    </div>

    <!-- List -->
    <ul v-else class="mt-lg flex flex-col gap-sm">
      <li v-for="r in filtered" :key="r.id">
        <button
          type="button"
          class="w-full flex items-center gap-md rounded-card-sm bg-surface p-md text-left transition-colors duration-150 ease-sorbo hover:bg-surface-2"
          @click="openEdit(r)"
        >
          <UiAvatar :name="r.name" :tone="avatarTone(r.name)" size="md" />
          <div class="flex-1 min-w-0">
            <div class="font-sans text-[16px] font-medium text-moss truncate">{{ r.name }}</div>
            <UiEyebrow class="mt-xxs">
              {{ [r.city, r.country].filter(Boolean).join(' · ') || '—' }}
            </UiEyebrow>
          </div>
          <div class="flex flex-col items-end gap-xxs shrink-0">
            <span v-if="r.rating !== undefined && r.rating !== null" class="font-display text-[18px] leading-none text-moss">
              {{ r.rating.toFixed(1) }}<span class="font-mono text-[10px] text-moss-soft">/5</span>
            </span>
            <UiEyebrow>
              {{ coffeesCount(r.id) }} {{ coffeesCount(r.id) === 1 ? 'café' : 'cafés' }}
            </UiEyebrow>
          </div>
        </button>
      </li>
    </ul>

    <!-- Bottom sheet form -->
    <UiBottomSheet v-model="sheetOpen" :title="editingId ? 'Editar tostador' : 'Nuevo tostador'">
      <div class="flex flex-col gap-xs pt-xs">
        <UiInput v-model="form.name" label="Nombre" placeholder="Libertario" :error="formErrors.name" />
        <UiInput v-model="form.country" label="País" placeholder="Colombia" :error="formErrors.country" />
        <UiInput v-model="form.city" label="Ciudad" placeholder="Bogotá" />
        <UiInput v-model="form.website" label="Sitio web" placeholder="libertario.co" type="url" />
        <UiInput v-model="form.instagram" label="Instagram" placeholder="@libertario" />

        <div class="flex flex-col gap-xs pt-[14px] pb-[13px] border-b border-moss/10">
          <div class="flex items-baseline justify-between gap-md">
            <label for="rating" class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft">
              <span aria-hidden="true">— </span>Rating
              <span class="lowercase normal-case font-display italic text-moss-soft">opcional · 0-5</span>
            </label>
            <span class="font-mono text-[12px] text-moss">
              {{ form.rating !== null ? form.rating.toFixed(1) : '—' }} /5
            </span>
          </div>
          <input
            id="rating"
            v-model.number="form.rating"
            type="range"
            min="0"
            max="5"
            step="0.1"
            class="mt-xs w-full accent-olive"
          >
        </div>
      </div>

      <div class="mt-xl flex flex-col gap-sm">
        <UiButton variant="primary" :loading="submitting" @click="save">
          {{ editingId ? 'Guardar cambios' : 'Crear tostador' }}
        </UiButton>
        <UiButton v-if="editingId" variant="ghost" @click="deleteRoaster">
          <span class="text-terracotta">Eliminar tostador</span>
        </UiButton>
      </div>
    </UiBottomSheet>
  </div>
</template>
