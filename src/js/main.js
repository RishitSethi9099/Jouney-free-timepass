import '../css/style.css';
import '../css/animations.css';
import '../css/responsive.css';

import { createAudioSystem } from './audio.js';
import { createCameraController } from './camera.js';
import { createParticleField } from './particles.js';
import { SCENES, createSceneManager } from './sceneManager.js';
import { createScrollController } from './scroll.js';
import { createTrainController } from './train.js';
import { createUI } from './ui.js';
import { createWorld } from './world.js';

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const app = document.querySelector('#app');

if (app) {
  app.innerHTML = `
    <main class="journey-app" data-journey-app>
      <section class="journey-stage" data-journey-stage aria-label="Scroll-driven train journey">
        <div class="journey-stage__sticky" data-journey-sticky>
          <div class="journey-stage__chrome">
            <div class="journey-brand" aria-label="Journey">Journey</div>
            <div class="journey-status">
              <span class="journey-status__label">Scene</span>
              <span class="journey-status__value" data-scene-counter>01 / 08</span>
            </div>
          </div>

          <div class="journey-stage__viewport" data-journey-viewport>
            <div class="journey-stage__backdrop" aria-hidden="true"></div>
            <div class="journey-stage__world" data-world></div>
            <div class="journey-stage__particles" data-particles aria-hidden="true"></div>

            <aside class="journey-story" data-story aria-live="polite">
              <p class="journey-story__kicker" data-story-kicker>Original cinematic journey</p>
              <h1 class="journey-story__title" data-story-title></h1>
              <p class="journey-story__copy" data-story-copy></p>
              <div class="journey-story__meta">
                <span class="journey-story__index" data-story-index></span>
                <span class="journey-story__label" data-story-label></span>
              </div>
              <div class="journey-story__controls" data-story-controls></div>
              <ol class="journey-story__nav" data-story-nav></ol>
            </aside>

            <div class="journey-stage__rail-note">Scroll to travel horizontally.</div>
          </div>
        </div>
      </section>
    </main>
  `;

  const appRoot = app.querySelector('[data-journey-app]');
  const viewport = app.querySelector('[data-journey-viewport]');
  const worldHost = app.querySelector('[data-world]');
  const particleHost = app.querySelector('[data-particles]');
  const storyRoot = app.querySelector('[data-story]');
  const storyTitle = app.querySelector('[data-story-title]');
  const storyCopy = app.querySelector('[data-story-copy]');
  const storyKicker = app.querySelector('[data-story-kicker]');
  const storyIndex = app.querySelector('[data-story-index]');
  const storyLabel = app.querySelector('[data-story-label]');
  const sceneCounter = app.querySelector('[data-scene-counter]');
  const storyControls = app.querySelector('[data-story-controls]');
  const storyNav = app.querySelector('[data-story-nav]');

  const ui = createUI({
    root: appRoot,
    scenes: SCENES,
    sceneCounter,
    storyControls,
    storyNav,
    storyRoot,
    storyTitle,
    storyCopy,
    storyKicker,
    storyIndex,
    storyLabel,
    reducedMotion: prefersReducedMotion,
  });

  const world = createWorld({
    host: worldHost,
    scenes: SCENES,
  });

  const train = createTrainController({
    host: world.trainLayer,
    reducedMotion: prefersReducedMotion,
  });

  const particles = createParticleField({
    host: particleHost,
    reducedMotion: prefersReducedMotion,
  });

  const camera = createCameraController({
    root: appRoot,
    viewport,
  });

  const audio = createAudioSystem();

  const sceneManager = createSceneManager({
    root: appRoot,
    scenes: SCENES,
    onSceneChange(scene, index) {
      ui.setScene(scene, index);
      particles.setScene(scene);
      train.setScene(scene);
      audio.setScene(scene);
    },
  });

  const scrollController = createScrollController({
    trigger: app.querySelector('[data-journey-stage]'),
    reducedMotion: prefersReducedMotion,
    onProgress(progress) {
      const snapshot = sceneManager.update(progress);
      world.update(snapshot);
      train.update(snapshot);
      particles.update(snapshot);
      camera.update(snapshot);
      ui.update(snapshot);
    },
  });

  ui.bindActions({
    onAudioToggle(enabled) {
      if (enabled) {
        audio.enable(sceneManager.getScene());
      } else {
        audio.disable();
      }
    },
    onSceneJump(index) {
      scrollController.scrollToScene(index);
    },
  });

  sceneManager.update(0);
  world.update(sceneManager.getSnapshot());
  train.update(sceneManager.getSnapshot());
  particles.update(sceneManager.getSnapshot());
  camera.update(sceneManager.getSnapshot());
  ui.update(sceneManager.getSnapshot());
}
