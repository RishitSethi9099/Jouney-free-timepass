function createSteamPlume(index) {
  const plume = document.createElement('span');
  plume.className = 'train__steam-puff';
  plume.style.setProperty('--puff-index', String(index));
  plume.style.setProperty('--puff-delay', `${(index * -0.35).toFixed(2)}s`);
  plume.style.setProperty('--puff-x', `${(index * 12 - 24).toFixed(2)}px`);
  return plume;
}

export function createTrainController({ host, reducedMotion }) {
  const train = document.createElement('div');
  train.className = 'train';
  train.setAttribute('aria-hidden', 'true');

  train.innerHTML = `
    <div class="train__shadow"></div>
    <div class="train__steam" data-train-steam></div>
    <div class="train__engine">
      <div class="train__headlamp"></div>
      <div class="train__stack"></div>
      <div class="train__smoke-trim"></div>
      <div class="train__boiler"></div>
      <div class="train__cabin"></div>
      <div class="train__tender"></div>
      <div class="train__cab-window"></div>
      <div class="train__side-strip"></div>
      <div class="train__marker"></div>
    </div>
    <div class="train__running-gear">
      <div class="train__wheel train__wheel--rear"><span class="train__hub"></span><span class="train__rod"></span></div>
      <div class="train__wheel train__wheel--middle"><span class="train__hub"></span><span class="train__rod"></span></div>
      <div class="train__wheel train__wheel--front"><span class="train__hub"></span><span class="train__rod"></span></div>
    </div>
  `;

  const steamHost = train.querySelector('[data-train-steam]');
  const plumeCount = reducedMotion ? 4 : 7;

  for (let index = 0; index < plumeCount; index += 1) {
    steamHost.append(createSteamPlume(index));
  }

  host.append(train);

  function setScene(scene) {
    train.dataset.mood = scene.mood;
    train.style.setProperty('--train-glow', scene.palette.accent);
  }

  function update(snapshot) {
    const lift = (0.5 - Math.abs(snapshot.sceneProgress - 0.5)) * 2;
    train.style.setProperty('--train-bob', `${Math.sin(snapshot.progress * Math.PI * 2) * 2.4}px`);
    train.style.setProperty('--train-tilt', `${(snapshot.sceneProgress - 0.5) * 0.9}deg`);
    train.style.setProperty('--wheel-speed', `${(1.15 + lift * 0.45).toFixed(3)}`);
    train.style.setProperty('--steam-scale', `${(0.85 + lift * 0.42).toFixed(3)}`);
    train.style.setProperty('--steam-opacity', `${(0.48 + lift * 0.3).toFixed(3)}`);
    train.style.setProperty('--shadow-opacity', `${(0.34 + lift * 0.08).toFixed(3)}`);
  }

  return {
    element: train,
    update,
    setScene,
  };
}
