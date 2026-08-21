<script setup lang="ts">
definePageMeta({ layout: false, auth: false })

const SITE_URL = 'https://sorbo.app'
const OG_IMAGE = `${SITE_URL}/og-image.png`
const DESCRIPTION = 'Sorbo es un proyecto personal de KurodaCafe — un diario para café de especialidad, hecho desde Colombia, gratuito y sin tracking ni paywall.'

useHead({
  title: 'Sobre Sorbo · Quién está detrás del proyecto',
  meta: [
    { name: 'description', content: DESCRIPTION },
    { name: 'robots', content: 'index, follow' },

    { property: 'og:type', content: 'profile' },
    { property: 'og:url', content: `${SITE_URL}/about` },
    { property: 'og:title', content: 'Sobre Sorbo · KurodaCafe' },
    { property: 'og:description', content: DESCRIPTION },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:locale', content: 'es_ES' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Sobre Sorbo · KurodaCafe' },
    { name: 'twitter:description', content: DESCRIPTION },
    { name: 'twitter:image', content: OG_IMAGE },
  ],
  link: [
    { rel: 'canonical', href: `${SITE_URL}/about` },
  ],
  script: [
    {
      type: 'application/ld+json',
      // AboutPage + Person referenciada con sameAs al perfil público
      // de IG. La Person hace de "creador" del SoftwareApplication
      // declarado en la home. KurodaCafe = nombre del creador / marca
      // personal (consistente con la Organization en /).
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'AboutPage',
            '@id': `${SITE_URL}/about#page`,
            'url': `${SITE_URL}/about`,
            'name': 'Sobre Sorbo · KurodaCafe',
            'description': DESCRIPTION,
            'inLanguage': 'es',
            'mainEntity': { '@id': `${SITE_URL}/about#person` },
            'about': { '@id': `${SITE_URL}/#software` },
          },
          {
            '@type': 'Person',
            '@id': `${SITE_URL}/about#person`,
            'name': 'KurodaCafe',
            'alternateName': 'Alfredo Romero',
            'description': 'Cafetero y desarrollador. Creador de Sorbo. Especialista en café de origen colombiano, con foco en procesos naturales.',
            'url': `${SITE_URL}/about`,
            'image': `${SITE_URL}/icons/icon-512.png`,
            'jobTitle': 'Software engineer & cafetero',
            'worksFor': { '@id': `${SITE_URL}/#organization` },
            'sameAs': [
              'https://instagram.com/kurodacafe',
            ],
            'knowsAbout': [
              'Café de especialidad',
              'Métodos de extracción',
              'Catación SCA',
              'Desarrollo de software',
              'PWA',
            ],
          },
        ],
      }),
    },
  ],
  htmlAttrs: { lang: 'es' },
})
</script>

<template>
  <div class="min-h-svh bg-paper text-moss">
    <header class="border-b border-moss/10 pt-[env(safe-area-inset-top)]">
      <div class="mx-auto max-w-[720px] flex items-center justify-between px-md py-md lg:px-xl">
        <NuxtLink to="/" class="inline-flex items-center gap-xs font-display text-[20px] text-moss">
          <img src="/sorbo.svg" alt="" aria-hidden="true" class="size-6">
          Sorbo<span class="text-honey">.</span>
        </NuxtLink>
        <span class="font-mono text-[10px] uppercase tracking-eyebrow text-moss-soft">
          — Sobre el proyecto
        </span>
      </div>
    </header>

    <main class="mx-auto max-w-[720px] px-md py-2xl lg:px-xl">
      <p class="font-mono text-[10px] uppercase tracking-eyebrow text-honey font-medium">
        — KurodaCafe · 2026
      </p>

      <h1 class="mt-md font-display tracking-[-0.02em] leading-[1.0] text-[44px] sm:text-[56px]">
        Un proyecto<br>
        de un <span class="italic text-olive">cafetero</span><br>
        para cafeteros.
      </h1>

      <p class="subtitle-italic mt-lg">
        Sorbo nace de tomar demasiados naturales colombianos y querer
        recordarlos todos.
      </p>

      <article class="prose-sorbo mt-2xl flex flex-col gap-lg">
        <section>
          <h2 class="font-display text-[28px] leading-tight text-moss">
            Quién está <em class="italic text-olive">detrás</em>
          </h2>
          <p class="mt-sm">
            Sorbo es un proyecto solo-developer hecho por
            <strong class="font-medium text-moss">KurodaCafe</strong> (Alfredo Romero), un
            cafetero y desarrollador desde Bogotá. Lo construyo entre tardes y
            fines de semana, financiado por mi propio café y motivado por
            querer una herramienta que combine la precisión del cuaderno de
            barista con la calidez de un diario personal.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[28px] leading-tight text-moss">
            Por qué <em class="italic text-olive">Sorbo</em>
          </h2>
          <p class="mt-sm">
            Las herramientas existentes para llevar registro de café están rotas:
            las hojas de Excel son precisión sin alma, Notion es flexible pero sin
            estructura, las apps específicas son cuadernos de barista demasiado técnicos
            o redes sociales disfrazadas de tracker. El espacio entre
            "Excel triste" y "Instagram con etiquetas" estaba vacío. Sorbo es la
            herramienta para el cafetero que disfruta del ritual sin querer convertirse
            en barista profesional.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[28px] leading-tight text-moss">
            Cómo se <em class="italic text-olive">sostiene</em>
          </h2>
          <p class="mt-sm">
            Sorbo es gratuito y siempre lo será para el plan core. No vendemos tus
            datos, no metemos publicidad, no hay tracking de terceros más allá de
            analytics anónimo (Google Analytics 4 sin User-ID) y monitoreo de
            errores (Sentry). La infraestructura corre en tiers gratuitos de
            Firebase y Vercel, lo cual nos permite operar sin presión de monetización
            agresiva.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[28px] leading-tight text-moss">
            Filosofía de <em class="italic text-olive">producto</em>
          </h2>
          <ul class="mt-sm flex flex-col gap-xs pl-md">
            <li class="list-disc">Editorial antes que técnico — tipografía serif, espacios amplios, mood cards.</li>
            <li class="list-disc">Privado por defecto — cada cata nace privada; tú decides si la compartes.</li>
            <li class="list-disc">Sin gamificación tóxica — no hay likes, no hay seguidores, no hay rankings.</li>
            <li class="list-disc">Open contact — `info@sorbo.app` te llega directamente.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-display text-[28px] leading-tight text-moss">
            Contacto y <em class="italic text-olive">comunidad</em>
          </h2>
          <p class="mt-sm">
            La conversación pasa por
            <a href="https://instagram.com/kurodacafe" target="_blank" rel="noopener" class="text-olive font-medium hover:underline">@kurodacafe en Instagram</a>
            y el correo
            <a href="mailto:info@sorbo.app" class="text-olive font-medium hover:underline">info@sorbo.app</a>.
            Bug reports, sugerencias y conversación sobre café son siempre bienvenidos.
          </p>
        </section>
      </article>

      <div class="mt-2xl flex flex-col gap-sm">
        <NuxtLink to="/" class="inline-flex items-center font-mono text-[11px] uppercase tracking-eyebrow text-olive hover:opacity-80">
          ← Volver a la portada
        </NuxtLink>
        <NuxtLink to="/register" class="inline-flex items-center font-sans font-medium text-[13px] text-moss hover:text-jungle">
          Crea tu cuenta — es gratis →
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
.prose-sorbo p,
.prose-sorbo li {
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.7;
  color: var(--moss-soft);
}
.prose-sorbo strong { color: var(--moss); }
.prose-sorbo em { color: var(--olive); }
</style>
