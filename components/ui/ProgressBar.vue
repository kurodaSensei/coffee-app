<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    /** 1-based current step. */
    current: number
    total: number
    class?: string
  }>(),
  { total: 3 },
)
</script>

<template>
  <div
    :class="cn('flex items-center gap-xxs w-full', $props.class)"
    role="progressbar"
    :aria-valuenow="current"
    :aria-valuemin="1"
    :aria-valuemax="total"
  >
    <span
      v-for="i in total"
      :key="i"
      :class="
        cn(
          'flex-1 h-[3px] rounded-pill transition-colors duration-200 ease-sorbo',
          i <= current ? 'bg-olive' : 'bg-moss/10',
        )
      "
    />
  </div>
</template>
