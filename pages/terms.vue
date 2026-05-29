<!--
  Estos documentos son razonables para una beta pero no son consejo
  legal. Antes de monetizar o expandir a UE/UK, conviene revisión
  profesional.
-->
<script setup lang="ts">
definePageMeta({ layout: false, auth: false })

useHead({
  title: 'Términos de Uso · Sorbo',
  meta: [
    { name: 'description', content: 'Términos y condiciones de uso del servicio Sorbo.' },
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
          — Términos de uso
        </span>
      </div>
    </header>

    <main class="mx-auto max-w-[720px] px-md py-2xl lg:px-xl">
      <h1 class="font-display tracking-[-0.02em] leading-[1.05] text-[40px] sm:text-[48px]">
        Términos de <span class="italic text-olive">uso</span>
      </h1>
      <p class="subtitle-italic mt-sm">
        En texto plano. Sin sorpresas.
      </p>
      <p class="mt-md font-mono text-[10px] uppercase tracking-eyebrow text-moss-soft">
        Última actualización · {{ LAST_UPDATED }}
      </p>

      <div class="mt-2xl flex flex-col gap-xl font-sans text-[15px] leading-relaxed text-moss">
        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">1. Quiénes somos</h2>
          <p class="mt-sm">
            Sorbo es un proyecto operado por <strong>Alfredo José Romero Morales</strong>, persona natural con residencia en <strong>Bogotá, Colombia</strong>, bajo la marca <strong>KurodaCafe</strong>. Para cualquier asunto relacionado con estos términos puedes escribirnos a
            <a href="mailto:info@sorbo.app" class="text-olive font-medium">info@sorbo.app</a>.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">2. Aceptación de los términos</h2>
          <p class="mt-sm">
            Al crear una cuenta en Sorbo o al usar el servicio, aceptas estos términos y la
            <NuxtLink to="/privacy" class="text-olive font-medium">Política de Privacidad</NuxtLink>. Si no estás de acuerdo con algo de lo que está aquí, por favor no uses el servicio.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">3. Edad mínima</h2>
          <p class="mt-sm">
            Para crear una cuenta en Sorbo debes tener al menos <strong>13 años</strong>. Si tienes entre 13 y 18 años, debes contar con autorización de tu padre, madre o tutor legal. Sorbo se reserva el derecho de cerrar cuentas que detecte de menores de 13 años.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">4. Tu cuenta</h2>
          <p class="mt-sm">
            Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran en tu cuenta. Si crees que alguien accedió sin permiso, escríbenos para que te ayudemos a recuperarla. Te pedimos usar información veraz al registrarte — un nombre real o un alias estable que te represente.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">5. Tu contenido</h2>
          <p class="mt-sm">
            <strong>Lo que registras en Sorbo es tuyo.</strong> Tus cafés, catas, recetas, notas y la wishlist te pertenecen. Sorbo no se vuelve dueño de tu memoria de taza.
          </p>
          <p class="mt-md">
            Lo que sí necesitamos para que la app funcione: una licencia limitada, no exclusiva y libre de regalías para almacenar, mostrar y procesar tu contenido <em>dentro de Sorbo</em>. Si marcas un café, cata o receta como <strong>Comunidad</strong>, esta licencia se extiende a mostrarlo en Explora a otros usuarios de Sorbo, junto con tu nombre y avatar como autor.
          </p>
          <p class="mt-md">
            Sorbo <strong>no usa tu contenido para marketing ni publicidad</strong> sin tu permiso explícito.
          </p>
          <p class="mt-md">
            Tú decides el nivel de visibilidad de cada cosa que creas: <strong>privado</strong> (solo tú), <strong>amigos</strong> (las personas que elijas) o <strong>comunidad</strong> (todos los usuarios de Sorbo en Explora). El default es privado.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">6. Reglas de la comunidad</h2>
          <p class="mt-sm">
            Para que Explora siga siendo un buen lugar, te pedimos que no publiques contenido que:
          </p>
          <ul class="mt-sm flex flex-col gap-xs pl-md">
            <li class="list-disc">Sea ilegal o promueva actividades ilegales.</li>
            <li class="list-disc">Incite al odio, la discriminación o la violencia.</li>
            <li class="list-disc">Sea spam, publicidad no solicitada o estafa.</li>
            <li class="list-disc">Suplante la identidad de otra persona o entidad.</li>
            <li class="list-disc">Viole derechos de propiedad intelectual de terceros.</li>
            <li class="list-disc">Contenga datos personales de otras personas sin su permiso.</li>
          </ul>
          <p class="mt-md">
            Si encuentras contenido que viola estas reglas, puedes reportarlo escribiéndonos a
            <a href="mailto:info@sorbo.app" class="text-olive font-medium">info@sorbo.app</a>.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">7. Suspensión y eliminación de cuenta</h2>
          <p class="mt-sm">
            Sorbo se reserva el derecho de suspender o eliminar cuentas que rompan estas reglas, sin previo aviso si la falta es grave. Para faltas leves, intentaremos contactarte primero.
          </p>
          <p class="mt-md">
            Tú puedes eliminar tu cuenta cuando quieras desde la app (Configuración → Cuenta → Eliminar mi cuenta). El borrado es <strong>inmediato e irreversible</strong>: todos tus cafés, catas, recetas, wishlist, amigos y perfil se eliminan al instante. Si te arrepientes, deberás crear una cuenta nueva. Ver la
            <NuxtLink to="/privacy" class="text-olive font-medium">Política de Privacidad</NuxtLink> para más detalle.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">8. El servicio "tal como es"</h2>
          <p class="mt-sm">
            Sorbo está actualmente en beta y se ofrece <strong>gratuitamente</strong> y <strong>tal como es</strong>. Hacemos todo lo posible por que funcione bien, pero no podemos garantizar disponibilidad continua, ausencia de errores o que cumpla expectativas particulares. Si pierdes datos por un fallo del servicio, haremos lo posible por recuperarlos, pero no asumimos responsabilidad por pérdida de contenido.
          </p>
          <p class="mt-md">
            En el máximo permitido por la ley, Sorbo no se hace responsable por daños indirectos, lucro cesante o cualquier perjuicio derivado del uso del servicio.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">9. Cambios al servicio y a los términos</h2>
          <p class="mt-sm">
            Sorbo está en evolución. Podemos cambiar, agregar o eliminar funcionalidades, e incluso introducir planes pagos en el futuro — siempre avisando con anticipación razonable. Si actualizamos estos términos de forma significativa, te avisaremos por email o desde la app antes de que entren en vigor.
          </p>
        </section>

        <section>
          <h2 class="font-display text-[24px] text-moss leading-tight">10. Ley aplicable</h2>
          <p class="mt-sm">
            Estos términos se rigen por la legislación de la República de Colombia. Cualquier disputa relacionada con el servicio será resuelta ante los tribunales competentes de <strong>Bogotá</strong>, Colombia.
          </p>
        </section>

        <section class="rounded-card-lg bg-surface-2 p-md">
          <p class="font-display italic text-[14px] text-moss-soft leading-relaxed">
            "Si llegaste hasta acá, gracias por leer. Sorbo intenta ser tan honesto en sus términos como en su producto."
          </p>
        </section>
      </div>

      <div class="mt-2xl pt-lg border-t border-moss/10 flex items-center justify-between flex-wrap gap-md">
        <NuxtLink to="/" class="font-mono text-[10px] uppercase tracking-eyebrow text-olive hover:opacity-80 transition-opacity">
          ← Volver al inicio
        </NuxtLink>
        <NuxtLink to="/privacy" class="font-mono text-[10px] uppercase tracking-eyebrow text-moss-soft hover:text-moss transition-colors">
          Política de Privacidad →
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
