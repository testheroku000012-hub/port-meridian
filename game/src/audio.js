let context;
let master;
let sirenTimer;
let muted = false;

export function audio() {
  function init() {
    if (context) return;
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = 0.035;
    master.connect(context.destination);
  }
  function beep(frequency = 440, duration = 0.08) {
    init();
    const oscillator = context.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.connect(master);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }
  function startSiren() {
    init();
    if (sirenTimer) return;
    let high = false;
    sirenTimer = setInterval(() => { high = !high; beep(high ? 660 : 440, 0.22); }, 260);
  }
  function stopSiren() { clearInterval(sirenTimer); sirenTimer = null; }
  return { start: init, beep, startSiren, stopSiren, mute() { muted = !muted; if (master) master.gain.value = muted ? 0 : 0.035; } };
}
