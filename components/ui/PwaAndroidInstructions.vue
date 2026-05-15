<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <UiBottomSheet
    :model-value="modelValue"
    title="Instala Sorbo en Android"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-lg pt-xs">
      <p class="subtitle-italic">
        Tu navegador no ofreció instalación con un toque, pero igual puedes hacerlo a mano:
      </p>

      <ol class="flex flex-col gap-md">
        <li class="flex items-start gap-md">
          <span
            aria-hidden="true"
            class="shrink-0 inline-flex items-center justify-center size-[28px] rounded-pill bg-surface-2 font-mono text-[12px] text-moss"
          >
            1
          </span>
          <p class="font-sans text-[14px] text-moss leading-relaxed">
            Toca
            <Icon name="lucide:more-vertical" class="size-4 inline -mt-[2px] mx-xxs" aria-hidden="true" />
            <strong class="font-medium">menú</strong> (tres puntos arriba a la derecha).
          </p>
        </li>
        <li class="flex items-start gap-md">
          <span
            aria-hidden="true"
            class="shrink-0 inline-flex items-center justify-center size-[28px] rounded-pill bg-surface-2 font-mono text-[12px] text-moss"
          >
            2
          </span>
          <p class="font-sans text-[14px] text-moss leading-relaxed">
            Elige <strong class="font-medium">Instalar app</strong> o <strong class="font-medium">Añadir a pantalla de inicio</strong>.
          </p>
        </li>
        <li class="flex items-start gap-md">
          <span
            aria-hidden="true"
            class="shrink-0 inline-flex items-center justify-center size-[28px] rounded-pill bg-surface-2 font-mono text-[12px] text-moss"
          >
            3
          </span>
          <p class="font-sans text-[14px] text-moss leading-relaxed">
            Confirma con <strong class="font-medium">Instalar</strong>.
          </p>
        </li>
      </ol>

      <p class="font-display italic text-[13px] text-moss-soft leading-relaxed">
        Si no ves la opción, tu navegador podría no soportar PWAs. Chrome, Edge y Brave funcionan.
      </p>
    </div>
  </UiBottomSheet>
</template>
