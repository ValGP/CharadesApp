import confetti from 'canvas-confetti';

export function fireVictoryConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Disparar desde dos esquinas
    confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.7 } });
    confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.7 } });
  }, 250);
}
