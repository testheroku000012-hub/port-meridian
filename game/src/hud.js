export function drawHud(ctx, world, mission, canvas) {
  const player = world.player;
  const scale = canvas.width / 2400;
  ctx.save(); ctx.scale(scale, scale);
  ctx.fillStyle = '#e8e4ff'; ctx.font = '24px monospace';
  ctx.fillText(`HEALTH ${Math.ceil(player.health)}`, 38, 48);
  ctx.fillText(`CASH $${player.cash}`, 38, 80);
  const stars = Math.ceil(player.wanted);
  ctx.fillText('★'.repeat(stars) + '☆'.repeat(5 - stars), 38, 112);
  ctx.fillText(`${Math.floor(world.time).toString().padStart(2, '0')}:${Math.floor((world.time % 1) * 60).toString().padStart(2, '0')}`, 2150, 48);
  ctx.fillStyle = '#ffc857'; ctx.font = 'bold 28px monospace';
  ctx.fillText(mission.done ? 'ALL MISSIONS COMPLETE' : `${Math.min(mission.index + 1, 3)}/3  ${mission.index < 3 ? ['FIRST DELIVERY', 'HARBOUR ESCAPE', 'NEON PAYBACK'][mission.index] : 'DONE'}`, 38, 1510);
  ctx.font = '18px monospace'; ctx.fillStyle = '#b8b5d4'; ctx.fillText('OBJECTIVE: ' + (mission.index === 1 ? 'Lose your 3-star wanted level.' : mission.index < 3 ? ['Reach the gold ferry marker.', 'Lose your wanted level.', 'Reach the Neon Row drop-off.'][mission.index] : 'Free roam'), 38, 1540);
  ctx.fillText('WASD / ARROWS move   E enter car   F punch   M mute   P pause', 38, 1575);
  ctx.fillStyle = '#0b1026cc'; ctx.fillRect(2040, 1160, 320, 270); ctx.strokeStyle = '#55d8e8'; ctx.strokeRect(2040, 1160, 320, 270);
  ctx.fillStyle = '#55d8e8'; ctx.fillRect(2040 + player.x / 2400 * 320 - 4, 1160 + player.y / 1600 * 270 - 4, 8, 8);
  world.cars.forEach((car) => { ctx.fillStyle = '#9aa8c9'; ctx.fillRect(2040 + car.x / 2400 * 320, 1160 + car.y / 1600 * 270, 3, 3); });
  world.police.forEach((car, i) => { ctx.fillStyle = Math.floor(world.time * 8) % 2 === i % 2 ? '#3c8cff' : '#ff405b'; ctx.fillRect(2040 + car.x / 2400 * 320 - 3, 1160 + car.y / 1600 * 270 - 3, 7, 7); });
  ctx.fillStyle = '#ffc857'; ctx.fillRect(2040 + world.marker.x / 2400 * 320 - 3, 1160 + world.marker.y / 1600 * 270 - 3, 6, 6);
  ctx.restore();
}
