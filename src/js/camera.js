export function createCameraController({ root, viewport }) {
  const state = {
    cameraOffset: 0,
    cameraScale: 1,
    cameraTilt: 0,
  };

  function update(snapshot) {
    const localProgress = snapshot.sceneProgress;
    const lift = (0.5 - Math.abs(localProgress - 0.5)) * 2;

    state.cameraOffset = (localProgress - 0.5) * 90;
    state.cameraScale = 1 + lift * 0.025;
    state.cameraTilt = (localProgress - 0.5) * 1.15;

    root.style.setProperty('--camera-offset', `${state.cameraOffset.toFixed(2)}px`);
    root.style.setProperty('--camera-scale', state.cameraScale.toFixed(3));
    root.style.setProperty('--camera-tilt', `${state.cameraTilt.toFixed(2)}deg`);
    viewport.style.setProperty('--horizon-glow', `${(0.55 + lift * 0.35).toFixed(3)}`);
  }

  return {
    update,
    state,
  };
}
