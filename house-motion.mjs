const clamp = n => Math.max(0, Math.min(1, n));
const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };
const ramp = (p, a, b) => ease((p - a) / (b - a));
const lift = (p, a, b, c, d) => ramp(p, a, b) * (1 - ramp(p, c, d));
export function housePose(progress) {
 const p = clamp(progress) * 3;
 return {
  rotation: -.3 + 2.1 * ramp(p, .82, 1.18) + 2.1 * ramp(p, 1.88, 2.18) + (Math.PI * 2 - 4.2) * ramp(p, 2.88, 3),
  parts: [lift(p, .02, .24, .61, .8), lift(p, 1.2, 1.4, 1.65, 1.86), lift(p, 2.2, 2.4, 2.66, 2.86)]
 };
}
export function damp(current, target, seconds) {
 return current + (target - current) * (1 - Math.exp(-8 * Math.min(.1, Math.max(0, seconds))));
}
