# Integration Brief — Process Section Replacement (boringproj.com)

Reference file: `process-section-prototype.html` (in this same folder). Open it in a browser first to see the actual behavior before touching code — this brief describes intent, the prototype is the source of truth for exact values.

## Scope — read this before changing anything

**Only replace one section on the homepage: "THE BORING PROCESS" (the 4-step section with Free audit / We build / We launch / We manage).**

Confirmed current homepage order, top to bottom:
1. Header/nav
2. Hero ("boring project. Finally found.")
3. The Problem
4. What we do (4 service cards)
5. **THE BORING PROCESS ← replace this one, only this one**
6. Pricing
7. Latest from the blog
8. Final CTA
9. Footer

Do not reorder, restyle, or restructure anything else. Sections 4 and 6 need one small touch each (see below) but keep their content and position exactly as-is.

## What's being added

A mouse-driven 3D wave grid (Three.js, `InstancedMesh` + custom `onBeforeCompile` vertex/fragment shader) replaces the current static numbered list. Moving the mouse over the section raycasts onto a plane and leaves a trail; a Gaussian wave travels outward from each trail point, popping nearby cubes toward the viewer and tinting them gold→blue. Full mechanics are commented in the prototype's `<script>` block.

**Desktop/tablet only (`window.innerWidth >= 768`).** Below that width the canvas hides itself and the WebGL scene never initializes — confirm this still matches whatever your current mobile version of this section looks like, since this prototype never had a mobile design of its own to diff against.

## Known things to adjust for the real page (don't skip these)

1. **Dependency handling — do not inline the 670KB Three.js build into the live site.** I embedded it directly in the prototype HTML purely so it would work as a single self-contained file with zero network dependency for testing. For production, self-host `three.min.js` (or the ES module build) as a proper static asset your build already serves, or load it from a pinned CDN URL — whichever matches how the rest of the site's JS is already loaded. Do not copy the giant inline `<script>` blob as-is.

2. **The upward "bleed" into the "What we do" section uses a hardcoded `margin-top: -38vh` / `padding-top: 38vh` pair.** That number was tuned against a *mock* "What we do" section built for this prototype — it will not be correct against the real one. Re-tune by eye against the actual section above it until the canvas fade-in lines up naturally. Same logic, different number.

3. **"What we do" service cards need two specific changes carried over** (not just the process section):
   - `z-index: 2` on the section wrapper, so it stacks above the canvas where the upward bleed overlaps it — otherwise the canvas paints over the card text and washes it out.
   - The cards' background switches to real glassmorphism (`backdrop-filter: blur(20px) saturate(130%)`, near-transparent background/border) instead of a flat translucent fill, so the grid shows through intentionally. Existing hover state (blue glow + lift) is preserved — confirm it still matches the current production hover exactly, since it was recreated from a screenshot, not the original CSS.

4. **Grid tuning constants** (all in the `initWaveScene()` function, top of the block) — these are the values I landed on through iteration, treat them as a starting point, not gospel, once it's running against the real page dimensions:
   - `GRID_X = 24`, `GRID_Z = 15`, `SPACING = 1.05`, `CUBE_W = 0.8`, `CUBE_H = 2.6`
   - `WAVE_SPEED = 5.5`, `WAVE_WIDTH = 1.3`, `FADE_TIME = 2.4`, `AMPLITUDE = 0.45`
   - Cube base color `#1e1e22`, ambient `0x2a2a34 @ 0.6`, directional `0xfff2df @ 0.9`, rim `0x2b5fa6 @ 0.5`

5. **Ripple pauses while scrolling through the 4 steps, resumes before/after.** This is driven by checking whether `.process-track`'s bounding rect currently spans the viewport (see `isRippleActive()`). If the real DOM structure around the step list changes during integration, this check needs to keep targeting whatever element's scroll range corresponds to the step-cycling — not necessarily the same class name.

## Suggested order of operations for Claude Code

1. Get the WebGL scene rendering in isolation on a scratch branch/page first — confirm cubes show up, mouse ripple works, before touching the live homepage at all.
2. Swap in the real 4-step copy/structure in place of the prototype's placeholder markup (should be closest to 1:1 already).
3. Wire it into the real page in place of the current process section, re-tune the `-38vh` bleed value against real content above it.
4. Apply the two "What we do" card changes (z-index + glass).
5. Verify: desktop ripple works, ripple pauses/resumes correctly at section boundaries, mobile is completely unaffected, nothing above/below the process section moved.
