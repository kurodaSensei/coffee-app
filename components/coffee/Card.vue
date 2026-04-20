<script setup lang="ts">
import type { Coffee } from '~/types'
import { formatPrice, formatWeight, getProcessLabel } from '~/utils/formatters'

defineProps<{ coffee: Coffee }>()
</script>

<template>
  <NuxtLink :to="`/coffees/${coffee.id}`" class="block group">
    <div
      class="relative overflow-hidden rounded-xl border border-moss/10 p-5 cursor-pointer hover:shadow-card transition-all duration-base"
      style="background: linear-gradient(135deg, #E4E3D2, #EBE9DC)"
    >
      <!-- Decorative honey circle -->
      <div class="absolute -top-10 -right-8 w-36 h-36 rounded-full bg-honey opacity-25 transition-transform duration-slow group-hover:scale-110" />

      <div class="relative">
        <!-- Process · Region eyebrow -->
        <p class="font-mono text-[9px] uppercase tracking-[.14em] text-moss-ghost">
          — {{ getProcessLabel(coffee.process) }} · {{ coffee.originRegion }}
        </p>

        <!-- Coffee name (serif large) -->
        <h3 class="font-serif text-[38px] leading-[.95] tracking-[-0.02em] text-moss mt-1.5">
          {{ coffee.name }}
        </h3>

        <!-- Roaster italic -->
        <p class="font-serif italic text-[12px] text-moss-ghost mt-0.5">
          {{ coffee.roasterName }}
        </p>

        <!-- Flavor chips -->
        <div v-if="coffee.flavorNotes?.length" class="flex flex-wrap gap-1.5 mt-3.5">
          <span
            v-for="note in coffee.flavorNotes.slice(0, 3)"
            :key="note"
            class="px-2.5 py-1 rounded-pill bg-white/70 text-[10px] font-medium text-moss"
          >
            {{ note }}
          </span>
          <span v-if="coffee.flavorNotes.length > 3" class="text-[10px] text-moss-ghost self-center">
            +{{ coffee.flavorNotes.length - 3 }}
          </span>
        </div>

        <!-- Footer: SCA score + price/weight -->
        <div class="flex items-end justify-between mt-4">
          <div v-if="coffee.scaScore">
            <p class="font-mono text-[9px] uppercase tracking-[.1em] text-moss-ghost">Score SCA</p>
            <p class="font-serif text-[36px] leading-none text-olive mt-0.5">{{ coffee.scaScore }}</p>
          </div>
          <div v-else />
          <p v-if="coffee.price || coffee.weight" class="font-mono text-[11px] font-medium text-moss self-end pb-0.5">
            <span v-if="coffee.price">{{ formatPrice(coffee.price) }}</span>
            <span v-if="coffee.price && coffee.weight"> · </span>
            <span v-if="coffee.weight">{{ formatWeight(coffee.weight) }}</span>
          </p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
