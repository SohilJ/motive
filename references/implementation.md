# Building a portable figure

The package needs Python 3 to assemble a file and a modern browser to run it. It has no package-manager, CDN, font, or network dependencies. Run the builder with paths to metadata, a trusted local figure module, and an output HTML:

```sh
python3 scripts/build.py assets/examples/emergence.json assets/examples/emergence.js /absolute/output/emergence.html
```

The script embeds the entire player, renderer, figure, and styles into the output. It does not execute the figure during assembly; browser inspection is still required. Never treat arbitrary downloaded JavaScript as a trusted figure module.

## Metadata

Required strings: `id`, `name`, `description`. Optional: positive `duration` in seconds (default 8), initial `pose` in seconds, and `finish` (`drawing`, `flat`, `light`, or `dark`). Use `drawing` (or omit `finish`) for the default: exported animations must first open in Construction with guides enabled. Use an accessible description of the visual transformation. Keep extra explanation outside the player.

## Figure contract

Write `function createFigure(scene,actors)` and return `{draw(t,intensity)}`. Create elements once and update them in `draw`, which must be deterministic for each time and intensity. `t` is elapsed seconds; intensity runs from 0 to 1. Both exact endpoints are rendered as zero; also check the states immediately around the seam, so canonicalization cannot conceal a jump.

- `scene.ink`: white primitives whose union becomes goo.
- `scene.raw`: corresponding guide primitives, shown only in Construction when guides are on.
- `actors`: optional separate SVG geometry. These elements do not merge into the material, but must participate in the same centered, balanced composition. The player applies finish colors and constant strokes to immediate actor children. An optional returned `theme(palette,finish)` hook can customize actors when necessary.
- `primitive(scene,tag,attrs)` creates `{shape,guide}`; `both(pair,attrs)` updates both.
- `node(tag,attrs,parent)` and `set(element,attrs)` are SVG helpers.
- `ramp(t,start,end)`, `ease(x)`, `clamp(x)`, `mix(a,b,t)`, and `TAU` are available.

The contour rasterizer supports **immediate** circles, rounded rectangles, and round-capped stroked `path` elements. Per-element SVG transforms work. Use `fill:'none'`, `stroke:'white'`, and an explicit `stroke-width` for ink paths. It does not yet support nested groups, filled arbitrary paths, ellipses, per-primitive opacity, or arbitrary blend modes. Extend both rendering paths and verify equivalence if the concept needs them. Do not silently render only the supported subset.

The geometry domain is −65 to +65 on each axis. Keep blur and maximum deformation away from that boundary, or extend the raster domain, SVG view, and filter bounds together. The illustrative scale used here is not suitable for unlimited zoom without changing contour sampling resolution.

Construction uses `constructionFinish` from `assets/vector-contour.js`: one filled outer path with a 1.5-pixel non-scaling stroke, plus an inset clip for 0.75-pixel primitive guides. Keep the guides separate from the outline so overlapping parts cannot double its weight. Graphite retains its fill filter; Light and Dark retain their independent outer and inner strokes.

The shared HTML shell and `assets/toolbar.js` provide matching custom Speed, Finish, and Settings popovers, with 44-pixel primary controls and pointer press feedback. Preserve the approved Settings panel with guides, high contrast, and its position scrubber. Speed and Finish listboxes share its surface and motion, with selected checkmarks and full keyboard operation. Native auto-popover behavior dismisses on outside click and keeps only one panel open. Listboxes support arrows, Home/End, typeahead, Enter/Space, Escape with focus return, and Tab navigation.

Use device-pixel-aligned toolbar and panel positioning without a centering transform, readable 13-pixel labels, and untransformed controls at rest. Pointer popovers enter in 180ms and exit in 140ms from the trigger. Keyboard actions and reduced motion skip UI transitions. Keep functional slider updates direct and update its fill only when intensity changes. The shared runtime keeps start-paused reduced-motion behavior, hidden-tab suspension, responsive dock, and per-finish guide choices. URL options: `?finish=dark`, `?paused=1`, `?pose=.5` (normalized cycle fraction).

## Validation that matters

Before technical validation, inspect composition: identify the fixed center and mirror axis or rotational organization, then follow visual weight and negative space through the key poses and transitions. Include all separate actors and the maximum-intensity pose. Keep the camera fixed. Centering the SVG container does not compensate for geometry or emphasis migrating across it. Use the accepted examples to judge balance; an exact mathematical centroid test would miss perceptual weight and reject useful differences between primitives.

1. Open the output directly as a local file and inspect the visible result. Check browser errors and required network requests.
2. Inspect meaningful poses through contact, joining, splitting, and the hold. Include 0%, 60%, and 100% intensity. Check that external actors remain visible and do not imply unintended merging.
3. Compare near-end and near-start geometry as well as exact endpoints. Test continuity of position and, when visible, speed. Look at actual playback; matching endpoint strings alone is insufficient.
4. Switch all four finishes at a paused pose. Primitive geometry and time should remain unchanged. In Hairline, inspect closed outer and inner paths, opacity, moving corners, and holes. Sampling the inner path against the filled body can catch inset excursions.
5. Exercise play/pause, intensity, speed, restart, matching dropdowns, settings toggles, and scrub. Scrubbing should pause. The dock must fit and remain clear of the art at desktop and narrow/short sizes.
6. Under reduced motion, a normal URL starts paused at a meaningful pose. Explicit Play works. Restore temporary browser emulation afterward.

Do not treat these checks as proof that viewers will read the intended meaning. Keep user review separate.
