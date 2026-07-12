import '../css/chapter.css';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { createAudioSystem } from './audio.js';
import { createScrollController } from './scroll.js';
import { CHAPTER } from './chapterData.js';

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const app = document.querySelector('#app');

function renderSection(section, index) {
  return `
    <section class="chapter-section chapter-section--${section.mood}" data-chapter-section data-section-index="${index}" style="--section-accent: ${section.accent};">
      <div class="chapter-section__rail">
        <span class="chapter-section__number">${section.number}</span>
        <span class="chapter-section__label">${section.label}</span>
      </div>
      <div class="chapter-section__copy">
        <p class="chapter-section__eyebrow">${section.label}</p>
        <h2 class="chapter-section__title">${section.title}</h2>
        ${section.copy.map((paragraph) => `<p class="chapter-section__paragraph">${paragraph}</p>`).join('')}
      </div>
      <div class="chapter-section__visual" aria-hidden="true">
        <div class="scene-art scene-art--${section.mood}">
          <div class="scene-art__sky"></div>
          <div class="scene-art__glow"></div>
          <div class="scene-art__land"></div>
          <div class="scene-art__track"></div>
          <div class="scene-art__railcar"></div>
          <div class="scene-art__mist"></div>
        </div>
      </div>
    </section>
  `;
}

if (app) {
  app.innerHTML = `
    <main class="chapter-app" data-chapter-app>
      <div class="chapter-gate" data-audio-gate>
        <div class="chapter-gate__card">
          <p class="chapter-gate__kicker">${CHAPTER.label}</p>
          <h2 class="chapter-gate__title">Start with sound?</h2>
          <p class="chapter-gate__copy">This chapter can breathe with ambient audio, or stay silent if you prefer. Choose one, then step into the story.</p>
          <div class="chapter-gate__actions">
            <button class="chapter-button chapter-button--primary" type="button" data-start-sound>Start with sound</button>
            <button class="chapter-button" type="button" data-skip-sound>No sound thanks</button>
          </div>
          <p class="chapter-gate__note">You can toggle audio later from the chapter bar.</p>
        </div>
      </div>

      <header class="chapter-bar">
        <a class="chapter-bar__brand" href="/" aria-label="Journey home">Journey</a>
        <div class="chapter-bar__meta">
          <span>${CHAPTER.label}</span>
          <span data-progress-label>00%</span>
        </div>
      </header>

      <section class="chapter-hero" data-chapter-hero>
        <div class="chapter-hero__copy">
          <p class="chapter-hero__strap">${CHAPTER.strapline}</p>
          <h1 class="chapter-hero__title">${CHAPTER.title}</h1>
          <p class="chapter-hero__lede">${CHAPTER.intro}</p>
          <div class="chapter-hero__actions">
            <button class="chapter-button chapter-button--ghost" type="button" data-toggle-audio aria-pressed="false">Audio off</button>
            <a class="chapter-button chapter-button--link" href="#chapter-story">Begin reading</a>
          </div>
        </div>
        <div class="chapter-hero__visual" aria-hidden="true">
          <div class="chapter-window">
            <div class="chapter-window__sky"></div>
            <div class="chapter-window__glow"></div>
            <div class="chapter-window__land"></div>
            <div class="chapter-window__track"></div>
            <div class="chapter-window__train">
              <span class="chapter-window__smoke"></span>
            </div>
          </div>
        </div>
      </section>

      <section class="chapter-intro">
        <p class="chapter-intro__label">What follows is an original chapter, built as a scroll experience rather than a landing page.</p>
      </section>

      <article class="chapter-story" id="chapter-story" data-chapter-story>
        <aside class="chapter-story__rail" aria-label="Chapter navigation">
          <span class="chapter-story__rail-title">Story path</span>
          <ol class="chapter-story__nav" data-chapter-nav>
            ${CHAPTER.sections.map((section) => `<li><button class="chapter-story__nav-button" type="button" data-nav-target="${section.number}"><span>${section.number}</span>${section.label}</button></li>`).join('')}
          </ol>
        </aside>
        <div class="chapter-story__sections">
          ${CHAPTER.sections.map(renderSection).join('')}
        </div>
      </article>
    </main>
  `;

  const page = app.querySelector('[data-chapter-app]');
  const story = app.querySelector('[data-chapter-story]');
  const gate = app.querySelector('[data-audio-gate]');
  const startSound = app.querySelector('[data-start-sound]');
  const skipSound = app.querySelector('[data-skip-sound]');
  const toggleAudio = app.querySelector('[data-toggle-audio]');
  const progressLabel = app.querySelector('[data-progress-label]');
  const navButtons = Array.from(app.querySelectorAll('[data-nav-target]'));
  const sectionNodes = Array.from(app.querySelectorAll('[data-chapter-section]'));

  const audio = createAudioSystem();
  let audioEnabled = false;
  let gateResolved = false;

  const setActiveSection = (index) => {
    navButtons.forEach((button, buttonIndex) => {
      button.dataset.active = buttonIndex === index ? 'true' : 'false';
    });

    sectionNodes.forEach((sectionNode, sectionIndex) => {
      sectionNode.dataset.active = sectionIndex === index ? 'true' : 'false';
    });
  };

  const updateAudioToggle = () => {
    toggleAudio.textContent = audioEnabled ? 'Audio on' : 'Audio off';
    toggleAudio.setAttribute('aria-pressed', audioEnabled ? 'true' : 'false');
  };

  const setGate = (enabled) => {
    gate.classList.add('is-dismissed');
    page.dataset.audio = enabled ? 'on' : 'off';
    gateResolved = true;
    if (enabled) {
      audioEnabled = audio.enable(CHAPTER.sections[0]);
      updateAudioToggle();
    }
  };

  startSound.addEventListener('click', () => setGate(true));
  skipSound.addEventListener('click', () => setGate(false));

  toggleAudio.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
      audioEnabled = audio.enable(CHAPTER.sections[0]);
    } else {
      audio.disable();
    }
    updateAudioToggle();
  });

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetNumber = button.dataset.navTarget;
      const target = app.querySelector(`[data-chapter-section][data-section-index="${CHAPTER.sections.findIndex((section) => section.number === targetNumber)}"]`);
      target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const scrollController = createScrollController({
    trigger: story,
    reducedMotion: prefersReducedMotion,
    onProgress(progress) {
      const percent = `${Math.round(progress * 100).toString().padStart(2, '0')}%`;
      progressLabel.textContent = percent;
      page.style.setProperty('--page-progress', progress.toFixed(4));
    },
  });

  sectionNodes.forEach((sectionNode, index) => {
    const section = CHAPTER.sections[index];

    ScrollTrigger.create({
      trigger: sectionNode,
      start: 'top 68%',
      end: 'bottom 30%',
      onEnter() {
        setActiveSection(index);
        if (audioEnabled && gateResolved) {
          audio.setScene(section);
        }
      },
      onEnterBack() {
        setActiveSection(index);
        if (audioEnabled && gateResolved) {
          audio.setScene(section);
        }
      },
      onLeave() {
        sectionNode.dataset.active = 'false';
      },
      onLeaveBack() {
        sectionNode.dataset.active = 'false';
      },
    });

    gsap.fromTo(
      sectionNode.querySelector('.chapter-section__copy'),
      { opacity: 0.15, y: 36 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionNode,
          start: 'top 82%',
          end: 'top 45%',
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      sectionNode.querySelector('.chapter-section__visual'),
      { y: 48, scale: 0.985 },
      {
        y: -18,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionNode,
          start: 'top 88%',
          end: 'bottom 35%',
          scrub: true,
        },
      },
    );
  });

  updateAudioToggle();
  setActiveSection(0);
  page.dataset.audio = 'off';
}
