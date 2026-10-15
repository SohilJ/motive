# Quality gates for Motive

Apply these gates to one figure and to every figure in a batch. The baseline is the accepted Synthesis, Growth, and Emergence examples, not the last generated draft. Technical checks support visual judgment; they do not establish user approval of a concept.

## 1. Meaning before geometry

Record the message, primitive roles, consequential change, fixed center/symmetry, repeatable process, and intensity behavior. Reuse the user's settled choices. Distinct ideas need distinct mechanisms, rather than recolored or rearranged versions of one loop. If an animation needs its title to explain every change, simplify or revise its mechanism.

## 2. Accepted construction and finish

Use the shared player and renderer. Construction opens first, with one filled union silhouette and one opaque 1.5-pixel non-scaling outline. Internal guides stay clipped inside the inset contour. Compare actual rendered joins, holes, and outer bounds with the accepted examples at the same display size. Do not overlay primitive outlines, use a blurred screenshot as the finished frame, or substitute a rough SVG sketch. Preserve the four finishes and the standard toolbar in every standalone file.

## 3. Composed motion

Keep a fixed camera and visually balanced mass throughout, including intermediates. Establish approach, contact, consequential change, and a readable hold. Choose motion timing to suit the mechanism. Use a meaningful repeating process; do not hide an irreversible reset with an arbitrary dissolve. Check both sides of the loop seam, not only equal endpoint strings.

## 4. Per-figure checks

For every requested item, record:
- Key pose images before, through, and after the meaningful change, rendered by the actual player.
- Continuous playback inspection at the intended gallery size and in the standalone viewer.
- Low, default, and maximum intensity: stable center, no clipping, no lost essential parts.
- Near-start and near-end geometry; no visible jump or speed discontinuity at the seam.
- Construction join/outline inspection and all four finish states.
- Play/pause, speed, restart, intensity, scrub, and settings; responsive toolbar and reduced motion.
- Self-contained output with no required network dependencies and no console errors.

Repair failed checks and repeat the affected checks. Shared controls can be verified on representative files only when their generated code is identical; record that fact. Geometry, meaning, key poses, and the loop must be checked for every item.

## 5. Batch and gallery checks

Keep a row per concept: meaning, composition, motion/seam, contours, finishes, controls, output, evidence, and outstanding repairs. Inspect a contact sheet of all rendered figures at one consistent scale, then inspect motion separately. Remove accidental near-duplicates and revise weak silhouettes; do not silently reduce the requested count.

Use static posters drawn from the actual renderer and activate at most one gallery player on hover or keyboard focus. Match the poster to the initial live pose and begin previews during meaningful movement, without a multi-second idle hold. Touch opens the individual figure. Suspend offscreen and hidden-page motion, respect reduced motion, and verify a fast handoff between cards cannot leave two players running. A gallery must not run an independent full-resolution render loop for every card.

## Deliverable contract check

Run `python3 scripts/check_batch.py --expected-count N path/to/figure-1.html path/to/figure-2.html ...` for the requested count. It rejects missing figures, duplicate IDs, external dependencies, an incorrect default finish, and missing shared renderer/controls. `--report path/to/report.json` records the result. This check is necessary but does not replace the per-figure visual and continuous-motion review above.

## Completion

Deliver every requested figure as an individual HTML, with genuine hover motion in a requested gallery. Report which visual and technical checks were performed, plus any remaining limitation. Keep concept selection separate from technical acceptance: the user decides whether the interpretation is compelling.
