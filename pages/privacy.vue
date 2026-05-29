<!--
  Estos documentos son razonables para una beta pero no son consejo
  legal. Antes de monetizar o expandir a UE/UK, conviene revisión
  profesional.
-->
<script setup lang="ts">
definePageMeta({ layout: false, auth: false })

useHead({
  title: 'Política de Privacidad · Sorbo',
  meta: [
    { name: 'description', content: 'Cómo Sorbo trata tus datos personales.' },
    { name: 'robots', content: 'noindex, follow' },
  ],
})

const LAST_UPDATED = '15 de mayo de 2026'
</script>

<template>
  <div class="min-h-svh bg-paper text-moss">
    <header class="border-b border-moss/10">
      <div class="mx-auto max-w-[720px] flex items-center justify-between px-md py-md lg:px-xl">
        <NuxtLink to="/" class="inline-flex items-center gap-xs font-display text-[20px] text-moss">
          <img src="/sorbo.svg" alt="" aria-hidden="true" class="size-6">
          Sorbo<span class="text-honey">.</span>
        </NuxtLink>
        <span class="font-mono text-[10px] uppercase tracking-eyebrow text-moss-soft">
          — Privacidad
        </span>
      </div>
    </header>

    <main class="mx-auto max-w-[720px] px-md py-2xl lg:px-xl">
      <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-[40px] sm:text-[48px]">
        Política de <span class="italic text-olive">privacidad</span>
      </h1>
      <p class="subtitle-italic mt-sm">
        Qué guardamos, para qué, y con quién lo compartimos.
      </p>
      <p class="mt-md font-mono text-[10px] uppercase tracking-eyebrow text-moss-soft">
        Última actualización · {{ LAST_UPDATED }}
      </p>

      <div class="mt-2xl flex flex-col gap-xl font-sans text-[15px] leading-relaxed text-moss">
        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">1. Responsable</h2>
          <p class="mt-sm">
            <strong>Alfredo José Romero Morales</strong>, persona natural con residencia en <strong>Bogotá, Colombia</strong>, operando bajo la marca <strong>KurodaCafe</strong>, es responsable del tratamiento de los datos personales que recolecta Sorbo en cumplimiento de la Ley 1581 de 2012 de Colombia.
          </p>
          <p class="mt-md">
            Para cualquier consulta o ejercicio de derechos sobre tus datos, escríbenos a
            <a href="mailto:info@sorbo.app" class="text-olive font-medium">info@sorbo.app</a>.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">2. Qué datos recolectamos</h2>

          <h3 class="mt-md font-display italic text-[18px] text-olive">De tu cuenta</h3>
          <ul class="mt-xs flex flex-col gap-xs pl-md">
            <li class="list-disc">Correo electrónico (necesario para autenticar).</li>
            <li class="list-disc">Nombre y foto de perfil (si te registras con Google, los tomamos de allí; si te registras con email, los pides tú).</li>
            <li class="list-disc">Una biografía corta opcional que tú escribes.</li>
            <li class="list-disc">Tu lista de amigos dentro de Sorbo.</li>
          </ul>

          <h3 class="mt-md font-display italic text-[18px] text-olive">De tu contenido</h3>
          <ul class="mt-xs flex flex-col gap-xs pl-md">
            <li class="list-disc">Los cafés que registras (nombre, tostador, origen, proceso, notas, etc.).</li>
            <li class="list-disc">Las catas que haces (puntajes, atributos, notas personales).</li>
            <li class="list-disc">Las recetas y la wishlist.</li>
            <li class="list-disc">El nivel de visibilidad que asignas a cada item (privado, amigos o comunidad).</li>
            <li class="list-disc">Fechas de creación y modificación.</li>
          </ul>

          <h3 class="mt-md font-display italic text-[18px] text-olive">Técnicos y de analítica</h3>
          <ul class="mt-xs flex flex-col gap-xs pl-md">
            <li class="list-disc">Dirección IP aproximada y tipo de dispositivo, recolectados automáticamente por nuestros proveedores de hosting y analítica.</li>
            <li class="list-disc">Comportamiento de navegación dentro de Sorbo (qué pantallas visitas, qué acciones haces), recolectado por Google Analytics 4 con propósitos estadísticos.</li>
            <li class="list-disc">Cookies estrictamente necesarias para mantener tu sesión iniciada y cookies de analítica.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">3. Para qué usamos tus datos</h2>
          <ul class="mt-sm flex flex-col gap-xs pl-md">
            <li class="list-disc">Para que la app funcione: autenticarte, guardar tu contenido, mostrarte tu colección.</li>
            <li class="list-disc">Para mostrarte a otros usuarios en el feed de Explora <em>solo si tú marcas contenido como Comunidad</em>.</li>
            <li class="list-disc">Para permitirte conectar con amigos que también usan Sorbo.</li>
            <li class="list-disc">Para entender cómo se usa la app y mejorarla (analítica agregada).</li>
            <li class="list-disc">Para responderte cuando nos escribes.</li>
          </ul>
          <p class="mt-md">
            <strong>No vendemos tus datos.</strong> No los entregamos a anunciantes ni los comercializamos de ninguna forma.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">4. Con quién compartimos tus datos</h2>
          <p class="mt-sm">
            Sorbo se apoya en proveedores de infraestructura para operar. Estos proveedores procesan tus datos por encargo nuestro y bajo sus propias políticas de privacidad:
          </p>
          <ul class="mt-sm flex flex-col gap-xs pl-md">
            <li class="list-disc"><strong>Google (Firebase y Google Analytics)</strong> — autenticación, base de datos, almacenamiento de archivos, analítica.</li>
            <li class="list-disc"><strong>Vercel</strong> — hosting de la aplicación web.</li>
            <li class="list-disc"><strong>ImprovMX</strong> — entrega del correo de contacto.</li>
            <li class="list-disc"><strong>Brevo</strong> (cuando lo activemos) — envío de correos transaccionales y, si te suscribes, comunicaciones de producto.</li>
          </ul>
          <p class="mt-md">
            Estos terceros tienen acceso técnico a los datos necesarios para prestar su servicio, pero no están autorizados a usarlos para otros fines.
          </p>
          <p class="mt-md">
            Adicionalmente, otros <strong>usuarios de Sorbo</strong> verán los datos que tú decidas compartir con ellos: amigos que invitas (ven tu nombre y avatar) y la comunidad de Explora (ven tu nombre, avatar y el contenido que marques como Comunidad).
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">5. Cuánto tiempo los guardamos</h2>
          <p class="mt-sm">
            Mantenemos tus datos personales mientras tu cuenta esté activa. Si eliminas tu cuenta, se aplica un periodo de gracia de <strong>30 días</strong> (por si te arrepientes), tras el cual tus datos personales se borran de forma definitiva de nuestras bases de datos activas.
          </p>
          <p class="mt-md">
            Los datos agregados y anonimizados que ya no permiten identificarte (estadísticas de uso, por ejemplo) pueden conservarse de forma indefinida.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">6. Tus derechos</h2>
          <p class="mt-sm">
            De acuerdo con la Ley 1581 de 2012 y normativa concordante, tienes derecho a:
          </p>
          <ul class="mt-sm flex flex-col gap-xs pl-md">
            <li class="list-disc"><strong>Acceder</strong> a los datos personales que tengamos sobre ti.</li>
            <li class="list-disc"><strong>Rectificar</strong> datos inexactos o incompletos.</li>
            <li class="list-disc"><strong>Solicitar la eliminación</strong> de tus datos (derecho al olvido).</li>
            <li class="list-disc"><strong>Revocar</strong> el consentimiento que diste para el tratamiento de tus datos.</li>
            <li class="list-disc"><strong>Solicitar una copia portable</strong> de tu contenido.</li>
            <li class="list-disc"><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio si consideras que tus derechos no se respetaron.</li>
          </ul>
          <p class="mt-md">
            Para ejercer cualquiera de estos derechos, escríbenos a
            <a href="mailto:info@sorbo.app" class="text-olive font-medium">info@sorbo.app</a>. Respondemos en un plazo máximo de 15 días hábiles.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">7. Cookies y tecnologías similares</h2>
          <p class="mt-sm">
            Sorbo usa dos tipos de cookies y tecnologías similares:
          </p>
          <ul class="mt-sm flex flex-col gap-xs pl-md">
            <li class="list-disc"><strong>Estrictamente necesarias</strong>: mantienen tu sesión iniciada y guardan preferencias mínimas (como modo de visualización elegido). Sin estas la app no funciona.</li>
            <li class="list-disc"><strong>De analítica</strong>: Google Analytics 4 deposita cookies que nos permiten entender, de forma agregada, cómo se usa la app. Puedes deshabilitarlas desde la configuración de tu navegador.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">8. Menores de edad</h2>
          <p class="mt-sm">
            Sorbo no está dirigido a menores de 13 años. Si tienes entre 13 y 18 años, debes usar el servicio con autorización de tu padre, madre o tutor legal. Si detectamos una cuenta de un menor de 13 años, la cerraremos y eliminaremos sus datos.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">9. Cambios a esta política</h2>
          <p class="mt-sm">
            Si actualizamos esta política de forma significativa, te avisaremos por email o desde la app antes de que entre en vigor. La fecha de "Última actualización" arriba siempre refleja la versión vigente.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">10. Cómo contactarnos</h2>
          <p class="mt-sm">
            Para cualquier consulta sobre privacidad o ejercicio de tus derechos:
          </p>
          <p class="mt-sm">
            Correo: <a href="mailto:info@sorbo.app" class="text-olive font-medium">info@sorbo.app</a><br>
            Responsable: <strong>Alfredo José Romero Morales</strong>, <strong>Bogotá</strong>, Colombia.
          </p>
        </section>
      </div>

      <div class="mt-2xl pt-lg border-t border-moss/10 flex items-center justify-between flex-wrap gap-md">
        <NuxtLink to="/" class="font-mono text-[10px] uppercase tracking-eyebrow text-olive hover:opacity-80 transition-opacity">
          ← Volver al inicio
        </NuxtLink>
        <NuxtLink to="/terms" class="font-mono text-[10px] uppercase tracking-eyebrow text-moss-soft hover:text-moss transition-colors">
          ← Términos de uso
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
