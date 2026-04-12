<script setup lang="ts">
const friendsStore = useFriendsStore()

onMounted(() => friendsStore.load())

function initial(name?: string, email?: string) {
  return name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || '?'
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
      <div class="space-y-1">
        <CardTitle class="text-base flex items-center gap-2">
          <Icon name="lucide:users" class="w-4 h-4 text-muted-foreground" />
          Amigos
        </CardTitle>
        <CardDescription class="text-xs">
          Comparte cafés, catas y recetas
        </CardDescription>
      </div>
      <NuxtLink to="/friends">
        <Button variant="ghost" size="sm">
          Ver todos
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
        </Button>
      </NuxtLink>
    </CardHeader>

    <CardContent class="space-y-3">
      <!-- Pending requests badge -->
      <NuxtLink
        v-if="friendsStore.pendingIncoming.length > 0"
        to="/friends"
        class="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
      >
        <Icon name="lucide:bell" class="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-amber-900 dark:text-amber-200">
            {{ friendsStore.pendingIncoming.length }} solicitud{{ friendsStore.pendingIncoming.length !== 1 ? 'es' : '' }} pendiente{{ friendsStore.pendingIncoming.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </NuxtLink>

      <!-- Friends list -->
      <div v-if="friendsStore.accepted.length === 0" class="text-center py-6">
        <Icon name="lucide:user-plus" class="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
        <p class="text-xs text-muted-foreground">Aún no tienes amigos</p>
        <NuxtLink to="/friends">
          <Button variant="link" size="sm" class="mt-1 h-auto py-0">Invitar amigo</Button>
        </NuxtLink>
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="f in friendsStore.accepted.slice(0, 4)" :key="f.id"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Avatar class="h-8 w-8">
            <AvatarFallback class="bg-muted text-xs font-semibold">
              {{ initial(friendsStore.getOtherUser(f)?.displayName, friendsStore.getOtherUser(f)?.email) }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ friendsStore.getOtherUser(f)?.displayName || friendsStore.getOtherUser(f)?.email }}
            </p>
          </div>
        </div>
        <p v-if="friendsStore.accepted.length > 4" class="text-xs text-muted-foreground text-center pt-1">
          +{{ friendsStore.accepted.length - 4 }} más
        </p>
      </div>
    </CardContent>
  </Card>
</template>
