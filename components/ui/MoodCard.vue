<script setup lang="ts">
import { cn } from '~/lib/utils'

withDefaults(
  defineProps<{
    /** Eyebrow text shown above the title (without the leading em-dash). */
    eyebrow?: string
    /** Big serif name (e.g. coffee name). */
    name?: string
    /** Italic subtitle (e.g. "de Libertario."). */
    subtitle?: string
    /** Score number (e.g. 86.5). When omitted the score block is hidden. */
    score?: number | string
    /** Right-side meta line (e.g. "$60K · 250g"). */
    meta?: string
    /** Decorative blob color — uses honey by default. */
    blobTone?: 'honey' | 'olive-light' | 'surface-2' | 'none'
    /** Render as <a> when href is provided. */
    href?: string
    class?: string
  }>(),
  {
    blobTone: 'honey',
  },
)

const blobToneClass: Record<'honey' | 'olive-light' | 'surface-2' | 'none', string> = {
  honey: 'bg-honey/70',
  'olive-light': 'bg-olive-light/60',
  'surface-2': 'bg-surface-2',
  none: 'hidden',
}
</script>

<template>
  <component
    :is="href ? 'a' : 'article'"
    :href="href"
    :class="
      cn(
        'relative block overflow-hidden rounded-card-lg bg-surface text-moss',
        'transition-transform duration-200 ease-sorbo',
        href && 'hover:-translate-y-0.5 active:translate-y-0',
        $props.class,
      )
    "
  >
    <span
      aria-hidden="true"
      :class="cn('pointer-events-none absolute -right-12 -top-12 h-[160px] w-[160px] rounded-full', blobToneClass[blobTone])"
    />

    <div class="relative flex flex-col gap-sm p-md">
      <UiEyebrow v-if="eyebrow || $slots.eyebrow">
        <slot name="eyebrow">{{ eyebrow }}</slot>
      </UiEyebrow>

      <h3 v-if="name || $slots.name" class="display-l text-moss">
        <slot name="name">{{ name }}</slot>
      </h3>

      <p v-if="subtitle || $slots.subtitle" class="subtitle-italic">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>

      <div v-if="$slots.notes" class="flex flex-wrap gap-xxs pt-xxs">
        <slot name="notes" />
      </div>

      <div
        v-if="score !== undefined || meta || $slots.footer"
        class="mt-xs flex items-end justify-between gap-md"
      >
        <div v-if="score !== undefined" class="flex flex-col gap-xxs">
          <UiEyebrow>Score</UiEyebrow>
          <span class="font-display text-[32px] leading-none text-moss">{{ score }}</span>
        </div>

        <slot name="footer">
          <span v-if="meta" class="mono-data text-moss-soft">{{ meta }}</span>
        </slot>
      </div>
    </div>
  </component>
</template>
