<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  eyebrow?: string
  label?: string
  to?: string
  href?: string
  class?: string
}>()

const baseClass = cn(
  'group flex flex-col justify-between gap-sm rounded-card-sm bg-surface border border-moss/10',
  'p-md text-left h-full min-h-[88px]',
  'transition-colors duration-150 ease-sorbo hover:bg-surface-2 active:bg-surface-2',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss-soft',
)
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="cn(baseClass, $props.class)">
    <UiEyebrow>
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </UiEyebrow>
    <span class="font-display text-[18px] sm:text-[20px] leading-none tracking-tight text-moss">
      <slot>{{ label }}</slot>
    </span>
  </NuxtLink>
  <a v-else-if="href" :href="href" :class="cn(baseClass, $props.class)">
    <UiEyebrow>
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </UiEyebrow>
    <span class="font-display text-[18px] sm:text-[20px] leading-none tracking-tight text-moss">
      <slot>{{ label }}</slot>
    </span>
  </a>
  <button v-else type="button" :class="cn(baseClass, $props.class)">
    <UiEyebrow>
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </UiEyebrow>
    <span class="font-display text-[18px] sm:text-[20px] leading-none tracking-tight text-moss">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>
