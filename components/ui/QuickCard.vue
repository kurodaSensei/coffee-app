<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  eyebrow?: string
  label?: string
  /** Micro-hint bajo el label. Define en ≤1 línea qué hace la acción para
   * usuarios nuevos que no reconocen el vocabulario ("cata", "método", etc). */
  hint?: string
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
    <div class="flex flex-col gap-xxs">
      <span class="font-display text-[18px] sm:text-[20px] leading-none tracking-tight text-moss">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hint" class="font-display italic text-[12px] leading-snug text-moss-soft">{{ hint }}</span>
    </div>
  </NuxtLink>
  <a v-else-if="href" :href="href" :class="cn(baseClass, $props.class)">
    <UiEyebrow>
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </UiEyebrow>
    <div class="flex flex-col gap-xxs">
      <span class="font-display text-[18px] sm:text-[20px] leading-none tracking-tight text-moss">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hint" class="font-display italic text-[12px] leading-snug text-moss-soft">{{ hint }}</span>
    </div>
  </a>
  <button v-else type="button" :class="cn(baseClass, $props.class)">
    <UiEyebrow>
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </UiEyebrow>
    <div class="flex flex-col gap-xxs">
      <span class="font-display text-[18px] sm:text-[20px] leading-none tracking-tight text-moss">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hint" class="font-display italic text-[12px] leading-snug text-moss-soft">{{ hint }}</span>
    </div>
  </button>
</template>
