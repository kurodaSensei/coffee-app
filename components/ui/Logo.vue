<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

type Variant = 'mark' | 'wordmark' | 'lockup'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Tone applied to the wordmark / mark surface. */
    tone?: 'jungle' | 'paper' | 'olive'
    class?: string
  }>(),
  {
    variant: 'mark',
    size: 'md',
    tone: 'jungle',
  },
)

const markSizeClass: Record<Size, string> = {
  sm: 'size-[36px] rounded-card-sm text-[20px]',
  md: 'size-[48px] rounded-cta text-[26px]',
  lg: 'size-[64px] rounded-card-lg text-[34px]',
}

const wordmarkSizeClass: Record<Size, string> = {
  sm: 'text-[28px]',
  md: 'text-[40px]',
  lg: 'text-[56px]',
}

const markToneClass: Record<'jungle' | 'paper' | 'olive', string> = {
  jungle: 'bg-jungle text-paper',
  paper: 'bg-paper text-jungle border border-moss/10',
  olive: 'bg-olive text-paper',
}

const wordmarkColor = computed(() => {
  if (props.tone === 'paper') return 'text-paper'
  if (props.tone === 'olive') return 'text-olive'
  return 'text-moss'
})
</script>

<template>
  <div :class="cn('inline-flex items-center gap-sm', $props.class)" aria-label="Sorbo">
    <!-- Mark -->
    <div
      v-if="variant === 'mark' || variant === 'lockup'"
      :class="
        cn(
          'inline-flex items-center justify-center font-display leading-none',
          markSizeClass[size],
          markToneClass[tone],
        )
      "
      aria-hidden="true"
    >
      <span>S</span><span class="text-honey">.</span>
    </div>

    <!-- Wordmark -->
    <div
      v-if="variant === 'wordmark' || variant === 'lockup'"
      :class="cn('flex flex-col leading-none', variant === 'lockup' && 'gap-xxs')"
    >
      <span :class="cn('font-display leading-none', wordmarkSizeClass[size], wordmarkColor)">
        Sorbo<span class="text-honey">.</span>
      </span>
      <span
        v-if="variant === 'lockup'"
        class="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-moss-soft"
      >
        — by KurodaCafe
      </span>
    </div>
  </div>
</template>
