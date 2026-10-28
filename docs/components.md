# Originals

Every original: what it's for, its settings, where its files are. **Read this
before building anything new** (CLAUDE.md rule 1). `npm run check` fails if an
original in `src/originals/` is missing here.

The full planned list is in [system.md](system.md) §2–§4. This file lists only
what exists.

## How an original is made

| Part | Where | Holds |
|---|---|---|
| Component | `src/originals/<name>/<Name>.tsx` | markup; calls `marks("<name>", instance)` on its root and `field("<field>")` on editable text |
| Look | `src/originals/<name>/<name>.module.css` | tokens only (`var(--…)`); reads choices as `[data-s-<setting>="<value>"]` and token settings as `var(--s-<setting>)` |
| Schema | `src/originals/<name>/schema.ts` | settings the Inspector offers (kind, options, per device), text fields, blocks inside |
| Defaults | `design/originals/<name>.json` | the original's current settings: what "Change the original" edits |
| Registration | `src/originals/schemas.ts` (+ `src/stripes/registry.ts` for stripes) | so pages and the Inspector find it |

Instances live in content files (`content/pages/<slug>.json`, …). Each stripe
has a stable `id`, its `content`, and optional `overrides` + `overrideReasons`.
Blocks inside a stripe are objects in its `content` with the same two keys.
Instance address: `pages/about#hero`, block: `pages/about#hero.button`.

## Blocks

### `button`

A link styled as a button. Files: `src/originals/button/`.

| Setting | Kind | Options | Default |
|---|---|---|---|
| `variant` | choice | `outline` (button-2.white-outline, 37 live pages) · `cta` (button-2-cta: wider at ≥1920) · `news` (button.is-secondary, news pages) · `earth-defender` (black fill) · `empower-children` (blue fill) | `outline` |

- Content: `label` (editable in place), `href`.
- Text: `ts-button` + `ts-button-label` (`ts-news-button` for `news`).

## Stripes

### `test-stripe` (dev only)

Proves the Inspector. It's only on `/dev/inspector-test` under `npm run dev`,
never on the live site. Files: `src/originals/test-stripe/`.

| Setting | Kind | Default |
|---|---|---|
| `background` | colour token | `page` |
| `spacing` | spacing token, per device | desktop `5` · tablet `4` · phone `3` |
| `align` | choice: `center` · `left` | `center` |
| `titleStyle` | text style | `display` |

- Content: `eyebrow`, `title`, `text` (all editable in place), and `button` (a `button` block).
