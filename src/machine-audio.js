export function createMachineAudio() {
  let context;
  let enabled = false;
  let loop = null;
  let lastPulse = 0;

  function getContext() {
    context ??= new (window.AudioContext || window.webkitAudioContext)();
    context.resume();
    return context;
  }

  function stop() {
    if (!loop) return;
    for (const node of loop.sources) {
      try {
        node.stop();
      } catch {
        // The source may already have ended.
      }
      node.disconnect();
    }
    loop.gain.disconnect();
    loop = null;
  }

  function noiseSource(ctx) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  function start(type) {
    if (!enabled || loop?.type === type) return;
    stop();
    const ctx = getContext();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      type === "rotor" ? 0.045 : 0.032,
      ctx.currentTime + 0.08,
    );
    gain.connect(ctx.destination);
    const sources = [];
    if (type === "rover") {
      const motor = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      motor.type = "sawtooth";
      motor.frequency.value = 48;
      filter.type = "lowpass";
      filter.frequency.value = 420;
      motor.connect(filter).connect(gain);
      motor.start();
      sources.push(motor);
      loop = { type, gain, sources, motor, filter };
    } else {
      const blade = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const wind = noiseSource(ctx);
      const windFilter = ctx.createBiquadFilter();
      const windGain = ctx.createGain();
      blade.type = "sawtooth";
      harmonic.type = "triangle";
      blade.frequency.value = 72;
      harmonic.frequency.value = 144;
      windFilter.type = "bandpass";
      windFilter.frequency.value = 750;
      windFilter.Q.value = 0.7;
      windGain.gain.value = 0.14;
      blade.connect(gain);
      harmonic.connect(gain);
      wind.connect(windFilter).connect(windGain).connect(gain);
      blade.start();
      harmonic.start();
      wind.start();
      sources.push(blade, harmonic, wind);
      loop = { type, gain, sources, blade, harmonic };
    }
  }

  function update({ power = 50, roughness = 0 } = {}) {
    if (!loop || !enabled) return;
    const ctx = getContext();
    if (loop.type === "rover") {
      loop.motor.frequency.setTargetAtTime(
        42 + roughness * 22,
        ctx.currentTime,
        0.04,
      );
      loop.filter.frequency.setTargetAtTime(
        360 + roughness * 520,
        ctx.currentTime,
        0.05,
      );
    } else {
      const bladeHz = 58 + power * 0.34;
      loop.blade.frequency.setTargetAtTime(bladeHz, ctx.currentTime, 0.04);
      loop.harmonic.frequency.setTargetAtTime(
        bladeHz * 2,
        ctx.currentTime,
        0.04,
      );
    }
  }

  function pulse(type, intensity = 1) {
    if (!enabled) return;
    const now = performance.now();
    if (now - lastPulse < 45) return;
    lastPulse = now;
    const ctx = getContext();
    const gain = ctx.createGain();
    const oscillator = ctx.createOscillator();
    const duration = type === "servo" ? 0.11 : 0.045;
    oscillator.type = type === "servo" ? "sawtooth" : "square";
    oscillator.frequency.setValueAtTime(
      type === "servo" ? 150 + intensity * 120 : 72 + Math.random() * 55,
      ctx.currentTime,
    );
    if (type === "servo")
      oscillator.frequency.exponentialRampToValueAtTime(
        72,
        ctx.currentTime + duration,
      );
    gain.gain.setValueAtTime(0.018 * intensity, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  return {
    setEnabled(value) {
      enabled = value;
      if (!enabled) stop();
    },
    start,
    stop,
    update,
    pulse,
  };
}
