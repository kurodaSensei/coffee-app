# Sorbo

> Un diario para cada sorbo de café.

**Sitio**: [sorbo.app](https://sorbo.app)
**Estado**: Beta cerrada · pre-lanzamiento (2026)
**Rol**: Solo founder & developer
**Stack**: Nuxt 3 · Vue 3 · TypeScript · Firebase · Tailwind CSS

---

## Qué es

App-diario para amantes del café de especialidad. Registra cada café que pruebas (origen, variedad, proceso, dónde lo compraste), puntúa catas con atributos detallados, guarda recetas con cronómetro, y descubre lo que otros cafeteros publican — sin la ansiedad de una red social.

## Posicionamiento

> "No es un Excel, ni una red social, ni un cuaderno perdido."

Sorbo ocupa el espacio entre tres cosas que ya existen pero no encajan: las apps técnicas (frías y desnudas), las redes sociales de café tipo Untappd (ruidosas y competitivas), y los cuadernos de papel (se pierden). El producto es editorial, no técnico — cada café tiene nombre propio y se presenta más como una página de revista que como una hoja de datos.

## Features destacadas

- **Diario privado por defecto**: cafés, catas y recetas. Cada item nace privado.
- **Sharing en 3 niveles**: privado, amigos elegidos, o comunidad pública (Explora).
- **Explora**: feed comunitario para descubrir lo que otros publican. Sin likes, sin follows, sin ranking. Filtros + acciones para guardar a wishlist o duplicar a tu colección.
- **Cata guiada en 3 pasos** con atributos detallados (aroma, acidez, dulzura, cuerpo, retrogusto). Tooltips educativos en cada atributo para usuarios no expertos.
- **Recetas con cronómetro funcional**: pasos cronometrados, timer integrado que resalta el paso activo en tiempo real.
- **Catálogos personalizables**: tostadores, variedades, métodos de extracción (12), procesos, notas de sabor — el usuario añade custom o desactiva defaults según su uso.
- **PWA instalable**: prompt nativo en Android/desktop, instrucciones manuales en iOS. Funciona offline.

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | Nuxt 3, Vue 3 Composition API, TypeScript |
| UI | Tailwind CSS + sistema de diseño propio (tokens, mood cards, bottom sheets, action menus) |
| Estado | Pinia con factory genérico que envuelve CRUD de Firestore |
| Backend | Firebase Firestore + Auth + Storage |
| Hosting | Vercel (static preset, SSR off) |
| Observabilidad | Google Analytics 4 (10 eventos custom mapeando embudos) + Sentry |
| Email | ImprovMX (info@sorbo.app), Brevo programado para cuando crezca la waitlist |

## Decisiones de producto interesantes

- **Ni red social al uso**: cero mecanismos adictivos — ningún like, follow, perfil público navegable. La comunidad existe para descubrir lo que otros toman, no para competir.
- **Editorial sobre técnico**: tipografía serif para títulos (DM Serif Display), mood cards visuales en lugar de tablas, tagline italic-olive como marca de identidad.
- **Privado por defecto + comunidad opcional**: el usuario decide qué llevar al público. La acción de "compartir a comunidad" tiene un confirm explícito de privacidad la primera vez para evitar sorpresas.
- **Atribución denormalizada en lugar de joins**: para cada item compartido a comunidad, `authorName` y `authorPhotoURL` se denormalizan en el doc — evita N lecturas extra en el feed sin necesitar Cloud Functions.
- **Polish editorial transversal**: cada hero usa el patrón "Tus [palabra-clave-italic-olive]" para coherencia visual entre todas las pantallas ("Mi colección", "Tus catas", "La comunidad").

## Arquitectura

Diseñado para correr cómodamente en el plan gratuito de Firebase y Vercel — incluso con un par de cientos de usuarios activos. El feed comunitario hace queries directas a Firestore con índices compuestos (sin Cloud Functions, sin colección agregada todavía). La arquitectura es deliberadamente simple: SSR off, PWA con service worker para offline, sin colas ni workers externos.

Todo el modelo de visibilidad (privado / amigos / comunidad) vive en reglas de Firestore que verifican `userId`, `sharedWith[]` y `visibility == 'community'` en una sola función reusable.

## Pre-lanzamiento

Lo que se cerró antes de abrir la beta:

- Páginas legales (Términos + Política de Privacidad) alineadas con Ley 1581 de Colombia.
- Sentry observando errores con privacy-first (sin PII, ignore de ruido común).
- GA4 con pageviews entre rutas y 10 eventos custom mapeando embudos clave.
- SEO con Open Graph completo + JSON-LD WebApplication.
- Polish editorial en todas las pantallas con sistema consistente.
- Cancelación de cuenta desde la app (borrado en cascada inmediato).
- PWA install banner con flujos diferenciados Android/iOS/desktop.

## Hecho por

Alfredo José Romero Morales — KurodaCafe. Sorbo nació de un problema propio: tomar demasiados naturales colombianos y querer recordarlos todos. Cada decisión de UX viene de ese ritual diario real.

[sorbo.app](https://sorbo.app) · [@kurodacafe](https://instagram.com/kurodacafe)
