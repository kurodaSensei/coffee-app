<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  eyebrow?: string
  label?: string
  to?: string
  href?: string
  class?: string
}>()

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="!to && !href ? 'button' : undefined"
    :class="
      cn(
        'group flex flex-col justify-between gap-sm rounded-card-sm bg-surface border border-moss/10',
        'p-md text-left h-full min-h-[88px]',
        'transition-colors duration-150 ease-sorbo hover:bg-surface-2 active:bg-surface-2',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss-soft',
        $props.class,
      )
    "
  >
    <UiEyebrow>
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </UiEyebrow>
    <span class="font-display text-[18px] sm:text-[20px] leading-none tracking-tight text-moss">
      <slot>{{ label }}</slot>
    </span>
  </component>
</template>
