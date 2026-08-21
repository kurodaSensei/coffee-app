<script setup lang="ts">
import { ref } from 'vue'
import VertidoBackground from '~/components/vertido/Background.vue'
import VertidoParticles from '~/components/vertido/Particles.vue'
import VertidoStamp from '~/components/vertido/Stamp.vue'
import VertidoTransition from '~/components/vertido/Transition.vue'

/**
 * Sandbox para iterar visualmente los átomos del Vertido sin tocar el
 * flow. No protegida — solo es útil en dev, no es ruta de usuario final.
 *
 * Habilitar: visitar /dev/vertido-atoms en localhost.
 */

definePageMeta({ layout: false })

type Stage = 'coffee' | 'method' | 'recipe' | 'adjust' | 'pour' | 'close'

const stage = ref<Stage>('coffee')
const stages: Stage[] = ['coffee', 'method', 'recipe', 'adjust', 'pour', 'close']

const stampNames = ['coffee', 'method', 'recipe', 'adjust', 'pour', 'cup'] as const

const particlesActive = ref(false)

// Transition demo
const transitioning = ref(false)
const tapPoint = ref<{ x: number; y: number }>({ x: 0, y: 0 })

function triggerTransition(e: MouseEvent) {
  tapPoint.value = { x: e.clientX, y: e.clientY }
  transitioning.value = true
}
function onTransitionDone() {
  transitioning.value = false
  // Avanzar al siguiente stage en el bg para verlo evolucionar
  const i = stages.indexOf(stage.value)
  stage.value = stages[(i + 1) % stages.length]
}
</script>

<template>
  <div class="relative min-h-screen text-paper">
    <!-- Background animado -->
    <VertidoBackground :stage="stage" />

    <!-- Particles overlay -->
    <VertidoParticles :active="particlesActive" />

    <!-- Transition overlay -->
    <VertidoTransition
      :show="transitioning"
      :origin="tapPoint"
      :duration="600"
      @done="onTransitionDone"
    />

    <div class="relative z-10 mx-auto max-w-[1100px] px-6 py-12 space-y-12">
      <header>
        <p class="font-mono text-[10px] tracking-[0.2em] text-honey/70 uppercase">
          dev · sandbox
        </p>
        <h1 class="mt-2 font-display italic text-paper text-[40px] leading-none">
          El Vertido — átomos
        </h1>
        <p class="mt-2 font-display italic text-paper/60 text-sm">
          Iteración de lenguaje visual sin tocar el flow.
        </p>
      </header>

      <!-- ━━━ Stage selector ━━━ -->
      <section class="space-y-3">
        <h2 class="font-mono text-[10px] tracking-[0.2em] text-paper/50 uppercase">
          Stage cromático
        </h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in stages"
            :key="s"
            type="button"
            class="px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest transition-colors"
            :class="stage === s
              ? 'bg-honey text-jungle'
              : 'border border-paper/20 text-paper/70 hover:text-paper hover:border-paper/40'"
            @click="stage = s"
          >
            {{ s }}
          </button>
        </div>
      </section>

      <!-- ━━━ Sellos ━━━ -->
      <section class="space-y-3">
        <h2 class="font-mono text-[10px] tracking-[0.2em] text-paper/50 uppercase">
          Sellos editoriales
        </h2>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div
            v-for="name in stampNames"
            :key="name"
            class="flex flex-col items-center gap-2 p-4 border border-paper/10 rounded-lg"
          >
            <VertidoStamp :name="name" :size="56" class="text-honey" />
            <p class="font-mono text-[10px] uppercase tracking-widest text-paper/60">
              {{ name }}
            </p>
          </div>
        </div>
      </section>

      <!-- ━━━ Particles ━━━ -->
      <section class="space-y-3">
        <h2 class="font-mono text-[10px] tracking-[0.2em] text-paper/50 uppercase">
          Partículas verticales
        </h2>
        <button
          type="button"
          class="px-4 py-2 border border-paper/30 rounded-full font-mono text-[11px] uppercase tracking-widest text-paper/80 hover:text-paper hover:border-paper"
          @click="particlesActive = !particlesActive"
        >
          {{ particlesActive ? 'Pausar' : 'Activar' }} gránulos
        </button>
      </section>

      <!-- ━━━ Transition ━━━ -->
      <section class="space-y-3">
        <h2 class="font-mono text-[10px] tracking-[0.2em] text-paper/50 uppercase">
          Wash radial — clic donde quieras que nazca
        </h2>
        <div
          class="h-48 rounded-2xl border border-paper/15 flex items-center justify-center cursor-pointer hover:border-honey/40 transition-colors"
          @click="triggerTransition"
        >
          <p class="font-display italic text-paper/60">
            Haz clic en cualquier punto
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
