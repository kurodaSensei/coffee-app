<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { cn } from '~/lib/utils'
import type { Friendship } from '~/types'

withDefaults(
  defineProps<{
    /** Visual size. 'sm' fits inside mobile page headers next to the avatar. */
    size?: 'sm' | 'md'
    class?: string
  }>(),
  { size: 'sm' },
)

const friendsStore = useFriendsStore()
const toast = useToast()

onMounted(() => {
  if (friendsStore.list.length === 0) {
    friendsStore.load().catch(() => {})
  }
})

const incoming = computed<Friendship[]>(() => friendsStore.pendingIncoming as Friendship[])
const count = computed(() => incoming.value.length)
const hasAny = computed(() => count.value > 0)

const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const busyId = ref<string | null>(null)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (!open.value) return
  const el = containerRef.value
  if (el && !el.contains(e.target as Node)) close()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

function otherUser(f: Friendship) {
  return friendsStore.getOtherUser(f)
}

function displayNameOf(f: Friendship): string {
  const o = otherUser(f)
  return o?.displayName || o?.email || 'Alguien'
}

function initialOf(f: Friendship): string {
  const name = displayNameOf(f)
  return name.trim().charAt(0).toUpperCase() || '?'
}

async function accept(f: Friendship) {
  if (busyId.value) return
  busyId.value = f.id
  try {
    await friendsStore.accept(f.id)
    toast.success(`Ahora son amigos con ${displayNameOf(f)}`)
  }
  catch (e: any) {
    toast.error(e?.message || 'No se pudo aceptar la solicitud')
  }
  finally {
    busyId.value = null
  }
}

async function reject(f: Friendship) {
  if (busyId.value) return
  busyId.value = f.id
  try {
    await friendsStore.reject(f.id)
    toast.info('Solicitud rechazada')
  }
  catch (e: any) {
    toast.error(e?.message || 'No se pudo rechazar la solicitud')
  }
  finally {
    busyId.value = null
  }
}
</script>

<template>
  <div ref="containerRef" :class="cn('relative inline-flex', $props.class)">
    <button
      type="button"
      :aria-label="hasAny ? `Notificaciones (${count})` : 'Notificaciones'"
      :aria-expanded="open"
      :class="
        cn(
          'relative inline-flex items-center justify-center rounded-pill bg-surface-2 text-moss transition-colors duration-150 ease-sorbo hover:bg-surface focus-visible:outline-2 focus-visible:outline-moss-soft',
          size === 'sm' ? 'size-[32px]' : 'size-[40px]',
        )
      "
      @click="toggle"
    >
      <Icon name="lucide:bell" :class="size === 'sm' ? 'size-4' : 'size-5'" />
      <span
        v-if="hasAny"
        aria-hidden="true"
        class="absolute -top-[2px] -right-[2px] inline-flex min-w-[16px] h-[16px] px-[4px] items-center justify-center rounded-pill bg-terracotta text-paper font-mono text-[10px] font-medium leading-none"
      >
        {{ count > 9 ? '9+' : count }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      role="dialog"
      aria-label="Solicitudes de amistad"
      class="absolute right-0 top-[calc(100%+8px)] z-40 w-[320px] max-w-[calc(100vw-32px)] origin-top-right rounded-card-lg bg-paper border border-moss/10 shadow-[0_12px_32px_rgba(47,53,40,0.12)] p-md"
    >
      <div class="flex items-center justify-between gap-md pb-sm">
        <UiEyebrow>Solicitudes</UiEyebrow>
        <NuxtLink
          to="/app/friends"
          class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft hover:text-moss"
          @click="close"
        >
          Ver todo
        </NuxtLink>
      </div>

      <div v-if="!hasAny" class="py-md text-center">
        <p class="font-display italic text-[14px] text-moss-soft leading-relaxed">
          "Sin solicitudes pendientes."
        </p>
      </div>

      <ul v-else class="flex flex-col gap-sm">
        <li
          v-for="f in incoming"
          :key="f.id"
          class="flex flex-col gap-xs rounded-card-sm bg-surface-2 p-sm"
        >
          <div class="flex items-center gap-sm min-w-0">
            <span
              class="inline-flex size-[32px] shrink-0 items-center justify-center rounded-pill bg-olive text-paper font-sans font-medium text-[12px] leading-none"
              aria-hidden="true"
            >
              {{ initialOf(f) }}
            </span>
            <div class="flex flex-col min-w-0">
              <span class="font-sans text-label text-moss truncate">
                {{ displayNameOf(f) }}
              </span>
              <span class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-soft">
                quiere ser tu amigo
              </span>
            </div>
          </div>

          <div class="flex gap-xs pt-xxs">
            <UiButton
              variant="primary"
              size="sm"
              :block="true"
              :loading="busyId === f.id"
              @click="accept(f)"
            >
              Aceptar
            </UiButton>
            <UiButton
              variant="ghost"
              size="sm"
              :block="true"
              :disabled="busyId === f.id"
              @click="reject(f)"
            >
              Rechazar
            </UiButton>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
