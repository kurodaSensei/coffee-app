<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  /** Café que se está compartiendo (sólo para mostrar nombre + estado inicial). */
  coffeeId: string
  coffeeName?: string
  initialSharedWith?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [uids: string[]]
}>()

const friendsStore = useFriendsStore()
const coffeesStore = useCoffeesStore()

onMounted(() => {
  if (friendsStore.list.length === 0) friendsStore.load().catch(() => {})
})

const selectedUids = ref<string[]>([])

// Sincroniza la selección al abrir el sheet con el estado actual del café.
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selectedUids.value = [...(props.initialSharedWith ?? [])]
    }
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

function toggle(uid: string) {
  const idx = selectedUids.value.indexOf(uid)
  if (idx === -1) selectedUids.value.push(uid)
  else selectedUids.value.splice(idx, 1)
}

const saving = ref(false)

async function onSave() {
  if (saving.value) return
  saving.value = true
  try {
    await coffeesStore.updateSharing(props.coffeeId, selectedUids.value.slice())
    emit('saved', selectedUids.value.slice())
    emit('update:modelValue', false)
  }
  catch {
    // toast surfaced by store
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
    title="Compartir café"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-lg pt-xs">
      <p v-if="coffeeName" class="subtitle-italic">
        "{{ coffeeName }}" será visible para quienes elijas.
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
        @click="onSave"
      >
        {{ selectedUids.length === 0 ? 'Dejar de compartir' : `Compartir con ${selectedUids.length}` }}
      </UiButton>
    </div>
  </UiBottomSheet>
</template>
