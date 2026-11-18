import { COLORS } from './config.js';
import { drawHud } from './hud.js';
export function draw(ctx, world, mission, screen) {
  const sx = ctx.canvas.width / 2400; const sy = ctx.canvas.height / 1600; ctx.save(); ctx.scale(sx, sy);
  ctx.fillStyle = COLORS.sky; ctx.fillRect(0, 0, 2400, 1600); ctx.fillStyle = COLORS.water; ctx.fillRect(1850, 0, 550, 1600);
  world.parks.forEach((p) => { ctx.fillStyle = COLORS.grass; ctx.fillRect(p.x, p.y, p.w, p.h); });
  ctx.strokeStyle = COLORS.road; ctx.lineWidth = 70; world.roads.forEach((r) => { ctx.beginPath(); ctx.moveTo(r.x1,r.y1); ctx.lineTo(r.x2,r.y2); ctx.stroke(); });
  ctx.strokeStyle = COLORS.roadLine; ctx.lineWidth = 3; world.roads.forEach((r) => { ctx.beginPath(); ctx.moveTo(r.x1,r.y1); ctx.lineTo(r.x2,r.y2); ctx.stroke(); });
  world.buildings.forEach((b) => { ctx.fillStyle = '#111528'; ctx.fillRect(b.x + 12,b.y - b.z + 12,b.w,b.h); ctx.fillStyle = b.c; ctx.fillRect(b.x,b.y-b.z,b.w,b.h); ctx.fillStyle = '#ffd66b'; for (let x = b.x + 10; x < b.x + b.w - 8; x += 24) for (let y = b.y - b.z + 10; y < b.y - b.z + b.h - 6; y += 22) ctx.fillRect(x,y,7,6); });
  world.cars.forEach((c) => { ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.a); ctx.fillStyle=c.model[1]; ctx.fillRect(-24,-12,48,24); ctx.fillStyle='#182238'; ctx.fillRect(-10,-9,20,8); ctx.restore(); });
  world.police.forEach((c) => { ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.a); ctx.fillStyle='#dce8ff'; ctx.fillRect(-25,-13,50,26); ctx.fillStyle=Date.now()%400<200?'#ff405b':'#3c8cff'; ctx.fillRect(-7,-15,14,6); ctx.restore(); });
  world.peds.forEach((p) => { ctx.fillStyle='#d5c8dc'; ctx.beginPath(); ctx.arc(p.x,p.y,8,0,7); ctx.fill(); });
  ctx.fillStyle='#ffc857'; ctx.beginPath(); ctx.arc(world.marker.x,world.marker.y,18+Math.sin(Date.now()/180)*5,0,7); ctx.fill();
  ctx.fillStyle=world.player.inCar?'#55d8e8':'#f5e6d3'; ctx.beginPath(); ctx.arc(world.player.x,world.player.y,16,0,7); ctx.fill(); ctx.restore(); drawHud(ctx,world,mission,ctx.canvas);
  if (mission.toast && screen === 'play') dialogue(ctx, mission.toast);
  if (screen === 'title') overlay(ctx,'PORT MERIDIAN','NEW GAME  •  Click or press Enter'); if (screen === 'pause') overlay(ctx,'PAUSED','Press P to resume');
  if (world.gameOver) overlay(ctx,world.gameOver === 'busted' ? 'BUSTED' : 'WASTED','Press Enter to try again');
}
function dialogue(ctx, text) { ctx.fillStyle='#080b16ee'; ctx.fillRect(40,ctx.canvas.height-150,ctx.canvas.width-80,92); ctx.strokeStyle='#ff4fba'; ctx.strokeRect(40,ctx.canvas.height-150,ctx.canvas.width-80,92); ctx.fillStyle='#e8e4ff'; ctx.font='22px monospace'; ctx.fillText(text,70,ctx.canvas.height-95); }
function overlay(ctx,title,sub) { ctx.fillStyle='#050611cc'; ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height); ctx.textAlign='center'; ctx.fillStyle='#ff4fba'; ctx.font='bold 78px monospace'; ctx.fillText(title,ctx.canvas.width/2,ctx.canvas.height/2-30); ctx.fillStyle='#e8e4ff'; ctx.font='24px monospace'; ctx.fillText(sub,ctx.canvas.width/2,ctx.canvas.height/2+35); ctx.textAlign='left'; }
