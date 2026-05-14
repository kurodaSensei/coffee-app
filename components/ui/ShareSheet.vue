<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  /** Nombre del item (para mostrar en el subtítulo). */
  entityName?: string
  /** Texto del subtítulo, por defecto se construye con entityName. */
  subtitle?: string
  /** UIDs con los que ya está compartido el item. */
  initialSharedWith?: string[]
  /** Función async que persiste el nuevo array de UIDs. */
  onSave: (uids: string[]) => Promise<void>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [uids: string[]]
}>()

const friendsStore = useFriendsStore()

onMounted(() => {
  if (friendsStore.list.length === 0) friendsStore.load().catch(() => {})
})

const selectedUids = ref<string[]>([])

watch(
  () => props.modelValue,
  (open) => {
    if (open) selectedUids.value = [...(props.initialSharedWith ?? [])]
  },
  { immediate: true },
)

interface FriendEntry { uid: string; label: string }

const friends = computed<FriendEntry[]>(() => {
  return friendsStore.accepted
    .map((f) => {
      const other = friendsStore.getOtherUser(f)
      if (!other) return null
      return { uid: other.uid, label: other.displayName || other.email }
    })
    .filter((x): x is FriendEntry => x !== null)
})

const computedSubtitle = computed(() => {
  if (props.subtitle) return props.subtitle
  if (props.entityName) return `"${props.entityName}" será visible para quienes elijas.`
  return 'Elige con quién compartir.'
})

function toggle(uid: string) {
  const idx = selectedUids.value.indexOf(uid)
  if (idx === -1) selectedUids.value.push(uid)
  else selectedUids.value.splice(idx, 1)
}

const saving = ref(false)

async function save() {
  if (saving.value) return
  saving.value = true
  try {
    await props.onSave(selectedUids.value.slice())
    emit('saved', selectedUids.value.slice())
    emit('update:modelValue', false)
  }
  catch {
    // toast surfaced by caller
  }
  finally {
    saving.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}

const hasChanges = computed(() => {
  const initial = [...(props.initialSharedWith ?? [])].sort().join(',')
  const next = [...selectedUids.value].sort().join(',')
  return initial !== next
})
</script>

<template>
  <UiBottomSheet
    :model-value="modelValue"
    title="Compartir"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-lg pt-xs">
      <p class="subtitle-italic">
        {{ computedSubtitle }}
      </p>

      <div v-if="friends.length === 0" class="rounded-card bg-surface px-md py-lg text-center">
        <p class="font-display italic text-[15px] text-moss-soft leading-relaxed">
          Aún no tienes amigos en Sorbo.
        </p>
        <UiButton
          variant="dark"
          :block="false"
          to="/app/friends"
          class="mt-md"
          @click="close"
        >
          Agregar amigos
        </UiButton>
      </div>

      <div v-else class="flex flex-col gap-xs">
        <UiEyebrow>Amigos · {{ friends.length }}</UiEyebrow>
        <div class="flex flex-wrap gap-xxs">
          <UiChip
            v-for="f in friends"
            :key="f.uid"
            interactive
            :variant="selectedUids.includes(f.uid) ? 'active' : 'default'"
            @click="toggle(f.uid)"
          >
            {{ f.label }}
          </UiChip>
        </div>
      </div>

      <UiButton
        v-if="friends.length > 0"
        variant="dark"
        :loading="saving"
        :disabled="!hasChanges"
        @click="save"
      >
        {{ selectedUids.length === 0 ? 'Dejar de compartir' : `Compartir con ${selectedUids.length}` }}
      </UiButton>
    </div>
  </UiBottomSheet>
</template>
