<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Footer line under the dots. */
    footer?: string
  }>(),
  {
    footer: '— Por KurodaCafe',
  },
)

// Editorial messages — pick one stable per mount (setup-time, hydration-safe).
const messages = [
  ['Cada taza guarda un ', 'recuerdo', '. Preparando el tuyo…'],
  ['El mejor café es el que se ', 'recuerda', '. Un momento…'],
  ['Tu diario de ', 'sorbos', ' está despertando…'],
  ['Calentando el agua, ', 'moliendo', ' los recuerdos…'],
  ['De la finca a tu ', 'memoria', '. Casi listo…'],
] as const

const picked = messages[Math.floor(Math.random() * messages.length)]
const messageBefore = picked[0]
const messageAccent = picked[1]
const messageAfter = picked[2]
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-label="Cargando Sorbo"
    class="splash fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-moss text-paper"
  >
    <!-- Diagonal texture overlay -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 splash-texture" />

    <!-- Radial honey/olive glow -->
    <div aria-hidden="true" class="pointer-events-none absolute splash-glow" />

    <!-- Center stack -->
    <div class="relative z-[2] flex flex-col items-center px-md text-center">
      <!-- Steam wisps (drawing animation) -->
      <svg
        class="splash-steam mb-[6px]"
        width="90"
        height="48"
        viewBox="0 0 90 48"
        aria-hidden="true"
      >
        <path d="M28 44 C28 32, 36 32, 36 22 C36 12, 31 9, 31 3" />
        <path d="M46 46 C46 33, 54 33, 54 21 C54 9, 49 6, 49 1" />
        <path d="M64 44 C64 32, 72 32, 72 22 C72 12, 67 9, 67 3" />
      </svg>

      <!-- Mark badge -->
      <div class="splash-mark flex size-[96px] items-center justify-center rounded-[24px] bg-olive">
        <span class="font-display text-[66px] leading-none text-paper">
          S<span class="text-honey">.</span>
        </span>
      </div>

      <!-- Wordmark -->
      <h1 class="splash-wordmark mt-[32px] font-display text-[56px] leading-none text-paper">
        Sorbo<span class="text-honey">.</span>
      </h1>

      <!-- Byline -->
      <p class="splash-byline mt-md font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
        {{ footer }}
      </p>

      <!-- Editorial message -->
      <p class="splash-message mt-[36px] max-w-[260px] font-display italic text-[17px] leading-snug text-paper/70">
        "{{ messageBefore }}<span class="text-honey not-italic-fix">{{ messageAccent }}</span>{{ messageAfter }}"
      </p>
    </div>

    <!-- Bottom loader -->
    <div class="splash-footer absolute inset-x-0 bottom-[56px] z-[2] flex flex-col items-center">
      <div class="flex items-center gap-[7px]" aria-hidden="true">
        <span class="splash-dot splash-dot-1 size-[7px] rounded-full bg-honey" />
        <span class="splash-dot splash-dot-2 size-[7px] rounded-full bg-honey" />
        <span class="splash-dot splash-dot-3 size-[7px] rounded-full bg-honey" />
      </div>
      <p class="mt-[18px] font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40">
        Cargando tu diario
      </p>
    </div>
  </div>
</template>

<style scoped>
.splash-texture {
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0,
    transparent 16px,
    rgba(244, 242, 235, 0.015) 16px,
    rgba(244, 242, 235, 0.015) 17px
  );
}

.splash-glow {
  top: 38%;
  left: 50%;
  width: 420px;
  height: 420px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(85, 107, 58, 0.5) 0%, transparent 62%);
}

/* Keep the honey accent italic-aligned with the surrounding serif italic */
.not-italic-fix {
  font-style: italic;
}

/* ---------- Steam (drawing) ---------- */
.splash-steam {
  opacity: 0;
  animation: splash-steam-in 1s ease 0.3s forwards;
}
.splash-steam path {
  stroke: var(--honey);
  stroke-width: 3;
  stroke-linecap: round;
  fill: none;
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: splash-steam-draw 2.4s ease-in-out infinite;
}
.splash-steam path:nth-child(1) { animation-delay: 0s; opacity: 0.55; }
.splash-steam path:nth-child(2) { animation-delay: 0.3s; opacity: 0.85; }
.splash-steam path:nth-child(3) { animation-delay: 0.6s; opacity: 0.55; }
@keyframes splash-steam-draw {
  0% { stroke-dashoffset: 60; opacity: 0; }
  40% { opacity: 0.8; }
  70% { stroke-dashoffset: 0; opacity: 0.5; }
  100% { stroke-dashoffset: -20; opacity: 0; }
}
@keyframes splash-steam-in {
  to { opacity: 1; }
}

/* ---------- Entrance choreography ---------- */
.splash-mark {
  opacity: 0;
  transform: scale(0.7) translateY(16px);
  box-shadow: 0 16px 40px rgba(85, 107, 58, 0.4);
  animation: splash-mark-in 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.3) 0.15s forwards;
}
@keyframes splash-mark-in {
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.splash-wordmark,
.splash-byline,
.splash-message,
.splash-footer {
  opacity: 0;
  transform: translateY(14px);
}
.splash-wordmark { animation: splash-rise 0.8s ease 0.45s forwards; }
.splash-byline   { animation: splash-rise 0.8s ease 0.6s forwards; }
.splash-message  { animation: splash-rise 1s ease 0.8s forwards; }
.splash-footer   { animation: splash-rise 0.8s ease 1s forwards; }
@keyframes splash-rise {
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- Dots ---------- */
.splash-dot {
  opacity: 0.3;
  animation: splash-dot 1.3s ease-in-out infinite;
}
.splash-dot-2 { animation-delay: 0.18s; }
.splash-dot-3 { animation-delay: 0.36s; }
@keyframes splash-dot {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  45% { opacity: 1; transform: translateY(-3px); }
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .splash-steam,
  .splash-mark,
  .splash-wordmark,
  .splash-byline,
  .splash-message,
  .splash-footer,
  .splash-dot,
  .splash-steam path {
    animation: none;
    opacity: 1;
    transform: none;
    stroke-dashoffset: 0;
  }
}
</style>
