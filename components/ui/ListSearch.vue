<script setup lang="ts">
/**
 * Barra de búsqueda estándar para listas del dashboard (cafés, catas,
 * recetas, marcas). Un solo estilo, un solo comportamiento — extraído
 * del roasters/index original a la 3ª repetición (ponytail rule).
 *
 * El filtrado ocurre en el padre — este componente solo dispara
 * update:modelValue con lo que el usuario escribió.
 */
defineProps<{
  modelValue: string
  placeholder?: string
  ariaLabel?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-sm rounded-pill bg-surface-2 px-md py-sm">
    <Icon name="lucide:search" class="size-4 text-moss-ghost shrink-0" aria-hidden="true" />
    <input
      :value="modelValue"
      type="search"
      :placeholder="placeholder ?? 'Buscar…'"
      :aria-label="ariaLabel ?? placeholder ?? 'Buscar'"
      class="flex-1 bg-transparent border-0 p-0 outline-none font-mono text-[12px] uppercase tracking-eyebrow text-moss placeholder:text-moss-ghost"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>
