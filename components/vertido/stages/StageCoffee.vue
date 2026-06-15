<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StageFrame from '../StageFrame.vue'
import { useVertidoSession } from '~/composables/useVertidoSession'
import type { Coffee } from '~/types'

const { state, setCoffee, next } = useVertidoSession()
const coffeesStore = useCoffeesStore()

onMounted(() => {
  if ((coffeesStore.list as Coffee[]).length === 0) {
    coffeesStore.loadAll().catch(() => {})
  }
})

// Activos primero, más recientes arriba. Cap a 10 para no abrumar.
const coffees = computed<Coffee[]>(() => {
  const list = [...(coffeesStore.list as Coffee[])]
  return list
    .sort((a, b) => {
      const tb = (b.createdAt as any)?.toMillis?.() ?? 0
      const ta = (a.createdAt as any)?.toMillis?.() ?? 0
      return tb - ta
    })
    .slice(0, 10)
})

function pick(c: Coffee, e: MouseEvent) {
  setCoffee(c)
  emit('advance', { x: e.clientX, y: e.clientY })
}

const emit = defineEmits<{ advance: [origin: { x: number; y: number }] }>()
</script>

<template>
  <StageFrame stamp="coffee" eyebrow="Empieza por aquí" headline="¿Qué café tienes hoy?">
    <div v-if="coffees.length === 0" class="space-y-3">
      <p class="font-display italic text-paper/70">
        Aún no tienes cafés guardados.
      </p>
      <NuxtLink
        to="/app/coffees/new"
        class="inline-block font-mono text-[11px] uppercase tracking-widest text-honey underline underline-offset-4"
      >
        Agregar uno primero
      </NuxtLink>
    </div>

    <ul v-else class="space-y-1">
      <li v-for="c in coffees" :key="c.id">
        <button
          type="button"
          class="w-full text-left py-4 px-1 border-b border-paper/20 hover:border-honey/70 transition-colors group"
          :class="state.coffee?.id === c.id ? 'border-honey' : ''"
          @click="pick(c, $event)"
        >
          <div class="flex items-baseline justify-between gap-4">
            <div class="min-w-0">
              <p class="font-display italic text-paper text-[20px] truncate">
                {{ c.name }}
              </p>
              <p class="font-mono text-[10px] uppercase tracking-widest text-paper/50 mt-1">
                {{ c.roasterName || 'sin tostador' }}
              </p>
            </div>
            <span
              class="font-mono text-[10px] uppercase tracking-widest text-honey opacity-0 group-hover:opacity-100 transition-opacity"
              :class="state.coffee?.id === c.id ? 'opacity-100' : ''"
            >
              elegir →
            </span>
          </div>
        </button>
      </li>
    </ul>
  </StageFrame>
</template>
