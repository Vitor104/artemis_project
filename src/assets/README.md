# Assets

Place local imagery for the scrollytelling scenes in this directory.

## WebP conversion

Run once after adding or updating PNG masters (requires dev dependency `sharp`):

```bash
npm run convert-images
```

This generates `.webp` files next to each source under `src/assets/*.png` and `src/components/Crew/crew_assets/*.jpg`. The app imports the `.webp` files for smaller bundles.

## Scene backgrounds (WebP)

| File | Section |
|------|---------|
| `Capsula.webp` | Prologue / Hero |
| `SLSRocket.webp` | Foundation |
| `SLSRocketLauching.webp` | Launch / Ignition |
| `RocketTowardsTheMoon.webp` | Journey / path |
| `darkSide.webp` | Dark side (sticky) |
| `splashdown-capsule.webp` | Return / splashdown |

## Crew portraits (WebP)

Generated beside the JPG masters in `src/components/Crew/crew_assets/`:

- `Reid Wiseman.webp`
- `Victor Glover.webp`
- `Christina Koch.webp`
- `Jeremy Hansen.webp`

## Optional

- `hero.webp` — produced if `hero.png` is present (not required by current sections).
