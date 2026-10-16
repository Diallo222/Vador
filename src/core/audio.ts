import { Howl, Howler } from "howler";
import breathSrc from "/Darth.mp3";
import { getState, setState } from "./director";

/** Vader's respirator — the metronome of the whole site. */
const breath = new Howl({ src: [breathSrc], loop: true, volume: 0, preload: true });

/**
 * Asset-free sound design: every saber sound is synthesized with WebAudio.
 * The context is created lazily on the first user gesture (autoplay policy).
 */
class SaberSynth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private hum: { gain: GainNode; filter: BiquadFilterNode; oscs: OscillatorNode[] } | null = null;

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(ctx.destination);

    const length = ctx.sampleRate * 1.5;
    this.noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

    this.ctx = ctx;
    return ctx;
  }

  setMuted(muted: boolean) {
    if (!this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.05);
  }

  /** The iconic "snap-hiss" + rising hum. */
  ignite() {
    const ctx = this.ensure();
    if (!this.master || !this.noise) return;
    void ctx.resume();
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.8;
    band.frequency.setValueAtTime(5200, now);
    band.frequency.exponentialRampToValueAtTime(380, now + 0.55);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.0001, now);
    nGain.gain.exponentialRampToValueAtTime(0.5, now + 0.02);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    noise.connect(band).connect(nGain).connect(this.master);
    noise.start(now);
    noise.stop(now + 0.8);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const oGain = ctx.createGain();
    oGain.gain.setValueAtTime(0.0001, now);
    oGain.gain.exponentialRampToValueAtTime(0.22, now + 0.12);
    oGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    lp.connect(oGain).connect(this.master);
    [1, 1.012].forEach((detune) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(38 * detune, now);
      osc.frequency.exponentialRampToValueAtTime(92 * detune, now + 0.35);
      osc.connect(lp);
      osc.start(now);
      osc.stop(now + 2.3);
    });
  }

  /** Continuous hum while dragging the duality blade; pitch follows speed. */
  humStart() {
    const ctx = this.ensure();
    if (!this.master || this.hum) return;
    void ctx.resume();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.connect(gain).connect(this.master);
    const oscs = [88, 89.3, 176.5].map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 2 ? "triangle" : "sawtooth";
      osc.frequency.value = f;
      osc.connect(filter);
      osc.start();
      return osc;
    });
    gain.gain.setTargetAtTime(0.09, ctx.currentTime, 0.08);
    this.hum = { gain, filter, oscs };
  }

  humSpeed(speed: number) {
    if (!this.ctx || !this.hum) return;
    const s = Math.min(1, Math.abs(speed));
    const now = this.ctx.currentTime;
    this.hum.filter.frequency.setTargetAtTime(320 + s * 2400, now, 0.04);
    this.hum.gain.gain.setTargetAtTime(0.08 + s * 0.16, now, 0.04);
    this.hum.oscs.forEach((o, i) =>
      o.frequency.setTargetAtTime([88, 89.3, 176.5][i] * (1 + s * 0.35), now, 0.05),
    );
  }

  humStop() {
    if (!this.ctx || !this.hum) return;
    const { gain, oscs } = this.hum;
    const now = this.ctx.currentTime;
    gain.gain.setTargetAtTime(0, now, 0.12);
    oscs.forEach((o) => o.stop(now + 0.6));
    this.hum = null;
  }

  /** Tiny UI blip for hovers. */
  tick(freq = 1900) {
    if (!this.ctx || !this.master || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.025, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  /** Hyperspace jump: a rising noise sweep over a swelling sub. */
  jump() {
    if (!this.ctx || !this.master || !this.noise || this.ctx.state !== "running") return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 2.2;
    f.frequency.setValueAtTime(180, now);
    f.frequency.exponentialRampToValueAtTime(3600, now + 0.9);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.22, now + 0.75);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);
    src.connect(f).connect(g).connect(this.master);
    src.start(now);
    src.stop(now + 1.1);

    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(42, now);
    sub.frequency.exponentialRampToValueAtTime(110, now + 0.9);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, now);
    sg.gain.exponentialRampToValueAtTime(0.28, now + 0.8);
    sg.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    sub.connect(sg).connect(this.master);
    sub.start(now);
    sub.stop(now + 1.05);
  }

  /** Dropping out of hyperspace: a low thump and a falling hiss. */
  arrive() {
    if (!this.ctx || !this.master || !this.noise || this.ctx.state !== "running") return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.5);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, now);
    og.gain.exponentialRampToValueAtTime(0.4, now + 0.015);
    og.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc.connect(og).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.75);
    this.whoosh(false);
  }

  /** Filtered-noise sweep for big transitions (menu). */
  whoosh(up = true) {
    if (!this.ctx || !this.master || !this.noise || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.4;
    f.frequency.setValueAtTime(up ? 300 : 2400, now);
    f.frequency.exponentialRampToValueAtTime(up ? 2400 : 300, now + 0.6);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    src.connect(f).connect(g).connect(this.master);
    src.start(now);
    src.stop(now + 0.75);
  }
}

export const synth = new SaberSynth();

// The respirator stops when nobody is watching
let pausedByVisibility = false;
document.addEventListener("visibilitychange", () => {
  if (document.hidden && breath.playing()) {
    breath.pause();
    pausedByVisibility = true;
  } else if (!document.hidden && pausedByVisibility) {
    breath.play();
    pausedByVisibility = false;
  }
});

/* Breath analyser: the HUD ring and the vignette follow the real respirator */
let analyser: AnalyserNode | null = null;
let samples: Uint8Array | null = null;
let level = 0;

function attachAnalyser() {
  const ctx = Howler.ctx as AudioContext | undefined;
  const master = (Howler as unknown as { masterGain?: GainNode }).masterGain;
  if (analyser || !ctx || !master) return;
  analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  samples = new Uint8Array(analyser.fftSize);
  master.connect(analyser);
}

export const audio = {
  start() {
    if (!breath.playing()) breath.play();
    breath.fade(0, 0.42, 2500);
    attachAnalyser();
  },
  /** Smoothed respirator loudness 0 → 1, or -1 when no analyser (muted / no WebAudio). */
  level() {
    if (!analyser || !samples || getState().muted) return -1;
    analyser.getByteTimeDomainData(samples);
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      const v = (samples[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.min(1, Math.sqrt(sum / samples.length) * 6);
    level += (rms - level) * 0.12;
    return level;
  },
  setMuted(muted: boolean) {
    Howler.mute(muted);
    synth.setMuted(muted);
    setState({ muted });
  },
};
