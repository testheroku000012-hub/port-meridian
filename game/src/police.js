import { W, H } from './config.js';

export function wantedStars(player) {
  return Math.ceil(player.wanted);
}

export function policeCount(player) {
  const stars = wantedStars(player);
  return stars === 0 ? 0 : Math.min(4, stars);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function spawnPosition(world, index) {
  const angle = (index * Math.PI * 2) / Math.max(1, policeCount(world.player));
  const radius = 300 + index * 35;
  return {
    x: Math.max(40, Math.min(W - 40, world.player.x + Math.cos(angle) * radius)),
    y: Math.max(40, Math.min(H - 40, world.player.y + Math.sin(angle) * radius)),
  };
}

export function updatePolice(world, dt) {
  const desired = policeCount(world.player);
  while (world.police.length < desired) {
    const position = spawnPosition(world, world.police.length);
    world.police.push({ ...position, a: 0, closeTime: 0, hitCooldown: 0, searchAngle: 0 });
  }
  world.police.length = Math.min(world.police.length, desired);
  if (wantedStars(world.player) >= 3 && world.roadblocks.length === 0) {
    world.roadblocks.push({ x: world.player.x + 180, y: world.player.y, a: 0 }, { x: world.player.x - 180, y: world.player.y, a: 0 });
  }
  if (wantedStars(world.player) < 3) world.roadblocks.length = 0;

  let seesPlayer = false;
  for (const officer of world.police) {
    const hiding = isPlayerHiding(world);
    const playerDistance = distance(officer, world.player);
    if (playerDistance < 520 && !hiding) {
      seesPlayer = true;
      world.lastKnown = { x: world.player.x, y: world.player.y };
    }
    const target = hiding ? world.lastKnown : world.player;
    const dx = target.x - officer.x;
    const dy = target.y - officer.y;
    const range = Math.hypot(dx, dy);
    if (hiding && range <= 60) {
      if (Math.random() < 0.04) officer.searchAngle += (Math.random() - 0.5) * 1.4;
      officer.a = officer.searchAngle;
    } else {
      officer.a = Math.atan2(dy, dx);
      officer.searchAngle = officer.a;
    }
    const speed = (1.65 + wantedStars(world.player) * 0.18) * dt * 60;
    officer.x += Math.cos(officer.a) * speed;
    officer.y += Math.sin(officer.a) * speed;
    officer.hitCooldown = Math.max(0, officer.hitCooldown - dt);
    if (!hiding && playerDistance < 30) {
      officer.closeTime += dt;
      if (world.player.inCar && officer.hitCooldown === 0) {
        world.player.health -= 8;
        officer.hitCooldown = 0.8;
      }
    } else if (!hiding) {
      officer.closeTime = 0;
    } else {
      officer.closeTime = 0;
    }
  }
  for (const block of world.roadblocks) {
    if (world.player.inCar && distance(block, world.player) < 38 && Math.abs(world.player.speed) > 0.8) {
      world.player.health -= 4;
      world.player.speed *= 0.35;
      world.player.wanted = Math.min(5, world.player.wanted + 0.1);
    }
  }
  world.policeSeen = seesPlayer;
  world.lastPoliceSight = seesPlayer ? 0 : world.lastPoliceSight + dt;
  if (world.player.wanted > 0 && world.lastPoliceSight > 3 && !seesPlayer) {
    world.player.wanted = Math.max(0, world.player.wanted - 0.12 * dt);
  }
  if (world.police.some((officer) => officer.closeTime >= 1.2)) world.gameOver = 'busted';
  if (world.player.health <= 0) world.gameOver = 'wasted';
}

export function isPlayerHiding(world) {
  // Minimum hiding rule: a stationary on-foot player inside a park is hidden.
  if (world.player.inCar || world.player.speed > 0.05) return false;
  return world.parks.some((park) => world.player.x >= park.x && world.player.x <= park.x + park.w
    && world.player.y >= park.y && world.player.y <= park.y + park.h);
}

export function resetPolice(world) {
  world.police.length = 0;
  world.roadblocks.length = 0;
  world.policeSeen = false;
  world.lastPoliceSight = 0;
}
