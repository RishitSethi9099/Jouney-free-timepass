function createCloud(index, scene) {
  const cloud = document.createElement('span');
  cloud.className = 'scene__cloud';
  cloud.style.setProperty('--cloud-index', String(index));
  cloud.style.setProperty('--cloud-left', `${(8 + index * 18).toFixed(2)}%`);
  cloud.style.setProperty('--cloud-top', `${(12 + (index % 3) * 10).toFixed(2)}%`);
  cloud.style.setProperty('--cloud-scale', `${(0.75 + (index % 4) * 0.18).toFixed(2)}`);
  cloud.style.setProperty('--cloud-speed', `${(18 + index * 3).toFixed(2)}s`);
  return cloud;
}

function createTree(index, scene) {
  const tree = document.createElement('span');
  tree.className = 'scene__tree';
  tree.style.setProperty('--tree-x', `${(index * 8 + 3).toFixed(2)}%`);
  tree.style.setProperty('--tree-scale', `${(0.8 + (index % 5) * 0.14).toFixed(2)}`);
  tree.style.setProperty('--tree-delay', `${(index * -0.28).toFixed(2)}s`);
  return tree;
}

function createPeak(index) {
  const peak = document.createElement('span');
  peak.className = 'scene__peak';
  peak.style.setProperty('--peak-x', `${(8 + index * 26).toFixed(2)}%`);
  peak.style.setProperty('--peak-scale', `${(0.78 + (index % 3) * 0.18).toFixed(2)}`);
  return peak;
}

function renderScene(scene) {
  const clouds = Array.from({ length: scene.decor.clouds }, (_, index) => createCloud(index, scene)).map((node) => node.outerHTML).join('');
  const trees = Array.from({ length: scene.decor.trees }, (_, index) => createTree(index, scene)).map((node) => node.outerHTML).join('');
  const peaks = Array.from({ length: scene.decor.peaks }, (_, index) => createPeak(index)).map((node) => node.outerHTML).join('');

  const birds = scene.decor.birds
    ? Array.from({ length: scene.decor.birds }, (_, index) => `<span class="scene__bird scene__bird--${index + 1}"></span>`).join('')
    : '';

  const specialLayer = scene.id === 'river-bridge'
    ? '<div class="scene__river"></div>'
    : scene.id === 'old-station'
      ? '<div class="scene__station"><span class="scene__station-roof"></span><span class="scene__station-post"></span></div>'
      : scene.id === 'snow-lake'
        ? '<div class="scene__lake"></div><div class="scene__snowfall"></div>'
        : scene.id === 'night-arc'
          ? '<div class="scene__stars"></div>'
          : '';

  return `
    <article class="scene scene--${scene.id}" data-scene-id="${scene.id}" data-scene-kind="${scene.mood}" style="--scene-sky-top: ${scene.palette.skyTop}; --scene-sky-bottom: ${scene.palette.skyBottom}; --scene-glow: ${scene.palette.glow}; --scene-land: ${scene.palette.land}; --scene-land-dark: ${scene.palette.landDark}; --scene-mist: ${scene.palette.mist}; --scene-ink: ${scene.palette.ink}; --scene-accent: ${scene.palette.accent};">
      <div class="scene__sky">
        <span class="scene__sun"></span>
        <span class="scene__moon"></span>
        ${clouds}
        ${birds}
      </div>
      <div class="scene__mountains">${peaks}</div>
      <div class="scene__specials">${specialLayer}</div>
      <div class="scene__trees">${trees}</div>
      <div class="scene__foreground"></div>
      <div class="scene__track"></div>
    </article>
  `;
}

export function createWorld({ host, scenes }) {
  const rail = document.createElement('div');
  rail.className = 'world';
  rail.style.setProperty('--scene-count', String(scenes.length));
  rail.innerHTML = scenes.map(renderScene).join('');

  const trainLayer = document.createElement('div');
  trainLayer.className = 'world__train-layer';
  rail.append(trainLayer);
  host.append(rail);

  function update(snapshot) {
    const offset = -window.innerWidth * (scenes.length - 1) * snapshot.progress;
    rail.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    rail.dataset.scene = snapshot.scene.id;

    rail.querySelectorAll('.scene').forEach((sceneNode, index) => {
      sceneNode.classList.toggle('is-active', index === snapshot.sceneIndex);
      if (index === snapshot.sceneIndex) {
        sceneNode.style.setProperty('--scene-local-progress', snapshot.sceneProgress.toFixed(4));
      }
    });
  }

  return {
    rail,
    trainLayer,
    update,
  };
}
