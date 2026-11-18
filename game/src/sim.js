import { W, H } from './config.js';
import { crime } from './world.js';
import { updatePolice } from './police.js';
import { updateMission } from './missions.js';

export function step(world, input, dt, mission, sound) {
  if (world.gameOver) return;
  const player = world.player;
  const direction = input.dir();
  if (input.pressed('m')) sound.mute();
  if (input.pressed('e')) player.inCar = !player.inCar;
  if (input.pressed('f')) { crime(world, 0.7); sound.beep(120, 0.12); player.cash = Math.max(0, player.cash - 2); }
  const speed = player.inCar ? 4.8 : 2.4;
  if (player.inCar) {
    player.a += direction.x * 0.055;
    player.speed += direction.y ? -direction.y * 0.18 : 0;
    player.speed *= 0.97;
    player.x += Math.cos(player.a) * player.speed * speed;
    player.y += Math.sin(player.a) * player.speed * speed;
  } else {
    player.x += direction.x * speed;
    player.y += direction.y * speed;
    if (direction.x || direction.y) player.a = Math.atan2(direction.y, direction.x);
    player.speed = direction.x || direction.y ? 1 : 0;
  }
  player.x = Math.max(30, Math.min(W - 30, player.x));
  player.y = Math.max(30, Math.min(H - 30, player.y));
  world.time = (world.time + dt * 0.18) % 24;
  world.cars.forEach((car) => { if (car.traffic) { car.x += Math.cos(car.a) * 0.65; car.y += Math.sin(car.a) * 0.65; if (car.x < 0) car.x = W; if (car.x > W) car.x = 0; if (car.y < 0) car.y = H; if (car.y > H) car.y = 0; } });
  world.peds.forEach((ped) => { if (Math.random() < 0.01) ped.a = Math.random() * Math.PI * 2; ped.x += Math.cos(ped.a) * 0.2; ped.y += Math.sin(ped.a) * 0.2; if (ped.x < 0) ped.x = W; if (ped.x > W) ped.x = 0; if (ped.y < 0) ped.y = H; if (ped.y > H) ped.y = 0; });
  updatePolice(world, dt);
  if (world.police.length) sound.startSiren(); else sound.stopSiren();
  if (mission) updateMission(mission, world);
}
