<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Async callback que dispara el refresh real (load del store, etc.) */
    onRefresh: () => Promise<void>
    /** Distancia en px para disparar el refresh. */
    threshold?: number
  }>(),
  {
    threshold: 70,
  },
)

const containerRef = ref<HTMLElement | null>(null)
const pullDistance = ref(0)
const isPulling = ref(false)
const isRefreshing = ref(false)

const { light, medium } = useHaptic()
// Tick haptico cuando se cruza el threshold por primera vez en este pull —
// le dice al usuario "ya soltá y va a refrescar"
let crossedThreshold = false

let startY = 0

function isAtTop(): boolean {
  // El scroll de las páginas ocurre a nivel window, no en este contenedor.
  return window.scrollY <= 0
}

function onTouchStart(e: TouchEvent) {
  if (isRefreshing.value || !isAtTop()) return
  startY = e.touches[0].clientY
  isPulling.value = true
  crossedThreshold = false
}

function onTouchMove(e: TouchEvent) {
  if (!isPulling.value) return
  const delta = e.touches[0].clientY - startY

  if (delta <= 0) {
    // Si el usuario empieza a subir el dedo, cancelamos el pull
    pullDistance.value = 0
    return
  }

  // Resistencia: cuesta más arrastrar mientras más se aleja. Math.pow(x, 0.75)
  // da la sensación de elasticidad clásica de iOS/Android.
  pullDistance.value = Math.pow(delta, 0.75)

  // Haptic light al cruzar el threshold — feedback de "ya soltá"
  if (!crossedThreshold && pullDistance.value >= props.threshold) {
    crossedThreshold = true
    light()
  }

  // Cuando ya estamos pulling, bloqueamos el scroll del body para que el
  // gesto no se confunda con scroll vertical.
  if (pullDistance.value > 8 && e.cancelable) {
    e.preventDefault()
  }
}

async function onTouchEnd() {
  if (!isPulling.value) return
  isPulling.value = false

  if (pullDistance.value >= props.threshold && !isRefreshing.value) {
    medium() // haptic medium cuando el refresh efectivamente dispara
    isRefreshing.value = true
    // Mantenemos la card del indicador visible durante el refresh
    pullDistance.value = props.threshold
    try {
      await props.onRefresh()
    }
    catch {
      // los errores los maneja el caller via toast/etc.
    }
    finally {
      isRefreshing.value = false
      pullDistance.value = 0
    }
  }
  else {
    // No alcanzó el threshold — spring-back
    pullDistance.value = 0
  }
}

onMounted(() => {
  const el = containerRef.value
  if (!el) return
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: false })
  el.addEventListener('touchend', onTouchEnd, { passive: true })
  el.addEventListener('touchcancel', onTouchEnd, { passive: true })
})

onUnmounted(() => {
  const el = containerRef.value
  if (!el) return
  el.removeEventListener('touchstart', onTouchStart)
  el.removeEventListener('touchmove', onTouchMove)
  el.removeEventListener('touchend', onTouchEnd)
  el.removeEventListener('touchcancel', onTouchEnd)
})
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- Indicador — aparece desde el top mientras se hace pull, queda visible
         durante el refresh. Posicionado fixed para no afectar el layout. -->
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="pullDistance > 0 || isRefreshing"
        aria-hidden="true"
        class="fixed left-1/2 -translate-x-1/2 z-30 inline-flex items-center justify-center size-[36px] rounded-pill bg-paper shadow-[0_4px_16px_rgba(20,23,18,0.12)] border border-moss/5"
        :style="{
          top: `${Math.max(8, Math.min(pullDistance - 18, props.threshold - 18 + 8))}px`,
        }"
      >
        <Icon
          v-if="isRefreshing"
          name="lucide:loader-2"
          class="size-4 text-olive animate-spin"
        />
        <Icon
          v-else
          name="lucide:arrow-down"
          class="size-4 text-moss-soft transition-transform duration-200"
          :class="pullDistance >= threshold ? 'rotate-180 text-olive' : ''"
        />
      </div>
    </Transition>

    <!-- Contenido — se desplaza hacia abajo según el pull. La transition se
         desactiva mientras el dedo está arrastrando (sigue 1:1) y se reactiva
         al soltar para el spring-back.

         CRÍTICO: el transform solo se aplica cuando hay pull activo o refresh
         en curso. Si lo dejamos siempre con translate3d(0,0,0), este wrapper
         se convierte en containing block para position:fixed descendants
         (gotcha clásico de CSS), rompiendo el anchor de los FABs flotantes
         de las listas (los pega al contenido en lugar del viewport). -->
    <div
      :style="(pullDistance > 0 || isRefreshing) ? { transform: `translate3d(0, ${pullDistance}px, 0)` } : undefined"
      :class="!isPulling && !isRefreshing ? 'transition-transform duration-300 ease-sorbo' : ''"
    >
      <slot />
    </div>
  </div>
</template>
