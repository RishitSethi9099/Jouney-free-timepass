const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((channel) => channel + channel).join('')
    : normalized;
  const int = Number.parseInt(value, 16);

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex({ r, g, b }) {
  return [r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('');
}

function mixHex(a, b, ratio) {
  const start = hexToRgb(a);
  const end = hexToRgb(b);
  return `#${rgbToHex({
    r: start.r + (end.r - start.r) * ratio,
    g: start.g + (end.g - start.g) * ratio,
    b: start.b + (end.b - start.b) * ratio,
  })}`;
}

export const SCENES = [
  {
    id: 'dawn-line',
    number: '01',
    label: 'Sunrise departure',
    title: 'The valley opens before the first bell.',
    copy: 'A silver locomotive leaves the platform while the valley is still half asleep, carrying a warm seam of light into the morning fields.',
    mood: 'clear',
    palette: {
      skyTop: '#9fd9ff',
      skyBottom: '#f7c98f',
      glow: '#ffd885',
      land: '#5f8f5a',
      landDark: '#35523c',
      mist: '#f7f0df',
      ink: '#1c2230',
      accent: '#f8a25c',
    },
    decor: {
      clouds: 3,
      peaks: 2,
      trees: 10,
      birds: 2,
    },
    ambience: {
      wind: 0.12,
      steam: 0.48,
      bell: 0.02,
      drone: 0.12,
      noiseFrequency: 500,
    },
  },
  {
    id: 'copper-meadow',
    number: '02',
    label: 'Countryside drift',
    title: 'Fields bend, the horizon breathes.',
    copy: 'Hedgerows, quiet lanes, and slow wind move past the carriage windows while the train gathers its rhythm across open pasture.',
    mood: 'breezy',
    palette: {
      skyTop: '#8fd6ff',
      skyBottom: '#ffe1b3',
      glow: '#ffe7a6',
      land: '#78975e',
      landDark: '#4a673f',
      mist: '#f4ecd8',
      ink: '#1e2431',
      accent: '#d08b49',
    },
    decor: {
      clouds: 4,
      peaks: 1,
      trees: 14,
      birds: 3,
    },
    ambience: {
      wind: 0.16,
      steam: 0.42,
      bell: 0.01,
      drone: 0.11,
      noiseFrequency: 580,
    },
  },
  {
    id: 'pine-forest',
    number: '03',
    label: 'Forest shade',
    title: 'The track narrows under the pines.',
    copy: 'The light cools into green shade and the carriage windows pick up the soft pulse of trunks, ferns, and mossy embankments.',
    mood: 'mist',
    palette: {
      skyTop: '#5f8db8',
      skyBottom: '#c5d6cf',
      glow: '#9fc9c0',
      land: '#4f7050',
      landDark: '#2c4636',
      mist: '#dde5df',
      ink: '#182228',
      accent: '#8cb08b',
    },
    decor: {
      clouds: 2,
      peaks: 3,
      trees: 22,
      birds: 1,
    },
    ambience: {
      wind: 0.09,
      steam: 0.44,
      bell: 0.0,
      drone: 0.14,
      noiseFrequency: 430,
    },
  },
  {
    id: 'river-bridge',
    number: '04',
    label: 'River crossing',
    title: 'Water mirrors the passing sky.',
    copy: 'The train glides onto a long bridge while the river catches the clouds in pieces, broken only by reeds, reflections, and a distant heron.',
    mood: 'clear',
    palette: {
      skyTop: '#74b8ef',
      skyBottom: '#dff4ff',
      glow: '#e1f5ff',
      land: '#6f8f63',
      landDark: '#405442',
      mist: '#ebf5f8',
      ink: '#16202b',
      accent: '#7fb7c5',
    },
    decor: {
      clouds: 4,
      peaks: 2,
      trees: 8,
      birds: 4,
    },
    ambience: {
      wind: 0.08,
      steam: 0.39,
      bell: 0.0,
      drone: 0.1,
      noiseFrequency: 510,
    },
  },
  {
    id: 'ridge-pass',
    number: '05',
    label: 'Mountain pass',
    title: 'The line climbs toward colder air.',
    copy: 'Stone ridges rise above the carriage roofline, and the locomotive leans into the grade with a disciplined, bright exhale of steam.',
    mood: 'breezy',
    palette: {
      skyTop: '#7ba1cf',
      skyBottom: '#f1efe9',
      glow: '#e4ebf6',
      land: '#7a8078',
      landDark: '#495054',
      mist: '#edf2f4',
      ink: '#151c23',
      accent: '#c8d0dc',
    },
    decor: {
      clouds: 5,
      peaks: 4,
      trees: 6,
      birds: 2,
    },
    ambience: {
      wind: 0.2,
      steam: 0.5,
      bell: 0.0,
      drone: 0.09,
      noiseFrequency: 620,
    },
  },
  {
    id: 'old-station',
    number: '06',
    label: 'Abandoned station',
    title: 'A platform waits for a timetable that never returned.',
    copy: 'An empty station slips by in the half-light: peeling boards, a clock with no answer, and lanterns that still remember the route.',
    mood: 'mist',
    palette: {
      skyTop: '#6e7685',
      skyBottom: '#c7c2ba',
      glow: '#d9d2c4',
      land: '#5d665f',
      landDark: '#313936',
      mist: '#d8dad7',
      ink: '#10161d',
      accent: '#d2a36b',
    },
    decor: {
      clouds: 3,
      peaks: 1,
      trees: 7,
      birds: 0,
    },
    ambience: {
      wind: 0.11,
      steam: 0.52,
      bell: 0.03,
      drone: 0.07,
      noiseFrequency: 380,
    },
  },
  {
    id: 'snow-lake',
    number: '07',
    label: 'Snow and lake water',
    title: 'Snow settles while the lake keeps moving.',
    copy: 'The world softens into white silence. Ice rims the shoreline and the train threads across the plain as the weather writes in slow strokes.',
    mood: 'snow',
    palette: {
      skyTop: '#a4c0df',
      skyBottom: '#e8f3ff',
      glow: '#f4fbff',
      land: '#aeb7c0',
      landDark: '#65707a',
      mist: '#f7fbff',
      ink: '#101822',
      accent: '#7da3c7',
    },
    decor: {
      clouds: 2,
      peaks: 2,
      trees: 5,
      birds: 0,
    },
    ambience: {
      wind: 0.14,
      steam: 0.56,
      bell: 0.0,
      drone: 0.08,
      noiseFrequency: 740,
    },
  },
  {
    id: 'night-arc',
    number: '08',
    label: 'Night and stars',
    title: 'The last mile opens into constellations.',
    copy: 'The train becomes a moving lantern under a wide black sky, passing through rainless dark while the stars keep pace above the ridge.',
    mood: 'night',
    palette: {
      skyTop: '#071325',
      skyBottom: '#14213a',
      glow: '#6aa8ff',
      land: '#1d3440',
      landDark: '#0d1822',
      mist: '#a2b8d9',
      ink: '#f0f6ff',
      accent: '#ffcb89',
    },
    decor: {
      clouds: 2,
      peaks: 3,
      trees: 8,
      birds: 2,
    },
    ambience: {
      wind: 0.06,
      steam: 0.4,
      bell: 0.02,
      drone: 0.2,
      noiseFrequency: 860,
    },
  },
];

export function createSceneManager({ root, scenes = SCENES, onSceneChange }) {
  const state = {
    progress: 0,
    sceneIndex: 0,
    sceneProgress: 0,
    scene: scenes[0],
    nextScene: scenes[1] || scenes[0],
  };

  function syncTheme(scene, nextScene, progressWithinScene) {
    const theme = {
      skyTop: mixHex(scene.palette.skyTop, nextScene.palette.skyTop, progressWithinScene),
      skyBottom: mixHex(scene.palette.skyBottom, nextScene.palette.skyBottom, progressWithinScene),
      glow: mixHex(scene.palette.glow, nextScene.palette.glow, progressWithinScene),
      land: mixHex(scene.palette.land, nextScene.palette.land, progressWithinScene),
      landDark: mixHex(scene.palette.landDark, nextScene.palette.landDark, progressWithinScene),
      mist: mixHex(scene.palette.mist, nextScene.palette.mist, progressWithinScene),
      ink: mixHex(scene.palette.ink, nextScene.palette.ink, progressWithinScene),
      accent: mixHex(scene.palette.accent, nextScene.palette.accent, progressWithinScene),
    };

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--journey-${key}`, value);
    });

    root.style.setProperty('--scene-count', String(scenes.length));
    root.style.setProperty('--journey-progress', state.progress.toFixed(4));
    root.style.setProperty('--journey-local-progress', progressWithinScene.toFixed(4));
    root.dataset.scene = scene.id;
    root.dataset.mood = scene.mood;
  }

  function update(progress) {
    const safeProgress = clamp(progress, 0, 1);
    const travel = safeProgress * (scenes.length - 1);
    const sceneIndex = Math.min(scenes.length - 1, Math.floor(travel));
    const nextSceneIndex = Math.min(scenes.length - 1, sceneIndex + 1);
    const sceneProgress = travel - sceneIndex;
    const scene = scenes[sceneIndex];
    const nextScene = scenes[nextSceneIndex] || scene;

    state.progress = safeProgress;
    state.sceneIndex = sceneIndex;
    state.sceneProgress = sceneProgress;
    state.scene = scene;
    state.nextScene = nextScene;

    syncTheme(scene, nextScene, sceneProgress);

    if (sceneIndex !== state.previousSceneIndex) {
      state.previousSceneIndex = sceneIndex;
      onSceneChange?.(scene, sceneIndex);
    }

    return getSnapshot();
  }

  function getScene() {
    return state.scene;
  }

  function getSnapshot() {
    return {
      progress: state.progress,
      sceneIndex: state.sceneIndex,
      sceneProgress: state.sceneProgress,
      scene: state.scene,
      nextScene: state.nextScene,
      scenes,
    };
  }

  return {
    update,
    getScene,
    getSnapshot,
  };
}
