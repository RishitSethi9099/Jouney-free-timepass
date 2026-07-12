function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

const MODE_MAP = {
  clear: 'clear',
  breezy: 'breezy',
  mist: 'mist',
  rain: 'rain',
  snow: 'snow',
  night: 'night',
};

export function createParticleField({ host, reducedMotion }) {
  const field = document.createElement('div');
  field.className = 'atmosphere';
  host.append(field);

  const count = reducedMotion ? 10 : 28;
  const particles = Array.from({ length: count }, (_, index) => {
    const particle = document.createElement('span');
    particle.className = 'atmosphere__particle';
    particle.style.setProperty('--x', `${randomBetween(0, 100).toFixed(2)}%`);
    particle.style.setProperty('--y', `${randomBetween(0, 100).toFixed(2)}%`);
    particle.style.setProperty('--size', `${randomBetween(0.25, 1.1).toFixed(2)}rem`);
    particle.style.setProperty('--duration', `${randomBetween(8, 22).toFixed(2)}s`);
    particle.style.setProperty('--delay', `${(index * -0.7).toFixed(2)}s`);
    field.append(particle);
    return particle;
  });

  function setScene(scene) {
    const mode = MODE_MAP[scene.mood] || 'clear';
    field.dataset.mode = mode;

    particles.forEach((particle, index) => {
      const spread = (index / particles.length) * 100;
      particle.style.setProperty('--x', `${(spread + randomBetween(-8, 8)).toFixed(2)}%`);
      particle.style.setProperty('--y', `${randomBetween(4, 92).toFixed(2)}%`);
      particle.style.setProperty('--size', `${randomBetween(0.22, scene.mood === 'snow' ? 1.6 : 1).toFixed(2)}rem`);
      particle.style.setProperty('--duration', `${randomBetween(10, scene.mood === 'rain' ? 16 : 28).toFixed(2)}s`);
    });
  }

  function update(snapshot) {
    field.style.setProperty('--field-progress', snapshot.progress.toFixed(4));
    field.style.setProperty('--field-shift', `${(snapshot.sceneProgress - 0.5) * 24}px`);
  }

  return {
    field,
    setScene,
    update,
  };
}
