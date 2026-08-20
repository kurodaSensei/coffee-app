# UX Improvement Map · Sorbo

> Objetivo: reducir el "es complicada". Trabajo pantalla por pantalla,
> priorizado por impacto en los primeros 5 minutos + fricción crónica.
> Marca [x] cuando `/impeccable critique` + fixes queden hechos.

## Tier 1 — Primeros 5 minutos (bloqueadores de activación)

Si estas pantallas son confusas, el usuario bounce antes de crear su
primer café. Máximo lift por hora invertida.

- [ ] `pages/index.vue` — landing (persuade → registro)
- [ ] `pages/register.vue` — registro (fricción de campos)
- [ ] `pages/login.vue` — login
- [ ] `pages/app/index.vue` — dashboard (primer paisaje post-login)
- [ ] `components/ui/OnboardingWelcome.vue` — welcome sheet primera vez
- [ ] `components/ui/OnboardingChecklist.vue` — checklist de activación
- [ ] `layouts/default.vue` — TabBar + nav shell (dónde está todo)

## Tier 2 — Core loop (donde vive "complicada")

Los 3 wizards de creación son el sospechoso más probable del feedback:
demasiados campos, no queda claro qué es requerido vs opcional.

- [ ] `components/coffee/Wizard.vue` — nuevo café (3 pasos)
- [ ] `components/tasting/Wizard.vue` — **nueva cata** (acción más frecuente)
- [ ] `components/recipe/Wizard.vue` — nueva receta
- [ ] `pages/app/coffees/[id]/index.vue` — detalle café
- [ ] `pages/app/tastings/[id]/index.vue` — detalle cata
- [ ] `pages/app/recipes/[id]/index.vue` — detalle receta

## Tier 3 — Navegación + listas

- [ ] `pages/app/coffees/index.vue` — lista cafés
- [ ] `pages/app/tastings/index.vue` — lista catas
- [ ] `pages/app/recipes/index.vue` — lista recetas
- [ ] `pages/app/explore.vue` — feed comunidad

## Tier 4 — Secundarias

- [ ] `pages/app/wishlist.vue`
- [ ] `pages/app/roasters/index.vue`
- [ ] `pages/app/friends.vue`
- [ ] `pages/app/profile.vue`
- [ ] `pages/app/settings.vue`

## Tier 5 — Catálogos (baja frecuencia, dejar para el final)

- [ ] `pages/app/methods.vue`
- [ ] `pages/app/varieties.vue`
- [ ] `pages/app/processes.vue`
- [ ] `pages/app/notes.vue`

---

## Plan de ataque

1. **Corre `/impeccable critique <target>` sobre un archivo del tier 1**
2. Revisa hallazgos, ejecuta el fix command que critique recomiende
   (`clarify`, `distill`, `onboard`, `adapt`, etc.)
3. Marca [x] el item, pasa al siguiente
4. Al terminar el tier, re-audit y sigue con el próximo tier

Empezar por: **`pages/app/index.vue`** (dashboard) → **`components/tasting/Wizard.vue`** (nueva cata, la acción más frecuente) → seguir el orden del tier 1.

## Hipótesis a validar en cada crítica

Cuando el feedback dice "complicada", suele ser una de estas:

- **Vocabulario asumido** — SCA, cata, extracción, tueste sin explicación
- **Campos opcionales que se leen como obligatorios** — el helper no lo dice claro
- **Sin acción clara siguiente** — el usuario mira la pantalla y no sabe qué hacer
- **Demasiadas opciones a la vez** — 12 métodos, 8 procesos, N tostadores en el primer paso
- **Empty states sin gancho** — "aún no tienes catas" sin invitar a hacer la primera
- **Terminología inconsistente** — "marca" en un lado, "tostador" en otro (ya arreglado)

Apunta cuál aplica al ejecutar critique.

## Métrica de éxito (informal)

- Un usuario nuevo llega a la primera cata guardada en < 3 minutos
- No pregunta "¿esto es obligatorio?" en ningún campo
- No hay más de una pantalla del flujo que requiera texto de ayuda
