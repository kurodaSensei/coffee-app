<script setup lang="ts">
import { computed } from 'vue'

/**
 * Sustrato del Vertido — color sólido que evoluciona por stage.
 *
 * Principio "el fondo es el tiempo" del rediseño: la paleta progresa
 * de jungle frío hacia amber cálido y rompe a paper en el cierre.
 * Esto elimina la necesidad de progress dots — la pantalla misma dice
 * dónde estás. Por eso no hay blobs ni decoración: el color hace el
 * trabajo completo.
 *
 * El wash radial de transición (componente Transition) interpola los
 * dos colores al cambiar stage.
 */

type Stage = 'coffee' | 'method' | 'recipe' | 'adjust' | 'pour' | 'close'

const props = defineProps<{ stage: Stage }>()

// Paleta del rediseño de Claude Design (sección 02 — sistema visual).
const STAGE_BG: Record<Stage, string> = {
  coffee: '#141712', // jungle frío — punto de partida
  method: '#191C11', // jungle verdoso
  recipe: '#241B0A', // empieza la temperatura
  adjust: '#2D2008', // amber concentrado
  pour:   '#1E1208', // espresso oscuro — el momento más concentrado
  close:  '#F4F2EB', // paper — la inversión, único stage que rompe lo oscuro
}

const bg = computed(() => STAGE_BG[props.stage])
</script>

<template>
  <div
    class="ritual-bg fixed inset-0 z-0 transition-colors duration-[700ms] ease-sorbo"
    :style="{ backgroundColor: bg }"
    aria-hidden="true"
  />
</template>
