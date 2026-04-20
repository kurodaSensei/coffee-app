<script setup lang="ts">
const coffeesStore = useCoffeesStore()
const tastingsStore = useTastingsStore()
const { currentUser } = useAuth()
const { computeStats } = useStats()

onMounted(async () => {
  await Promise.all([
    coffeesStore.loadAll(),
    tastingsStore.loadAll(),
    tastingsStore.loadRecent(5),
  ])
})

const stats = computed(() => computeStats(coffeesStore.list, tastingsStore.list))
const lastTasting = computed(() => tastingsStore.recent[0])
const isLoading = computed(() => coffeesStore.loading || tastingsStore.loading)
const hasData = computed(() => coffeesStore.list.length > 0 || tastingsStore.list.length > 0)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const userName = computed(() =>
  currentUser.value?.displayName?.split(' ')[0] || 'barista'
)

const today = computed(() =>
  new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
)
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="isLoading" class="mt-12 flex flex-col items-center justify-center py-16">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      <p class="mt-3 font-mono text-eyebrow uppercase text-muted-foreground">Cargando...</p>
    </div>

    <template v-else>
      <!-- Hero editorial -->
      <div class="pb-6 border-b border-moss/10">
        <p class="font-mono text-[9px] uppercase tracking-[.14em] text-moss-ghost">— {{ today }}</p>
        <h1 class="font-serif text-[26px] leading-[1.0] tracking-[-0.02em] text-foreground mt-3">
          {{ greeting }},<br><em class="not-italic text-olive">{{ userName }}</em>.
        </h1>
        <p v-if="lastTasting" class="font-serif italic text-[13px] text-moss-ghost mt-2 leading-[1.4]">
          Tu última taza: {{ lastTasting.coffeeName }}, con {{ lastTasting.ratingOverall }} puntos.
        </p>
      </div>

      <!-- Primary CTA -->
      <NuxtLink to="/tastings/new" class="block mt-5">
        <div class="rounded-xl bg-moss text-paper px-4 py-3.5 flex items-center justify-between hover:bg-moss/90 transition-colors duration-base">
          <div>
            <p class="font-mono text-[9px] uppercase tracking-[.14em] text-paper/55">— Hoy</p>
            <p class="font-serif text-[16px] leading-snug mt-1">¿Preparas café?</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-honey text-moss flex items-center justify-center text-[14px] font-semibold flex-shrink-0">→</div>
        </div>
      </NuxtLink>

      <!-- 2-col shortcuts -->
      <div class="mt-2.5 grid grid-cols-2 gap-2.5">
        <NuxtLink to="/tastings/new" class="block">
          <div class="px-3 py-3 rounded-xl bg-surface-2 border border-moss/10 hover:border-moss/20 transition-colors duration-fast">
            <p class="font-serif text-[15px] leading-none text-moss">Nueva cata</p>
            <p class="font-mono text-[8px] uppercase tracking-[.1em] text-moss-ghost mt-1.5">Del último</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/coffees/new" class="block">
          <div class="px-3 py-3 rounded-xl bg-surface-2 border border-moss/10 hover:border-moss/20 transition-colors duration-fast">
            <p class="font-serif text-[15px] leading-none text-moss">+ Café</p>
            <p class="font-mono text-[8px] uppercase tracking-[.1em] text-moss-ghost mt-1.5">Registrar</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Stats "Este mes" -->
      <div v-if="hasData" class="mt-6">
        <p class="font-mono text-[9px] uppercase tracking-[.14em] text-moss-ghost mb-1">— Este mes</p>
        <div class="divide-y divide-moss/10">
          <div class="flex items-center justify-between py-2.5">
            <span class="font-serif italic text-[11px] text-foreground/80">Cafés</span>
            <span class="font-mono text-[11px] font-medium text-foreground">{{ stats.totalCoffees }}</span>
          </div>
          <div class="flex items-center justify-between py-2.5">
            <span class="font-serif italic text-[11px] text-foreground/80">Catas</span>
            <span class="font-mono text-[11px] font-medium text-foreground">{{ stats.totalTastings }}</span>
          </div>
          <div class="flex items-center justify-between py-2.5">
            <span class="font-serif italic text-[11px] text-foreground/80">Score promedio</span>
            <span class="font-mono text-[11px] font-medium text-olive">{{ stats.avgRating || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Welcome state (no data) -->
      <Card v-if="!hasData" class="mt-6 border-dashed">
        <CardContent class="flex flex-col items-center text-center py-12 px-6">
          <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Icon name="lucide:coffee" class="w-10 h-10 text-primary" />
          </div>
          <h2 class="font-serif text-h2 text-foreground">Bienvenido a Sorbo</h2>
          <p class="mt-2 font-sans text-body text-muted-foreground max-w-sm">
            Empieza registrando tu primer café.
          </p>
        </CardContent>
      </Card>

      <!-- Recent tastings -->
      <div v-if="hasData" class="mt-8">
        <DashboardRecent :tastings="tastingsStore.recent" />
      </div>

      <!-- Friends widget -->
      <div class="mt-6">
        <DashboardFriends />
      </div>
    </template>
  </div>
</template>
