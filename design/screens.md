# Sorbo · Pantallas

Spec layered de las 28 pantallas para llevar al Figma. Cada pantalla incluye:
estructura de frame, tokens usados, componentes que aparecen, y estados.

## Convención de frames

- **Mobile**: `390 × auto` (iPhone 15 Pro)
- **Tablet**: `768 × auto`
- **Desktop**: `1280 × auto` (max-content `1200px`)

Salvo que se indique, todas las pantallas autenticadas viven dentro del layout
default que tiene:

- **Mobile**: `TabBar` fijo abajo (5 items) + `NotificationBell` en header
- **Desktop lg+**: `Sidebar` 240px a la izquierda + sin TabBar

Padding-x consistente: `[spacing.md]` (16) mobile · `[spacing.xl]` (40) lg · `[spacing.2xl]` (64) xl.

---

## Patrón base: Page header

Reutilizable en ~20 pantallas. Conviene hacerlo componente Figma.

```
┌─────────────────────────────────────────────┐
│ ─ EYEBROW · COUNT          [🔖] [🔔] [👤]   │  <- top row mobile only
├─────────────────────────────────────────────┤
│                                             │
│  Mi colección                               │  <- display-l/xl
│      ↑italic olive↑                         │
│                                             │
│  Subtitle italic con contexto.              │  <- subtitle-italic
│                                             │
└─────────────────────────────────────────────┘
```

- **Top row mobile**: eyebrow `[typography.eyebrow]` color `[color.moss-soft]` izquierda;
  derecha: bookmark icon → wishlist (32×32 pill `[color.surface-2]`) + NotificationBell + Avatar
- **Hero title**: `[fontFamilies.display]` 40→48→64px responsive, color `[color.moss]`, palabra clave en `italic [color.olive]`
- **Subtitle**: `[typography.subtitle-italic]`
- **Margen entre header y contenido**: `[spacing.lg]`

---

## Flow 1 — Landing & Auth (públicos)

### `/` · Landing (`pages/index.vue`)
Página pública, layout false, sin auth.

- **Section hero**: bg `[color.paper]`, hero `[typography.display-xl]` con highlight italic olive, subtitle, dos CTAs (primary "Crear cuenta", ghost "Ya tengo")
- **Section features**: 3 cards con `[color.surface]` + eyebrow + título + descripción
- **Section comunidad** (post-Tier 2): describe Explora sin mecanismos de red social
- **Section how-it-works**: 3 pasos numerados con ilustraciones
- **Section CTA final**: HeroCard jungle ocupando todo el ancho
- **Footer**: minimal, fondo `[color.paper]`, links small caps mono
- **JSON-LD + OG tags**: ya en código, no afecta diseño

### `/login` · Login (`pages/login.vue`)
- **Width container**: max 420px centrado
- **Top**: Logo "Sorbo." centrado, eyebrow "— ENTRAR"
- **Form** (gap `[spacing.lg]`):
  - Input email (label "EMAIL")
  - Input password (label "CONTRASEÑA")
  - Link "Olvidé mi contraseña" — `[typography.eyebrow]` color `[color.moss-soft]`
- **CTA primary block**: Button "Entrar" + divider mono "o" + Button secondary con Google icon
- **Footer**: "¿No tenés cuenta? Crear una" — link olive

### `/register` · Registro (`pages/register.vue`)
Mismo layout que login con campos adicionales:
- Input nombre
- Input email
- Input password
- Checkbox términos (acepto + link a /terms)
- Botón "Crear cuenta"

### `/terms` y `/privacy`
- **Layout false, auth false**
- **Container**: max 720px
- **Tipografía**: títulos `[typography.display-m]`, body `[typography.body]`
- **Sección dividers**: 1px `[color.moss]` 10%
- **robots: noindex**

---

## Flow 2 — Dashboard

### `/app` · Dashboard (`pages/app/index.vue`)

```
┌─────────────────────────────────────────────┐
│ ─ BUENOS DÍAS, ALFREDO    [🔔] [👤]         │
├─────────────────────────────────────────────┤
│  MAR · 03 · JUN · 2026   ←mono-data         │
│                                             │
│  Tu diario de                               │  <- display-xl con italic honey
│  cafés y sorbos                             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─ HERO CARD jungle ─────────────────┐    │
│  │ — REGISTRAR                         │    │
│  │ Añadir un nuevo café         [→]    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ Quick row 2 cols ──────────────────┐   │
│  │ [Cata]      [Receta]                │   │  <- QuickCards
│  └─────────────────────────────────────┘   │
│                                             │
│  ─ TU ÚLTIMA CATA                           │
│  ┌─ MoodCard ──────────────────────────┐   │
│  │ café · proceso                       │   │
│  │ Nombre del café                     │   │
│  │ Score SCA: 87.5     · 2 días        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ─ ONBOARDING CHECKLIST (si aplica)         │
│  ☐ Añadí tu primer café       [→ /new]      │
│  ☐ Registrá una cata           [→ /new]     │
│  ✓ Probaste compartir un café               │
│                                             │
└─────────────────────────────────────────────┘
```

Componentes: `Eyebrow`, `NotificationBell`, `Avatar`, `HeroCard`, `QuickCard`, `MoodCard`, `OnboardingChecklist`.

Estados extra:
- **Welcome sheet** (`OnboardingWelcome`): aparece full-screen la primera vez (5 slides)
- **Sin catas todavía**: bloque "Tu última cata" no aparece (no flash gracias a `tastingsReady` flag)
- **PWA banner**: `PwaInstallBanner` bottom-fixed si no está instalada y no fue dismissed

---

## Flow 3 — Cafés

### `/app/coffees` · Lista de cafés
Page header standard ("Mi colección" con "colección" italic-olive).

- **Tabs Segmented**: Míos (count) / Compartidos (count)
- **Right side**: Filter button + Sort dropdown (Recientes / Score SCA ↓ / Precio ↑ / Precio ↓ / Nombre A-Z)
- **Active filters chips row** (si hay filtros activos): chips `active` removibles + "limpiar todo" ghost
- **Grid**:
  - Mobile: 1 col gap `[spacing.md]`
  - Tablet: 2 cols
  - Desktop lg+: 3 cols
- **Item**: `MoodCard` con:
  - Eyebrow `proceso · variedad`
  - Name: nombre del café
  - Subtitle: "de [tostador]"
  - Notes chips: notas de sabor (max 3, ellipsis)
  - Score SCA + meta precio/gramaje
  - Blob tone: rotación honey/olive-light/peach según índice
- **Empty state mine**: ilustración café + "Aún no tenés cafés. Añadí el primero." + CTA primary "Añadir café"
- **Empty filtered**: "No hay cafés que coincidan" + ghost "Limpiar filtros"
- **Filters bottom sheet**: Proceso, Variedad, Tostador, País — cada uno con chips selectables

### `/app/coffees/new` · Wizard Crear café
Layout false (sin TabBar). 3 pasos.

```
┌─────────────────────────────────────────────┐
│ [← Volver]                  Paso 1 de 3 ●○○ │
├─────────────────────────────────────────────┤
│                                             │
│  Tu nuevo                                   │  <- display-l
│  ↑café↑ italic olive                        │
│                                             │
│  Subtitle hint contextual                   │
│                                             │
│  [Form fields...]                           │
│                                             │
├─────────────────────────────────────────────┤
│ [Cancelar]              [Siguiente] →       │  <- fixed bottom
└─────────────────────────────────────────────┘
```

**Step 1 · Identidad**
- Input "NOMBRE DEL CAFÉ" (required)
- Select "TOSTADOR" (link inline "+ crear tostador")
- Select "VARIEDAD"
- Select "PROCESO"
- Eyebrow chip "+ AÑADIR PAÍS" → opens country selector

**Step 2 · Origen y compra**
- Country select
- Region / Farm / Producer (todos opcionales)
- Range slider altitude (50–2500 msnm)
- Date picker "FECHA DE TUESTE"
- Date picker "FECHA DE COMPRA"
- Input "DÓNDE LO COMPRÉ" (texto libre — canal de compra)
- Input numérico "PRECIO" + "GRAMAJE"

**Step 3 · Notas y score**
- Input numérico "SCA SCORE" (opcional)
- Multi-select chips "NOTAS DE SABOR" del catálogo
- Textarea "OBSERVACIONES"
- Visibility selector inline (Privado / Amigos / Comunidad)

**Footer fijo**: Cancelar ghost + Siguiente primary (último paso = "Guardar café")

### `/app/coffees/[id]` · Detalle café
- **Top**: Back arrow + nombre del café `[typography.eyebrow-sm]` truncate + ActionMenu (3 dots)
- **Hero MoodCard expanded**: el café como hero, con score y precio destacados
- **Section "— SOBRE EL CAFÉ"** (SpecRow loop):
  - Tostador · País / Región
  - Variedad · Proceso
  - Altitud · Fecha de tueste
  - Compra · Gramaje
- **Section "— NOTAS DE SABOR"**: chips wrap
- **Section "— OBSERVACIONES"**: párrafo `[typography.body]`
- **Sticky actions bar** (mobile bottom, desktop sidebar):
  - Botón primary "Registrar cata"
  - Botón ghost "Compartir"
  - Botón ghost "Editar"

**Estado visitante** (visibility=community, no es del usuario):
- CTA visitante "Guardar a wishlist" (bookmark icon)
- CTA "Duplicar a mi colección"
- Sin botón "Editar"
- Atribución autor: avatar + nombre + fecha relativa

### `/app/coffees/[id]/edit`
Mismo wizard de `new` pero pre-llenado, todas las steps abiertas en una vista scroll (no wizard), footer "Guardar cambios".

---

## Flow 4 — Catas

### `/app/tastings` · Lista de catas
Mismo patrón que cafés con `[typography.display-l]` "Tus catas" (italic-olive en "catas").
Filtros: por café, por método de extracción, por score range.

### `/app/tastings/new` · Wizard cata (3 pasos)

**Step 1 · Setup**
- Coffee selector grande (busca y selecciona el café que estás catando)
- Date picker "FECHA"
- Select "MÉTODO" del catálogo (12 defaults: V60, Aeropress, Chemex, Kalita, etc.)
- Inputs: Dosis (g) · Agua (g) · Tiempo (mm:ss) · Temperatura (°C)
- Input "MOLIENDA" (texto libre o tag)

**Step 2 · Atributos**
- 5 `RatingBar` con `InfoTrigger` al lado del label:
  - Aroma · Acidez · Dulzura · Cuerpo · Retrogusto
- Cada uno con `InfoSheet` educacional

**Step 3 · Sabor y notas**
- Multi-select chips "NOTAS"
- Textarea "OBSERVACIONES"
- Input numérico "TU SCORE" (0–100)
- Visibility selector

### `/app/tastings/[id]` · Detalle cata
- Hero con nombre del café + score grande mono `[typography.display-l]`
- Specs (método, dosis, tiempo, temperatura, molienda) en SpecRows
- Atributos: 5 RatingBars en read-only mostrando los valores
- Notas chips
- Observaciones párrafo
- Actions: Editar / Eliminar / Compartir

---

## Flow 5 — Recetas

### `/app/recipes` · Lista de recetas
Patrón estándar. Eyebrow + "Tus recetas" (italic-olive "recetas").

### `/app/recipes/new` · Wizard receta
- **Step 1 · Identidad**: nombre, método, café asociado (opcional), descripción corta
- **Step 2 · Parámetros**: dosis, ratio, temperatura, molienda, tiempo total
- **Step 3 · Pasos cronometrados**: lista repetible
  - Cada paso: input título + duración (mm:ss) + descripción
  - "+ Añadir paso" ghost
  - Drag handle para reordenar

### `/app/recipes/[id]` · Detalle receta con timer
- Header con título + meta
- Parámetros en SpecRows
- **Timer block** (sticky o hero):
  - Display grande mono `mm:ss`
  - Play / pause / reset buttons
  - Step actual resaltado con `[color.olive]` bg
- **Lista de pasos**: cada paso es row con número + título + duración mono
  - Paso actual: bg `[color.olive]` text `[color.paper]`
  - Paso completado: opacity 50% con check
  - Pasos futuros: default

---

## Flow 6 — Comunidad

### `/app/explore` · Feed comunitario
- Header standard: eyebrow "— COMUNIDAD" + título "La _comunidad_" (italic olive)
- Subtitle: "Lo que otros cafeteros descubren."
- **Segmented**: Todos / Cafés / Catas / Recetas (con counts)
- **Feed**: lista de `ExploreCard` (variante de MoodCard con atribución):
  - Top row: Avatar autor + nombre `[typography.label]` + fecha relativa `[typography.mono-data]`
  - Body: mismo layout que MoodCard según `kind`
  - Footer actions: si es café → bookmark (save to wishlist) + duplicate
- **Empty state**: "Aún nadie publicó nada. Sé el primero." con CTA a `/new`
- **Loading**: 3 mood card skeletons
- **No results filtered**: "Nada en esta categoría."

### `/app/friends` · Amigos
- Header "Tus amistades" (italic olive "amistades")
- 3 tabs Segmented: Amigos / Solicitudes / Buscar
- **Amigos**: lista vertical de FriendChip extendido (avatar 40 + nombre + email + 3-dots menu)
- **Solicitudes**: dos sub-secciones — Entrantes (con Aceptar/Rechazar) + Salientes (con Cancelar)
- **Buscar**: input email + botón "Enviar solicitud"
- **Empty amigos**: "Compartí Sorbo con amigos cafeteros."

### `/app/profile` · Mi perfil público
- Avatar 80px centrado
- Nombre `[typography.display-m]`
- Email `[typography.label]` color `[color.moss-soft]`
- Stats row: # cafés · # catas · # recetas (mono-data)
- "Editar perfil" ghost button
- Public items section (lo que comparto a comunidad)

---

## Flow 7 — Catálogos personalizables

Todas usan el mismo patrón. Misma pantalla, distintos datos:
`roasters`, `varieties`, `methods`, `processes`, `notes`.

### `/app/[catalog]`
- Header: eyebrow del catálogo + título "Tus [item-plural]" (italic olive)
- Subtitle contextual
- **Header right**: Botón primary "+ Añadir" o icono pill
- **Lista**: cards simples con
  - Nombre del item
  - Counter de uso (ej. "usado en 12 cafés")
  - Toggle visible/oculto (para defaults)
  - 3-dots: editar / eliminar (solo customs)
- **Defaults vs Custom**: divider mono "— DEFAULTS DE SORBO" / "— TUS PROPIOS"
- **Inline create**: pequeño form expandible con input + Confirmar
- **Empty**: "Aún no tenés [items]. Los que añadas aparecen acá."

### `/app/wishlist` · Wishlist
Mismo patrón que `coffees` pero con cards de wishlist:
- MoodCard con tone surface-2 (más sutil)
- Action: "Lo conseguí — moverlo a mi colección"
- Empty: "Marcá cafés desde Explora para no perderlos."

---

## Flow 8 — Settings + Notifications

### `/app/settings` · Ajustes
- Header "Ajustes" simple (sin italic-olive)
- **User card top**:
  - Avatar 56 + nombre + email + chip "✓ APP" si está instalado como PWA
- **Sections** (gap `[spacing.2xl]` entre):

  **— PERFIL Y CUENTA**
  - Editar perfil → `/app/profile`
  - Cambiar contraseña

  **— CATÁLOGOS**
  - Tostadores → `/app/roasters`
  - Variedades → `/app/varieties`
  - Métodos → `/app/methods`
  - Procesos → `/app/processes`
  - Notas → `/app/notes`

  **— APP**
  - "Instalar como app" (solo si no está instalada) → abre PWA flow
  - Tema (futuro)

  **— LEGAL**
  - Términos → `/terms`
  - Privacidad → `/privacy`

  **— CUENTA**
  - Cerrar sesión (ghost)
  - Eliminar mi cuenta (text-terracotta, destructive confirm)

- **Item row**: padding `[spacing.md]`, icono 20 izq + label 17px medium + subtitle 12px lowercase + chevron right
- **Section header**: `[typography.eyebrow]` con margin-top `[spacing.2xl]`
- **Section divider**: 1px `[color.moss]` 10%, `last:border-b-0`

### Notifications dropdown
Teleported a body desde `NotificationBell`. Panel `[color.paper]` shadow soft, radius `[borderRadius.card-lg]`, ancho 320px, items con avatar + texto + timestamp.

---

## Pantallas especiales

### Splash (`components/ui/Splash.vue`)
Full-screen overlay. Ver detalle en `components.md`.
- Background moss + radial glow
- Badge "S." con bounce
- Wordmark + byline + mensaje editorial italic rotativo
- Footer dots + label

### Onboarding (`OnboardingWelcome.vue`)
5 slides:
1. **Bienvenida**: "Tu diario de café" — display-xl con italic-olive
2. **Privado por defecto**: explica el modelo de visibilidad
3. **Comunidad opcional**: introduce Explora sin red social
4. **Catálogos personalizables**: muestra los catálogos
5. **Listo**: CTA "Empezar"

Cada slide: ilustración SVG + título + descripción + dots progress + "Saltar"/"Continuar".

---

## Frame inventory para Figma

Te conviene crear una página por flujo. Sugerencia:

| Página Figma actual | Frames a crear |
|---|---|
| Design System (4:2) | Tokens grid, Components, Type ramp, Color palette, Spacing & radii |
| Logo (44:2) | Variaciones del wordmark + mark badge |
| Login and Register | login default, login error, register, recovery |
| Home Page | dashboard default, dashboard con onboarding checklist, dashboard sin catas |
| Cafes | lista mine, lista shared, detalle propio, detalle visitante, wizard 3 pasos, edit, empty, filtered-empty |
| Catas | lista, detalle, wizard 3 pasos |
| Recetas | lista, detalle con timer activo, wizard 3 pasos |
| Wishlist | lista, empty |
| Config | settings principal + Notas + Métodos + Procesos + Variedades + Tostadores + Friends + Profile |
| Landing Page | hero, features, comunidad, how-it-works, CTA final, footer |

Total estimado: ~40 frames bien estructurados cubren toda la app.

---

## Tip final

Cuando diseñes, agarrá los **componentes** primero (los 8 críticos: Button,
Chip, Input, MoodCard, HeroCard, Eyebrow, Segmented, Avatar). Una vez que
tengas esos como Figma Components con variantes, las pantallas se arman
componiendo en auto-layouts en cuestión de minutos.
