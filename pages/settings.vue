<script setup lang="ts">
import { computed, onMounted } from 'vue'

const router = useRouter()
const { currentUser, logout } = useAuth()
const coffeesStore = useCoffeesStore()
const tastingsStore = useTastingsStore()
const roastersStore = useRoastersStore()
const settings = useSettingsStore()
const friendsStore = useFriendsStore()

onMounted(() => {
  coffeesStore.loadAll().catch(() => {})
  tastingsStore.loadAll().catch(() => {})
  roastersStore.loadAll().catch(() => {})
  friendsStore.load().catch(() => {})
  if (!settings.prefs) settings.load().catch(() => {})
})

const userName = computed(() =>
  currentUser.value?.displayName || currentUser.value?.email?.split('@')[0] || '',
)

const coffeesCount = computed(() => coffeesStore.list.length)
const tastingsCount = computed(() => tastingsStore.list.length)
const roastersCount = computed(() => roastersStore.list.length)

const variedadesActiveCount = computed(() => {
  const disabled = settings.prefs?.disabledVarieties ?? []
  const custom = settings.prefs?.customVarieties ?? []
  return [
    ...['Caturra', 'Geisha', 'Bourbon', 'Typica', 'Pacamara', 'SL28', 'Mundo Novo', 'Catimor'].filter(
      v => !disabled.includes(v),
    ),
    ...custom.filter(v => !disabled.includes(v)),
  ].length
})

const metodosActiveCount = computed(() => {
  const disabled = settings.prefs?.disabledBrewMethods ?? []
  const custom = settings.prefs?.customBrewMethods ?? []
  return 12 - disabled.length + custom.filter(m => !disabled.includes(m.value)).length
})

const procesosActiveCount = computed(() => {
  const disabled = settings.prefs?.disabledProcesses ?? []
  const custom = settings.prefs?.customProcesses ?? []
  return 7 - disabled.length + custom.filter(p => !disabled.includes(p.value)).length
})

const friendsAcceptedCount = computed(() => friendsStore.accepted.length)

async function onLogout() {
  const ok = window.confirm('¿Cerrar sesión?')
  if (!ok) return
  await logout()
}
</script>

<template>
  <div class="mx-auto w-full max-w-[640px] px-md pt-md pb-2xl lg:px-xl lg:pt-xl">
    <header class="flex items-center justify-between gap-md">
      <button
        type="button"
        class="inline-flex items-center justify-center size-[40px] rounded-pill text-moss hover:bg-surface-2/60 transition-colors"
        aria-label="Volver"
        @click="router.back()"
      >
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>
      <UiEyebrow>Ajustes</UiEyebrow>
      <div class="size-[40px]" aria-hidden="true" />
    </header>

    <h1 class="mt-md font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[48px]">
      Configuración<span>.</span>
    </h1>

    <!-- User card -->
    <NuxtLink
      to="/profile"
      class="mt-lg flex items-center gap-md rounded-card-lg bg-surface-2 p-md transition-colors duration-150 ease-sorbo hover:bg-surface"
    >
      <UiAvatar :name="userName" :src="currentUser?.photoURL ?? undefined" size="lg" />
      <div class="flex flex-col gap-xxs flex-1 min-w-0">
        <span class="font-sans text-[16px] font-medium text-moss truncate">{{ userName || 'Tu perfil' }}</span>
        <UiEyebrow>{{ coffeesCount }} {{ coffeesCount === 1 ? 'café' : 'cafés' }} · {{ tastingsCount }} {{ tastingsCount === 1 ? 'cata' : 'catas' }}</UiEyebrow>
      </div>
      <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost" />
    </NuxtLink>

    <!-- Catálogos -->
    <section class="mt-xl">
      <UiEyebrow>Catálogos</UiEyebrow>
      <div class="mt-sm flex flex-col">
        <NuxtLink
          to="/roasters"
          class="flex items-center justify-between gap-md py-md border-b border-moss/10 hover:bg-surface-2/40 transition-colors"
        >
          <div class="flex flex-col gap-xxs">
            <span class="font-sans text-[16px] font-medium text-moss">Tostadores / Marcas</span>
            <UiEyebrow>{{ roastersCount }} {{ roastersCount === 1 ? 'activo' : 'activos' }}</UiEyebrow>
          </div>
          <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost" />
        </NuxtLink>

        <NuxtLink
          to="/varieties"
          class="flex items-center justify-between gap-md py-md border-b border-moss/10 hover:bg-surface-2/40 transition-colors"
        >
          <div class="flex flex-col gap-xxs">
            <span class="font-sans text-[16px] font-medium text-moss">Variedades</span>
            <UiEyebrow>{{ variedadesActiveCount }} {{ variedadesActiveCount === 1 ? 'activa' : 'activas' }}</UiEyebrow>
          </div>
          <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost" />
        </NuxtLink>

        <NuxtLink
          to="/methods"
          class="flex items-center justify-between gap-md py-md border-b border-moss/10 hover:bg-surface-2/40 transition-colors"
        >
          <div class="flex flex-col gap-xxs">
            <span class="font-sans text-[16px] font-medium text-moss">Métodos</span>
            <UiEyebrow>{{ metodosActiveCount }} {{ metodosActiveCount === 1 ? 'activo' : 'activos' }}</UiEyebrow>
          </div>
          <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost" />
        </NuxtLink>

        <NuxtLink
          to="/processes"
          class="flex items-center justify-between gap-md py-md border-b border-moss/10 hover:bg-surface-2/40 transition-colors"
        >
          <div class="flex flex-col gap-xxs">
            <span class="font-sans text-[16px] font-medium text-moss">Procesos</span>
            <UiEyebrow>{{ procesosActiveCount }} {{ procesosActiveCount === 1 ? 'activo' : 'activos' }}</UiEyebrow>
          </div>
          <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost" />
        </NuxtLink>
      </div>
    </section>

    <!-- Social -->
    <section class="mt-xl">
      <UiEyebrow>Social</UiEyebrow>
      <div class="mt-sm flex flex-col">
        <NuxtLink
          to="/friends"
          class="flex items-center justify-between gap-md py-md border-b border-moss/10 hover:bg-surface-2/40 transition-colors"
        >
          <div class="flex flex-col gap-xxs">
            <span class="font-sans text-[16px] font-medium text-moss">Amigos</span>
            <UiEyebrow>
              <template v-if="friendsAcceptedCount > 0">
                {{ friendsAcceptedCount }} {{ friendsAcceptedCount === 1 ? 'amigo' : 'amigos' }}
              </template>
              <template v-else>Invita a tu primer amigo</template>
            </UiEyebrow>
          </div>
          <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost" />
        </NuxtLink>
      </div>
    </section>

    <!-- Cuenta -->
    <section class="mt-xl">
      <UiEyebrow>Cuenta</UiEyebrow>
      <div class="mt-sm flex flex-col">
        <NuxtLink
          to="/profile"
          class="flex items-center justify-between gap-md py-md border-b border-moss/10 hover:bg-surface-2/40 transition-colors"
        >
          <span class="font-sans text-[16px] font-medium text-moss">Perfil</span>
          <Icon name="lucide:chevron-right" class="size-5 text-moss-ghost" />
        </NuxtLink>
        <button
          type="button"
          class="flex items-center justify-between gap-md py-md border-b border-moss/10 hover:bg-terracotta/5 transition-colors text-left"
          @click="onLogout"
        >
          <span class="font-sans text-[16px] font-medium text-terracotta">Cerrar sesión</span>
          <Icon name="lucide:chevron-right" class="size-5 text-terracotta/60" />
        </button>
      </div>
    </section>
  </div>
</template>
