<script setup lang="ts">
import {
  DEFAULT_PROCESS_OPTIONS,
  DEFAULT_BREW_METHOD_OPTIONS,
  DEFAULT_VARIETIES,
} from '~/utils/constants'

const settings = useSettingsStore()
const roastersStore = useRoastersStore()

const newVariety = ref('')
const newProcess = ref('')
const newMethod = ref('')

onMounted(() => {
  settings.load()
  roastersStore.loadAll()
})

const prefs = computed(() => settings.prefs)

async function addVariety() {
  if (!newVariety.value.trim()) return
  await settings.addVariety(newVariety.value)
  newVariety.value = ''
}

async function addProcess() {
  if (!newProcess.value.trim()) return
  await settings.addProcess(newProcess.value)
  newProcess.value = ''
}

async function addMethod() {
  if (!newMethod.value.trim()) return
  await settings.addBrewMethod(newMethod.value)
  newMethod.value = ''
}

function isVarietyDisabled(v: string) {
  return prefs.value?.disabledVarieties.includes(v) ?? false
}
function isProcessDisabled(v: string) {
  return prefs.value?.disabledProcesses.includes(v) ?? false
}
function isMethodDisabled(v: string) {
  return prefs.value?.disabledBrewMethods.includes(v) ?? false
}
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Configuración" subtitle="Personaliza tus catálogos de café" />

    <div v-if="settings.loading && !prefs" class="flex justify-center py-12">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
    </div>

    <Tabs v-else default-value="varieties" class="space-y-6">
      <TabsList class="grid w-full grid-cols-4 max-w-2xl">
        <TabsTrigger value="varieties">Variedades</TabsTrigger>
        <TabsTrigger value="processes">Procesos</TabsTrigger>
        <TabsTrigger value="methods">Métodos</TabsTrigger>
        <TabsTrigger value="roasters">Tostadores</TabsTrigger>
      </TabsList>

      <!-- Variedades -->
      <TabsContent value="varieties" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Agregar variedad personalizada</CardTitle>
            <CardDescription>Añade variedades que pruebas con frecuencia</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="addVariety" class="flex gap-2">
              <Input v-model="newVariety" placeholder="Ej: Java Ipar" class="flex-1" />
              <Button type="submit" :disabled="!newVariety.trim()">
                <Icon name="lucide:plus" class="w-4 h-4" />
                Agregar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div v-if="prefs?.customVarieties?.length" class="space-y-2">
          <h3 class="text-sm font-semibold text-foreground">Tus variedades</h3>
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="v in prefs.customVarieties" :key="v"
              variant="default"
              class="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              @click="settings.removeCustomVariety(v)"
            >
              {{ v }}
              <Icon name="lucide:x" class="w-3 h-3" />
            </Badge>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-foreground">Variedades predefinidas</h3>
          <p class="text-xs text-muted-foreground">Clic para desactivar / activar</p>
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="v in DEFAULT_VARIETIES" :key="v"
              :variant="isVarietyDisabled(v) ? 'outline' : 'secondary'"
              :class="[
                'cursor-pointer transition-colors',
                isVarietyDisabled(v) ? 'opacity-50 line-through' : '',
              ]"
              @click="settings.toggleDefaultVariety(v)"
            >
              {{ v }}
            </Badge>
          </div>
        </div>
      </TabsContent>

      <!-- Procesos -->
      <TabsContent value="processes" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Agregar proceso personalizado</CardTitle>
            <CardDescription>Registra procesos experimentales o locales</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="addProcess" class="flex gap-2">
              <Input v-model="newProcess" placeholder="Ej: Koji fermentation" class="flex-1" />
              <Button type="submit" :disabled="!newProcess.trim()">
                <Icon name="lucide:plus" class="w-4 h-4" />
                Agregar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div v-if="prefs?.customProcesses?.length" class="space-y-2">
          <h3 class="text-sm font-semibold text-foreground">Tus procesos</h3>
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="p in prefs.customProcesses" :key="p.value"
              variant="default"
              class="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              @click="settings.removeCustomProcess(p.value)"
            >
              {{ p.label }}
              <Icon name="lucide:x" class="w-3 h-3" />
            </Badge>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-foreground">Procesos predefinidos</h3>
          <p class="text-xs text-muted-foreground">Clic para desactivar / activar</p>
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="p in DEFAULT_PROCESS_OPTIONS" :key="p.value"
              :variant="isProcessDisabled(p.value) ? 'outline' : 'secondary'"
              :class="[
                'cursor-pointer transition-colors',
                isProcessDisabled(p.value) ? 'opacity-50 line-through' : '',
              ]"
              @click="settings.toggleDefaultProcess(p.value)"
            >
              {{ p.label }}
            </Badge>
          </div>
        </div>
      </TabsContent>

      <!-- Métodos -->
      <TabsContent value="methods" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Agregar método de preparación</CardTitle>
            <CardDescription>Añade los métodos que usas</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="addMethod" class="flex gap-2">
              <Input v-model="newMethod" placeholder="Ej: Switch, Clever, Mokapot" class="flex-1" />
              <Button type="submit" :disabled="!newMethod.trim()">
                <Icon name="lucide:plus" class="w-4 h-4" />
                Agregar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div v-if="prefs?.customBrewMethods?.length" class="space-y-2">
          <h3 class="text-sm font-semibold text-foreground">Tus métodos</h3>
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="m in prefs.customBrewMethods" :key="m.value"
              variant="default"
              class="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              @click="settings.removeCustomBrewMethod(m.value)"
            >
              {{ m.label }}
              <Icon name="lucide:x" class="w-3 h-3" />
            </Badge>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-foreground">Métodos predefinidos</h3>
          <p class="text-xs text-muted-foreground">Clic para desactivar / activar</p>
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="m in DEFAULT_BREW_METHOD_OPTIONS" :key="m.value"
              :variant="isMethodDisabled(m.value) ? 'outline' : 'secondary'"
              :class="[
                'cursor-pointer transition-colors',
                isMethodDisabled(m.value) ? 'opacity-50 line-through' : '',
              ]"
              @click="settings.toggleDefaultBrewMethod(m.value)"
            >
              {{ m.label }}
            </Badge>
          </div>
        </div>
      </TabsContent>

      <!-- Tostadores -->
      <TabsContent value="roasters" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Tostadores y marcas</CardTitle>
            <CardDescription>Gestiona tus tostadores favoritos desde su sección dedicada</CardDescription>
          </CardHeader>
          <CardContent>
            <NuxtLink to="/roasters">
              <Button variant="outline">
                <Icon name="lucide:store" class="w-4 h-4" />
                Ir a tostadores
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
              </Button>
            </NuxtLink>
            <p v-if="roastersStore.list.length > 0" class="mt-4 text-sm text-muted-foreground">
              Tienes {{ roastersStore.list.length }} tostador{{ roastersStore.list.length !== 1 ? 'es' : '' }} registrado{{ roastersStore.list.length !== 1 ? 's' : '' }}.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
