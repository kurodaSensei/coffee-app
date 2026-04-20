<script setup lang="ts">
interface Option { value: string; label: string; count?: number }
defineProps<{ modelValue: string; options: Option[] }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex gap-1 p-1 bg-secondary rounded-pill w-fit">
    <button
      v-for="opt in options"
      :key="opt.value"
      :class="[
        'px-4 py-1.5 rounded-pill text-ui transition-all duration-fast',
        modelValue === opt.value
          ? 'bg-background text-foreground shadow-soft'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
      <span v-if="opt.count !== undefined" class="ml-1.5 font-mono text-[10px] opacity-50">{{ opt.count }}</span>
    </button>
  </div>
</template>
