<script setup lang="ts">
/**
 * Reemplaza el StageFrame anterior — ahora cada stage define su propia
 * composición (Claude Design dixit: "uno gigante por pantalla").
 * Este header es minimal: solo el indicador de stage en mono pequeño,
 * alineado a la derecha como en el mockup, opacity media.
 *
 * El sello editorial NO va aquí — cada stage lo ubica off-axis donde
 * mejor le sirve a su composición.
 */

defineProps<{
  /** Número del stage (1..6) */
  n: number
  /** Etiqueta uppercase ej. "CAFÉ", "MÉTODO" */
  label: string
  /** Tono del texto. Default heredado del padre (text-paper). */
  tone?: 'paper' | 'moss'
}>()
</script>

<template>
  <header class="flex justify-end items-center px-md pt-xs pb-sm">
    <span
      class="font-mono uppercase tracking-[0.2em]"
      :class="tone === 'moss' ? 'text-moss/40' : 'text-honey/55'"
      style="font-size: 9px;"
    >
      {{ String(n).padStart(2, '0') }} — {{ label }}
    </span>
  </header>
</template>
