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
    :class="cn('flex items-center gap-xs w-full', $props.class)"
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
          'h-[5px] rounded-pill transition-all duration-300 ease-sorbo',
          i === current
            ? 'flex-[2] bg-olive'
            : i < current
              ? 'flex-1 bg-olive'
              : 'flex-1 bg-moss/20',
        )
      "
    />
  </div>
</template>
