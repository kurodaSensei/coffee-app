<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const { currentRequest, resolveCurrent } = useConfirm()
const { medium, heavy } = useHaptic()

// Estado local del sheet; se sincroniza con currentRequest.
const open = ref(false)

watch(currentRequest, (req) => {
  open.value = !!req
})

const options = computed(() => currentRequest.value?.options ?? null)

const confirmLabel = computed(() => options.value?.confirmLabel || 'Confirmar')
const cancelLabel = computed(() => options.value?.cancelLabel || 'Cancelar')
const destructive = computed(() => !!options.value?.destructive)

function onConfirm() {
  // Heavy si es destructive (eliminar), medium si es confirmación normal
  destructive.value ? heavy() : medium()
  resolveCurrent(true)
}

function onCancel() {
  resolveCurrent(false)
}

// Si el usuario cierra el sheet sin tocar los botones (X, click fuera, Esc),
// resolver como cancelado.
function onOpenChange(v: boolean) {
  if (!v && currentRequest.value) {
    resolveCurrent(false)
  }
  open.value = v
}
</script>

<template>
  <UiBottomSheet
    :model-value="open"
    :title="options?.title || ''"
    layer="overlay"
    @update:model-value="onOpenChange"
  >
    <div class="flex flex-col gap-lg pt-xs">
      <p
        v-if="options?.message"
        class="font-display italic text-[15px] leading-relaxed text-moss-soft"
      >
        {{ options.message }}
      </p>

      <div class="flex flex-col gap-xs">
        <UiButton
          :variant="destructive ? 'dark' : 'primary'"
          :class="destructive ? '!bg-terracotta hover:!bg-terracotta/90' : ''"
          @click="onConfirm"
        >
          {{ confirmLabel }}
        </UiButton>
        <UiButton variant="ghost" @click="onCancel">
          {{ cancelLabel }}
        </UiButton>
      </div>
    </div>
  </UiBottomSheet>
</template>
