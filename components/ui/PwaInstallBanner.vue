<script setup lang="ts">
const { canShowBanner, install, dismiss, isIOS, hasNativePrompt } = usePwaInstall()

const ctaLabel = computed(() => {
  if (hasNativePrompt.value) return 'Instalar app'
  if (isIOS.value) return 'Cómo instalar'
  return 'Cómo instalar'
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-sorbo"
    leave-active-class="transition-all duration-200 ease-sorbo"
    enter-from-class="opacity-0 -translate-y-2"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="canShowBanner"
      class="relative rounded-card-lg bg-jungle text-paper overflow-hidden"
    >
      <!-- Mobile: versión compacta (~64px) — 1 línea + CTA + X.
           Desktop: versión completa con eyebrow + título + subtitle. -->

      <!-- Compact (mobile) -->
      <div class="sm:hidden flex items-center gap-sm px-md py-sm">
        <Icon name="lucide:download" class="size-4 text-honey shrink-0" aria-hidden="true" />
        <p class="flex-1 min-w-0 font-sans text-[13px] text-paper truncate">
          Instala Sorbo como app
        </p>
        <button
          type="button"
          class="shrink-0 font-mono text-[10px] uppercase tracking-eyebrow text-honey hover:opacity-80 transition-opacity px-xs"
          @click="install"
        >
          {{ ctaLabel }}
        </button>
        <button
          type="button"
          class="shrink-0 inline-flex items-center justify-center size-[28px] rounded-pill text-paper/60 hover:text-paper transition-colors"
          aria-label="Descartar"
          @click="dismiss"
        >
          <Icon name="lucide:x" class="size-3.5" />
        </button>
      </div>

      <!-- Full (desktop) -->
      <div class="hidden sm:block p-lg">
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -right-12 -top-12 size-[160px] rounded-pill bg-honey opacity-30"
        />

        <div class="relative flex items-start gap-md">
          <div class="flex-1 min-w-0">
            <UiEyebrow class="text-paper/60">Sorbo</UiEyebrow>
            <p class="mt-xs font-display text-[28px] leading-tight">
              Tenlo a un toque desde tu inicio.
            </p>
            <p class="mt-xs font-display italic text-[13px] text-paper/70 leading-relaxed">
              Funciona offline y se abre sin la barra del navegador.
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 inline-flex items-center justify-center size-[32px] rounded-pill text-paper/70 hover:text-paper hover:bg-paper/10 transition-colors"
            aria-label="Descartar"
            @click="dismiss"
          >
            <Icon name="lucide:x" class="size-4" />
          </button>
        </div>

        <div class="relative mt-md flex items-center gap-sm">
          <UiButton
            variant="primary"
            size="sm"
            :block="false"
            @click="install"
          >
            {{ ctaLabel }}
          </UiButton>
          <button
            type="button"
            class="font-mono text-[10px] uppercase tracking-eyebrow text-paper/60 hover:text-paper transition-colors px-sm"
            @click="dismiss"
          >
            No, gracias
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
