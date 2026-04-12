<script setup lang="ts">
const actions = [
  { label: 'Nuevo café', desc: 'Registra un café', icon: 'lucide:coffee', to: '/coffees/new', color: 'amber' },
  { label: 'Nueva cata', desc: 'Cata de hoy', icon: 'lucide:clipboard-list', to: '/tastings/new', color: 'blue' },
  { label: 'Nueva receta', desc: 'Guarda un brew', icon: 'lucide:book-open', to: '/recipes/new', color: 'emerald' },
  { label: 'Agregar a wishlist', desc: 'Por probar', icon: 'lucide:heart', to: '/wishlist', color: 'rose' },
]

const colorClasses: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20',
  rose: 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500/20',
}
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <NuxtLink
      v-for="a in actions" :key="a.to"
      :to="a.to"
      class="group"
    >
      <Card class="h-full hover:border-primary/20 transition-all duration-200 hover:shadow-sm">
        <CardContent class="p-4">
          <div :class="['rounded-lg p-2 w-9 h-9 flex items-center justify-center transition-colors', colorClasses[a.color]]">
            <Icon :name="a.icon" class="w-4 h-4" />
          </div>
          <div class="mt-3">
            <p class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{{ a.label }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ a.desc }}</p>
          </div>
        </CardContent>
      </Card>
    </NuxtLink>
  </div>
</template>
