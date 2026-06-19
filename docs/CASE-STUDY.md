# Sorbo — Un diario para cada sorbo

> Diseñé y construí una PWA editorial para cataloguar, catar y compartir
> café de especialidad. Producto en producción en `sorbo.app`, gratis,
> sin tracking ni paywall.

— **Live:** [sorbo.app](https://sorbo.app)
— **Tipo:** SaaS solo-developer / proyecto personal en producción
— **Año:** 2026
— **Rol:** Producto, diseño, ingeniería, marketing — todo

---

## El problema

La gente que toma café de especialidad lo trata como un objeto cultural,
no solo una bebida. Comparte recetas, anota notas en taza, compara
tostadores, descubre orígenes. Pero las herramientas para hacerlo
están rotas:

- **Hojas de Excel**: precisión sin alma. No invita a registrar.
- **Notion / Apple Notes**: flexible pero sin estructura — cada cata
  termina con un formato distinto y no puedes comparar.
- **Apps de specialty existentes**: o son brick-and-mortar (cafetería
  específica), o son cuadernos de barista demasiado técnicos, o son
  social media disfrazado de tracker.

El espacio entre "Excel triste" y "Instagram con etiquetas" estaba
vacío. **Sorbo es la herramienta para el cafetero que disfruta del
ritual sin querer convertirse en barista profesional.**

---

## Lo que construí

Una PWA mobile-first con tres capas:

**1. Catálogo personal.** Registra cafés, catas (con scoring SCA),
   recetas (con timer de extracción), wishlist. Todo bajo tu
   colección privada por default.

**2. Visibilidad granular.** Cada item (café, cata, receta) tiene
   tres niveles: privado, amigos (UIDs explícitos), comunidad.
   El usuario decide qué expone, ítem por ítem.

**3. Comunidad editorial.** Página *Explora* con un feed de los
   items que la comunidad marcó como community. Filtros por tipo,
   guardar a wishlist, duplicar a tu colección.

Encima de eso, un cuarto pilar en desarrollo (`el-vertido` branch):
un flow guiado de preparación que reemplaza al wizard tradicional —
café → método → receta → ajuste → cronómetro → cierre, con un lenguaje
visual editorial que rompe con la estética app-de-cocina (sin
progress dots, paleta que evoluciona por stage, tipografía heroica,
inversión cromática a paper en el cierre como "umbral cruzado").

---

## Stack y decisiones técnicas

| Capa | Tecnología | Por qué |
|---|---|---|
| **Framework** | Nuxt 3 (Vue 3 Composition API, TypeScript) | SSR off, static preset. Build estático para Vercel free tier. |
| **Persistencia** | Firebase Firestore | NoSQL, security rules declarativas, tier gratuito generoso. |
| **Auth** | Firebase Auth (email + Google) | Cero infra. |
| **Storage** | Firebase Storage | Para imágenes de cafés y avatares. |
| **PWA** | `@vite-pwa/nuxt` | Instalable en iOS/Android/Desktop, manifest customizado. |
| **Estilos** | Tailwind CSS + tokens custom | Sistema de diseño propio (paper / moss / honey / olive / jungle). |
| **Tipografía** | DM Serif Display + Geist + JetBrains Mono | Editorial > UI genérica. |
| **Observabilidad** | Sentry (errores) + GA4 (eventos custom) | Free tiers, suficiente para pre-launch. |
| **Hosting + DNS** | Vercel + dominio gestionado en Vercel | Cero fricción, deploy on push. |

**Restricciones que moldearon el producto:**

- **Sin Cloud Functions** (Spark tier de Firebase). Todo el cómputo
  vive en el cliente o en queries de Firestore. Esto forzó denormalización
  agresiva (denormalizar `coffeeName`/`roasterName` en `Tasting` para
  evitar joins en el render, denormalizar `authorName`/`authorPhotoURL`
  al compartir a comunidad para que el feed no haga N+1 lookups).
- **Sin backend custom.** Las reglas de Firestore son el único enforcer
  de visibilidad y autorización. Reescribirlas para los 3 niveles de
  visibilidad fue uno de los hitos del proyecto.

---

## Sistema de diseño

Definí un lenguaje visual editorial, antagónico al SaaS genérico:

- **Paleta de "verde finca"**: paper (#F4F2EB), moss (#2F3528),
  jungle (#141712), honey (#E5B84B), olive (#556B3A), terracotta para
  estados críticos.
- **Tipografía con personalidad**: DM Serif Display *italic* para
  títulos clave + JetBrains Mono uppercase con tracking `0.14em` para
  eyebrows + Geist sans para body.
- **Tokens** sincronizados entre `tailwind.config.ts`, `main.css` con
  CSS vars (`--paper-rgb: 244 242 235`) para soportar opacity modifiers,
  y `figma-variables.json` para handoff de diseño.
- **Átomos reusables**: `UiInput`, `UiButton`, `UiBottomSheet`,
  `UiHeroCard`, `UiEyebrow`, `UiAvatar` — todos con variantes
  documentadas.
- **Detalle editorial**: punto final en títulos (`Rock.`, `Catas.`)
  como recurso de marca, *em italic* selectivo en olive para
  enfatizar una palabra clave por bloque.

---

## Decisiones de producto destacadas

### "El fondo es el tiempo" (El Vertido)

Para el flow guiado de preparación, en vez de poner una barra de
progreso encima de las 6 pantallas, el **color del fondo evoluciona**:
jungle frío → amber concentrado → paper en el cierre. La pantalla
misma dice dónde estás. El cierre rompe a paper claro como "umbral
cruzado", único stage iluminado del flujo.

### "Marca" en vez de "Tostador"

Feedback de usuarios reveló que el campo "Tostador" del wizard de
café era demasiado específico — muchas marcas comerciales no tuestan
el café que venden (resellers, cafés tienda). Renombré el concepto a
**"Marca"** (más amplio, lo que leés en la bolsa), lo hice opcional,
y agregué un flag `roasts?: boolean` en la entidad. Las marcas
marcadas como tostadores muestran un badge sutil "Tuesta su café".
Cero migración de datos.

### Tres niveles de visibilidad por item

En vez del binario público/privado típico, cada item de Sorbo tiene
**tres niveles**: privado (default), amigos (UIDs explícitos en
`sharedWith`), o comunidad (feed público). Las reglas de Firestore
enforcen los tres niveles vía pares de queries — el feed comunidad
filtra `visibility == 'community'`, el de amigos hace `where in [...]`.
Esto convirtió a Sorbo en algo a medio camino entre Strava y un
diario privado.

### Author Intent en recetas

Para resolver el cold-start del algoritmo de recomendación, las
recetas pueden declarar el perfil de café para el que fueron
diseñadas (proceso, banda de tueste, clase de flavor). Esta señal
explícita pesa más que el aprendizaje colaborativo — porque es
intencional. Las recetas community muestran inline en su detalle
"Diseñada para café lavado de tueste claro con notas frutales",
convirtiendo el campo en discovery orgánico.

---

## Lo más difícil

- **Modelo de visibilidad de 3 niveles**, retroactivo. Documentos
  antiguos sin el campo `visibility` se tratan como `private`.
  Las reglas de Firestore tuvieron que soportar el caso ausente
  sin migración.
- **Hacer que el Vertido se sintiera ceremonial** y no como un
  wizard de cocina. Pasaron tres iteraciones — la primera fue
  un clon de Aura Brew (rechazado por demasiado literal), la segunda
  un MVP funcional pero "técnico", la tercera el rediseño editorial
  basado en propuesta de Claude Design (ver `design/el-vertido.md`).
- **Tier gratuito de Firebase Spark** sin Cloud Functions me obligó
  a mover lógica al cliente y aceptar que la magia (algoritmo de
  Affinity Score, etc.) tenía que ser computable en tiempo de query
  o como background job ocasional.

---

## Estado actual

- ✅ Tier crítico completado: catálogo, catas, recetas, wishlist,
  comunidad, friends, settings, onboarding, PWA installable.
- ✅ Legal: términos de uso + política de privacidad + cancelación
  de cuenta desde la app.
- ✅ Observabilidad: Sentry + GA4 con 10 eventos custom estratégicos.
- ✅ Landing pública convertida en home oficial con registro inline.
- 🚧 En desarrollo: El Vertido (rama `el-vertido`, archivada
  documentada en `design/el-vertido-STATUS.md`).
- 🔮 Próximo: Affinity Score (motor de recomendación), versión Lite
  pública en `pour.sorbo.app`, treatment full-bleed desktop del Vertido.

---

## Aprendizajes

1. **El branding hace el producto.** La diferencia entre Sorbo y una
   hoja de Excel es la misma información — pero el lenguaje editorial
   convierte el acto de registrar en algo que dan ganas de hacer.
2. **Decir que no.** Resistí la tentación de meter feeds infinitos,
   notificaciones push agresivas, gamificación. Sorbo es un cuaderno,
   no una red social. La frontera con TikTok-for-coffee es donde
   muere el producto.
3. **Restricciones liberan.** El Spark tier me forzó a denormalizar
   y aceptar consistencia eventual donde una arquitectura "correcta"
   habría requerido infraestructura. El resultado es más simple,
   más barato, y suficientemente bueno.
4. **Diseñar con un colaborador AI.** Trabajé el rediseño del Vertido
   en paralelo con Claude Design (propuestas visuales) y Claude Code
   (implementación). El handoff entre los dos —especialmente la
   auditoría de átomos visuales construidos previamente— fue uno de
   los hitos más productivos del proyecto.

---

## Métricas

— **Líneas de código:** ~25k entre Vue, TypeScript, CSS
— **Componentes Vue:** ~90 (~30 átomos `Ui*`, ~60 específicos)
— **Páginas:** 27
— **Tiempo:** ~6 meses de tardes y fines de semana
— **Costo de infra:** $0/mes (Spark tier Firebase + Vercel free)

---

## Stack visual

```
Paper #F4F2EB   ──┐
Surface #E4E3D2   │  fondo cálido editorial
Moss #2F3528      │  texto principal · fondos oscuros
Jungle #141712    │  el negro del producto
Honey #E5B84B     │  acento + CTAs + highlight italic
Olive #556B3A     │  italic + accents secundarios
Terracotta #C14A3A│  errores
                  ─
DM Serif Display  → títulos clave, italic editorial
Geist             → UI sans, lecturable
JetBrains Mono    → eyebrows, datos, prefijos "—"
```

---

— Sorbo es un proyecto personal. La estética, las decisiones de
producto y la implementación son todo lo opuesto al "MVP genérico de
React + dashboard": es un caso de estudio de cómo el cuidado en cada
capa hace la diferencia entre una herramienta más y una herramienta
que **se siente**.
