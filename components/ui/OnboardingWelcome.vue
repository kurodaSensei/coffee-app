<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
  userName?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'finish': []
}>()

interface Slide {
  eyebrow: string
  title: string
  italicWord: string
  body: string
}

const slides: Slide[] = [
  {
    eyebrow: 'Hola',
    title: 'Tu diario de',
    italicWord: 'café',
    body: 'Sorbo es la memoria de cada taza que vale la pena recordar. Cataloga, prueba, comparte.',
  },
  {
    eyebrow: 'Paso 1 · Cafés',
    title: 'Registra cada',
    italicWord: 'descubrimiento',
    body: 'Anota el tostador, el origen, el método. Construye tu colección, taza por taza.',
  },
  {
    eyebrow: 'Paso 2 · Catas',
    title: 'Anota cómo te',
    italicWord: 'supo',
    body: 'Notas de cata sin tecnicismos. Frutal, dulce, brutal — como lo digas tú.',
  },
  {
    eyebrow: 'Paso 3 · Amigos',
    title: 'Comparte con tu',
    italicWord: 'tribu',
    body: 'Invita a otros cafeteros y comparte directamente lo que estás tomando. Tu gente, sin intermediarios.',
  },
  {
    eyebrow: 'Paso 4 · Comunidad',
    title: 'Descubre lo que otros',
    italicWord: 'toman',
    body: 'En Explora encuentras cafés, catas y recetas que la comunidad comparte. Para inspirarte, no para seguirte.',
  },
]

const index = ref(0)
const isLast = computed(() => index.value === slides.length - 1)
const currentSlide = computed(() => slides[index.value])

function next() {
  if (isLast.value) finish()
  else index.value++
}

function back() {
  if (index.value > 0) index.value--
}

function finish() {
  emit('finish')
  emit('update:modelValue', false)
  // Reset for next mount in case the user logs out and back in
  setTimeout(() => { index.value = 0 }, 300)
}
</script>

<template>
  <UiBottomSheet :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <div class="flex flex-col gap-md min-h-[60svh] lg:min-h-0">
      <UiEyebrow>{{ currentSlide.eyebrow }}</UiEyebrow>

      <h2 class="font-display tracking-[-0.02em] leading-[1.02] text-moss text-[40px] sm:text-[48px]">
        <template v-if="index === 0 && userName">
          Hola <span class="italic text-olive">{{ userName }}</span>.<br>
        </template>
        {{ currentSlide.title }}
        <span class="italic text-olive">{{ currentSlide.italicWord }}</span>.
      </h2>

      <p class="font-display italic text-[18px] leading-relaxed text-moss-soft">
        "{{ currentSlide.body }}"
      </p>

      <!-- Progress dots -->
      <div class="flex items-center gap-xs pt-md" role="tablist" aria-label="Progreso del recorrido">
        <span
          v-for="(s, i) in slides"
          :key="i"
          aria-hidden="true"
          :class="[
            'h-[6px] rounded-pill transition-all duration-200 ease-sorbo',
            i === index ? 'w-[24px] bg-olive' : 'w-[6px] bg-moss/15',
          ]"
        />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-xs pt-md mt-auto">
        <UiButton
          v-if="index > 0"
          variant="ghost"
          :block="false"
          @click="back"
        >
          Atrás
        </UiButton>
        <div class="flex-1" />
        <UiButton
          variant="ghost"
          :block="false"
          @click="finish"
        >
          <span class="text-moss-soft">Saltar</span>
        </UiButton>
        <UiButton
          variant="primary"
          :block="false"
          @click="next"
        >
          {{ isLast ? 'Empezar →' : 'Siguiente →' }}
        </UiButton>
      </div>
    </div>
  </UiBottomSheet>
</template>
