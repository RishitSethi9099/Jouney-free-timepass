function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * 0.35;
  }

  return buffer;
}

function setParamSmooth(param, value, context, timeConstant = 0.12) {
  param.setTargetAtTime(value, context.currentTime, timeConstant);
}

export function createAudioSystem() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  const available = Boolean(AudioCtor);
  let context = null;
  let enabled = false;
  let noise = null;
  let noiseFilter = null;
  let windGain = null;
  let steamGain = null;
  let bellGain = null;
  let drone = null;
  let droneGain = null;
  let master = null;

  function ensureContext() {
    if (!available) {
      return null;
    }

    if (!context) {
      context = new AudioCtor();
      master = context.createGain();
      master.gain.value = 0.0001;
      master.connect(context.destination);

      noise = context.createBufferSource();
      noise.buffer = createNoiseBuffer(context);
      noise.loop = true;

      noiseFilter = context.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 640;
      noiseFilter.Q.value = 0.9;

      windGain = context.createGain();
      steamGain = context.createGain();
      bellGain = context.createGain();
      droneGain = context.createGain();

      const windPan = context.createStereoPanner();
      const steamPan = context.createStereoPanner();
      const bellPan = context.createStereoPanner();

      windGain.connect(windPan);
      windPan.connect(noiseFilter);
      noiseFilter.connect(master);

      steamGain.connect(steamPan);
      steamPan.connect(master);

      bellGain.connect(bellPan);
      bellPan.connect(master);

      droneGain.connect(master);

      drone = context.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = 48;
      drone.connect(droneGain);

      drone.start();
      noise.start();
    }

    return context;
  }

  function applyScene(scene) {
    if (!context || !scene) {
      return;
    }

    const ambience = scene.ambience;
    setParamSmooth(windGain.gain, ambience.wind, context);
    setParamSmooth(steamGain.gain, ambience.steam, context);
    setParamSmooth(bellGain.gain, ambience.bell, context);
    setParamSmooth(droneGain.gain, ambience.drone, context);
    setParamSmooth(noiseFilter.frequency, ambience.noiseFrequency, context, 0.2);
    setParamSmooth(master.gain, enabled ? 0.8 : 0.0001, context, 0.3);
  }

  function enable(scene) {
    const activeContext = ensureContext();

    if (!activeContext) {
      return false;
    }

    if (activeContext.state === 'suspended') {
      activeContext.resume();
    }

    enabled = true;
    applyScene(scene);
    return true;
  }

  function disable() {
    if (!context) {
      enabled = false;
      return;
    }

    enabled = false;
    setParamSmooth(master.gain, 0.0001, context, 0.35);
  }

  function setScene(scene) {
    if (!context || !enabled) {
      return;
    }

    applyScene(scene);
  }

  function destroy() {
    if (context) {
      context.close();
    }
  }

  return {
    available,
    enable,
    disable,
    setScene,
    destroy,
    get enabled() {
      return enabled;
    },
  };
}