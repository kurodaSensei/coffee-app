<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Stamp from '../Stamp.vue'
import StageHeader from '../StageHeader.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { Coffee } from '~/types'

const { state, setCoffee } = useVertidoSession()
const coffeesStore = useCoffeesStore()
const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()

onMounted(() => {
  if ((coffeesStore.list as Coffee[]).length === 0) {
    coffeesStore.loadAll().catch(() => {})
  }
})

// Búsqueda — typeahead por nombre o tostador. Sin query: lista corta
// editorial. Con query: hasta 30 matches (suficiente para no abrumar
// pero permitir desambiguar entre cafés homónimos de distintos tostadores).
const query = ref('')
const queryNorm = computed(() => query.value.trim().toLowerCase())

function sortByRecent(a: Coffee, b: Coffee) {
  const tb = (b.createdAt as any)?.toMillis?.() ?? 0
  const ta = (a.createdAt as any)?.toMillis?.() ?? 0
  return tb - ta
}

const coffees = computed<Coffee[]>(() => {
  const list = [...(coffeesStore.list as Coffee[])]
  if (!queryNorm.value) {
    return list.sort(sortByRecent).slice(0, 6)
  }
  return list
    .filter((c) => {
      const n = (c.name || '').toLowerCase()
      const r = (c.roasterName || '').toLowerCase()
      return n.includes(queryNorm.value) || r.includes(queryNorm.value)
    })
    .sort(sortByRecent)
    .slice(0, 30)
})

const totalCoffees = computed(() => (coffeesStore.list as Coffee[]).length)
const hasMoreThanShown = computed(() => !queryNorm.value && totalCoffees.value > 6)

const selected = ref<Coffee | null>(null)

function pick(c: Coffee) {
  selected.value = c
}

function confirm(e: MouseEvent) {
  const c = selected.value ?? coffees.value[0]
  if (!c) return
  setCoffee(c)
  emit('advance', { x: e.clientX, y: e.clientY })
}
</script>

<template>
  <section class="relative flex flex-col h-full">
    <StageHeader :n="1" label="CAFÉ" />

    <!-- Sello off-axis, esquina superior derecha, marca de capítulo -->
    <Stamp
      name="coffee"
      :size="140"
      class="absolute top-16 -right-4 text-paper pointer-events-none"
      style="opacity: 0.14; transform: rotate(-8deg);"
    />

    <div class="flex-1 px-md flex flex-col">
      <!-- Headline: "¿qué café tienes hoy?" con em italic honey -->
      <h2
        class="font-display text-paper leading-[0.95] tracking-[-0.02em] mb-5"
        style="font-size: 38px;"
      >
        ¿qué café
        <em class="not-italic">
          <span class="italic text-honey">tienes hoy?</span>
        </em>
      </h2>

      <!-- Search bar minimal: hairline en honey al focus, sin border box.
           Default vacío con placeholder editorial — discreto pero presente. -->
      <div class="relative mb-4 border-b border-paper/15 focus-within:border-honey/60 transition-colors">
        <input
          v-model="query"
          type="search"
          placeholder="busca por nombre o tostador"
          autocomplete="off"
          class="w-full bg-transparent py-2.5 pr-8 font-sans text-paper placeholder:text-paper/30 focus:outline-none"
          style="font-size: 14px;"
        >
        <span
          class="absolute right-0 top-1/2 -translate-y-1/2 font-mono uppercase tracking-[0.15em] text-paper/30 pointer-events-none"
          style="font-size: 9px;"
        >
          {{ queryNorm ? `${coffees.length}` : `${totalCoffees}` }}
        </span>
      </div>

      <!-- Lista editorial; el seleccionado se hincha con acento honey -->
      <ul
        v-if="coffees.length > 0"
        class="flex flex-col gap-2 overflow-y-auto"
        :style="queryNorm ? 'max-height: calc(100vh - 360px);' : ''"
      >
        <li v-for="c in coffees" :key="c.id">
          <button
            type="button"
            class="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3"
            :class="selected?.id === c.id
              ? 'bg-honey/10 border-honey/30'
              : 'bg-paper/5 border-paper/10 hover:border-paper/25'"
            @click="pick(c)"
          >
            <div class="min-w-0">
              <p
                class="font-display text-paper leading-[1.1] truncate transition-all"
                :style="{ fontSize: selected?.id === c.id ? '22px' : '17px' }"
              >
                {{ c.name }}
              </p>
              <p
                class="font-mono uppercase tracking-[0.12em] mt-1"
                :class="selected?.id === c.id ? 'text-honey' : 'text-paper/30'"
                style="font-size: 9px;"
              >
                {{ c.roasterName || 'sin tostador' }}
              </p>
            </div>
            <span
              class="font-display transition-all flex-shrink-0"
              :class="selected?.id === c.id ? 'text-honey' : 'text-paper/25'"
              :style="{ fontSize: selected?.id === c.id ? '22px' : '16px' }"
            >
              {{ c.scaScore ? c.scaScore.toFixed(0) : '—' }}
            </span>
          </button>
        </li>
      </ul>

      <!-- Empty state cuando no hay matches -->
      <div v-else-if="queryNorm" class="py-8 text-center">
        <p class="font-display italic text-paper/45" style="font-size: 18px;">
          nada encontrado
        </p>
        <p class="font-mono uppercase tracking-[0.15em] text-paper/30 mt-2" style="font-size: 9px;">
          prueba con otro término
        </p>
      </div>

      <!-- Hint cuando hay más cafés que los 6 visibles -->
      <p
        v-if="hasMoreThanShown"
        class="font-mono uppercase tracking-[0.18em] text-paper/30 mt-3 text-center"
        style="font-size: 9px;"
      >
        {{ totalCoffees - 6 }} más · escribe para buscar
      </p>
    </div>

    <!-- CTA al pie -->
    <div class="px-md pb-md pt-sm">
      <button
        type="button"
        :disabled="!selected"
        class="w-full py-3.5 rounded-[11px] font-sans font-semibold transition-opacity"
        :class="selected ? 'bg-honey text-jungle' : 'bg-honey/40 text-jungle/50 cursor-not-allowed'"
        style="font-size: 13px;"
        @click="confirm"
      >
        Continuar
      </button>
    </div>
  </section>
</template>
