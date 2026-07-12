import gsap from 'gsap';
import Lenis from 'lenis';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function createScrollController({ trigger, reducedMotion, onProgress }) {
  const lenis = new Lenis({
    duration: reducedMotion ? 0.001 : 1.15,
    lerp: reducedMotion ? 1 : 0.08,
    smoothWheel: !reducedMotion,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.35,
  });

  const raf = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  const scrollTrigger = ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      onProgress?.(self.progress);
    },
    onRefresh(self) {
      onProgress?.(self.progress);
    },
  });

  function scrollToScene(index) {
    const target = trigger.offsetTop + (window.innerHeight * index);
    lenis.scrollTo(target, {
      immediate: reducedMotion,
      lock: false,
    });
  }

  function destroy() {
    gsap.ticker.remove(raf);
    scrollTrigger.kill();
    lenis.destroy();
  }

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

  return {
    lenis,
    scrollToScene,
    destroy,
  };
}
