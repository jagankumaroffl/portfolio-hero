// Jelly-mass physics for the Hero's cursor reveal.
//
// A short chain of masses — the leader spring-chases the pointer, every
// later mass spring-chases the one before it. What this pass changes on
// top of that (unchanged) skeleton:
//
// 1. MORPHOLOGY: the leader's outline is no longer one fixed harmonic
//    "shape" that gets rotated/panned. Each harmonic's own amplitude now
//    breathes over its own slow, independent period (see ampDriftFrequency
//    in heroMaskConstants.ts), so the balance between "one big lobe",
//    "two lobes", and "pinched/asymmetric" keeps shifting — the viewer
//    can't lock onto a single recognizable master silhouette.
//
// 2. DIRECTIONAL STRETCH: outline deformation now includes a term locked
//    to each mass's OWN current velocity direction — elongating fore/aft
//    along the direction of travel and pinching the perpendicular sides
//    (a mass-conserving stretch, not a uniform inflate). This is driven
//    by real per-mass velocity, so it naturally vanishes at rest and
//    grows with speed.
//
// 3. FRAGMENT IDENTITY: secondary masses (followers) use a DIFFERENT
//    harmonic vocabulary than the leader (see
//    HERO_MASK_FRAGMENT_OUTLINE_HARMONICS) — different frequencies,
//    amplitudes, and drift rates — so a split reads as its own irregular
//    piece of jelly, not a scaled-down copy of the main mass. Each fresh
//    "emergence" (tension rising from ~0) also re-seeds that fragment's
//    phase offset, so repeated splits don't all produce the same-looking
//    piece either.
//
// 4. SAFETY CLAMPS: the leader's spring velocity is capped, so an
//    abnormal one-frame pointer jump (window/monitor teleport, a very
//    fast re-entry) can't produce an explosive single-frame stretch.
//
// The distance-gated split/merge/dissipate "tension" mechanic, the
// ~1-second stationary dissipation timer, idle radius breathing, and the
// leader's own pointer-following spring are all unchanged from the
// previous pass.
//
// All state lives in plain arrays/objects mutated in place; nothing here
// touches React state or the DOM, so the calling hook can drive it from a
// GSAP ticker and write straight to path `d` attributes without
// triggering re-renders.

import {
  HERO_MASK_BASE_RADIUS_PX,
  HERO_MASK_CHAIN_DAMPING,
  HERO_MASK_CHAIN_STIFFNESS,
  HERO_MASK_DISSIPATE_DELAY_SECONDS,
  HERO_MASK_DISSIPATE_STAGGER_SECONDS,
  HERO_MASK_EMERGENCE_TENSION_THRESHOLD,
  HERO_MASK_ENTRY_SEED_FRACTION,
  HERO_MASK_FRAGMENT_OUTLINE_HARMONICS,
  HERO_MASK_IDLE_POSITION_AMPLITUDE_PX,
  HERO_MASK_IDLE_POSITION_FREQUENCY,
  HERO_MASK_IDLE_RADIUS_NOISE_LAYERS,
  HERO_MASK_LEADER_DAMPING,
  HERO_MASK_LEADER_OUTLINE_HARMONICS,
  HERO_MASK_LEADER_STIFFNESS,
  HERO_MASK_MASS_COUNT,
  HERO_MASK_MAX_LEADER_SPEED_PX_S,
  HERO_MASK_OUTLINE_MAX_MULTIPLIER,
  HERO_MASK_OUTLINE_MIN_MULTIPLIER,
  HERO_MASK_OUTLINE_POINT_COUNT,
  HERO_MASK_RADIUS_DAMPING,
  HERO_MASK_RADIUS_FRACTIONS,
  HERO_MASK_RADIUS_STIFFNESS,
  HERO_MASK_REFORM_THRESHOLD_FRACTION,
  HERO_MASK_SPEED_RADIUS_BOOST_MAX_PX,
  HERO_MASK_SPEED_RADIUS_GAIN,
  HERO_MASK_STILL_SPEED_THRESHOLD_PX_S,
  HERO_MASK_STRETCH_GAIN,
  HERO_MASK_STRETCH_MAX_AMPLITUDE,
  HERO_MASK_STRETCH_PINCH_FACTOR,
  HERO_MASK_STRETCH_TRAIL_FACTOR,
  HERO_MASK_TENSION_FAR_PX,
  HERO_MASK_TENSION_NEAR_PX,
  HERO_MASK_TENSION_PEAK_PX,
} from "./heroMaskConstants";

/** Golden-angle-spaced per-mass phase offsets so idle noise/harmonics never visibly sync up. */
const GOLDEN_ANGLE = 2.399963229728653;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Cubic smoothstep, 0 at/before `a`, 1 at/after `b`, smooth between. */
function smoothstep(a: number, b: number, x: number): number {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Smooth "tent" curve used to gate a follower's visibility by distance
 * from its parent: rises from 0 to 1 between NEAR and PEAK, then falls
 * back from 1 to 0 between PEAK and FAR.
 */
function tensionCurve(distance: number): number {
  const rising = smoothstep(HERO_MASK_TENSION_NEAR_PX, HERO_MASK_TENSION_PEAK_PX, distance);
  const falling = 1 - smoothstep(HERO_MASK_TENSION_PEAK_PX, HERO_MASK_TENSION_FAR_PX, distance);
  return rising * falling;
}

export type HeroMassState = {
  /** Spring-driven position (the "true" physics position). */
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  /** Final on-screen position for this frame: cx/cy plus a small cosmetic
   *  idle-wander offset. Read this when rendering, not cx/cy directly. */
  renderX: number;
  renderY: number;
  radius: number;
  radiusVelocity: number;
  /** Tension from the previous frame — used only to detect the instant a
   *  follower newly emerges (tension rising through
   *  HERO_MASK_EMERGENCE_TENSION_THRESHOLD) so its outline can be re-seeded. */
  prevTension: number;
  /** Phase offset applied to this mass's fragment harmonics, re-rolled on
   *  every fresh emergence so repeated splits don't all look identical.
   *  Unused by the leader. */
  outlineSeed: number;
};

export type HeroMaskState = {
  active: boolean;
  targetX: number;
  targetY: number;
  stillTimer: number;
  elapsed: number;
  masses: HeroMassState[];
};

function createMass(): HeroMassState {
  return {
    cx: 0,
    cy: 0,
    vx: 0,
    vy: 0,
    renderX: 0,
    renderY: 0,
    radius: 0,
    radiusVelocity: 0,
    prevTension: 0,
    outlineSeed: 0,
  };
}

export function createHeroMaskState(): HeroMaskState {
  return {
    active: false,
    targetX: 0,
    targetY: 0,
    // Starts already past the dissipate delay so a page that never
    // receives a pointer event stays fully collapsed.
    stillTimer: HERO_MASK_DISSIPATE_DELAY_SECONDS,
    elapsed: 0,
    masses: Array.from({ length: HERO_MASK_MASS_COUNT }, createMass),
  };
}

/** True when the leader has shrunk small enough that the next pointer
 *  activity should be treated as a fresh reform rather than a smooth
 *  continuation of whatever's still (barely) on screen. */
export function isHeroMaskCollapsed(state: HeroMaskState): boolean {
  return state.masses[0].radius < HERO_MASK_BASE_RADIUS_PX * HERO_MASK_REFORM_THRESHOLD_FRACTION;
}

/**
 * Call on a fresh reform (pointer enter/move while isHeroMaskCollapsed()
 * was true) so every mass starts small and collapsed onto the entry point
 * and springs up to full size over the next few frames. The outline
 * harmonics themselves are never reset (state.elapsed keeps running), so
 * the resulting silhouette is never identical to the previous formation.
 */
export function seedHeroMaskEntry(state: HeroMaskState, x: number, y: number): void {
  state.targetX = x;
  state.targetY = y;
  state.stillTimer = 0;
  for (let i = 0; i < state.masses.length; i += 1) {
    const mass = state.masses[i];
    mass.cx = x;
    mass.cy = y;
    mass.vx = 0;
    mass.vy = 0;
    mass.renderX = x;
    mass.renderY = y;
    mass.radius = HERO_MASK_BASE_RADIUS_PX * HERO_MASK_RADIUS_FRACTIONS[i] * HERO_MASK_ENTRY_SEED_FRACTION;
    mass.radiusVelocity = 0;
    mass.prevTension = 0;
  }
}

/** Advances every spring, the idle-noise clock, and the dissipation timer by `dt` seconds, in place. */
export function stepHeroMaskState(state: HeroMaskState, dt: number): void {
  state.elapsed += dt;

  const leader = state.masses[0];

  // Leader spring: chases the pointer target with lag + a touch of
  // overshoot rather than being assigned the pointer position directly.
  const lax = HERO_MASK_LEADER_STIFFNESS * (state.targetX - leader.cx) - HERO_MASK_LEADER_DAMPING * leader.vx;
  const lay = HERO_MASK_LEADER_STIFFNESS * (state.targetY - leader.cy) - HERO_MASK_LEADER_DAMPING * leader.vy;
  leader.vx += lax * dt;
  leader.vy += lay * dt;

  // Safety clamp: bounds a single abnormal pointer jump (window/monitor
  // teleport, alt-tab, very fast re-entry) from producing an explosive
  // one-frame stretch — see HERO_MASK_MAX_LEADER_SPEED_PX_S doc comment.
  const leaderRawSpeed = Math.hypot(leader.vx, leader.vy);
  if (leaderRawSpeed > HERO_MASK_MAX_LEADER_SPEED_PX_S) {
    const scale = HERO_MASK_MAX_LEADER_SPEED_PX_S / leaderRawSpeed;
    leader.vx *= scale;
    leader.vy *= scale;
  }

  leader.cx += leader.vx * dt;
  leader.cy += leader.vy * dt;

  const leaderSpeed = Math.hypot(leader.vx, leader.vy);

  // Dissipation timer: resets while genuinely moving inside the hero,
  // otherwise counts up. Leaving the hero fast-forwards it to just short
  // of the delay so the mass eases out quickly rather than waiting out a
  // full second after the pointer is already gone. Unchanged behavior.
  if (state.active && leaderSpeed > HERO_MASK_STILL_SPEED_THRESHOLD_PX_S) {
    state.stillTimer = 0;
  } else {
    state.stillTimer += dt;
  }
  if (!state.active) {
    state.stillTimer = Math.max(state.stillTimer, HERO_MASK_DISSIPATE_DELAY_SECONDS - 0.25);
  }

  const leaderSpeedBoost = Math.min(leaderSpeed * HERO_MASK_SPEED_RADIUS_GAIN, HERO_MASK_SPEED_RADIUS_BOOST_MAX_PX);

  const n = state.masses.length;
  for (let i = 0; i < n; i += 1) {
    const mass = state.masses[i];
    let tension = 1; // the leader is always "fully present" while active

    if (i > 0) {
      const prev = state.masses[i - 1];
      const cax = HERO_MASK_CHAIN_STIFFNESS * (prev.cx - mass.cx) - HERO_MASK_CHAIN_DAMPING * mass.vx;
      const cay = HERO_MASK_CHAIN_STIFFNESS * (prev.cy - mass.cy) - HERO_MASK_CHAIN_DAMPING * mass.vy;
      mass.vx += cax * dt;
      mass.vy += cay * dt;
      mass.cx += mass.vx * dt;
      mass.cy += mass.vy * dt;

      // The split/merge/dissipate mechanic: how far this mass currently
      // is from the one it's chasing determines how visible it is this
      // frame, continuously — never a hard state switch.
      const distanceFromParent = Math.hypot(mass.cx - prev.cx, mass.cy - prev.cy);
      tension = tensionCurve(distanceFromParent);

      // A fresh emergence (tension rising up out of ~0) gets its own
      // outline phase offset, so repeated splits don't all produce the
      // same-looking fragment.
      if (mass.prevTension < HERO_MASK_EMERGENCE_TENSION_THRESHOLD && tension >= HERO_MASK_EMERGENCE_TENSION_THRESHOLD) {
        mass.outlineSeed = state.elapsed;
      }
      mass.prevTension = tension;
    }

    // Small autonomous drift on top of the spring position, kept out of
    // the spring state itself so it can't accumulate/destabilize the
    // chain — this plus the outline harmonics (applied when building the
    // path) is what keeps the silhouette visibly alive at rest.
    const phase = i * GOLDEN_ANGLE;
    const wanderAngle = state.elapsed * HERO_MASK_IDLE_POSITION_FREQUENCY * Math.PI * 2;
    mass.renderX = mass.cx + HERO_MASK_IDLE_POSITION_AMPLITUDE_PX * Math.sin(wanderAngle + phase);
    mass.renderY = mass.cy + HERO_MASK_IDLE_POSITION_AMPLITUDE_PX * Math.cos(wanderAngle + phase * 1.3);

    const baseRadius = HERO_MASK_BASE_RADIUS_PX * HERO_MASK_RADIUS_FRACTIONS[i];

    let idleNoise = 0;
    for (const layer of HERO_MASK_IDLE_RADIUS_NOISE_LAYERS) {
      idleNoise += layer.amplitude * Math.sin(state.elapsed * layer.frequency * Math.PI * 2 + phase);
    }

    // Still-timeout dissipation (unchanged behavior): tail masses get a
    // head start so they fade before the leader does.
    const dissipateThreshold = HERO_MASK_DISSIPATE_DELAY_SECONDS - i * HERO_MASK_DISSIPATE_STAGGER_SECONDS;
    const shouldDissipate = state.stillTimer >= dissipateThreshold;

    const fullTargetRadius = clamp(baseRadius + idleNoise + leaderSpeedBoost * HERO_MASK_RADIUS_FRACTIONS[i], 0, baseRadius * 2);

    // Tension gates the follower's radius on top of everything else: a
    // follower sitting close to its parent has its size suppressed
    // toward 0 (reabsorbed into the leader's own shape) regardless of how
    // "full size" it would otherwise be.
    const targetRadius = shouldDissipate ? 0 : fullTargetRadius * tension;

    const radiusAccel =
      HERO_MASK_RADIUS_STIFFNESS * (targetRadius - mass.radius) - HERO_MASK_RADIUS_DAMPING * mass.radiusVelocity;
    mass.radiusVelocity += radiusAccel * dt;
    mass.radius = clamp(mass.radius + mass.radiusVelocity * dt, 0, baseRadius * 2.2);
  }
}

type Point = { x: number; y: number };

type OutlineHarmonic = {
  harmonic: number;
  amplitude: number;
  rotationSpeed: number;
  ampDriftFrequency: number;
  ampDriftDepth: number;
};

/** Builds this mass's irregular outline for the current frame: a ring of
 *  points whose radius is modulated by large, low-frequency angular
 *  harmonics (with their own amplitudes slowly breathing over time) plus
 *  a velocity-direction-locked stretch — this combination is what makes
 *  it read as a continuously evolving liquid lobe rather than a fixed
 *  shape being panned around, and what makes a fragment read as its own
 *  irregular piece rather than a shrunk copy of the leader. */
function buildMassOutlinePoints(state: HeroMaskState, massIndex: number): Point[] {
  const mass = state.masses[massIndex];
  const isLeader = massIndex === 0;
  const harmonics: readonly OutlineHarmonic[] = isLeader
    ? HERO_MASK_LEADER_OUTLINE_HARMONICS
    : HERO_MASK_FRAGMENT_OUTLINE_HARMONICS;
  const seed = isLeader ? massIndex * 1.7 : massIndex * 1.7 + mass.outlineSeed;

  const speed = Math.hypot(mass.vx, mass.vy);
  const moveAngle = speed > 0.01 ? Math.atan2(mass.vy, mass.vx) : 0;
  const stretchAmp = Math.min(speed * HERO_MASK_STRETCH_GAIN, HERO_MASK_STRETCH_MAX_AMPLITUDE);

  const points: Point[] = new Array(HERO_MASK_OUTLINE_POINT_COUNT);

  for (let k = 0; k < HERO_MASK_OUTLINE_POINT_COUNT; k += 1) {
    const angle = (k / HERO_MASK_OUTLINE_POINT_COUNT) * Math.PI * 2;

    let deformation = 0;
    for (const h of harmonics) {
      const drift = state.elapsed * h.rotationSpeed + seed;
      const ampEnvelope =
        h.amplitude * (1 - h.ampDriftDepth / 2 + (h.ampDriftDepth / 2) * Math.sin(state.elapsed * h.ampDriftFrequency * Math.PI * 2 + seed));
      deformation += ampEnvelope * Math.cos(h.harmonic * angle - drift);
    }

    if (stretchAmp > 0.0001) {
      // Fore/aft elongation along the direction of travel...
      deformation += stretchAmp * Math.cos(angle - moveAngle);
      deformation += stretchAmp * HERO_MASK_STRETCH_TRAIL_FACTOR * Math.cos(angle - (moveAngle + Math.PI));
      // ...and a perpendicular pinch, so the mass reads as redistributed
      // (stretched thinner, not just inflated) rather than scaled up.
      deformation -= stretchAmp * HERO_MASK_STRETCH_PINCH_FACTOR * Math.cos(2 * (angle - moveAngle));
    }

    const multiplier = clamp(1 + deformation, HERO_MASK_OUTLINE_MIN_MULTIPLIER, HERO_MASK_OUTLINE_MAX_MULTIPLIER);
    const radius = mass.radius * multiplier;

    points[k] = {
      x: mass.renderX + radius * Math.cos(angle),
      y: mass.renderY + radius * Math.sin(angle),
    };
  }

  return points;
}

/**
 * Threads a Catmull-Rom spline through a closed loop of points and
 * returns it as a cubic-bezier SVG path `d` string — smooth rather than a
 * faceted polygon, without needing an external curve lib.
 */
function catmullRomToBezierPath(points: Point[]): string {
  const n = points.length;
  if (n < 3) return "";

  const at = (i: number) => points[((i % n) + n) % n];

  let d = `M ${at(0).x.toFixed(2)} ${at(0).y.toFixed(2)} `;
  for (let i = 0; i < n; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }
  return `${d}Z`;
}

/** Builds the current frame's SVG path `d` string for one mass. */
export function buildHeroMassPath(state: HeroMaskState, massIndex: number): string {
  const mass = state.masses[massIndex];
  if (mass.radius <= 0.5) {
    return `M ${mass.renderX.toFixed(2)} ${mass.renderY.toFixed(2)} Z`;
  }
  return catmullRomToBezierPath(buildMassOutlinePoints(state, massIndex));
}