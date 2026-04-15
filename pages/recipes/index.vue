<script setup lang="ts">
import type { Recipe } from '~/types'
import { getBrewMethodLabel, formatRatio } from '~/utils/formatters'

const recipesStore = useRecipesStore()

const showDetailDialog = ref(false)
const showEditMode = ref(false)
const showDeleteDialog = ref(false)
const showShareDialog = ref(false)
const selectedRecipe = ref<Recipe | null>(null)

const activeTab = ref('mine')

onMounted(() => {
  recipesStore.loadAll()
  recipesStore.loadShared()
})

function openDetail(recipe: Recipe) {
  selectedRecipe.value = recipe
  showEditMode.value = false
  showDetailDialog.value = true
}

function startEdit() {
  showEditMode.value = true
}

async function onUpdate(data: Partial<Recipe>) {
  if (!selectedRecipe.value) return
  await recipesStore.update(selectedRecipe.value.id, data)
  showDetailDialog.value = false
  selectedRecipe.value = null
}

async function onDelete() {
  if (!selectedRecipe.value) return
  await recipesStore.remove(selectedRecipe.value.id)
  showDeleteDialog.value = false
  showDetailDialog.value = false
  selectedRecipe.value = null
}
</script>

<template>
  <div class="space-y-6">
    <LayoutHeader title="Recetas" subtitle="Tus recetas de preparacion favoritas">
      <NuxtLink to="/recipes/new">
        <Button>
          <Icon name="lucide:plus" class="w-4 h-4" />
          Agregar
        </Button>
      </NuxtLink>
    </LayoutHeader>

    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid grid-cols-2 w-full">
        <TabsTrigger value="mine">
          Mis recetas
          <Badge variant="secondary" class="ml-2">{{ recipesStore.list.length }}</Badge>
        </TabsTrigger>
        <TabsTrigger value="shared">
          Compartidas conmigo
          <Badge variant="secondary" class="ml-2">{{ recipesStore.sharedList.length }}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mine">
        <div v-if="recipesStore.loading" class="flex justify-center py-12">
          <Icon name="lucide:loader-2" class="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
        <div v-else-if="recipesStore.list.length === 0" class="text-center py-12">
          <Icon name="lucide:flask-conical" class="w-12 h-12 text-muted-foreground/50 mx-auto" />
          <h3 class="mt-4 text-lg font-medium text-foreground">No hay recetas aun</h3>
          <p class="mt-2 text-sm text-muted-foreground">Agrega tu primera receta de preparacion.</p>
          <NuxtLink to="/recipes/new">
            <Button class="mt-4">Crear receta</Button>
          </NuxtLink>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="recipe in recipesStore.list" :key="recipe.id" @click="openDetail(recipe)" class="cursor-pointer">
            <RecipeCard :recipe="recipe" />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="shared">
        <div v-if="recipesStore.sharedList.length === 0" class="text-center py-16 border border-dashed rounded-lg">
          <Icon name="lucide:share-2" class="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p class="text-sm font-medium text-foreground">Nadie te ha compartido recetas aún</p>
          <p class="text-xs text-muted-foreground mt-1">Cuando un amigo comparta una receta contigo aparecerá aquí.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="recipe in recipesStore.sharedList" :key="recipe.id" @click="openDetail(recipe)" class="cursor-pointer">
            <RecipeCard :recipe="recipe" />
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <!-- Detail / Edit Dialog -->
    <Dialog v-model:open="showDetailDialog">
      <DialogScrollContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ showEditMode ? 'Editar receta' : (selectedRecipe?.name || '') }}</DialogTitle>
        </DialogHeader>

        <div v-if="selectedRecipe && !showEditMode" class="space-y-4">
          <div class="flex items-center gap-2">
            <Badge>{{ getBrewMethodLabel(selectedRecipe.brewMethod) }}</Badge>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="text-center bg-muted rounded-lg p-3">
              <p class="text-xs text-muted-foreground">Dosis</p>
              <p class="text-lg font-semibold text-foreground">{{ selectedRecipe.dose }}g</p>
            </div>
            <div class="text-center bg-muted rounded-lg p-3">
              <p class="text-xs text-muted-foreground">Agua</p>
              <p class="text-lg font-semibold text-foreground">{{ selectedRecipe.water }}ml</p>
            </div>
            <div class="text-center bg-muted rounded-lg p-3">
              <p class="text-xs text-muted-foreground">Ratio</p>
              <p class="text-lg font-semibold text-foreground">
                {{ selectedRecipe.ratio || formatRatio(selectedRecipe.dose, selectedRecipe.water) }}
              </p>
            </div>
          </div>

          <div v-if="selectedRecipe.waterTemp || selectedRecipe.grindSize" class="flex gap-4 text-sm text-muted-foreground">
            <span v-if="selectedRecipe.waterTemp">
              <Icon name="lucide:thermometer" class="w-4 h-4 inline" />
              {{ selectedRecipe.waterTemp }}°C
            </span>
            <span v-if="selectedRecipe.grindSize">
              <Icon name="lucide:settings-2" class="w-4 h-4 inline" />
              Molienda: {{ selectedRecipe.grindSize }}
            </span>
          </div>

          <div v-if="selectedRecipe.instructions" class="bg-muted rounded-lg p-4">
            <h4 class="text-sm font-medium text-foreground mb-2">Instrucciones</h4>
            <p class="text-sm text-muted-foreground whitespace-pre-line">{{ selectedRecipe.instructions }}</p>
          </div>

          <div v-if="selectedRecipe.bestFor" class="text-sm text-muted-foreground">
            <span class="font-medium text-foreground">Mejor para:</span> {{ selectedRecipe.bestFor }}
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" @click="showShareDialog = true">
              <Icon name="lucide:share-2" class="w-4 h-4" />
              Compartir
              <Badge v-if="selectedRecipe.sharedWith?.length" variant="secondary" class="ml-1 h-5 px-1.5">
                {{ selectedRecipe.sharedWith.length }}
              </Badge>
            </Button>
            <Button variant="secondary" size="sm" @click="startEdit">
              <Icon name="lucide:pencil" class="w-4 h-4" />
              Editar
            </Button>
            <Button variant="destructive" size="sm" @click="showDeleteDialog = true">
              <Icon name="lucide:trash-2" class="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </div>

        <div v-if="selectedRecipe && showEditMode">
          <RecipeForm
            :initial-data="selectedRecipe"
            :loading="recipesStore.loading"
            @submit="onUpdate"
            @cancel="showEditMode = false"
          />
        </div>
      </DialogScrollContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Receta</DialogTitle>
        </DialogHeader>
        <p class="text-muted-foreground">
          Estas seguro de que deseas eliminar <strong class="text-foreground">{{ selectedRecipe?.name }}</strong>? Esta accion no se puede deshacer.
        </p>
        <DialogFooter>
          <Button variant="ghost" @click="showDeleteDialog = false">
            Cancelar
          </Button>
          <Button variant="destructive" @click="onDelete">
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ShareDialog
      v-if="selectedRecipe"
      v-model:open="showShareDialog"
      collection="recipes"
      :item-id="selectedRecipe.id"
      :item-name="selectedRecipe.name"
      :current-shared="selectedRecipe.sharedWith"
      @shared="recipesStore.loadAll()"
    />
  </div>
</template>
