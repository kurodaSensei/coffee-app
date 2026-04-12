<script setup lang="ts">
const friendsStore = useFriendsStore()
const email = ref('')
const submitting = ref(false)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

onMounted(() => friendsStore.load())

async function submit() {
  if (!email.value.trim()) return
  submitting.value = true
  feedback.value = null
  const result = await friendsStore.addFriendByEmail(email.value)
  feedback.value = { type: result.success ? 'success' : 'error', message: result.message }
  if (result.success) email.value = ''
  submitting.value = false
}

function initial(name?: string, emailStr?: string) {
  return name?.[0]?.toUpperCase() || emailStr?.[0]?.toUpperCase() || '?'
}
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Amigos" subtitle="Comparte cafés, catas y recetas con personas específicas" />

    <!-- Add friend form -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">Agregar amigo</CardTitle>
        <CardDescription>Busca a alguien por su correo electrónico. Debe tener una cuenta en Coffee Tracker.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submit" class="flex flex-col sm:flex-row gap-2">
          <Input v-model="email" type="email" placeholder="amigo@email.com" class="flex-1" />
          <Button type="submit" :disabled="submitting || !email.trim()" class="w-full sm:w-auto">
            <Icon v-if="submitting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:user-plus" class="w-4 h-4" />
            Enviar solicitud
          </Button>
        </form>
        <div
          v-if="feedback"
          :class="[
            'mt-3 flex items-start gap-2 p-3 rounded-lg text-sm',
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
              : 'bg-destructive/10 text-destructive border border-destructive/20',
          ]"
        >
          <Icon
            :name="feedback.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'"
            class="w-4 h-4 flex-shrink-0 mt-0.5"
          />
          <span>{{ feedback.message }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Pending incoming -->
    <section v-if="friendsStore.pendingIncoming.length > 0" class="space-y-3">
      <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
        <Icon name="lucide:bell" class="w-4 h-4 text-primary" />
        Solicitudes recibidas ({{ friendsStore.pendingIncoming.length }})
      </h3>
      <div class="space-y-2">
        <Card v-for="f in friendsStore.pendingIncoming" :key="f.id">
          <CardContent class="flex items-center gap-3 p-4">
            <Avatar class="h-10 w-10">
              <AvatarFallback class="bg-muted">
                {{ initial(friendsStore.getOtherUser(f)?.displayName, friendsStore.getOtherUser(f)?.email) }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-foreground truncate">
                {{ friendsStore.getOtherUser(f)?.displayName || friendsStore.getOtherUser(f)?.email }}
              </p>
              <p class="text-xs text-muted-foreground truncate">{{ friendsStore.getOtherUser(f)?.email }}</p>
            </div>
            <div class="flex gap-1.5">
              <Button size="sm" @click="friendsStore.accept(f.id)">
                <Icon name="lucide:check" class="w-4 h-4" />
                Aceptar
              </Button>
              <Button size="sm" variant="ghost" @click="friendsStore.reject(f.id)">
                Rechazar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Friends list -->
    <section class="space-y-3">
      <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
        <Icon name="lucide:users" class="w-4 h-4 text-muted-foreground" />
        Mis amigos ({{ friendsStore.accepted.length }})
      </h3>
      <div v-if="friendsStore.accepted.length === 0" class="text-center py-12 border border-dashed rounded-lg">
        <Icon name="lucide:users" class="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p class="text-sm text-muted-foreground">Aún no tienes amigos conectados.</p>
        <p class="text-xs text-muted-foreground mt-1">Envíales una solicitud para empezar a compartir.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card v-for="f in friendsStore.accepted" :key="f.id">
          <CardContent class="flex items-center gap-3 p-4">
            <Avatar class="h-10 w-10">
              <AvatarFallback class="bg-primary text-primary-foreground">
                {{ initial(friendsStore.getOtherUser(f)?.displayName, friendsStore.getOtherUser(f)?.email) }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-foreground truncate">
                {{ friendsStore.getOtherUser(f)?.displayName || friendsStore.getOtherUser(f)?.email }}
              </p>
              <p class="text-xs text-muted-foreground truncate">{{ friendsStore.getOtherUser(f)?.email }}</p>
            </div>
            <Button size="sm" variant="ghost" @click="friendsStore.remove(f.id)" title="Eliminar amigo">
              <Icon name="lucide:user-minus" class="w-4 h-4 text-muted-foreground" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Pending outgoing -->
    <section v-if="friendsStore.pendingOutgoing.length > 0" class="space-y-3">
      <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
        <Icon name="lucide:clock" class="w-4 h-4 text-muted-foreground" />
        Solicitudes enviadas ({{ friendsStore.pendingOutgoing.length }})
      </h3>
      <div class="space-y-2">
        <Card v-for="f in friendsStore.pendingOutgoing" :key="f.id">
          <CardContent class="flex items-center gap-3 p-4">
            <Avatar class="h-9 w-9">
              <AvatarFallback class="bg-muted">
                {{ initial(friendsStore.getOtherUser(f)?.displayName, friendsStore.getOtherUser(f)?.email) }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">
                {{ friendsStore.getOtherUser(f)?.displayName || friendsStore.getOtherUser(f)?.email }}
              </p>
              <p class="text-xs text-muted-foreground">Esperando respuesta...</p>
            </div>
            <Button size="sm" variant="ghost" @click="friendsStore.remove(f.id)">
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>
