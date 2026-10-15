---
name: motive
description: Turn abstract ideas into expressive looping animations with gooey geometric forms. Use for standalone conceptual motion studies or animations of relationships, combining meaning-focused questions with polished HTML output. Not for interface transitions.
---

# Motive

Create an interesting visual interpretation with Motive, delivered as one portable HTML per animation. The central capability is the conversation that discovers what an abstract idea means, followed by geometry whose relationships and changes express that meaning.

## Discover the meaning

Use the existing conversation before asking anything. The finish, shape vocabulary, or controls may already be settled.

For an ambiguous idea, ask **one consequential question at a time**, with two or three concrete interpretations when helpful. Ask what changes, what matters, what remains distinct, what becomes possible, or where influence travels. Wait for the answer when it determines the concept. Each answer should change the proposed mechanism; avoid a questionnaire or a fixed question count. Do not begin with palettes, libraries, or an inventory of shapes.

When the user cannot decide, offer contrasting examples or an opinionated recommendation. When they delegate a question, choose it. **“Choose all the answers,” “you decide,” or equivalent delegation means make the remaining creative decisions and build; do not keep asking those questions.** Briefly state the chosen interpretation. This delegation applies to that brief, not every future use of the skill.

Once meaning is clear, offer two or three materially different mechanisms and let the user choose, unless the mechanism is supplied or delegated. “Build all” authorizes all proposed mechanisms. Differences must be causal, not three decorative arrangements of particles. See [discovery.md](references/discovery.md) for useful question patterns and delegated examples.

Write a compact working brief: message, roles, consequential transformation, central anchor and symmetry, meaningful loop, and intensity's effect. Filter mechanisms through the composition rule below before proposing or building them. Keep the brief out of the animation canvas. Proceed when these are selected or delegated.

## Compose and build

Read [visual-language.md](references/visual-language.md) for the established finish and motion rules. Use abstract bars, circles, plates, rounded rectangles, paths, and voids. Give the primitives roles. Merging, splitting, stretching, or moving support must explain something. Literal illustrations and interface behaviors are outside this skill's default direction.

**Keep the composition centered; transform within it.** Use a fixed central anchor and bilateral or rotational symmetry as the default organization. Coordinate opposing or repeated elements so the figure stays visually balanced throughout the cycle. Centering the SVG alone is insufficient: avoid a migrating focal point, one-sided loading, or lateral drift in visual weight. Symmetry describes the composition, not a requirement for circles or identical primitives at every instant. See the detailed composition criteria in [visual-language.md](references/visual-language.md).

Compose the decisive still frames first, then connect them with motion. A perfect loop needs a semantic reason to repeat. For an irreversible story, resolve its cycle explicitly rather than silently rewinding the outcome. Eight seconds and the supplied motifs are examples, not requirements.

Use the reusable player and builder for consistent standalone output. Read [implementation.md](references/implementation.md) when implementing a figure. Write a new figure module; the examples are quality references, not a fixed menu. Extend the renderer when the chosen mechanism needs unsupported geometry instead of distorting the idea to fit the starter.

Deliver **one self-contained HTML per concept**, with only the animation and a compact toolbar centered at the bottom. Include play/pause, intensity, speed, finish, restart, and relevant secondary settings. Put comparisons, research, and explanatory prose in separate artifacts. The four supported finishes are Construction, Graphite, Light, and Dark. Every new standalone export must open in Construction with guides enabled. Set metadata `finish` to `drawing` (or omit it); explicit finish URLs can still open a requested preview. Preserve an actively selected preview finish during revisions unless the user requests a different default. Construction uses a single crisp silhouette with lighter guides contained inside it; never stack raw primitive outlines over its outer edge.

## Consistent quality at any batch size

A request for multiple animations changes the count, not the finish level. Use the same approved player, contour renderer, Construction default, centered composition, and controls for every item. Read [quality-gates.md](references/quality-gates.md) for every build, including batches.

A gallery of requested animations must contain actual continuous motion. Two still poses, crossfades, wireframes, and concept diagrams are useful planning artifacts but do not satisfy an animation request. Preserve the accepted visual language when moving from one example to a large batch; do not substitute a simpler renderer to finish the count.

Check every item individually against the gates, then compare the entire set with the accepted Synthesis, Growth, and Emergence examples. Track each item's evidence and repairs in a batch review. Do not declare the batch complete while any requested item is missing, substituted, or unreviewed. If work remains, state exactly which items and checks are outstanding and continue within the authorized task.

## Check the result

Inspect the decisive poses and the transitions between them for a stable center and balanced motion, including maximum intensity. Then inspect actual browser rendering, including moving joins and small screens. Sampling a declared stroke width is not evidence of consistent appearance. The Hairline outer and inner lines must be independent, closed, fully opaque 1.5-pixel strokes: no local fading, gradient highlight, or inner line made by covering a thick stroke.

Check the loop on both sides of its seam, multiple poses and intensities, finish switching, controls, responsive layout, and reduced-motion behavior. Verify supported external actors as well as the main merged material. A portable file must contain no required network resources and should open directly from disk. See the specific checks in [implementation.md](references/implementation.md).

Review meaning separately from polish. Explain the intended transformation briefly and ask for the user's reading when feedback is appropriate. Do not treat successful technical checks or delegated authorship as the user's approval of taste. Preserve accepted decisions and apply corrections to reusable rendering or discovery rules when they recur.

## Included examples

`assets/examples/` contains the accepted Synthesis, Growth, and Emergence modules and metadata. All four finishes were also accepted. `assets/rejected/resilience.*` preserves a technically checked trial rejected by the user for its off-center, asymmetric choreography; it is a counterexample, not a starter or quality reference. The lesson is recorded in [discovery.md](references/discovery.md). Reference observations and reconstruction choices are distinguished in [visual-language.md](references/visual-language.md).
