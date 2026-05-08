<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Italic tagline below the wordmark. */
    tagline?: string
    /** Footer line under the dots. */
    footer?: string
  }>(),
  {
    tagline: '"el primer sorbo del día."',
    footer: '— Por KurodaCafe',
  },
)
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-label="Cargando Sorbo"
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-moss text-paper splash"
  >
    <!-- Subtle diagonal texture -->
    <div aria-hidden="true" class="absolute inset-0 splash-texture" />

    <!-- Center stack -->
    <div class="relative flex flex-col items-center px-md">
      <!-- Steam wisps -->
      <div class="relative flex h-[60px] w-[120px] items-end justify-center gap-md pb-xs">
        <svg viewBox="0 0 12 60" width="12" height="60" class="steam-wisp steam-wisp-1" aria-hidden="true">
          <path
            d="M6 58 Q2 46 6 32 Q10 18 6 4"
            stroke="#E5B84B"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>
        <svg viewBox="0 0 12 60" width="12" height="60" class="steam-wisp steam-wisp-2" aria-hidden="true">
          <path
            d="M6 58 Q2 46 6 32 Q10 18 6 4"
            stroke="#E5B84B"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
            opacity="0.85"
          />
        </svg>
        <svg viewBox="0 0 12 60" width="12" height="60" class="steam-wisp steam-wisp-3" aria-hidden="true">
          <path
            d="M6 58 Q2 46 6 32 Q10 18 6 4"
            stroke="#E5B84B"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      <!-- Cup illustration -->
      <svg viewBox="0 0 180 180" width="180" height="180" aria-hidden="true">
        <!-- Saucer shadow -->
        <ellipse cx="90" cy="162" rx="64" ry="6" fill="#5F6652" opacity="0.7" />
        <!-- Cup body -->
        <path
          d="M40 70 L40 148 Q40 158 50 158 L122 158 Q132 158 132 148 L132 70 Z"
          fill="#F4F2EB"
        />
        <!-- Handle -->
        <path
          d="M132 88 Q154 88 154 108 Q154 128 132 128"
          stroke="#F4F2EB"
          stroke-width="9"
          fill="none"
          stroke-linecap="round"
        />
        <!-- Coffee surface -->
        <ellipse cx="86" cy="72" rx="46" ry="5" fill="#556B3A" />
      </svg>

      <!-- Wordmark -->
      <h1 class="mt-xl font-display text-[48px] leading-none text-paper">
        Sorbo<span class="text-honey">.</span>
      </h1>

      <!-- Tagline -->
      <p class="mt-sm font-display italic text-[14px] text-center text-paper/55">
        {{ tagline }}
      </p>
    </div>

    <!-- Bottom dots + author -->
    <div class="absolute inset-x-0 bottom-[56px] flex flex-col items-center gap-md">
      <div class="flex items-center gap-xs" aria-hidden="true">
        <span class="splash-dot splash-dot-1 size-[6px] rounded-[3px] bg-honey" />
        <span class="splash-dot splash-dot-2 size-[6px] rounded-[3px] bg-honey" />
        <span class="splash-dot splash-dot-3 size-[6px] rounded-[3px] bg-honey" />
      </div>
      <p class="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/45">
        {{ footer }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.splash-texture {
  background-image: linear-gradient(
    45deg,
    transparent 0%,
    transparent 1.6%,
    rgba(244, 242, 235, 0.02) 1.6%,
    rgba(244, 242, 235, 0.02) 1.72%
  );
  background-size: 14px 14px;
}

.steam-wisp {
  animation: steam-rise 3.2s ease-in-out infinite;
  transform-origin: bottom center;
}
.steam-wisp-1 { animation-delay: 0s; }
.steam-wisp-2 { animation-delay: 0.35s; }
.steam-wisp-3 { animation-delay: 0.7s; }

@keyframes steam-rise {
  0% { transform: translateY(6px) scaleY(0.95); opacity: 0.3; }
  50% { transform: translateY(0) scaleY(1); opacity: 1; }
  100% { transform: translateY(-6px) scaleY(1.05); opacity: 0.4; }
}

.splash-dot {
  opacity: 0.25;
  animation: dot-pulse 1.4s ease-in-out infinite;
}
.splash-dot-1 { animation-delay: 0s; }
.splash-dot-2 { animation-delay: 0.2s; }
.splash-dot-3 { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.85; }
}

@media (prefers-reduced-motion: reduce) {
  .steam-wisp,
  .splash-dot {
    animation: none;
  }
}
</style>
