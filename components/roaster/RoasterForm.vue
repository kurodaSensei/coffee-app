<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { roasterSchema } from '~/utils/validators'
import type { Roaster } from '~/types'

interface Props {
  initialData?: Partial<Roaster>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  cancel: []
}>()

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(roasterSchema),
  initialValues: {
    name: props.initialData?.name ?? '',
    country: props.initialData?.country ?? 'Colombia',
    city: props.initialData?.city ?? '',
    website: props.initialData?.website ?? '',
    instagram: props.initialData?.instagram ?? '',
    notes: props.initialData?.notes ?? '',
    rating: props.initialData?.rating ?? undefined,
  },
})

const [name] = defineField('name')
const [country] = defineField('country')
const [city] = defineField('city')
const [website] = defineField('website')
const [instagram] = defineField('instagram')
const [notes] = defineField('notes')
const [rating] = defineField('rating')

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <UiInput
      v-model="name"
      label="Nombre *"
      placeholder="Nombre del tostador"
      :error="errors.name"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UiInput
        v-model="country"
        label="País *"
        placeholder="País"
        :error="errors.country"
      />

      <UiInput
        v-model="city"
        label="Ciudad"
        placeholder="Ciudad"
        :error="errors.city"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UiInput
        v-model="website"
        label="Sitio web"
        placeholder="https://ejemplo.com"
        :error="errors.website"
      />

      <UiInput
        v-model="instagram"
        label="Instagram"
        placeholder="@usuario"
        :error="errors.instagram"
      />
    </div>

    <UiTextarea
      v-model="notes"
      label="Notas"
      placeholder="Notas sobre el tostador..."
      :rows="3"
      :error="errors.notes"
    />

    <div>
      <label class="label">Calificación</label>
      <UiRating v-model="rating" />
      <p v-if="errors.rating" class="mt-1 text-sm text-red-600">
        {{ errors.rating }}
      </p>
    </div>

    <div class="flex items-center justify-end gap-3 pt-4">
      <UiButton type="button" variant="ghost" @click="emit('cancel')">
        Cancelar
      </UiButton>
      <UiButton type="submit" :loading="loading">
        {{ initialData?.id ? 'Guardar cambios' : 'Crear tostador' }}
      </UiButton>
    </div>
  </form>
</template>
