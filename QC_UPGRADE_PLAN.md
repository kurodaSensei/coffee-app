# QC Upgrade Plan

> Branch aislado para arreglar todo lo no-bloqueante del QC visual del 3 jun 2026.
> Los P0 ya fueron a `main` en commit `5eaa830`. Esto es el resto.

## Cómo trabajamos

1. Yo voy haciendo los issues en orden (mobile primero, desktop después, criticidad).
2. Cuando llego a uno que necesita tu input, te pregunto con opciones concretas antes de codear.
3. Vos verificás visualmente al final del workstream — yo te paso screenshots de antes/después por cada commit.
4. Cuando todo esté testeado, merge `qc-upgrade` → `main` en un solo PR.

---

## 📱 MOBILE workstream (4 issues)

### 🤖 Puedo hacerlo solo

#### MOB-1 · M2 NotificationBell dropdown invade hero en mobile
**Pantallas:** `/app/coffees`, `/app/tastings`, todas con header mobile
**Fix:** En `components/ui/NotificationBell.vue`, detectar `window.innerWidth < 768` y abrir como `BottomSheet` desde abajo en lugar de dropdown posicionado. El componente ya tiene la lógica de teleport — solo cambiar el contenedor target.
**Esfuerzo:** ~30 min

#### MOB-2 · M4 Catas list score "6.8/10" choca con eyebrow en cards cortas
**Pantalla:** `/app/tastings` mobile
**Fix:** Aumentar el `gap` entre eyebrow row y score block en `MoodCard.vue` cuando es tasting. O cambiar el layout a stack vertical cuando el viewport < sm.
**Esfuerzo:** ~15 min

#### MOB-3 · M8 Wizard footer cubierto por Nuxt DevTools (solo dev)
**Verificación:** confirmar en `nuxt.config.ts` que `devtools: { enabled: process.env.NODE_ENV === 'development' }` o equivalente para prod. Probable que ya esté bien — solo verificar.
**Esfuerzo:** ~5 min

### 🤝 Necesito tu input antes de codear

#### MOB-4 · M3 Explore cards — posición de bookmark + plus
**Pantalla:** `/app/explore`
**Decisión:** los iconos de acción quedan abajo de la card en mobile y el TabBar los cubre parcialmente. Opciones:
- (a) Moverlos a esquina superior derecha de la card (estilo overflow menu, sin fondo)
- (b) Mantenerlos abajo pero asegurar padding-bottom suficiente para que el TabBar no los toque
- (c) Mover ambos al action menu (3 dots) → más limpio pero pierde la acción rápida

#### MOB-5 · M5 TabBar tipografía activo vs inactivo
**Pantalla:** TabBar mobile en toda la app
**Decisión:** asimetría visual entre activo (lowercase italic olive con dot) e inactivo (UPPERCASE mono caps mossGhost). Opciones:
- (a) Mantener como está (la asimetría es intencional, marca el activo claramente)
- (b) Unificar a lowercase ambos, el activo sigue siendo italic+olive+dot
- (c) Unificar a uppercase ambos, el activo sigue siendo olive+dot+bold

#### MOB-6 · M6 PWA install banner mobile demasiado grande
**Pantalla:** `/app` dashboard mobile
**Decisión:** el banner ocupa ~280px de alto en mobile. Opciones:
- (a) Versión compacta: 1 línea texto + botón "Instalar" pequeño + X close → ~64px alto
- (b) Convertirlo a BottomSheet que aparece una vez al primer login (no en dashboard)
- (c) Mantener tal cual (apostás por la conversión a PWA, vale el espacio)

#### MOB-7 · M7 Header mobile sin logo de marca
**Pantalla:** Todas las pantallas autenticadas en mobile
**Decisión:** desktop muestra "Sorbo." logo en sidebar, mobile no tiene logo en ningún lado. Opciones:
- (a) Agregar mark "S." badge 32×32 izquierda del header en todas las pantallas internas mobile
- (b) Mantener sin logo (el header ya tiene eyebrow contextual + bell + avatar, no falta nada)

---

## 🖥 DESKTOP workstream (15 issues)

### 🤖 Puedo hacerlo solo

#### DSK-1 · #1 Splash superpuesto al device frame mockup en hero landing
**Pantalla:** `/` desktop
**Fix:** Leer `pages/index.vue`, identificar qué componente está renderizando el splash visual dentro del mockup, y o (a) extraerlo a un sub-componente sin `fixed inset-0 z-[100]` o (b) posicionarlo dentro del device frame contenedor con `position: absolute` relativo al frame.
**Esfuerzo:** ~45 min (incluye investigación)

#### DSK-2 · #7 Wizard receta — campo huérfano "James Hoffmann" sin label
**Pantalla:** `/app/recipes/new` step 1
**Fix:** Encontrar el input en `pages/app/recipes/new.vue` (probablemente "Autor" o "Inspirado por"), agregar el label `eyebrow` correspondiente.
**Esfuerzo:** ~10 min

#### DSK-3 · #8 Dashboard "score promedio —" guion roto
**Pantalla:** `/app`
**Fix:** En el componente que muestra el stat, agregar fallback: si no hay catas, mostrar `Sin catas` en lugar del guion vacío.
**Esfuerzo:** ~15 min

#### DSK-4 · #9 QuickCards inconsistencia "Nueva cata" vs "+ Café"
**Pantalla:** `/app`
**Fix:** Unificar a "Nueva cata" y "Nuevo café" (sin "+") — coherente con el patrón de "Nuevo deseo" de wishlist.
**Esfuerzo:** ~5 min

#### DSK-5 · #10 Roasters avatar fallback con bg paper invisible
**Pantalla:** `/app/roasters`
**Fix:** Quitar `paper` del set de colores rotativos del avatar, o cambiarlo por `surface-2` con border `moss/10`.
**Esfuerzo:** ~10 min

#### DSK-6 · #12 Settings — "Instalar Sorbo" duplicación con banner dashboard
**Pantalla:** `/app/settings`
**Fix:** Mostrar la fila "Instalar Sorbo" solo si `bannerDismissed && !installed`. Reutilizar el state de `usePwaInstall`.
**Esfuerzo:** ~15 min

#### DSK-7 · #13 Wishlist empty state sin CTA visible
**Pantalla:** `/app/wishlist`
**Fix:** Agregar un Button primary "+ Nuevo deseo" dentro del empty state card, debajo del quote. En desktop el botón sigue arriba a la derecha para no duplicar; en mobile aparece dentro del empty (ya funciona bien en mobile).
**Esfuerzo:** ~10 min

#### DSK-8 · #16 Splash component no se ve durante reload (investigación)
**Pantalla:** Toda la app al hacer F5
**Fix:** Verificar `app.vue` — `showSplash = computed(() => authLoading.value || splashHeld.value)`. Si auth carga muy rápido, el splash no alcanza a verse. Considerar agregar `minDuration: 800ms` para que siempre se vea al menos un beat.
**Esfuerzo:** ~20 min

#### DSK-9 · #18 Wizards step indicator más prominente
**Pantalla:** Todos los wizards
**Fix:** Reemplazar la barra olive thin por 3 dots horizontales centrados arriba del título (dot olive = actual, dot moss/15 = futuros, dot olive con check = completados). Más explícito visualmente.
**Esfuerzo:** ~30 min

#### DSK-10 · #19 Sidebar desktop item activo poco diferenciado
**Pantalla:** Sidebar en `lg+` breakpoints
**Fix:** Agregar dot olive 6px a la izquierda del item activo (replica el patrón del TabBar mobile) + cambiar el `bg-surface-2` actual por `bg-transparent` y `font-medium` para no competir con el dot.
**Esfuerzo:** ~15 min

#### DSK-11 · #20 Nuxt DevTools floating button (verificar prod hide)
**Verificación:** confirmar en `nuxt.config.ts` que en prod no se incluye. Si no está bien, agregar la config.
**Esfuerzo:** ~5 min

#### DSK-12 · #21 Cata modal — "/10" apretado contra el score grande
**Componente:** `BottomSheet` de cata preview
**Fix:** Agregar gap `xxs` o cambiar tamaño relativo del "/10".
**Esfuerzo:** ~5 min

### 🤝 Necesito tu input antes de codear

#### DSK-13 · #6 Recetas cards inconsistencia visual entre completa vs incompleta
**Pantalla:** `/app/recipes`
**Decisión:** La card "V60 Chano" es jungle dark con specs, las otras dos son surface-2 con solo tiempo. Opciones:
- (a) Todas jungle dark (con specs en placeholder cuando faltan)
- (b) Todas surface light (mantener estilo claro)
- (c) Card destacada/featured = dark + resto = light (intencional pero hay que documentar el criterio)

#### DSK-14 · #11 Catálogos heros sin italic-olive
**Pantallas:** `/app/methods`, `/app/varieties`, `/app/processes`, `/app/notes`
**Decisión:** opciones de copy para unificar con resto de la app:
- (a) "Tus _métodos_", "Tus _variedades_", "Tus _procesos_", "Tus _notas_"
- (b) "Cómo extraes _café_", "Qué hay en tu _taza_", etc. (más editorial, menos formulaico)
- (c) "Métodos en _uso_", "Variedades _activas_", etc.
- (d) Mantener simple como está (los catálogos son utility, no editorial)

#### DSK-15 · #17 Footer landing — columnas sparse
**Pantalla:** `/` footer
**Decisión:** "Comunidad" y "Cuenta" tienen solo 1 link cada una. Opciones:
- (a) Fusionar las 3 nav columns en una sola "Links" más densa
- (b) Agregar contenido: "Comunidad" → Instagram + Twitter (si tenés) + Discord (si tenés); "Cuenta" → Contacto + FAQ
- (c) Mantener (la simpleza es intencional)

---

## 👤 Solo vos podés hacer

Estas cosas no puedo ejecutarlas yo. Cuando termines, marcalas y avísame:

- **Verificación física en iPhone real** (o Chrome DevTools 390×844 manual) — para validar los fixes mobile en el viewport correcto, no a 500px que es lo que pude testear yo.
- **PNG OG image 1200×630** — convertir `public/og-image.svg` a PNG para que WhatsApp/Telegram lo coman. Usá cloudconvert o screenshot del SVG en Figma exportado a PNG.
- **Aprobar las decisiones de las preguntas con tu input** — cuando lleguemos a esos issues, te pregunto y respondés.
- **Merge a `main` y push a producción** — al final del workstream, vos aprobás el PR y mergeás.
- **Test del SSO con Google** después de los cambios — verificar que el logo nuevo no rompió el handler (yo no puedo loguearme).

---

## Orden de ejecución propuesto

Mi recomendación de orden — máximo impacto, menor fricción:

1. **DSK-11 + MOB-3** (verificación Nuxt DevTools prod) — 10 min, descarta o confirma 2 issues
2. **MOB-1 + MOB-2** (NotificationBell mobile + catas score) — fixes mobile P1
3. **DSK-2 + DSK-3 + DSK-4 + DSK-5 + DSK-6 + DSK-7 + DSK-12** (los 7 fixes desktop chicos que puedo solo) — ~75 min totales
4. **DSK-1 + DSK-8** (splash investigations) — 1h
5. **DSK-9 + DSK-10** (wizard step indicator + sidebar active) — 45 min
6. **Pausa para preguntas con tu input** — DSK-13, DSK-14, DSK-15, MOB-4 a MOB-7
7. **Implementación de las decisiones**
8. **Tu verificación final en iPhone**
9. **Merge + push**

Estimado total mío: ~4-5 horas de trabajo de código + tus decisiones intercaladas.

---

## Lo que NO está en este plan

- **Splash splash splash redesign Lottie** — pospuesto en sesión anterior, no es QC sino product enhancement
- **Brevo + email template waitlist** — independiente, va cuando crezca waitlist
- **Comunidad Fase 3** (follow tostadores, agregados, moderación) — feature work, no QC
- **Cancelar cuenta Storage cleanup** — irrelevante hasta que alguien suba fotos
