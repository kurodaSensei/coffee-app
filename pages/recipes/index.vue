<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Recipe } from '~/types'

const { currentUser } = useAuth()
const recipesStore = useRecipesStore()
const { getBrewMethodLabel } = useCatalog()

onMounted(() => {
  recipesStore.loadAll().catch(() => {})
})

const userName = computed(() =>
  currentUser.value?.displayName || currentUser.value?.email?.split('@')[0] || '',
)

const items = computed<Recipe[]>(() => {
  const list = (recipesStore.list as Recipe[]) || []
  return [...list].sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0
    const tb = b.createdAt?.toMillis?.() ?? 0
    return tb - ta
  })
})

const featured = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1))

const isEmpty = computed(() => items.value.length === 0)

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function durationLabel(r: Recipe): string {
  if (!r.steps || r.steps.length === 0) return '—'
  const max = r.steps.reduce((acc, s) => Math.max(acc, s.timeSeconds), 0)
  return formatTime(max)
}

function methodPill(r: Recipe): string {
  return getBrewMethodLabel(r.brewMethod)
}

function rowEyebrow(r: Recipe): string {
  const method = methodPill(r).toUpperCase()
  if (r.author) return `${method} · ${r.author.toUpperCase()}`
  return method
}

function recipeName(r: Recipe): string {
  // If recipe name == "{Method} {Author}", split for visual emphasis.
  // Otherwise just display the name.
  return r.name.endsWith('.') ? r.name : `${r.name}.`
}

// Sheet detail
const sheetOpen = ref(false)
const activeRecipe = ref<Recipe | null>(null)

function openSheet(r: Recipe) {
  activeRecipe.value = r
  sheetOpen.value = true
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-md pt-md pb-2xl lg:px-xl xl:px-2xl lg:pt-xl">
    <header class="flex items-center justify-between gap-md">
      <UiEyebrow>Recetas{{ items.length > 0 ? ` · ${items.length}` : '' }}</UiEyebrow>
      <NuxtLink to="/settings" class="lg:hidden inline-flex">
        <UiAvatar :name="userName" :src="currentUser?.photoURL ?? undefined" size="sm" />
      </NuxtLink>
    </header>

    <div class="mt-lg flex items-end justify-between gap-md flex-wrap">
      <div>
        <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[48px] lg:text-[64px]">
          Recetas<span>.</span>
        </h1>
        <p class="subtitle-italic mt-xs">
          {{ items.length > 0 ? 'Tus brews favoritos.' : 'Tu próximo brew empieza aquí.' }}
        </p>
      </div>
      <UiButton
        variant="primary"
        :block="false"
        to="/recipes/new"
        size="sm"
        class="hidden lg:inline-flex"
      >
        + Nueva receta
      </UiButton>
    </div>

    <!-- Empty -->
    <div v-if="isEmpty" class="mt-2xl flex flex-col items-center gap-lg">
      <p class="font-display italic text-[16px] text-moss text-center max-w-[320px] leading-relaxed">
        "Una buena receta es repetir el sorbo perfecto."
      </p>
      <UiButton variant="dark" :block="false" to="/recipes/new">
        + Nueva receta
      </UiButton>
    </div>

    <!-- List -->
    <div v-else class="mt-lg flex flex-col gap-sm lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-md">
      <!-- Featured (first recipe) -->
      <button
        v-if="featured"
        type="button"
        class="group relative overflow-hidden rounded-card-lg bg-moss text-paper p-md sm:p-lg text-left transition-transform duration-200 ease-sorbo hover:-translate-y-[2px] lg:col-span-2 xl:col-span-1"
        @click="openSheet(featured)"
      >
        <div class="flex items-start justify-between gap-md">
          <UiEyebrow class="text-paper/70">{{ (featured.author || 'Receta').toUpperCase() }}</UiEyebrow>
          <UiChip variant="honey" compact class="!h-[22px]">
            {{ methodPill(featured).toUpperCase() }}
          </UiChip>
        </div>

        <h2 class="mt-sm font-display tracking-[-0.01em] leading-[0.95] text-[32px] sm:text-[36px]">
          <template v-if="featured.author">
            {{ getBrewMethodLabel(featured.brewMethod) }}<br>
            <span class="italic text-honey">{{ featured.author }}</span><span>.</span>
          </template>
          <template v-else>
            {{ recipeName(featured) }}
          </template>
        </h2>

        <div class="mt-md grid grid-cols-3 gap-md">
          <div class="flex flex-col gap-xxs">
            <UiEyebrow class="text-paper/70">Dosis</UiEyebrow>
            <span class="font-mono text-[14px] text-paper">{{ featured.dose }}g</span>
          </div>
          <div class="flex flex-col gap-xxs">
            <UiEyebrow class="text-paper/70">Ratio</UiEyebrow>
            <span class="font-mono text-[14px] text-honey">
              {{ featured.ratio || `1:${Math.round(featured.water / featured.dose)}` }}
            </span>
          </div>
          <div class="flex flex-col gap-xxs">
            <UiEyebrow class="text-paper/70">Temp</UiEyebrow>
            <span class="font-mono text-[14px] text-paper">
              {{ featured.waterTemp ? `${featured.waterTemp}°` : '—' }}
            </span>
          </div>
        </div>

        <p v-if="featured.bestFor" class="mt-md font-display italic text-[14px] text-paper/80 leading-relaxed">
          "{{ featured.bestFor }}"
        </p>
      </button>

      <!-- Compact rows -->
      <button
        v-for="r in rest"
        :key="r.id"
        type="button"
        class="w-full rounded-card-sm bg-surface p-md text-left transition-colors duration-150 ease-sorbo hover:bg-surface-2"
        @click="openSheet(r)"
      >
        <div class="flex items-start justify-between gap-md">
          <UiEyebrow>{{ rowEyebrow(r) }}</UiEyebrow>
          <span class="font-mono text-[12px] text-moss-soft tabular-nums">
            {{ durationLabel(r) }}
          </span>
        </div>
        <div class="mt-xs font-display text-[24px] leading-none text-moss truncate">
          {{ recipeName(r) }}
        </div>
      </button>

      <!-- + Nueva receta dashed pill (mobile) -->
      <NuxtLink
        to="/recipes/new"
        class="lg:hidden rounded-cta border border-dashed border-moss/30 bg-surface/50 px-md py-md text-center font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft hover:bg-surface transition-colors"
      >
        + Nueva receta
      </NuxtLink>
    </div>

    <!-- Mobile FAB (hidden because we have the dashed pill instead) -->

    <!-- Detail sheet -->
    <UiBottomSheet v-model="sheetOpen" :title="activeRecipe ? methodPill(activeRecipe) : ''">
      <RecipeDetail v-if="activeRecipe" :recipe="activeRecipe" />
      <div v-if="activeRecipe" class="mt-lg">
        <UiButton
          variant="ghost"
          :to="`/recipes/${activeRecipe.id}`"
          @click="sheetOpen = false"
        >
          Ver completa
        </UiButton>
      </div>
    </UiBottomSheet>
  </div>
</template>
