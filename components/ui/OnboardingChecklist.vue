<script setup lang="ts">
import { computed, onMounted } from 'vue'

const emit = defineEmits<{
  dismiss: []
}>()

const coffeesStore = useCoffeesStore()
const tastingsStore = useTastingsStore()
const recipesStore = useRecipesStore()
const friendsStore = useFriendsStore()

// Lazy-load any store that hasn't been hydrated yet so the checklist reflects truth
// regardless of which page the user came from.
onMounted(() => {
  if (coffeesStore.list.length === 0) coffeesStore.loadAll().catch(() => {})
  if (tastingsStore.list.length === 0) tastingsStore.loadAll().catch(() => {})
  if (recipesStore.list.length === 0) recipesStore.loadAll().catch(() => {})
  if (friendsStore.list.length === 0) friendsStore.load().catch(() => {})
})

interface Step {
  key: 'coffee' | 'tasting' | 'recipe' | 'friend'
  label: string
  hint: string
  to: string
  done: boolean
}

const steps = computed<Step[]>(() => [
  {
    key: 'coffee',
    label: 'Registra tu primer café',
    hint: 'El que tienes ahora en la cafetera.',
    to: '/app/coffees/new',
    done: coffeesStore.list.length > 0,
  },
  {
    key: 'tasting',
    label: 'Haz tu primera cata',
    hint: '¿Cómo te supo? Sin tecnicismos.',
    to: '/app/tastings/new',
    done: tastingsStore.list.length > 0,
  },
  {
    key: 'recipe',
    label: 'Guarda una receta',
    hint: 'La preparación que te quedó perfecta.',
    to: '/app/recipes/new',
    done: recipesStore.list.length > 0,
  },
  {
    key: 'friend',
    label: 'Agrega un amigo cafetero',
    hint: 'Comparte cafés y catas con tu gente.',
    to: '/app/friends',
    done: friendsStore.accepted.length > 0,
  },
])

const completedCount = computed(() => steps.value.filter(s => s.done).length)
const allDone = computed(() => completedCount.value === steps.value.length)
const progressPct = computed(() => Math.round((completedCount.value / steps.value.length) * 100))
</script>

<template>
  <section
    aria-label="Primeros pasos"
    class="rounded-card-lg bg-surface-2 p-md lg:p-lg flex flex-col gap-md"
  >
    <header class="flex items-start justify-between gap-md">
      <div class="flex flex-col gap-xxs min-w-0">
        <UiEyebrow>Primeros pasos · {{ completedCount }}/{{ steps.length }}</UiEyebrow>
        <h2 class="font-display tracking-[-0.01em] leading-[1.05] text-moss text-[24px] sm:text-[28px]">
          <template v-if="allDone">
            Estás <span class="italic text-olive">listo</span>.
          </template>
          <template v-else>
            Empieza por <span class="italic text-olive">aquí</span>.
          </template>
        </h2>
      </div>
      <button
        type="button"
        class="inline-flex size-[32px] shrink-0 items-center justify-center rounded-pill text-moss-soft hover:bg-surface hover:text-moss transition-colors duration-150 ease-sorbo"
        aria-label="Ocultar primeros pasos"
        @click="emit('dismiss')"
      >
        <Icon name="lucide:x" class="size-4" />
      </button>
    </header>

    <!-- Progress bar -->
    <div class="h-[6px] rounded-pill bg-paper overflow-hidden" aria-hidden="true">
      <div
        class="h-full bg-olive transition-all duration-300 ease-sorbo"
        :style="{ width: `${progressPct}%` }"
      />
    </div>

    <!-- Steps -->
    <ul class="flex flex-col gap-xs">
      <li v-for="step in steps" :key="step.key">
        <NuxtLink
          :to="step.to"
          :class="[
            'group flex items-center gap-sm rounded-card-sm p-sm transition-colors duration-150 ease-sorbo',
            step.done
              ? 'bg-transparent hover:bg-paper/60'
              : 'bg-paper hover:bg-paper/80',
          ]"
        >
          <!-- Check indicator -->
          <span
            :class="[
              'inline-flex size-[28px] shrink-0 items-center justify-center rounded-pill transition-colors duration-150 ease-sorbo',
              step.done
                ? 'bg-olive text-paper'
                : 'bg-surface border border-moss/15 text-moss-ghost',
            ]"
            aria-hidden="true"
          >
            <Icon v-if="step.done" name="lucide:check" class="size-4" />
            <span v-else class="font-mono text-[11px] leading-none">{{ steps.indexOf(step) + 1 }}</span>
          </span>

          <div class="flex flex-col min-w-0 flex-1">
            <span
              :class="[
                'font-sans text-label text-moss truncate',
                step.done && 'line-through text-moss-soft',
              ]"
            >
              {{ step.label }}
            </span>
            <span
              v-if="!step.done"
              class="font-display italic text-[13px] text-moss-soft truncate"
            >
              {{ step.hint }}
            </span>
          </div>

          <Icon
            v-if="!step.done"
            name="lucide:arrow-right"
            class="size-4 shrink-0 text-moss-ghost group-hover:text-moss transition-colors"
            aria-hidden="true"
          />
        </NuxtLink>
      </li>
    </ul>

    <!-- Celebratory CTA when all done -->
    <UiButton
      v-if="allDone"
      variant="primary"
      :block="false"
      class="self-start"
      @click="emit('dismiss')"
    >
      ✓ Ocultar
    </UiButton>
  </section>
</template>
