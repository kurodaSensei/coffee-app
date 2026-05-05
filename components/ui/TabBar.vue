<script setup lang="ts">
import { cn } from '~/lib/utils'

export interface TabItem {
  key: string
  label: string
  /** Route for NuxtLink. When omitted the tab is treated as a plain button. */
  to?: string
  /** Optional icon name (when integrating with @nuxt/icon). */
  icon?: string
}

const props = withDefaults(
  defineProps<{
    items: TabItem[]
    /** Currently active tab key. When `to` is set on items, NuxtLink active state is used instead. */
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

function onSelect(item: TabItem) {
  emit('update:modelValue', item.key)
  emit('select', item)
}
</script>

<template>
  <nav
    aria-label="Navegación principal"
    :class="
      cn(
        'z-30 bg-paper/90 backdrop-blur-md border-t border-moss/10',
        fixed && 'fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]',
        $props.class,
      )
    "
  >
    <ul class="mx-auto flex max-w-md items-center justify-between px-md py-sm">
      <li v-for="item in items" :key="item.key" class="flex-1">
        <component
          :is="item.to ? resolveComponent('NuxtLink') : 'button'"
          :to="item.to"
          :type="item.to ? undefined : 'button'"
          :aria-current="!item.to && modelValue === item.key ? 'page' : undefined"
          class="group relative flex w-full flex-col items-center gap-xxs py-xs font-mono text-[11px] uppercase tracking-eyebrow text-moss-ghost transition-colors duration-150 ease-sorbo"
          :class="[
            'aria-[current=page]:text-moss',
            // Active state for NuxtLink — applied via active-class
            item.to ? 'router-link-active:text-moss' : '',
            modelValue === item.key && !item.to ? 'text-moss' : '',
          ]"
          :active-class="item.to ? 'text-moss' : undefined"
          @click="onSelect(item)"
        >
          <span
            aria-hidden="true"
            class="h-[6px] w-[6px] rounded-pill transition-colors duration-150 ease-sorbo"
            :class="[
              modelValue === item.key ? 'bg-olive' : 'bg-transparent',
            ]"
          />
          <span>{{ item.label }}</span>
        </component>
      </li>
    </ul>
  </nav>
</template>
