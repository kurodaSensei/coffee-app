# Sorbo · Design System bridge

Esta carpeta es el puente entre el código (fuente de verdad actual) y Figma.
La idea: que cualquier cosa que diseñes en Figma use exactamente los tokens
que ya viven en `assets/css/main.css` + `tailwind.config.ts`, y que tengas un
spec por pantalla para no tener que adivinar la arquitectura de capas.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `tokens.json`   | Tokens en formato **Tokens Studio**. Importás esto en Figma y te crea Variables + Text Styles. |
| `components.md` | Specs de los 29 componentes UI con anatomy, tokens y estados. |
| `screens.md`    | Specs por pantalla — frame structure, layout y componentes usados. |

## Cómo importar los tokens en Figma (5 min)

1. Abrí tu archivo de Figma (Sorbo 2.0).
2. Plugins → instalá **Tokens Studio for Figma** (gratis).
3. Abrí el plugin → menú ☰ → **Tools → Load from file/folder/preset**.
4. Seleccioná `design/tokens.json`.
5. Click derecho sobre el set `global` → **Apply to selection** o **Apply to file**.
6. (Recomendado) Activá la opción **Sync styles & variables** para que se creen
   automáticamente las Figma Variables y los Text Styles. Eso te deja todo
   referenciable nativamente desde el panel de propiedades.

### Si preferís Figma Variables nativas

Plugin alternativo: **Variables Import** (gratis). Acepta JSON DTCG.
`tokens.json` también es compatible con DTCG en su mayoría — sólo los tokens
de tipo `typography` no se mapean a Variables (Figma todavía no tiene typography
variables nativas), pero sí se materializan como **Text Styles** vía Tokens Studio.

## Pipeline propuesto (A + C)

```
[código actual]              [design/]                    [Figma]
                                                          
tailwind.config.ts   ──┐                                  ┌─ Variables (colors, spacing, radii)
main.css            ──┼──>  tokens.json     ───import──>  ├─ Text Styles
componentes Vue     ──┘                                   └─ (referenciable desde frames)

componentes Vue     ─────>  components.md   ──diseñás──>  Components con tokens aplicados
pantallas Vue       ─────>  screens.md      ──diseñás──>  Frames por pantalla
                                                          
                            (este folder)                  Code Connect mappings (opcional, después)
```

## Cuando cambies algo en el código

Si modificás un token en el código (ej. agregás un nuevo color o cambiás un
spacing), regenerá `tokens.json` y reimportá en Tokens Studio. Tokens Studio
detecta diffs y solo aplica lo que cambió — no rompe nada de lo que ya tengas.

## Estado de cobertura

- ✅ **Colors**: paper, surfaces, brand (olive/honey), text (moss/ghost), terracotta
- ✅ **Spacing**: xxs → 3xl (4 / 8 / 12 / 16 / 24 / 40 / 64 / 80)
- ✅ **Radii**: input, card-sm, cta, card, card-lg, sheet, pill
- ✅ **Typography**: 14 estilos compuestos (display, body, eyebrow, chip, mono-data, button)
- ✅ **Motion**: 3 duraciones + easing sorbo
- ⏸ **Shadows**: el código casi no usa box-shadows (sólo splash mark + tab bar
  border-top); cuando se introduzcan a escala, sumar a `tokens.json`.

## Si después querés conectar componentes Figma ↔ Vue

Una vez que tengas componentes hechos en Figma (Button, Chip, MoodCard, etc.),
puedo mapearlos con **Code Connect**: en Dev Mode, click derecho sobre un nodo
→ "Get code" te devuelve el snippet Vue real en lugar del HTML genérico.
Avisame cuando llegues a ese punto.
