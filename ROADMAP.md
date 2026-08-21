# Sorbo — Roadmap

> Documento vivo. Última actualización: 25 jun 2026.
> Producto en producción: [sorbo.app](https://sorbo.app)

---

## Estatus del proyecto

| | |
|---|---|
| **Etapa** | Producción · post-soft-launch |
| **Branch principal** | `main` (deploy continuo a Vercel) |
| **Branch archivada** | `el-vertido` (rediseño completo, ver [`design/el-vertido-STATUS.md`](design/el-vertido-STATUS.md)) |
| **Stack** | Nuxt 3 · Vue 3 · TypeScript · Tailwind · Firebase Spark · Vercel free |
| **Costo de infra** | $0/mes |
| **Equipo** | Solo developer (KurodaCafe) |
| **Métodos soportados** | 12 métodos de extracción |
| **Idioma** | Español (es-ES) |

---

## Lo que está

### Core del producto

- [x] Catálogo personal: cafés, catas, recetas, wishlist
- [x] CRUD completo con wizards de creación de 3 pasos
- [x] **Marcas** (renombrado de "tostadores") — opcional, con flag `roasts` para distinguir tostadores vs resellers/tiendas
- [x] **Modelo de visibilidad de 3 niveles** por item (privado · amigos · comunidad)
- [x] Sistema de scoring SCA (0-100) para cafés + sistema editorial (0-10) para catas
- [x] Recetas con timeline de steps + temporizador integrado
- [x] Catálogo de variedades, métodos, procesos

### Comunidad

- [x] Página `/app/explore` con feed comunitario
- [x] Filtros por tipo (catas / cafés / recetas)
- [x] Guardar a wishlist desde feed
- [x] Duplicar a mi colección (cafés y recetas)
- [x] Sistema de amigos (UIDs explícitos en `sharedWith`)
- [x] Perfiles públicos con catas community

### Auth + Onboarding

- [x] Email + password (Firebase Auth)
- [x] Google Sign-In
- [x] Onboarding checklist post-registro
- [x] Welcome sheet primera vez
- [x] Cancelación de cuenta desde la app + borrado completo de datos
- [x] Política de Privacidad + Términos de Uso

### PWA

- [x] Installable en iOS, Android, macOS, Windows
- [x] Manifest custom con icons + theme color
- [x] Service worker con Workbox (cache de fonts + assets)
- [x] Banner de install (Android nativo + iOS con instrucciones)
- [x] Status bar negra translucent en iOS

### Observabilidad

- [x] Sentry (errores en producción)
- [x] Google Analytics 4 con 10 eventos custom estratégicos
- [x] Sin tracking de terceros pesado

### Landing / SEO

- [x] **Landing convertida en home oficial** con registro inline (no más waitlist)
- [x] SSR habilitado para páginas públicas + SPA para `/app/**` y auth
- [x] JSON-LD `@graph` con SoftwareApplication + WebSite + Organization
- [x] Sitemap autogenerado (`@nuxtjs/sitemap`)
- [x] `llms.txt` para AI engines
- [x] `robots.txt` con reglas explícitas para GPTBot/ClaudeBot/PerplexityBot
- [x] Sección FAQ optimizada para extracción AI
- [x] Página `/about` con AboutPage + Person schema
- [x] OG image actualizada ("EN VIVO · GRATIS", sin "BETA PRIVADA")
- [x] Mobile hamburger nav con panel completo
- [x] Splash screen reducido (1500ms → 300ms para no penalizar LCP)
- [x] Meta tags + OG + Twitter Cards completos

### Sistema de diseño

- [x] Tokens: paper / surface / moss / jungle / honey / olive / terracotta
- [x] Tipografías: DM Serif Display + Geist + JetBrains Mono
- [x] Átomos UI documentados: Input, Button, BottomSheet, HeroCard, Eyebrow, Avatar, Chip, etc.
- [x] Tokens sincronizados entre Tailwind config + CSS vars + figma-variables.json
- [x] Mobile-first responsive en todas las pantallas

### Polish UX

- [x] Skeleton screens en listas
- [x] Haptic feedback en mobile
- [x] Long-press en cards → action menu
- [x] Swipe entre tabs del TabBar mobile
- [x] Transiciones page + layout coordinadas
- [x] Wizards con slide-up animation distintivo

### Documentos

- [x] Diseño del Vertido completo: [`design/el-vertido.md`](design/el-vertido.md)
- [x] Caso de estudio para portafolio: [`docs/CASE-STUDY.md`](docs/CASE-STUDY.md)
- [x] Estado de la rama Vertido: [`design/el-vertido-STATUS.md`](design/el-vertido-STATUS.md)

---

## En qué vamos

Acabamos de cerrar una **ronda completa de UX / a11y** para atacar el
feedback recurrente "es complicada". Estado por tier del
[`UX-IMPROVEMENT.md`](docs/UX-IMPROVEMENT.md):

- **Tier 1 activación** ✅ dashboard · welcome · checklist · TabBar/layout
- **Tier 2 core loop** ✅ los 3 wizards (coffee · tasting · recipe) — ⏳ 3 detalle pages
- **Tier 3 listas** ✅ 4 pantallas con `UiListSearch`
- **Tier 4 secundarias** ✅ wishlist · roasters · friends (búsqueda condicional)
- **Tier 5 catálogos** — mantenidos, pattern activo/inactivo funciona

**A11y score**: 18/20 Excellent (post `/impeccable audit`). Focus-visible
global, touch targets ≥44px en toda la app, gradientes tokenizados.

**Bugs recientes cerrados**:
- ShareSheet + Confirm ya no compitiendo por z-50 (Confirm ahora `layer="overlay"` = z-60)
- Notas custom del wizard ahora se persisten al catálogo (`settings.addFlavorNote`)
- Input "+ propia" ahora recibe focus al abrir (ref + nextTick, no HTML autofocus)
- `useCatalog` hidrata `settings.prefs` automáticamente en cliente

**Nuevos átomos** salidos de la ronda:
- `UiListSearch` (usado en 4 pantallas)
- `QuickCard.hint` prop
- `HeroCard.subtitle` visible en mobile
- `UiBottomSheet.layer` prop ('base'/'overlay')
- `BREW_METHOD_DESCRIPTION` en `utils/constants`

### Ronda anterior (SEO)

Cerrado el 22 jun. `ssr:true` con routeRules, JSON-LD `@graph`, sitemap,
llms.txt, robots.txt con AI bots, FAQ, /about con Person schema, OG
image corregida, hamburger mobile.

---

## Lo que sigue

### Próximos 7 días — quick wins

- [ ] **Detalle pages (tier 2)** — `coffees/[id]`, `tastings/[id]`, `recipes/[id]`. Ahí vive el "acabo de guardar mi cata, ¿ahora qué?" — sin next action clara, sin editar rápido.
- [ ] **Re-auditar SEO** con `/claude-seo-ai:audit` para confirmar el salto
- [ ] **Screenshots reales** de la app (dashboard, explora, detalle café) como `<img>` con alt descriptivo. Reemplazaría los mockups CSS de la landing en al menos un sitio para que crawlers vean imágenes.
- [ ] **Testimoniales** — 2-3 quotes reales de usuarios para social proof
- [ ] **Bio definitiva** en `/about` (hoy es placeholder editable)
- [ ] **GBP / Google Search Console** — verificar dominio y enviar sitemap

### Próximas 2-4 semanas — Vertido (descongelar la rama)

La rama `el-vertido` quedó archivada al ~70% del scope. Para retomarla, el orden de prioridades:

1. **Persistir `RitualOutcome`** — hoy todo es en memoria; debe escribir a Firestore (`ritualOutcomes/{uid}/...`) para alimentar el algoritmo
2. **Author Intent en wizard de receta** — campo `designedFor` + sub-colección privada `inspirations`
3. **Cronómetro lee `steps` reales** de la receta (hoy tiempos hardcodeados)
4. **Modo "nota rápida"** del stage CIERRE (sheet minimal en vez del wizard completo)
5. **Affinity Score** — reemplazar stubs (`suggested: 'v60'`, top match plano) con el algoritmo del [`design/el-vertido.md`](design/el-vertido.md) §4.6
6. **Recetas de la comunidad** como cuarta categoría en StageRecipe
7. **Tratamiento full-bleed desktop** del Vertido (hoy es columna 640px max)

### Próximas 1-2 meses — Sorbo Pour (versión Lite pública)

- [ ] Subdominio `pour.sorbo.app`
- [ ] Layout `lite.vue` sin Firebase (todo cliente, sin auth)
- [ ] Manifest PWA dedicado (`brew-manifest.json`)
- [ ] Funnel a la app completa al final del ritual

---

## Posibles mejoras (backlog blue-sky)

### Producto

- [ ] **Búsqueda global** estilo cmd+K (especialmente útil cuando una colección crece a 100+ cafés)
- [ ] **Stats / insights** mensuales y anuales (cafés del mes, score promedio, método más usado, etc.)
- [ ] **Backup / export** de datos del usuario (JSON descargable)
- [ ] **Notificaciones push** opcionales — recordatorios suaves ("hace 7 días que no registras una cata")
- [ ] **Recipe public sharing** con OG card por receta individual
- [ ] **Modo claro / oscuro** explícito (hoy es claro forzado)
- [ ] **Multi-idioma** (i18n) — empezar por inglés
- [ ] **Pinned coffees** + smart suggestions (hora del día, último café cateado)
- [ ] **Importador** desde otras apps (Coffee Notes, Brewfather, etc.)

### Inteligencia

- [ ] **Affinity Score collaborative** — capa colaborativa real entre usuarios
- [ ] **Recomendación de cafés** según historial
- [ ] **Detección de "favoritos"** automática (cafés con score >9 + repetidos)

### Distribución

- [ ] **TWA (Trusted Web Activity)** para listar en Google Play Store
- [ ] **iOS App Store** vía PWA wrapper (Capacitor / similar)
- [ ] **Página /press** o `/kit` con assets de marca para reseñas
- [ ] **Newsletter** opcional (separado del registro)

### Comunidad

- [ ] **Compartir desde la app a sistemas externos** (IG Stories, Twitter, WhatsApp)
- [ ] **Comentarios** en items community (con moderación básica)
- [ ] **Tostadores verificados** — claim de marcas por sus dueños
- [ ] **Eventos** (catas grupales, cuppings públicos)

### Técnico

- [ ] **Test suite** — hoy hay cero tests automatizados
- [ ] **CI básico** — typecheck + build en PRs
- [ ] **Performance budget** automatizado (Lighthouse CI)
- [ ] **Accesibilidad WCAG 2.2 AA audit** completo
- [ ] **Monitoreo de costos** Firebase (alertas si se acerca al límite del Spark)

---

## Estatus técnico

### Métricas del repo

- ~90 componentes Vue (~30 átomos `Ui*`, ~60 específicos)
- 27 páginas
- ~25k líneas entre Vue + TypeScript + CSS

### Decisiones arquitectónicas vigentes

- **No Cloud Functions** — todo el cómputo es cliente o queries. Forzó denormalización agresiva.
- **No backend custom** — Firestore Security Rules son el único enforcer.
- **Mobile-first** — desktop es responsive del mobile centrado, excepto Home y Cafés Lista que tienen layout dedicado.
- **PWA, no nativa** — install via browser, sin tiendas de apps.

### Branches activas

- `main` — production
- `el-vertido` — archivada con doc de estado

### Pendientes técnicos identificados

- ⚠️ Sin tests automatizados — riesgo creciente conforme se agregan features
- ⚠️ Sin CI/CD validation pre-merge
- ⚠️ Sentry cuota gratuita podría llenarse si se escala
- ⚠️ Firestore Spark tier tiene límite de 50k reads/día — habrá que monitorear conforme crezca la base de usuarios

---

## Notas operativas

### Cómo deployar

`git push origin main` → Vercel detecta el push y deployea automático. Sin pasos manuales.

### Cómo regenerar el OG image

```bash
./scripts/render-og-image.sh
```

Requiere Google Chrome instalado. Lee `public/og-image.svg`, lo renderiza en Chrome headless con Google Fonts cargadas, y produce `public/og-image.png` a 1200×630.

### Cómo retomar `el-vertido`

```bash
git checkout el-vertido
npm run dev
# Visita /app/vertido o /dev/vertido-atoms (sandbox de átomos visuales)
```

Ver `design/el-vertido-STATUS.md` para el detalle de qué falta.

---

— Mantenido por [@kurodacafe](https://instagram.com/kurodacafe) · `info@sorbo.app`
