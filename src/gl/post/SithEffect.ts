import { Effect } from "postprocessing";
import { Color, Uniform, Vector3 } from "three";

const fragment = /* glsl */ `
uniform vec3 uTint;
uniform float uSaturation;
uniform float uExposure;
uniform float uDuality;
uniform float uSplit;
uniform float uHeat;
uniform float uTime;
uniform float uVelocity;
uniform float uRewind;
uniform float uFlash;
uniform vec3 uFlashColor;
uniform float uAspect;
uniform float uVignette;
uniform float uWarp;
uniform vec3 uWarpColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec3 acesFitted(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void mainUv(inout vec2 uv) {
  // Mustafar heat haze: rising shimmer, stronger near the ground
  if (uHeat > 0.0) {
    float n1 = vnoise(vec2(uv.x * 14.0, uv.y * 9.0 - uTime * 1.8));
    float n2 = vnoise(vec2(uv.x * 31.0 + 7.0, uv.y * 24.0 - uTime * 2.7));
    uv += vec2(n1 - 0.5, n2 - 0.5) * 0.007 * uHeat * (1.25 - uv.y);
  }
  // VHS rewind: line jitter + rolling tracking band
  if (uRewind > 0.0) {
    float line = floor(uv.y * 260.0);
    float jitter = hash(vec2(line, floor(uTime * 24.0))) - 0.5;
    float band = smoothstep(0.0, 0.04, fract(uv.y * 1.3 - uTime * 0.9)) * (1.0 - smoothstep(0.04, 0.09, fract(uv.y * 1.3 - uTime * 0.9)));
    uv.x += (jitter * 0.006 + band * 0.03) * uRewind;
  }
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 col = inputColor.rgb;

  // Hyperspace jump (act navigation): radial zoom smear + star streaks
  if (uWarp > 0.001) {
    vec2 c = uv - 0.5;
    vec3 acc = vec3(0.0);
    float jitter = hash(uv * 731.0 + fract(uTime));
    for (int i = 0; i < 12; i++) {
      float s = 1.0 - uWarp * 0.42 * (float(i) + jitter) / 12.0;
      acc += texture2D(inputBuffer, 0.5 + c * s).rgb;
    }
    col = mix(col, acc / 12.0, smoothstep(0.0, 0.3, uWarp));

    vec2 p = c;
    p.x *= uAspect;
    float r = length(p);
    float lanes = 140.0;
    float a = atan(p.y, p.x) / 6.2831853 * lanes;
    float lane = floor(a);
    float h = hash(vec2(lane, 7.0));
    float across = abs(fract(a) - 0.5) * 2.0;
    float thin = 1.0 - smoothstep(0.0, 0.35, across);
    float head = fract(hash(vec2(lane, 13.0)) + uTime * (0.25 + h * 0.6) * (0.4 + uWarp * 2.6));
    float len = 0.04 + uWarp * uWarp * 0.55;
    float seg = smoothstep(head - len, head, r) * (1.0 - smoothstep(head, head + 0.004, r));
    float streak = seg * thin * step(0.45, h) * smoothstep(0.04, 0.22, r);
    vec3 starCol = mix(vec3(1.0), uWarpColor, 0.45 + h * 0.4);
    col += starCol * streak * uWarp * 3.0;
    col += uWarpColor * exp(-r * 5.0) * uWarp * uWarp * 0.9;
  }

  // Chromatic split driven by scroll velocity (and rewind)
  float ca = clamp(abs(uVelocity) * 0.00009, 0.0, 0.0045) + uRewind * 0.007;
  if (ca > 0.00005) {
    vec2 dir = (uv - 0.5) * ca * 2.0;
    // Shift only the detail (offset - center) so bloom already in col survives
    vec3 center = texture2D(inputBuffer, uv).rgb;
    col.r += texture2D(inputBuffer, uv + dir).r - center.r;
    col.b += texture2D(inputBuffer, uv - dir).b - center.b;
  }

  col *= uExposure;
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(lum), col, uSaturation) * uTint;

  // Duality: the frame is cut by a saber — Jedi light left, Sith fire right
  if (uDuality > 0.0) {
    float wobble = (vnoise(vec2(uv.y * 7.0, uTime * 2.2)) - 0.5) * 0.004;
    float x = uv.x - uSplit - wobble;
    float side = smoothstep(-0.0012, 0.0012, x);
    float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
    vec3 light = mix(vec3(l), col, 0.2) * vec3(0.7, 0.92, 1.3) + vec3(0.0, 0.004, 0.012);
    vec3 dark = mix(vec3(l), col, 0.9) * vec3(1.3, 0.42, 0.34) * 0.85;
    col = mix(col, mix(light, dark, side), uDuality);
    float d = abs(x) * uAspect;
    float flicker = 0.92 + 0.08 * vnoise(vec2(uTime * 30.0, 0.0));
    float core = exp(-d * 1400.0);
    float glow = exp(-d * 90.0) * 0.55 + exp(-d * 16.0) * 0.12;
    vec3 seam = mix(vec3(0.36, 0.78, 1.0), vec3(1.0, 0.16, 0.1), smoothstep(-0.02, 0.02, x));
    col += (vec3(1.0) * core * 1.6 + seam * glow * 1.8) * uDuality * flicker;
  }

  // Filmic tone mapping (the composer disables the renderer's)
  col = acesFitted(max(col, 0.0));

  if (uRewind > 0.0) {
    float scan = sin(uv.y * 1100.0) * 0.5 + 0.5;
    col *= 1.0 - scan * 0.22 * uRewind;
    col = mix(col, col * vec3(0.85, 1.05, 1.2), uRewind * 0.6);
    col += (hash(uv * 800.0 + uTime) - 0.5) * 0.14 * uRewind;
  }

  vec2 vc = uv - 0.5;
  vc.x *= mix(1.0, uAspect, 0.6);
  col *= 1.0 - smoothstep(0.3, 1.0, length(vc)) * uVignette;

  col = mix(col, uFlashColor, uFlash);
  outputColor = vec4(col, inputColor.a);
}
`;

export class SithEffect extends Effect {
  constructor() {
    super("SithEffect", fragment, {
      uniforms: new Map<string, Uniform>([
        ["uTint", new Uniform(new Vector3(1, 1, 1))],
        ["uSaturation", new Uniform(1)],
        ["uExposure", new Uniform(1)],
        ["uDuality", new Uniform(0)],
        ["uSplit", new Uniform(0.5)],
        ["uHeat", new Uniform(0)],
        ["uTime", new Uniform(0)],
        ["uVelocity", new Uniform(0)],
        ["uRewind", new Uniform(0)],
        ["uFlash", new Uniform(0)],
        ["uFlashColor", new Uniform(new Color("#ff2a2a"))],
        ["uAspect", new Uniform(1)],
        ["uVignette", new Uniform(0.85)],
        ["uWarp", new Uniform(0)],
        ["uWarpColor", new Uniform(new Color("#ff2a2a"))],
      ]),
    });
  }

  u(name: string) {
    return this.uniforms.get(name)!;
  }
}
