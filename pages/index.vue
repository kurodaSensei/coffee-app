<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: false, auth: false })

useHead({
  title: 'Sorbo — Un diario para cada sorbo',
  meta: [
    { name: 'description', content: 'Un diario íntimo para cada café que pasa por tu taza. Registra, cata y recuerda.' },
  ],
})

const email = ref('')
const submitting = ref(false)
const subscribed = ref(false)

function onSubscribe() {
  if (!email.value.trim() || submitting.value) return
  submitting.value = true
  // TODO: wire to a Firestore "waitlist" collection or external service
  setTimeout(() => {
    subscribed.value = true
    submitting.value = false
  }, 600)
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="min-h-svh bg-paper text-moss font-sans antialiased">
    <!-- ━━━━━━━━━━━━ HERO ━━━━━━━━━━━━ -->
    <section class="relative overflow-hidden bg-moss text-paper">
      <!-- Decorative radial glows -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -left-1/4 -top-1/4 h-[600px] w-[800px] rounded-full opacity-40 blur-3xl"
        style="background: radial-gradient(closest-side, rgba(85,107,58,0.45), transparent 70%);"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -right-1/4 top-1/2 h-[500px] w-[700px] rounded-full opacity-30 blur-3xl"
        style="background: radial-gradient(closest-side, rgba(229,184,75,0.18), transparent 70%);"
      />

      <!-- Top nav -->
      <header class="relative mx-auto max-w-[1280px] px-md sm:px-lg lg:px-2xl pt-md lg:pt-lg flex items-center justify-between gap-md">
        <NuxtLink to="/" class="inline-flex items-center gap-xs" aria-label="Sorbo">
          <img src="/sorbo.svg" alt="" aria-hidden="true" class="block size-[32px] shrink-0">
          <span class="font-display text-[22px] leading-none text-paper">
            Sorbo<span class="text-honey">.</span>
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-lg" aria-label="Navegación">
          <button type="button" class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-paper/70 hover:text-paper transition-colors" @click="scrollTo('manifiesto')">
            Manifiesto
          </button>
          <button type="button" class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-paper/70 hover:text-paper transition-colors" @click="scrollTo('producto')">
            Producto
          </button>
          <button type="button" class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-paper/70 hover:text-paper transition-colors" @click="scrollTo('filosofia')">
            Filosofía
          </button>
        </nav>

        <NuxtLink
          to="/register"
          class="inline-flex items-center justify-center h-[36px] px-md rounded-pill bg-honey text-jungle font-sans text-[13px] font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Crea tu diario
        </NuxtLink>
      </header>

      <!-- Hero content -->
      <div class="relative mx-auto max-w-[1280px] px-md sm:px-lg lg:px-2xl pt-2xl lg:pt-[120px] pb-2xl lg:pb-[160px] grid lg:grid-cols-[1.2fr_1fr] gap-2xl items-center">
        <div>
          <UiEyebrow class="text-paper/60">— Por KurodaCafe</UiEyebrow>

          <h1 class="mt-md font-display tracking-[-0.02em] leading-[0.95] text-paper text-[56px] sm:text-[72px] lg:text-[88px] xl:text-[104px]">
            Un diario<br>
            para cada<br>
            <span class="italic text-honey">sorbo</span>
          </h1>

          <p class="mt-lg font-display italic text-[16px] lg:text-[18px] text-paper/70 max-w-[440px] leading-relaxed">
            Un cuaderno íntimo de catas, recetas y descubrimientos. Sin algoritmo, sin feed, sin métricas vacías.
          </p>

          <div class="mt-xl flex flex-wrap items-center gap-sm">
            <NuxtLink
              to="/register"
              class="inline-flex items-center justify-center h-[46px] px-lg rounded-cta bg-olive text-paper font-sans text-[14px] font-medium hover:bg-olive-dark transition-colors"
            >
              Crea tu diario
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="inline-flex items-center justify-center h-[46px] px-lg rounded-cta border border-paper/20 text-paper font-sans text-[14px] font-medium hover:bg-paper/5 transition-colors"
            >
              Iniciar sesión
            </NuxtLink>
          </div>

          <!-- Stats row -->
          <div class="mt-2xl grid grid-cols-3 gap-md max-w-[400px]">
            <div class="flex flex-col gap-xxs">
              <span class="font-display text-[28px] leading-none text-paper">∞</span>
              <UiEyebrow class="text-paper/60">Cafés</UiEyebrow>
            </div>
            <div class="flex flex-col gap-xxs">
              <span class="font-mono text-[20px] leading-none text-honey">SCA</span>
              <UiEyebrow class="text-paper/60">Estándar</UiEyebrow>
            </div>
            <div class="flex flex-col gap-xxs">
              <span class="font-display text-[28px] leading-none text-paper">0%</span>
              <UiEyebrow class="text-paper/60">Espía</UiEyebrow>
            </div>
          </div>
        </div>

        <!-- Phone mockup (mini coffees list) -->
        <div class="relative justify-self-center lg:justify-self-end">
          <div class="relative w-[280px] sm:w-[320px] aspect-[9/19.5] rounded-[44px] bg-paper border-[10px] border-jungle shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
            <!-- Status bar -->
            <div class="px-md pt-sm pb-xs flex items-center justify-between">
              <span class="font-mono text-[11px] font-bold text-moss">9:41</span>
              <span class="font-mono text-[10px] text-moss">●●●● · WiFi</span>
            </div>

            <!-- Mini app shell -->
            <div class="px-md pt-sm">
              <div class="flex items-center justify-between">
                <span class="font-mono text-[9px] font-medium uppercase tracking-eyebrow text-moss-soft">— Cafés · 3</span>
                <span class="size-[20px] rounded-pill bg-olive flex items-center justify-center text-paper font-sans text-[10px] font-medium">S</span>
              </div>

              <h3 class="mt-md font-display text-[28px] leading-[1.05] tracking-[-0.02em] text-moss">
                Mi <span class="italic text-olive">colección</span>
              </h3>

              <!-- Mini cards -->
              <div class="mt-md flex flex-col gap-xs">
                <div class="relative overflow-hidden rounded-card-lg bg-surface p-sm">
                  <span aria-hidden="true" class="pointer-events-none absolute -right-6 -top-6 h-[60px] w-[60px] rounded-full bg-honey opacity-70" />
                  <div class="relative">
                    <span class="font-mono text-[8px] font-medium uppercase tracking-eyebrow text-moss-soft">— Natural · Tarqui</span>
                    <div class="mt-xxs font-display text-[18px] leading-none text-moss">Rock</div>
                    <div class="mt-xxs flex gap-xxs">
                      <span class="rounded-pill bg-surface-2 px-[6px] py-[1px] font-mono text-[7px] uppercase tracking-eyebrow text-moss">Cereza</span>
                      <span class="rounded-pill bg-surface-2 px-[6px] py-[1px] font-mono text-[7px] uppercase tracking-eyebrow text-moss">Panela</span>
                    </div>
                    <div class="mt-xs flex items-end justify-between">
                      <div class="flex flex-col">
                        <span class="font-mono text-[7px] uppercase tracking-eyebrow text-moss-soft">Score SCA</span>
                        <span class="font-display text-[18px] leading-none text-moss">86.5</span>
                      </div>
                      <span class="font-mono text-[8px] text-moss-soft">$60K · 250g</span>
                    </div>
                  </div>
                </div>

                <div class="relative overflow-hidden rounded-card-lg bg-surface p-sm">
                  <span aria-hidden="true" class="pointer-events-none absolute -right-6 -top-6 h-[60px] w-[60px] rounded-full bg-olive-light opacity-60" />
                  <div class="relative">
                    <span class="font-mono text-[8px] font-medium uppercase tracking-eyebrow text-moss-soft">— Lavado · Yirgacheffe</span>
                    <div class="mt-xxs font-display text-[18px] leading-none text-moss">Aramo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ━━━━━━━━━━━━ QUOTE ━━━━━━━━━━━━ -->
    <section id="manifiesto" class="bg-paper py-2xl lg:py-[120px]">
      <div class="mx-auto max-w-[800px] px-md sm:px-lg text-center">
        <p class="font-display tracking-[-0.01em] leading-[1.15] text-moss text-[28px] sm:text-[36px] lg:text-[44px]">
          "Cada sorbo es un pequeño viaje. <span class="italic text-olive">Sorbo</span> es donde lo <span class="italic text-olive">recuerdas</span>."
        </p>
      </div>
    </section>

    <!-- ━━━━━━━━━━━━ FEATURES ━━━━━━━━━━━━ -->
    <section id="producto" class="bg-paper py-2xl lg:py-[120px] border-t border-moss/10">
      <div class="mx-auto max-w-[1280px] px-md sm:px-lg lg:px-2xl">
        <h2 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[56px] lg:text-[72px] max-w-[800px]">
          Todo lo que necesitas,<br>
          nada de <span class="italic text-olive">relleno</span>
        </h2>

        <div class="mt-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm lg:gap-md">
          <!-- Card 01 -->
          <div class="rounded-card-lg bg-surface p-md lg:p-lg flex flex-col gap-md min-h-[220px]">
            <UiEyebrow>01</UiEyebrow>
            <div class="mt-auto">
              <h3 class="font-display text-[22px] leading-none text-moss">Tu colección</h3>
              <p class="mt-xs font-display italic text-[14px] text-moss-soft leading-relaxed">
                Cada café con nombre, origen, proceso y la historia detrás.
              </p>
            </div>
          </div>

          <!-- Card 02 (destacada) -->
          <div class="rounded-card-lg bg-moss text-paper p-md lg:p-lg flex flex-col gap-md min-h-[220px]">
            <UiEyebrow class="text-paper/60">02</UiEyebrow>
            <div class="mt-auto">
              <h3 class="font-display text-[22px] leading-none text-paper">
                Catas con <span class="italic text-honey">memoria</span>
              </h3>
              <p class="mt-xs font-display italic text-[14px] text-paper/70 leading-relaxed">
                Aroma, acidez, dulzura, cuerpo, retrogusto. Cada taza, su propio recuerdo.
              </p>
            </div>
          </div>

          <!-- Card 03 (olive) -->
          <div class="rounded-card-lg bg-olive text-paper p-md lg:p-lg flex flex-col gap-md min-h-[220px]">
            <UiEyebrow class="text-paper/70">03</UiEyebrow>
            <div class="mt-auto">
              <h3 class="font-display text-[22px] leading-none text-paper">
                <span class="italic">Recetas</span>
              </h3>
              <p class="mt-xs font-display italic text-[14px] text-paper/80 leading-relaxed">
                Tu V60 perfecto, tu prensa francesa Hoffmann, con timer integrado.
              </p>
            </div>
          </div>

          <!-- Card 04 -->
          <div class="rounded-card-lg bg-surface p-md lg:p-lg flex flex-col gap-md min-h-[220px]">
            <UiEyebrow>04</UiEyebrow>
            <div class="mt-auto">
              <h3 class="font-display text-[22px] leading-none text-moss">
                Wishlist <span class="italic text-olive">activa</span>
              </h3>
              <p class="mt-xs font-display italic text-[14px] text-moss-soft leading-relaxed">
                El próximo café favorito empieza siendo un deseo en tu lista.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ━━━━━━━━━━━━ 3 STEPS ━━━━━━━━━━━━ -->
    <section class="bg-paper py-2xl lg:py-[120px] border-t border-moss/10">
      <div class="mx-auto max-w-[1280px] px-md sm:px-lg lg:px-2xl">
        <h2 class="font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[56px] lg:text-[64px] max-w-[800px]">
          De la taza al diario,<br>
          en <span class="italic text-olive">tres pasos</span>
        </h2>

        <div class="mt-2xl grid grid-cols-1 md:grid-cols-3 gap-md">
          <!-- Step 1 -->
          <div class="rounded-card-lg bg-surface p-md lg:p-lg flex flex-col gap-md">
            <UiEyebrow>Paso 01</UiEyebrow>
            <h3 class="font-display text-[24px] leading-none text-moss">
              Registra el <span class="italic text-olive">café</span>
            </h3>
            <div class="mt-md rounded-card-sm bg-paper p-sm border border-moss/10">
              <UiEyebrow>Natural · Tarqui</UiEyebrow>
              <div class="mt-xxs font-display text-[18px] text-moss leading-none">Rock natural</div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="rounded-card-lg bg-surface p-md lg:p-lg flex flex-col gap-md">
            <UiEyebrow>Paso 02</UiEyebrow>
            <h3 class="font-display text-[24px] leading-none text-moss">
              Puntúa la <span class="italic text-olive">taza</span>
            </h3>
            <div class="mt-md rounded-card-lg bg-moss p-sm">
              <UiEyebrow class="text-paper">Puntuación general</UiEyebrow>
              <div class="mt-xxs flex items-baseline gap-xxs">
                <span class="font-display text-[36px] leading-none text-paper">8.7</span>
                <span class="font-mono text-[10px] text-paper">/10</span>
              </div>
              <div class="mt-xs h-[4px] rounded-pill bg-moss-soft overflow-hidden">
                <span class="block h-full bg-honey" style="width: 87%" />
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="rounded-card-lg bg-surface p-md lg:p-lg flex flex-col gap-md">
            <UiEyebrow>Paso 03</UiEyebrow>
            <h3 class="font-display text-[24px] leading-none text-moss">
              Tu <span class="italic text-olive">memoria</span>
            </h3>
            <div class="mt-md rounded-card-sm bg-paper p-sm border border-moss/10">
              <UiEyebrow>Tu nota</UiEyebrow>
              <p class="mt-xxs font-display italic text-[13px] text-moss leading-snug">
                "Dulce como postre, con un final a panela y un toque de cacao oscuro."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ━━━━━━━━━━━━ ANTI-PITCH ━━━━━━━━━━━━ -->
    <section id="filosofia" class="bg-moss text-paper py-2xl lg:py-[120px]">
      <div class="mx-auto max-w-[1280px] px-md sm:px-lg lg:px-2xl">
        <h2 class="font-display tracking-[-0.02em] leading-[1.05] text-paper text-[36px] sm:text-[48px] lg:text-[64px] max-w-[900px]">
          No es un Excel,<br>
          ni una red social,<br>
          ni un cuaderno <span class="italic text-honey">perdido</span>
        </h2>

        <div class="mt-2xl grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div class="flex flex-col gap-sm">
            <h3 class="font-display text-[22px] leading-none text-paper">
              Editorial, no <span class="italic text-honey">aplicación</span>
            </h3>
            <p class="font-display italic text-[14px] text-paper/70 leading-relaxed">
              Cada cata se siente como una página de un libro, no como un formulario.
            </p>
          </div>

          <div class="flex flex-col gap-sm">
            <h3 class="font-display text-[22px] leading-none text-paper">
              Privado por <span class="italic text-honey">defecto</span>
            </h3>
            <p class="font-display italic text-[14px] text-paper/70 leading-relaxed">
              Tu diario es tuyo. Compartes solo cuando tú decides, con quien tú decides.
            </p>
          </div>

          <div class="flex flex-col gap-sm">
            <h3 class="font-display text-[22px] leading-none text-paper">
              Hecho por un <span class="italic text-honey">cafetero</span>
            </h3>
            <p class="font-display italic text-[14px] text-paper/70 leading-relaxed">
              Por gente que persigue geishas y naturales colombianos. No por VCs.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ━━━━━━━━━━━━ EMAIL CTA ━━━━━━━━━━━━ -->
    <section class="bg-paper py-2xl lg:py-[120px] border-t border-moss/10">
      <div class="mx-auto max-w-[640px] px-md sm:px-lg text-center">
        <UiEyebrow>— Beta privada</UiEyebrow>
        <h2 class="mt-md font-display tracking-[-0.02em] leading-[1.05] text-moss text-[40px] sm:text-[56px] lg:text-[64px]">
          Sé de los primeros<br>
          en <span class="italic text-olive">sorber</span>
        </h2>
        <p class="mt-md font-display italic text-[14px] lg:text-[16px] text-moss-soft">
          Te avisamos cuando abramos el diario al público.
        </p>

        <form
          v-if="!subscribed"
          class="mt-xl flex flex-col sm:flex-row items-stretch gap-xs max-w-[480px] mx-auto"
          @submit.prevent="onSubscribe"
        >
          <input
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="tu-correo@ejemplo.com"
            required
            class="flex-1 rounded-input bg-surface-2 border border-moss/10 px-md h-[46px] font-display italic text-[16px] text-moss placeholder:text-moss-ghost outline-none focus:border-moss transition-colors"
          >
          <button
            type="submit"
            :disabled="submitting || !email.trim()"
            class="inline-flex items-center justify-center h-[46px] px-lg rounded-cta bg-moss text-paper font-sans text-[14px] font-medium hover:bg-jungle transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {{ submitting ? 'Enviando…' : 'Notifícame' }}
          </button>
        </form>
        <p
          v-else
          class="mt-xl font-display italic text-[16px] text-olive"
          role="status"
        >
          ✓ Listo. Te avisamos pronto.
        </p>
      </div>
    </section>

    <!-- ━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━ -->
    <footer class="bg-moss text-paper py-2xl">
      <div class="mx-auto max-w-[1280px] px-md sm:px-lg lg:px-2xl flex flex-col gap-xl">
        <div class="flex flex-wrap items-end justify-between gap-md">
          <div class="flex items-center gap-sm">
            <img src="/sorbo.svg" alt="" aria-hidden="true" class="block size-[40px]">
            <div class="flex flex-col gap-xxs">
              <span class="font-display text-[24px] leading-none text-paper">
                Sorbo<span class="text-honey">.</span>
              </span>
              <UiEyebrow class="text-paper/60">— Por KurodaCafe</UiEyebrow>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-md">
            <NuxtLink to="/login" class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-paper/70 hover:text-paper transition-colors">
              Iniciar sesión
            </NuxtLink>
            <NuxtLink to="/register" class="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-paper/70 hover:text-paper transition-colors">
              Crear cuenta
            </NuxtLink>
          </div>
        </div>

        <div class="border-t border-paper/10 pt-md flex flex-wrap items-center justify-between gap-md">
          <p class="font-mono text-[10px] uppercase tracking-eyebrow text-paper/45">
            © {{ new Date().getFullYear() }} Sorbo · Hecho en Colombia
          </p>
          <p class="font-display italic text-[13px] text-paper/55">
            "el primer sorbo del día."
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
