export const MISSIONS = [
  { name: 'FIRST DELIVERY', text: 'Mara Voss: Take this package to the old ferry terminal.', reward: 250 },
  { name: 'HARBOUR ESCAPE', text: 'Mara Voss: Heat is loud. Lose your 3-star wanted level.', reward: 500 },
  { name: 'NEON PAYBACK', text: 'Mara Voss: One last drop in Neon Row.', reward: 900 },
];

export function missionState() { return { index: 0, done: false, toast: MISSIONS[0].text }; }

export function updateMission(mission, world) {
  const player = world.player;
  const distance = Math.hypot(player.x - world.marker.x, player.y - world.marker.y);
  if (mission.index === 0 && distance < 90) {
    mission.index = 1;
    mission.toast = MISSIONS[1].text;
    player.cash += 250;
    player.wanted = 3;
    world.lastPoliceSight = 0;
  } else if (mission.index === 1 && player.wanted <= 0.01) {
    mission.index = 2;
    mission.toast = 'Clean slate. Neon Payback is waiting.';
    world.marker = { x: 1280, y: 320 };
    player.cash += 500;
  } else if (mission.index === 2 && distance < 90) {
    mission.index = 3;
    mission.done = true;
    mission.toast = 'NEON PAYBACK complete. Mara remembers.';
    player.cash += 900;
  }
}
