<script setup lang="ts">
import { resolveComponent } from 'vue'
import { cn } from '~/lib/utils'

export interface TabItem {
  key: string
  label: string
  /** Route for NuxtLink. When omitted the tab is treated as a plain button. */
  to?: string
}

const props = withDefaults(
  defineProps<{
    items: TabItem[]
    /** Currently active tab key. When `to` is set on items, route matching is used instead. */
    modelValue?: string
    /** Use fixed bottom positioning with safe-area padding. */
    fixed?: boolean
    class?: string
  }>(),
  {
    fixed: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [key: string]
  select: [item: TabItem]
}>()

const route = useRoute()

function isActive(item: TabItem): boolean {
  if (props.modelValue !== undefined) return props.modelValue === item.key
  if (!item.to) return false
  if (item.to === '/') return route.path === '/'
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function onSelect(item: TabItem) {
  emit('update:modelValue', item.key)
  emit('select', item)
}
</script>

<template>
  <nav
    aria-label="Navegación"
    :class="
      cn(
        'z-30 bg-paper/95 backdrop-blur-md border-t border-moss/10',
        fixed && 'fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]',
        $props.class,
      )
    "
  >
    <ul class="mx-auto flex max-w-xl items-center px-md py-sm">
      <li v-for="item in items" :key="item.key" class="flex flex-1 justify-center">
        <component
          :is="item.to ? resolveComponent('NuxtLink') : 'button'"
          :to="item.to"
          :type="item.to ? undefined : 'button'"
          :aria-current="isActive(item) ? 'page' : undefined"
          class="inline-flex items-center gap-xxs px-xs py-xs whitespace-nowrap"
          @click="onSelect(item)"
        >
          <template v-if="isActive(item)">
            <span aria-hidden="true" class="inline-block size-[6px] rounded-pill bg-olive" />
            <span class="font-display italic text-[14px] leading-none lowercase text-olive">
              {{ item.label }}
            </span>
          </template>
          <template v-else>
            <span class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-moss-ghost">
              {{ item.label }}
            </span>
          </template>
        </component>
      </li>
    </ul>
  </nav>
</template>
