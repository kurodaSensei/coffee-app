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
    rating: props.initialData?.rating ?? 3,
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
  <form @submit.prevent="onSubmit" class="max-w-2xl mx-auto space-y-8">
    <!-- Info basica -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:store" class="w-5 h-5 text-muted-foreground" />
          {{ initialData?.id ? 'Editar tostador' : 'Nuevo tostador' }}
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Ingresa la informacion del tostador de cafe.</p>
      </div>

      <div class="space-y-1.5">
        <Label for="roaster-name">Nombre *</Label>
        <Input id="roaster-name" v-model="name" placeholder="Nombre del tostador" />
        <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="roaster-country">Pais *</Label>
          <Input id="roaster-country" v-model="country" placeholder="Pais" />
          <p v-if="errors.country" class="text-xs text-destructive">{{ errors.country }}</p>
        </div>
        <div class="space-y-1.5">
          <Label for="roaster-city">Ciudad</Label>
          <Input id="roaster-city" v-model="city" placeholder="Ciudad" />
        </div>
      </div>
    </section>

    <Separator />

    <!-- Contacto -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:globe" class="w-5 h-5 text-muted-foreground" />
          Contacto
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Sitio web y redes sociales</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="roaster-website">Sitio web</Label>
          <Input id="roaster-website" v-model="website" placeholder="https://ejemplo.com" />
          <p v-if="errors.website" class="text-xs text-destructive">{{ errors.website }}</p>
        </div>
        <div class="space-y-1.5">
          <Label for="roaster-instagram">Instagram</Label>
          <Input id="roaster-instagram" v-model="instagram" placeholder="@usuario" />
          <p v-if="errors.instagram" class="text-xs text-destructive">{{ errors.instagram }}</p>
        </div>
      </div>
    </section>

    <Separator />

    <!-- Notas y calificacion -->
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <Icon name="lucide:star" class="w-5 h-5 text-muted-foreground" />
          Notas y calificacion
        </h3>
        <p class="text-sm text-muted-foreground mt-0.5">Tu experiencia con este tostador</p>
      </div>

      <div class="space-y-1.5">
        <Label for="roaster-notes">Notas</Label>
        <Textarea id="roaster-notes" v-model="notes" placeholder="Notas sobre el tostador..." :rows="3" />
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Label>Calificacion</Label>
          <span class="text-2xl font-bold tabular-nums">{{ rating }}<span class="text-base font-normal text-muted-foreground">/5</span></span>
        </div>
        <Slider
          :model-value="[rating ?? 3]"
          :max="5"
          :min="1"
          :step="1"
          @update:model-value="(v: number[]) => rating = v[0]"
        />
        <p v-if="errors.rating" class="text-xs text-destructive">{{ errors.rating }}</p>
      </div>
    </section>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <Button variant="ghost" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit" :disabled="loading">
        <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        {{ initialData?.id ? 'Guardar cambios' : 'Crear tostador' }}
      </Button>
    </div>
  </form>
</template>
