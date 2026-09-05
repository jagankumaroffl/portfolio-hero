// Tuning constants for the Hero's organic cursor-mask reveal: a short
// chain of irregular "jelly masses" (deformed SVG paths, not circles)
// fused by a gooey filter. See heroMaskGeometry.ts for the physics and
// useHeroMaskReveal.ts for how it's driven.

/** Number of masses in the chain: index 0 is the "leader" — the main
 *  jelly mass that spring-chases the pointer directly and is always
 *  visible while active. Every later mass spring-chases the one before
 *  it, but (unlike a permanent trailing chain) only becomes visible when
 *  stretched far enough from its parent — see the TENSION constants
 *  below. Kept small (one leader + two potential secondary lobes) so a
 *  split reads as "one mass dividing," not a train of beads. */
export const HERO_MASK_MASS_COUNT = 3;

/** Each mass's radius as a fraction of HERO_MASK_BASE_RADIUS_PX, leader
 *  first. Must have HERO_MASK_MASS_COUNT entries. */
export const HERO_MASK_RADIUS_FRACTIONS = [1, 0.82, 0.66] as const;

/** Resting radius of the leader mass, in CSS pixels, before outline
 *  deformation and the gooey filter both expand on it — the primary
 *  "mask size" dial. */
export const HERO_MASK_BASE_RADIUS_PX = 108;

/** Spring constants for the leader mass chasing the pointer target
 *  directly. Lower stiffness / lower damping = looser, more elastic
 *  follow with more overshoot on direction changes. */
export const HERO_MASK_LEADER_STIFFNESS = 120;
export const HERO_MASK_LEADER_DAMPING = 13;

/** Hard cap on the leader's spring velocity, px/s. Without this, an
 *  abnormal one-frame pointer jump (browser/window teleport, alt-tab,
 *  a very fast re-entry) could otherwise produce a huge spring force and
 *  a single-frame explosive stretch. Also indirectly caps how far a fast
 *  flick can stretch the silhouette, since the directional-stretch
 *  deformation below reads directly off this same velocity. */
export const HERO_MASK_MAX_LEADER_SPEED_PX_S = 2200;

/** Spring constants for every other mass chasing the mass before it.
 *  Deliberately looser than the leader spring, and looser still than the
 *  previous pass — even a small pointer movement should open up enough
 *  lag distance to cross into visible-lobe territory (see the TENSION
 *  thresholds below, which were tightened to match). */
export const HERO_MASK_CHAIN_STIFFNESS = 34;
export const HERO_MASK_CHAIN_DAMPING = 5.5;

/** Spring constants for each mass's radius chasing its current target
 *  radius (see the tension-gated target radius in stepHeroMaskState). */
export const HERO_MASK_RADIUS_STIFFNESS = 150;
export const HERO_MASK_RADIUS_DAMPING = 12;

/**
 * Distance thresholds (px, measured between a follower and the mass it's
 * chasing) that gate how visible that follower is. Below NEAR the
 * follower is fully reabsorbed (invisible, reads as one mass with the
 * leader). Between NEAR and PEAK its target radius ramps up — it's
 * stretching out as a secondary lobe. Past PEAK the ramp reverses: the
 * further it gets, the weaker it becomes, reaching ~0 again at FAR — a
 * detached mass dissipates instead of trailing along forever. The
 * transition is a smooth "tent" curve (see tensionCurve in
 * heroMaskGeometry.ts), never a hard on/off switch.
 */
export const HERO_MASK_TENSION_NEAR_PX = 10;
export const HERO_MASK_TENSION_PEAK_PX = 48;
export const HERO_MASK_TENSION_FAR_PX = 190;

/** Tension level (0–1) a follower must cross, rising from near-zero, to
 *  count as "a new lobe just emerged" — at that instant its outline seed
 *  (see HeroMassState.outlineSeed) is re-rolled, so each new split gets
 *  its own distinct irregular shape rather than always producing the
 *  same-looking fragment. */
export const HERO_MASK_EMERGENCE_TENSION_THRESHOLD = 0.15;

/** Number of control points used to build each mass's irregular outline.
 *  More points = more detailed silhouette for negligible extra cost. */
export const HERO_MASK_OUTLINE_POINT_COUNT = 10;

/**
 * Harmonic "vocabulary" for the LEADER's (main mass's) outline:
 * radius(angle) = mass.radius * (1 + sum of
 *   amplitude(t) * cos(harmonic*angle - elapsed*rotationSpeed + phase)).
 *
 * Two things make this avoid ever reading as "one fixed shape, panned
 * around": the phase drifts continuously (rotationSpeed), AND each
 * harmonic's own amplitude breathes over a slow, independent period
 * (ampDriftFrequency/ampDriftDepth) — so it's not just the same silhouette
 * rotating, the actual balance between "one big lobe" (harmonic 1), "two
 * lobes" (harmonic 2), and "pinched/three-lobed" (harmonic 3) keeps
 * shifting. Large amplitudes on a small number of harmonics is what keeps
 * the deformation large-scale rather than noisy micro-wobble.
 */
export const HERO_MASK_LEADER_OUTLINE_HARMONICS = [
  { harmonic: 1, amplitude: 0.36, rotationSpeed: 0.22, ampDriftFrequency: 0.17, ampDriftDepth: 0.78 },
  { harmonic: 2, amplitude: 0.24, rotationSpeed: -0.15, ampDriftFrequency: 0.14, ampDriftDepth: 0.8 },
  { harmonic: 3, amplitude: 0.16, rotationSpeed: 0.1, ampDriftFrequency: 0.21, ampDriftDepth: 0.82 },
] as const;

/**
 * Separate, deliberately different harmonic vocabulary for SECONDARY
 * masses (followers). Using the same set as the leader (just scaled down)
 * is what previously made a split look like "a smaller copy of the main
 * blob" — a distinct frequency/amplitude/drift combination here is what
 * makes a fragment read as its own irregular piece of jelly instead of a
 * shrunk clone.
 */
export const HERO_MASK_FRAGMENT_OUTLINE_HARMONICS = [
  { harmonic: 1, amplitude: 0.22, rotationSpeed: -0.34, ampDriftFrequency: 0.13, ampDriftDepth: 0.65 },
  { harmonic: 3, amplitude: 0.26, rotationSpeed: 0.28, ampDriftFrequency: 0.1, ampDriftDepth: 0.6 },
  { harmonic: 4, amplitude: 0.14, rotationSpeed: -0.19, ampDriftFrequency: 0.16, ampDriftDepth: 0.5 },
] as const;

/** Hard floor/ceiling on the outline's per-point radius multiplier, so an
 *  unlucky harmonic + stretch sum can never pinch a point through the
 *  center or balloon it into a self-intersecting spike. */
export const HERO_MASK_OUTLINE_MIN_MULTIPLIER = 0.3;
export const HERO_MASK_OUTLINE_MAX_MULTIPLIER = 1.95;

/**
 * Velocity-direction-locked elongation, applied on top of the harmonic
 * vocabulary above using each mass's OWN current velocity (so a follower
 * that's actively stretching away gets its own directional pull, not just
 * the leader). This is what gives fast movement a genuine fore/aft stretch
 * with a "mass-conserving" pinch on the sides, rather than the whole
 * silhouette merely puffing up uniformly:
 *   + gain toward the direction of travel (leading edge stretches),
 *   + a smaller amount opposite it (trailing tail),
 *   − a perpendicular pinch (the sides narrow as the ends stretch).
 * Raise STRETCH_GAIN for more dramatic elongation at a given speed; raise
 * STRETCH_MAX_AMPLITUDE to allow a longer stretch at very high speed.
 * GAIN is set high enough that even a slow, small pointer movement
 * produces a clearly visible stretch, not just a fast flick.
 */
export const HERO_MASK_STRETCH_GAIN = 0.0016;
export const HERO_MASK_STRETCH_MAX_AMPLITUDE = 0.85;
export const HERO_MASK_STRETCH_TRAIL_FACTOR = 0.6;
export const HERO_MASK_STRETCH_PINCH_FACTOR = 0.4;

/** Layered low-frequency sine oscillators applied to each mass's overall
 *  (pre-outline-deformation) radius so it keeps breathing even when the
 *  cursor is still (idle-animation dial). */
export const HERO_MASK_IDLE_RADIUS_NOISE_LAYERS = [
  { amplitude: 6, frequency: 0.5 },
  { amplitude: 3.5, frequency: 1.15 },
] as const;

/** Small autonomous positional drift applied to every mass on top of its
 *  spring target, so masses don't sit perfectly still even at rest —
 *  combined with the outline harmonics above, this is what keeps the
 *  silhouette visibly shifting while the pointer itself isn't moving. */
export const HERO_MASK_IDLE_POSITION_AMPLITUDE_PX = 5;
export const HERO_MASK_IDLE_POSITION_FREQUENCY = 0.4;

/** How much extra (isotropic) radius the leader gains per px/s of its own
 *  speed, and the hard cap on that boost. This stacks with the
 *  directional stretch above — this term thickens the mass a little
 *  overall; the stretch term is what actually elongates it. Followers get
 *  this scaled by their own tension, so it only shows up on a lobe that's
 *  already visibly splitting off. */
export const HERO_MASK_SPEED_RADIUS_GAIN = 0.035;
export const HERO_MASK_SPEED_RADIUS_BOOST_MAX_PX = 26;

/** Leader speed (px/s) below which the pointer counts as "stopped" for
 *  the dissipation timer below. */
export const HERO_MASK_STILL_SPEED_THRESHOLD_PX_S = 12;

/** How long the pointer must stay stopped (or be outside the hero) before
 *  the whole mass starts dissipating — the "~half a second, then
 *  disappear" behavior. */
export const HERO_MASK_DISSIPATE_DELAY_SECONDS = 0.1;

/** Per-mass head start on the still-timeout dissipation, in seconds, so
 *  secondary masses fade before the leader does rather than in lockstep. */
export const HERO_MASK_DISSIPATE_STAGGER_SECONDS = 0.12;

/** Fraction of HERO_MASK_BASE_RADIUS_PX below which the leader is
 *  considered fully collapsed — used to decide whether the next pointer
 *  activity should be treated as a fresh "reform from nothing" (reseed
 *  every mass near the entry point) rather than a smooth continuation. */
export const HERO_MASK_REFORM_THRESHOLD_FRACTION = 0.3;

/** Seed radius fraction (of each mass's own base radius) used on a fresh
 *  reform — starting small and springing up to full size is what makes
 *  the mask "appear" rather than pop in at full size. Since the outline
 *  harmonics keep drifting continuously the whole time (never reset),
 *  a fresh reform never has the exact same silhouette as the one before
 *  it, without any extra bookkeeping. */
export const HERO_MASK_ENTRY_SEED_FRACTION = 0.22;

/** Blur radius (px) in the gooey filter — how close two masses need to be
 *  before their (already-irregular) edges visibly bridge into one
 *  connected shape. Unchanged from the previous pass. */
export const HERO_MASK_GOOEY_BLUR_STD_DEVIATION = 9;

/** feComponentTransfer alpha-channel slope/intercept applied after the
 *  blur: alpha' = slope * alpha + intercept. Unchanged from the previous
 *  pass — this is what keeps the edge crisp rather than a hazy glow. */
export const HERO_MASK_GOOEY_MATRIX_SLOPE = 22;
export const HERO_MASK_GOOEY_MATRIX_INTERCEPT = -9;

/** Per-frame delta-time clamp (seconds) so a dropped/backgrounded tab
 *  can't feed the springs a huge dt and make the chain jump. */
export const HERO_MASK_MAX_DT_SECONDS = 1 / 20;