# Visual language

## Geometry and meaning

Use a small set of regular primitives and a legible organization. Spatial relationships, hierarchy, negative space, and changes of connectivity should carry the idea. A void can be the outcome; every idea need not be a central blob receiving particles.

Use goo to connect, separate, redistribute, or preserve a relationship under deformation. Avoid decorative wobble, continuous random drifting, gradients suggesting soft 3D volume, or unrelated particle traffic. These are local style decisions for this skill, not universal animation rules.

The reference canvas is a 100-unit construction square inside a 130-unit SVG view. Keep the main figure approximately within ±45 units, with room for its maximum-intensity poses. The grid is a secondary inspection aid. Do not fill the canvas with labels or implementation explanations.

## Centered composition and symmetry

**Keep the composition centered; transform within it.** This is an explicit user requirement for this visual language, clarified after the Resilience trial. It is not a universal motion-design law or a recovered numerical setting from the reference videos.

- Establish one fixed visual center in the animation area, with the toolbar below it. Keep the camera and stage still; do not chase moving geometry by recentering the view each frame.
- Organize the figure around a mirror axis or rotational symmetry. Pair expansion, compression, branching, separation, and return around that anchor. Bars, rectangles, poles, branches, and negative spaces are as valid as circles.
- Preserve balanced visual weight and surrounding negative space during transitions, not just at rest or at the loop seam. The viewer should watch one centered figure transform rather than follow attention across the stage.
- Avoid traveling focal points, one-sided loads, and supports that migrate left and right. If the meaning depends on those devices, rethink its spatial mechanism before polishing the finish. Circulation or staggered timing must preserve the centered whole.

This is compositional symmetry, not identical size or motion for every primitive at every instant. Approved Synthesis begins with unequal inputs arranged around a central anchor. Preserve that expressive difference while keeping the overall figure balanced. Use Synthesis, Growth, and Emergence as the accepted calibration; exact per-frame centroid equality is not the criterion.

Before building, identify the center and symmetry in the key poses. During review, follow the silhouette, central opening, and focal weight through the entire cycle at low and high intensity. A centered canvas with a lopsided event still fails this check.

## Four finishes

| Finish | Ground | Body | Contour |
| --- | --- | --- | --- |
| Construction | `#f2f3f0` | `#b5b7b6` | One opaque 1.5-pixel `#5d6263` contour; lighter interior guides |
| Graphite | `#f2f3f0` | `#626968` | Solid silhouette |
| Light | `#ffffff` | `#ffffff` | Outer `#232327`, inner `#a4a4ac` |
| Dark | `#08090a` | `#08090a` | Outer `#d0d6e0`, inner `#5b5d64` |

Hairline strokes are 1.5 screen pixels, fully opaque and non-scaling. The quieter contrast option changes the entire outer boundary to the inner gray. Both lines are complete paths. Do not add gradients, radial emphasis, clipped stroke bands, or background overpainting. Guides sit behind the opaque body. Normal edge antialiasing remains; do not claim every raster pixel has identical color.

Construction is the default landing finish, with guides enabled. It uses one filled union path with an opaque, non-scaling 1.5-pixel outline. Primitive guides are 0.75-pixel non-scaling strokes at 48% group opacity, clipped to the inset contour so they cannot redraw or protrude through the silhouette. Grid strokes are also 0.75 pixels with a quieter weight. Crossings inside the construction diagram remain intentional; doubled outer edges are not.

Graphite retains the shared SVG blur/alpha filter. Light and Dark extract two closed contours from the same primitive union at alpha levels 0.4 and 0.6. Construction reuses the outer contour for its single filled outline and the inner contour only to contain guides; it does not draw a second contour stroke. This is an approximation of the filled filter's silhouette. The inset follows the field; its gap is not a constant geometric offset. Changing finishes preserves the primitive choreography.

## Motion

The expressive hierarchy is approach → contact → consequential change → a short readable hold → continuation. Use fewer, coordinated events. Let the result exist long enough to be read. A loop can be an ongoing process, balanced circulation, or reconfiguration around the same center; avoid reversing a supposedly permanent gain just to reach frame zero. A reason to repeat does not excuse asymmetric staging.

The supplied `ease` uses cubic-bezier(.77,0,.175,1) for deliberate on-screen transformations. Constant circulation can use linear phase. Eight-second example cycles and specific geometry sizes are calibrated examples, not fixed rules for future concepts. Intensity should change physical expression without erasing the message. Reduced motion starts on a composed still frame with an explicit Play control.

## Source process and attribution

- [Hairline making-of](https://hairline.lucasmarkes.com/inspo): dissect a specific technique, build adjustable studies, critique them, turn accepted corrections into rules, then package.
- [Hairline figures](https://hairline.lucasmarkes.com/figures) and [source snapshot](https://github.com/lucasmarkes/hairline/tree/a2217852fed6d1a4f20bc7d43d4fad1a3de117b8/skills/hairline-create): palette and line hierarchy. The source used 0.9-pixel strokes; this skill's reviewed adaptation uses solid 1.5-pixel paths. The source asks for concept selection; the extended adaptive interview here is an explicit user requirement.
- [Lucas Bebber's gooey effect](https://css-tricks.com/gooey-effect/): shared blur and alpha contrast join nearby shapes.
- Andres Jasso's [anatomy](https://x.com/_andresjasso/status/2097456341766037602) and [construction breakdown](https://x.com/_andresjasso/status/2097782847302139926): simple primitives, controlled contact and separation, compact geometry. Downloaded footage was inspected during development. Exact easing and filter parameters were not recovered; the settings here are our reconstruction choices.

The package contains original reconstruction code and examples, not downloaded videos or the Hairline skill implementation.
