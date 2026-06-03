# Sorbo · Componentes UI

Spec layered de los 29 componentes en `components/ui/`. Todos los valores
hacen referencia a tokens de `tokens.json` (importable en Figma con Tokens Studio).

Notación: `[token.path]` = referencia al token correspondiente.

---

## Foundations

### `Eyebrow.vue`
Prefijo mono caps con guion. Aparece sobre títulos y como label de filas.

- **Anatomy**: `— LABEL` (em-dash + space + texto)
- **Tipografía**: `[typography.eyebrow]`
- **Color**: `[color.moss-soft]` (default), `[color.moss]` (tone moss), `[color.olive]` (tone olive), `[color.paper]` (tone paper)
- **Variants**: `bare` (sin em-dash), `size` (xs 10px / sm 13px)

### `Logo.vue`
"Sorbo." en DM Serif con dot honey. Usado en sidebar/footer/landing.

- **Tipografía**: `[fontFamilies.display]` 32px o 40px según contexto
- **Glyph dot**: `[color.honey]`
- **Color**: `[color.moss]` (por defecto sobre paper) o `[color.paper]` (sobre moss/jungle)

---

## Inputs / Forms

### `Input.vue`
Input con label flotante mono caps + border-bottom underline. Sin border-radius.

- **Estructura**: `flex flex-col gap-xs pt-[14px] pb-[13px] border-b`
- **Label**: `[typography.eyebrow]` color `[color.moss-soft]` con em-dash
- **Valor**: `[typography.input-value]` (DM Serif 18px), color `[color.moss]`
- **Placeholder**: `[fontFamilies.display]` italic, color `[color.moss-ghost]`
- **Border-bottom**: 1px
  - `[color.moss]` opacity 10% (default)
  - `[color.moss]` (focus o con valor)
  - `[color.terracotta]` (error)
- **Error**: párrafo bajo el input, `[typography.eyebrow]` color `[color.terracotta]`
- **Password**: `[fontFamilies.mono]` 18px tracking 0.3em

### `Button.vue`
Variants: `primary` / `dark` / `ghost` / `secondary`. Sizes: `md` / `sm`.

| Token | primary | dark | ghost | secondary |
|---|---|---|---|---|
| Background | `[color.olive]` | `[color.moss]` | transparent | `[color.surface-2]` |
| Text | `[color.paper]` | `[color.paper]` | `[color.moss]` | `[color.moss]` |
| Hover bg | `[color.olive-dark]` | `[color.jungle]` | `[color.surface-2]` | `[color.surface]` |
| Border | – | – | – | 1px `[color.moss]` 10% |
| Radius | `[borderRadius.cta]` | `[borderRadius.cta]` | `[borderRadius.cta]` | `[borderRadius.card-sm]` |

- **md**: alto 46px, padding-x `[spacing.md]`, `[typography.button-md]`
- **sm**: alto 38px, padding-x `[spacing.sm]`, `[typography.button-sm]`
- **Gap interno** (icono + texto): `[spacing.xs]`
- **Disabled**: opacity 50%
- **Loading**: spinner circular 12×12 con `border-current border-t-transparent`

### `Chip.vue`
Pill mono caps. Variants: `default` / `active` / `ghost` / `honey`.

| Token | default | active | ghost | honey |
|---|---|---|---|---|
| Background | `[color.surface-2]` | `[color.olive]` | transparent | `[color.honey]` |
| Text | `[color.moss]` | `[color.paper]` | `[color.moss-soft]` | `[color.jungle]` |
| Border | – | – | 1px `[color.moss]` 20% | – |

- **Default**: alto 25px, padding-x `[spacing.sm]`, `[typography.chip]`
- **Compact**: alto 22px, padding-x `[spacing.sm]`, `[typography.chip-compact]`
- **Radius**: `[borderRadius.pill]`
- **Gap interno** (icono + texto): `[spacing.xxs]`

### `Segmented.vue`
Filtro horizontal estilo tabs pill.

- **Item activo**: bg `[color.surface-2]`, text `[color.moss]`
- **Item inactivo**: text `[color.moss-soft]` → hover `[color.moss]`
- **Padding**: `[spacing.md]` horizontal, 8px vertical
- **Tipografía**: `[typography.chip]`
- **Radius**: `[borderRadius.pill]`
- **Gap entre items**: `[spacing.xxs]`
- **Counter**: opcional, opacity 70% con separador "·"

---

## Cards

### `MoodCard.vue`
Card editorial con eyebrow + nombre serif + subtitle italic + score + blob decorativo.

- **Background**: `[color.surface]`
- **Radius**: `[borderRadius.card-lg]`
- **Padding**: `[spacing.md]` (compact) o `[spacing.md]` → `[spacing.lg]` (default)
- **Gap vertical interno**: `[spacing.sm]`
- **Blob decorativo**: círculo 160×160 absolute top-right -12/-12
  - Tone `honey`: `[color.honey]` opacity 70%
  - Tone `olive-light`: `[color.olive-light]` opacity 60%
  - Tone `surface-2`: `[color.surface-2]`
  - Tone `peach`: `[color.terracotta]` opacity 40%
- **Eyebrow**: `[typography.eyebrow]` con guion
- **Name** (slot principal): `[typography.display-l]` o `[fontSize 28px]` en compact
- **Subtitle italic**: `[typography.subtitle-italic]`
- **Notes slot**: chips `compact` con `flex-wrap gap-xxs`
- **Score**: eyebrow "SCORE SCA" + número `[fontFamilies.display]` 32px (default) / 24px (compact)
- **Meta**: `[typography.mono-data]` color `[color.moss-soft]`
- **Hover**: `translateY -2px` en `[motion.duration-default]`

### `HeroCard.vue`
Card oscuro CTA principal (dashboard "Añadir café", etc.).

- **Background**: `[color.jungle]`
- **Text**: `[color.paper]`
- **Radius**: `[borderRadius.card-lg]`
- **Padding**: `[spacing.md]` / `[spacing.lg]` / `[spacing.xl]` (responsive)
- **Eyebrow**: `[typography.eyebrow]` color paper 60%
- **Título**: `[fontFamilies.display]` 28→32→44→52px (responsive), color `[color.paper]`
- **Subtitle** (lg+ only): italic 14→16px, color paper 70%
- **CTA arrow badge**:
  - Pill 40→48→64px circular
  - Background `[color.honey]`
  - Icono `lucide:arrow-right` color `[color.jungle]` 20→24px

### `QuickCard.vue`
Variante más pequeña de HeroCard para acciones secundarias.

- **Background**: `[color.surface]` o `[color.surface-2]`
- **Radius**: `[borderRadius.card]`
- **Padding**: `[spacing.md]`
- **Hover**: translateY -1px

### `SpecRow.vue`
Fila etiqueta ←→ valor con border-bottom para tablas de specs (detalle de café).

- **Layout**: `flex justify-between items-baseline gap-md py-md`
- **Border-bottom**: 1px `[color.moss]` 10% (a menos que `bare`)
- **Label**: `[typography.eyebrow]` color `[color.moss-soft]`, sin guion
- **Valor**: `[typography.label]` color `[color.moss]`, alineado a la derecha

### `RatingBar.vue`
Barra editorial para atributos de cata (aroma, acidez, cuerpo).

- **Track**: alto 4px, bg `[color.moss]` 8%, radius `[borderRadius.pill]`
- **Fill**: bg `[color.olive]`, mismo radius
- **Knob** (drag): círculo 16px, bg `[color.paper]`, ring 2px `[color.olive]`
- **Label arriba**: `[typography.eyebrow]` + InfoTrigger opcional al lado
- **Valor a la derecha del label**: `[typography.mono-data]`
- **Escala**: 0–10 con tick marks opcionales

### `ProgressBar.vue`
Genérica (loading / progress de wizard).

- **Track**: alto 3px, bg `[color.moss]` 8%
- **Fill**: bg `[color.olive]`, radius `[borderRadius.pill]`

---

## Navigation

### `TabBar.vue`
Bottom navigation mobile. 5 items: Inicio / Explora / Cafés / Catas / Recetas.

- **Container**: fixed bottom, `[color.paper]` 95% con backdrop-blur-md
- **Border-top**: 1px `[color.moss]` 10%
- **Padding**: `[spacing.md]` horizontal, `[spacing.sm]` vertical
- **Safe-area-inset-bottom**: respetar (iOS)
- **Item activo**: dot 6px `[color.olive]` + texto italic `[fontFamilies.display]` 14px lowercase color `[color.olive]`
- **Item inactivo**: `[typography.eyebrow]` color `[color.moss-ghost]`

### `Sidebar.vue` (desktop only)
Navegación lateral en breakpoints lg+.

- **Width**: 240px
- **Background**: `[color.paper]`
- **Border-right**: 1px `[color.moss]` 10%
- **Logo arriba**, items en lista, footer con avatar + nombre

### `NotificationBell.vue`
Campana con badge contador. Dropdown teleported a body con posicionamiento dinámico.

- **Botón**: 40×40, hover bg `[color.surface-2]`
- **Badge**: pill 16px `[color.terracotta]` con número en paper, `[typography.eyebrow]` 9px
- **Dropdown panel**: bg `[color.paper]`, radius `[borderRadius.card-lg]`, shadow soft
- **Items**: avatar 32px + texto + timestamp `[typography.mono-data]`

### `Avatar.vue`
Foto circular + fallback inicial.

- **Sizes**: 24 / 32 / 40 / 56 / 80px
- **Radius**: `[borderRadius.pill]`
- **Fallback**: bg `[color.olive-light]`, inicial `[fontFamilies.display]` color `[color.paper]`

---

## Overlays

### `BottomSheet.vue`
Modal desde abajo. Base de ShareSheet / InfoSheet / Confirm.

- **Background overlay**: `[color.jungle]` 60% backdrop-blur-sm
- **Panel**: bg `[color.paper]`
- **Border-radius-top**: `[borderRadius.sheet]` (24px)
- **Padding**: `[spacing.lg]` arriba, `[spacing.xl]` abajo (más espacio safe-area)
- **Handle**: pill 36×4 bg `[color.moss]` 15% centrado arriba
- **Slide-in**: 300ms `[motion.easing-sorbo]`

### `ShareSheet.vue`
Selector de visibilidad de un item (3 niveles).

- **Header**: eyebrow + título "Compartir [tipo]" `[typography.display-m]`
- **3 option cards** (vertical):
  - Privado (icono `lock`, "Solo tú lo ves")
  - Amigos (icono `users`, "Tus amigos elegidos")
  - Comunidad (icono `globe`, "Toda la comunidad de Sorbo")
- **Card seleccionada**: border 2px `[color.olive]`, bg `[color.olive]` 5%
- **Card no seleccionada**: bg `[color.surface]`, border 1px `[color.moss]` 10%
- **Padding por card**: `[spacing.md]`
- **Radius card**: `[borderRadius.card]`
- **Friends chips block**: aparece solo cuando visibility = friends
- **Footer**: Button primary "Guardar"

### `InfoSheet.vue` + `InfoTrigger.vue`
Tooltip educacional para atributos (ej. "qué es retrogusto").

- **Trigger**: ícono `lucide:info` 14px color `[color.moss-soft]`, hover `[color.moss]`
- **Sheet**: BottomSheet con título `[typography.display-m]` + body `[typography.body]`

### `Confirm.vue`
Reemplazo de `window.confirm()`. Render via teleport.

- **Layout**: bottom sheet con padding `[spacing.lg]`
- **Título**: `[typography.display-m]`
- **Mensaje**: `[typography.body]` color `[color.moss-soft]`
- **2 botones**: Cancelar (ghost) + Confirmar (primary o dark; **destructive** usa `[color.terracotta]` como bg)
- **Stack vertical** con gap `[spacing.sm]`

### `ActionMenu.vue` + `ActionMenuItem.vue`
Menú contextual (3 dots). Bottom sheet en mobile, popover en desktop.

- **Item**: padding `[spacing.md]`, icono + label `[typography.label]`
- **Hover**: bg `[color.surface-2]`
- **Destructive item**: text `[color.terracotta]`

---

## Onboarding & Empty states

### `OnboardingWelcome.vue`
5 slides editorial con CTAs.

- **Full-screen**: bg `[color.paper]`
- **Slide content**:
  - Hero `[typography.display-xl]` con highlight italic `[color.olive]`
  - Subtitle `[typography.subtitle-italic]`
  - Ilustración SVG centrada
- **Footer fijo**: dots progress + Button primary "Continuar"
- **Skip**: ghost top-right

### `OnboardingChecklist.vue`
Checklist post-onboarding con accesos `/new`.

- **Container**: card `[color.surface]` radius `[borderRadius.card-lg]`
- **Item completado**: check verde + text con strikethrough opacity 50%
- **Item pendiente**: círculo vacío + texto + chevron a la derecha

---

## PWA

### `PwaInstallBanner.vue`
Banner inferior "Instalá Sorbo".

- **Container**: fixed bottom, bg `[color.jungle]`, text `[color.paper]`
- **Padding**: `[spacing.md]`
- **Botón close**: ghost paper sobre jungle

### `PwaAndroidInstructions.vue` + `PwaIosInstructions.vue`
Bottom sheets con instrucciones manuales paso a paso.

- **Steps**: número en círculo olive + texto

---

## Splash

### `Splash.vue`
Pantalla de carga. (Recién rediseñada — ver `components/ui/Splash.vue`.)

- **Background**: `[color.moss]`
- **Mark badge**: 96×96 `[color.olive]` radius 24 con "S." DM Serif 66px y dot `[color.honey]`
- **Wordmark**: "Sorbo." DM Serif 56px paper + dot honey
- **Byline**: `[typography.eyebrow]` paper 50%
- **Mensaje editorial**: serif italic 17px paper 70% con palabra accent `[color.honey]`
- **Footer**: 3 dots 7px circulares `[color.honey]` con bounce + label "Cargando tu diario"
- **Radial glow**: 420×420 honey/olive detrás del centro
- **Texture**: stripes diagonales 45° paper 1.5%

---

## Lo que NO está como componente reutilizable (todavía)

Si vas a diseñar las pantallas en Figma, vas a encontrar estos patrones recurrentes
que viven inline en las páginas y conviene volverlos componentes si querés escalar:

- **Page header** (eyebrow + título serif "La/Mi/Tus _palabra-italic-olive_" + acción derecha)
- **Empty state** (icono grande + título + descripción + CTA)
- **Loading skeleton** (mood card placeholder)
- **Wishlist card** (variante de mood card con bookmark icon)
- **Explore card** (mood card + atribución autor: avatar + nombre + fecha relativa)
- **Friend chip** (avatar 24 + nombre)
- **Step indicator wizard** (3 dots horizontales con activo en olive)

Te los anoto explícitos en `screens.md` cuando aparecen.
