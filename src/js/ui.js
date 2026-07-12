export function createUI({
  root,
  scenes,
  sceneCounter,
  storyControls,
  storyNav,
  storyRoot,
  storyTitle,
  storyCopy,
  storyKicker,
  storyIndex,
  storyLabel,
  reducedMotion,
}) {
  const sceneButtons = [];
  let audioEnabled = false;

  storyControls.innerHTML = `
    <button class="journey-button" type="button" data-audio-toggle aria-pressed="false">
      Ambient audio off
    </button>
  `;

  storyNav.innerHTML = scenes
    .map((scene, index) => `
      <li class="journey-story__nav-item">
        <button class="journey-story__nav-button" type="button" data-scene-button="${index}" aria-label="Jump to ${scene.title}">
          <span class="journey-story__nav-number">${scene.number}</span>
          <span class="journey-story__nav-label">${scene.label}</span>
        </button>
      </li>
    `)
    .join('');

  storyNav.querySelectorAll('[data-scene-button]').forEach((button) => {
    sceneButtons.push(button);
  });

  const audioToggle = storyControls.querySelector('[data-audio-toggle]');

  if (reducedMotion) {
    root.dataset.motion = 'reduced';
  }

  function setScene(scene, index) {
    sceneCounter.textContent = `${scene.number} / ${String(scenes.length).padStart(2, '0')}`;
    storyTitle.textContent = scene.title;
    storyCopy.textContent = scene.copy;
    storyKicker.textContent = scene.label;
    storyIndex.textContent = scene.number;
    storyLabel.textContent = scene.mood;
    root.dataset.currentScene = scene.id;

    sceneButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === index);
      button.setAttribute('aria-current', buttonIndex === index ? 'true' : 'false');
    });

    storyRoot.animate(
      [
        { opacity: 0.68, transform: 'translate3d(0, 14px, 0) scale(0.99)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
      ],
      { duration: reducedMotion ? 1 : 420, easing: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    );
  }

  function update(snapshot) {
    storyRoot.style.setProperty('--story-progress', snapshot.progress.toFixed(4));
    storyRoot.style.setProperty('--story-local', snapshot.sceneProgress.toFixed(4));
  }

  function bindActions({ onAudioToggle, onSceneJump }) {
    audioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      audioToggle.setAttribute('aria-pressed', audioEnabled ? 'true' : 'false');
      audioToggle.textContent = audioEnabled ? 'Ambient audio on' : 'Ambient audio off';
      onAudioToggle?.(audioEnabled);
    });

    sceneButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.sceneButton);
        onSceneJump?.(index);
      });
    });
  }

  return {
    setScene,
    update,
    bindActions,
  };
}
