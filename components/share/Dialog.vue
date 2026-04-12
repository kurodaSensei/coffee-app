<script setup lang="ts">
const props = defineProps<{
  open: boolean
  collection: 'coffees' | 'tastings' | 'recipes'
  itemId: string
  itemName: string
  currentShared?: string[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'shared': []
}>()

const friendsStore = useFriendsStore()
const { updateSharing } = useFirebase()
const selectedUids = ref<string[]>([])
const saving = ref(false)

watch(() => props.open, (open) => {
  if (open) {
    selectedUids.value = [...(props.currentShared || [])]
    friendsStore.load()
  }
})

function toggle(uid: string) {
  if (selectedUids.value.includes(uid)) {
    selectedUids.value = selectedUids.value.filter(u => u !== uid)
  } else {
    selectedUids.value = [...selectedUids.value, uid]
  }
}

async function save() {
  saving.value = true
  try {
    await updateSharing(props.collection, props.itemId, selectedUids.value)
    emit('shared')
    emit('update:open', false)
  } finally {
    saving.value = false
  }
}

function initial(name?: string, email?: string) {
  return name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || '?'
}
</script>

<template>
  <Dialog :open="open" @update:open="(v: boolean) => emit('update:open', v)">
    <DialogScrollContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Compartir con amigos</DialogTitle>
        <DialogDescription>
          Selecciona amigos para compartir "{{ itemName }}". Podrán verlo pero no editarlo.
        </DialogDescription>
      </DialogHeader>

      <div v-if="friendsStore.accepted.length === 0" class="py-6 text-center">
        <Icon name="lucide:users" class="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p class="text-sm text-muted-foreground">Aún no tienes amigos.</p>
        <NuxtLink to="/friends" class="text-sm text-primary hover:underline">
          Agregar amigos
        </NuxtLink>
      </div>

      <div v-else class="space-y-1 max-h-80 overflow-y-auto">
        <label
          v-for="f in friendsStore.accepted"
          :key="f.id"
          class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent cursor-pointer transition-colors"
        >
          <Checkbox
            :checked="selectedUids.includes(friendsStore.getOtherUser(f)?.uid || '')"
            @update:checked="() => toggle(friendsStore.getOtherUser(f)?.uid || '')"
          />
          <Avatar class="h-8 w-8">
            <AvatarFallback class="bg-muted text-xs">
              {{ initial(friendsStore.getOtherUser(f)?.displayName, friendsStore.getOtherUser(f)?.email) }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ friendsStore.getOtherUser(f)?.displayName || friendsStore.getOtherUser(f)?.email }}
            </p>
            <p class="text-xs text-muted-foreground truncate">{{ friendsStore.getOtherUser(f)?.email }}</p>
          </div>
        </label>
      </div>

      <DialogFooter>
        <Button variant="ghost" @click="emit('update:open', false)">Cancelar</Button>
        <Button :disabled="saving || friendsStore.accepted.length === 0" @click="save">
          <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          Guardar ({{ selectedUids.length }})
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
