const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const heroes = [
  { name: 'LYRA', title: 'THE STARWEAVER', role: 'MID LANE · MAGE', symbol: '✧', desc: '“Even the darkest night is only a canvas.”', hue: 195 },
  { name: 'KAEL', title: 'THE IRON VANGUARD', role: 'CLASH LANE · WARRIOR', symbol: '⚔', desc: '“Stand behind me. I will not fall.”', hue: 36 },
  { name: 'NYX', title: 'THE VEIL DANCER', role: 'JUNGLE · ASSASSIN', symbol: '☾', desc: '“You never saw me coming.”', hue: 270 },
  { name: 'SERAPHINE', title: 'THE DAWNKEEPER', role: 'ROAM · SUPPORT', symbol: '✦', desc: '“A little light can change everything.”', hue: 48 },
  { name: 'ORION', title: 'THE LAST ARROW', role: 'FARM LANE · MARKSMAN', symbol: '➶', desc: '“One shot. One opening. One victory.”', hue: 160 },
  { name: 'BRAM', title: 'THE STONEWARDEN', role: 'CLASH LANE · TANK', symbol: '⬟', desc: '“The mountain does not move.”', hue: 12 }
];
let heroIndex = 0, mode = 'RANKED · CLASSIC';
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show'); clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2300);
}
function selectHero(i) {
  heroIndex = (i + heroes.length) % heroes.length;
  const h = heroes[heroIndex];
  $('#heroName').textContent = h.name; $('#heroTitle').textContent = h.title;
  $('#heroRole').textContent = h.role; $('#heroRoleIcon').textContent = h.symbol;
  $('#heroDesc').textContent = h.desc;
  $('#heroArt').style.filter = `drop-shadow(0 22px 24px #0209139c) hue-rotate(${h.hue - 195}deg)`;
  $$('.hero-dots i').forEach((d, j) => d.classList.toggle('selected', j === heroIndex % 4));
}
$('#enterGame').onclick = () => { $('#splash').classList.add('hidden'); $('#home').classList.remove('hidden'); };
$('#heroPrev').onclick = () => selectHero(heroIndex - 1);
$('#heroNext').onclick = () => selectHero(heroIndex + 1);

function goPage(page) {
  if (page === 'home') {
    $('#subPage').classList.add('hidden'); $('#homePage').classList.remove('hidden');
  } else {
    $('#homePage').classList.add('hidden'); $('#subPage').classList.remove('hidden'); renderSub(page);
  }
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
}
$$('[data-page]').forEach(b => b.addEventListener('click', () => goPage(b.dataset.page)));
$('#backHome').onclick = () => goPage('home');
function renderSub(page) {
  const el = $('#subContent');
  if (page === 'heroes') {
    el.innerHTML = `<h1 class="sub-heading">HEROES</h1><div class="sub-subtitle">CHOOSE YOUR LEGEND · 6 OF 42 UNLOCKED</div><div class="hero-grid">${heroes.map((h, i) => `<button class="hero-tile" data-hero="${i}"><span class="tile-art" style="filter:hue-rotate(${h.hue - 195}deg)"></span><span class="tile-copy"><b>${h.name}</b><small>${h.role}</small></span></button>`).join('')}</div>`;
    $$('.hero-tile').forEach(b => b.onclick = () => { selectHero(+b.dataset.hero); goPage('home'); toast(`${heroes[heroIndex].name} selected`); });
  } else if (page === 'events') {
    el.innerHTML = `<h1 class="sub-heading">EVENTS & MISSIONS</h1><div class="sub-subtitle">THE CELESTIAL DAWN · SEASON 08 ENDS IN 12 DAYS</div><div class="page-card-grid"><article class="info-card"><div class="card-icon">✧</div><h3>DAILY MISSIONS</h3><p>Complete daily challenges to earn gold, experience, and rare rewards.</p><button data-toast="Daily rewards claimed! +200 XP">CLAIM 200 XP</button></article><article class="info-card"><div class="card-icon">♜</div><h3>SEASON JOURNEY</h3><p>Climb the ranked ladder and unlock the Astral Vanguard seasonal skin.</p><button data-toast="Season journey opened">VIEW REWARDS</button></article><article class="info-card"><div class="card-icon">⚔</div><h3>WEEKEND BRAWL</h3><p>Double mastery and bonus gold in every match this weekend.</p><button data-toast="Weekend Brawl is active">PLAY NOW</button></article></div>`;
    $$('[data-toast]').forEach(b => b.onclick = () => toast(b.dataset.toast));
  } else if (page === 'ranked') {
    el.innerHTML = `<h1 class="sub-heading">RANKED ARENA</h1><div class="sub-subtitle">YOUR CLIMB TO THE TOP STARTS HERE</div><div class="profile-panel"><div class="profile-emblem">♜</div><div><h3>MASTER III</h3><p>62 stars · 1,842 ranked points</p><div class="profile-stats"><div><b>57.4%</b><small>WIN RATE</small></div><div><b>126</b><small>MATCHES</small></div><div><b>#2,418</b><small>REGIONAL</small></div></div></div></div><div class="page-card-grid" style="margin-top:18px"><article class="info-card"><div class="card-icon">⚔</div><h3>CLASSIC 5V5</h3><p>Team up and battle across the Celestial Rift.</p><button id="rankedPlay">FIND MATCH</button></article></div>`;
    $('#rankedPlay').onclick = startMatch;
  } else {
    el.innerHTML = `<h1 class="sub-heading">PLAYER PROFILE</h1><div class="sub-subtitle">YOUR LEGEND, YOUR JOURNEY</div><div class="profile-panel"><div class="profile-emblem">A</div><div><h3>ASTRALWOLF</h3><p>Level 38 · Master III · Online</p><div class="profile-stats"><div><b>126</b><small>MATCHES</small></div><div><b>57.4%</b><small>WIN RATE</small></div><div><b>62</b><small>STARS</small></div></div></div></div>`;
  }
}
$('#inviteBtn').onclick = () => toast('Invite sent to your online friends');
$$('.invite-plus').forEach(b => b.onclick = () => toast('Invite sent!'));
$('#modeChange').onclick = () => {
  mode = mode.includes('RANKED') ? 'CLASSIC · 5V5' : 'RANKED · CLASSIC';
  document.querySelector('.mode-select b').textContent = mode; toast(`Mode changed to ${mode}`);
};
$('#playButton').onclick = startMatch;
$('#menuToggle').onclick = () => toast('Menu · Heroes · Events · Profile');

const canvas = $('#gameCanvas'), ctx = canvas.getContext('2d');
const mini = $('#miniMap'), mctx = mini.getContext('2d');
let raf = 0, last = 0, world = null, keys = {}, stick = { x: 0, y: 0 }, clock = 0, paused = false, matchState = '';
let cooldowns = { q: 0, w: 0, e: 0 }, recallTime = 0, moveTarget = null;
const W = 2000, H = 1350, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function unit(x, y, team, type = 'minion') {
  const hp = type === 'hero' ? 900 : type === 'tower' ? 1400 : type === 'core' ? 3000 : 260;
  return { x, y, team, type, hp, max: hp, speed: type === 'hero' ? 180 : type === 'minion' ? 48 : 0,
    r: type === 'hero' ? 25 : type === 'tower' ? 34 : type === 'core' ? 52 : 13, alive: true,
    cd: 0, attack: 0, respawn: 0, level: 1, phase: Math.random() * 6, hit: 0, dir: 0 };
}
function freshWorld() {
  const p = unit(190, 1125, 'blue', 'hero');
  p.hp = p.max = 1000; p.mana = p.maxMana = 500; p.speed = 205; p.xp = 0; p.gold = 0;
  return { player: p, blue: [p, unit(410, 1100, 'blue', 'hero'), unit(390, 1165, 'blue', 'hero')],
    red: [unit(1760, 220, 'red', 'hero'), unit(1790, 340, 'red', 'hero'), unit(1640, 260, 'red', 'hero')],
    minions: [], towers: [unit(330, 1025, 'blue', 'tower'), unit(760, 805, 'blue', 'tower'), unit(1250, 520, 'red', 'tower'), unit(1670, 305, 'red', 'tower')],
    cores: [unit(125, 1210, 'blue', 'core'), unit(1880, 130, 'red', 'core')], effects: [], blueKills: 0, redKills: 0, spawnTimer: 3 };
}
function startMatch() {
  $('#home').classList.add('hidden'); $('#match').classList.remove('hidden');
  $('#matchNotice').classList.add('hidden'); $('#pausePanel').classList.add('hidden');
  paused = false; matchState = 'playing'; clock = 0; world = freshWorld(); keys = {}; stick = { x: 0, y: 0 };
  cooldowns = { q: 0, w: 0, e: 0 }; recallTime = 0; moveTarget = null;
  $('.match-hero-label b').textContent = heroes[heroIndex].name;
  $('.match-avatar').textContent = heroes[heroIndex].symbol;
  $('#killFeed').replaceChildren(); $('#matchClock').textContent = '00:00'; updateUI();
  resize(); if (raf) cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop);
}
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(r.width * dpr)); canvas.height = Math.max(1, Math.floor(r.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', () => { if (!$('#match').classList.contains('hidden')) { resize(); render(); } });
function addEffect(x, y, color, kind = 'burst') { world.effects.push({ x, y, color, kind, t: 0, life: kind === 'beam' ? .38 : .55 }); }
function enemies() {
  return [...world.red.filter(u => u.alive), ...world.minions.filter(u => u.alive && u.team === 'red'),
    ...world.towers.filter(u => u.alive && u.team === 'red'), ...world.cores.filter(u => u.alive && u.team === 'red')];
}
function nearestEnemy(x, y, max = Infinity) {
  let best = null, bd = max;
  for (const u of enemies()) { const d = Math.hypot(u.x - x, u.y - y); if (d < bd) { bd = d; best = u; } }
  return best;
}
function addFeed(a, b, c) {
  const f = document.createElement('div'); f.className = 'feed-item'; f.textContent = `${a}  ⚔  ${b} ${c}`;
  $('#killFeed').prepend(f); while ($('#killFeed').children.length > 3) $('#killFeed').lastChild.remove();
  setTimeout(() => f.remove(), 5000);
}
function doAttack(ultimate = false, skill = 0) {
  if (!world || paused || matchState !== 'playing') return;
  const p = world.player;
  if (p.respawn > 0) return;
  const slot = ultimate ? 'e' : skill === 1 ? 'q' : skill === 2 ? 'w' : '';
  if (slot && cooldowns[slot] > 0) { toast(`${slot.toUpperCase()} ready in ${cooldowns[slot].toFixed(1)}s`); return; }
  const cost = ultimate ? 120 : skill ? 70 : 0;
  if (p.mana < cost) { toast('Not enough mana'); return; }
  p.mana -= cost;
  if (slot) cooldowns[slot] = ultimate ? 24 : skill === 1 ? 4 : 7;
  const range = ultimate ? 390 : skill ? (skill === 1 ? 285 : 340) : 175;
  const damage = ultimate ? 480 : skill ? (skill === 1 ? 190 : 260) : 95;
  let target = nearestEnemy(p.x, p.y, range);
  if (!target) {
    addEffect(p.x + Math.cos(p.dir || 0) * (skill ? 150 : 72), p.y + Math.sin(p.dir || 0) * (skill ? 150 : 72), skill ? '#8de6ff' : '#f1d594', skill ? 'burst' : 'swing');
    if (!skill) return;
    target = nearestEnemy(p.x, p.y, range + 80);
  }
  if (!target) { updateUI(); return; }
  const aoe = ultimate ? 165 : skill ? 90 : 0;
  const hits = aoe ? [...new Set([target, ...enemies().filter(u => Math.hypot(u.x - target.x, u.y - target.y) < aoe)])] : [target];
  hits.forEach(u => {
    u.hp -= damage; u.hit = .22;
    addEffect(u.x, u.y, ultimate ? '#ffd56d' : skill ? '#69dcff' : '#ffe0a2', ultimate ? 'burst' : 'beam');
    if (u.hp <= 0) {
      u.hp = 0; u.alive = false;
      if (u.type === 'hero') { world.blueKills++; p.gold += 150; p.xp += 120; addFeed(heroes[heroIndex].name, 'DOWN', 'ENEMY'); }
      else if (u.type === 'core') finishMatch(true);
      else { p.gold += u.type === 'minion' ? 25 : 100; p.xp += u.type === 'minion' ? 30 : 90; }
    }
  });
  if (skill && p.mana < p.maxMana) p.mana = Math.min(p.maxMana, p.mana + 12);
  updateUI();
}
function updateUI() {
  if (!world) return;
  const p = world.player;
  $('#blueKills').textContent = world.blueKills; $('#redKills').textContent = world.redKills;
  $('#heroLevel').textContent = p.level; $('#levelBadge').textContent = p.level;
  $('#hpBar').style.width = `${100 * p.hp / p.max}%`; $('#manaBar').style.width = `${100 * p.mana / p.maxMana}%`;
  $('#xpBar').style.width = `${p.xp % (300 * p.level) / (3 * p.level)}%`;
  $('#hpText').textContent = `${Math.ceil(p.hp)} / ${p.max}`; $('#manaText').textContent = `${Math.ceil(p.mana)} / ${p.maxMana}`;
  [['skillOne', 'q'], ['skillTwo', 'w'], ['skillUlt', 'e']].forEach(([id, key]) => {
    const b = $(`#${id}`), cd = cooldowns[key]; b.classList.toggle('cooldown', cd > 0);
    b.dataset.cd = cd > 0 ? Math.ceil(cd) : '';
  });
}
function finishMatch(win) {
  if (matchState !== 'playing') return;
  matchState = 'ended'; $('#noticeTitle').textContent = win ? 'VICTORY' : 'DEFEAT';
  $('#noticeText').textContent = win ? 'The enemy core has fallen. The arena is yours.' : 'Your core has fallen. Regroup and rise again.';
  $('#matchNotice').classList.remove('hidden');
}
function moveToward(a, b, dist) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, step = Math.min(dist, d);
  a.x += dx / d * step; a.y += dy / d * step; a.dir = Math.atan2(dy, dx);
}
function tick(dt) {
  if (!world || paused || matchState !== 'playing') return;
  clock += dt; $('#matchClock').textContent = `${String(Math.floor(clock / 60)).padStart(2, '0')}:${String(Math.floor(clock % 60)).padStart(2, '0')}`;
  const p = world.player; world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) {
    world.spawnTimer = 11;
    for (let i = 0; i < 3; i++) {
      world.minions.push(unit(215 + i * 17, 1100 + i * 25, 'blue'));
      world.minions.push(unit(1785 - i * 17, 230 + i * 23, 'red'));
    }
  }
  Object.keys(cooldowns).forEach(k => cooldowns[k] = Math.max(0, cooldowns[k] - dt));
  if (recallTime > 0) {
    recallTime -= dt;
    if (recallTime <= 0 && p.respawn <= 0) {
      p.x = 190; p.y = 1125; p.hp = p.max; p.mana = p.maxMana; moveTarget = null;
      addEffect(p.x, p.y, '#6be1e6', 'burst'); toast('Recall complete · fully restored');
    }
  }
  if (p.respawn > 0) {
    p.respawn -= dt;
    if (p.respawn <= 0) { p.hp = p.max; p.mana = p.maxMana; p.x = 190; p.y = 1125; addEffect(p.x, p.y, '#6be1e6', 'burst'); }
  } else {
    let dx = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0) + stick.x;
    let dy = (keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0) + stick.y;
    let mag = Math.hypot(dx, dy);
    if (mag > 1) { dx /= mag; dy /= mag; }
    if (mag > .08) {
      p.x = clamp(p.x + dx * p.speed * dt, 65, W - 65); p.y = clamp(p.y + dy * p.speed * dt, 65, H - 65);
      p.dir = Math.atan2(dy, dx); moveTarget = null; recallTime = 0;
    } else if (moveTarget) {
      const before = Math.hypot(moveTarget.x - p.x, moveTarget.y - p.y);
      if (before < 8) moveTarget = null; else moveToward(p, moveTarget, p.speed * dt);
    }
    p.mana = Math.min(p.maxMana, p.mana + 9 * dt); p.attack -= dt;
    if (p.attack <= 0) {
      const t = nearestEnemy(p.x, p.y, 150);
      if (t) {
        t.hp -= 36; t.hit = .15; p.attack = .95; addEffect(t.x, t.y, '#f3d996', 'swing');
        if (t.hp <= 0) {
          t.hp = 0; t.alive = false;
          if (t.type === 'hero') { world.blueKills++; p.gold += 150; p.xp += 120; addFeed(heroes[heroIndex].name, 'DOWN', 'ENEMY'); }
          else { p.gold += t.type === 'minion' ? 25 : 100; p.xp += t.type === 'minion' ? 30 : 90; }
          if (t.type === 'core') finishMatch(true);
        }
      }
    }
    if (p.hp <= 0) { p.hp = 0; p.respawn = 3; recallTime = 0; addFeed(heroes[heroIndex].name, 'WAS SLAIN', 'BY SHADOW'); world.redKills++; }
  }
  // Friendly and enemy waves advance along the central lane and skirmish when close.
  for (const m of world.minions) {
    if (!m.alive) continue;
    m.attack -= dt;
    const foe = (m.team === 'blue' ? world.minions.filter(x => x.alive && x.team === 'red') : world.minions.filter(x => x.alive && x.team === 'blue'))
      .sort((a, b) => Math.hypot(a.x - m.x, a.y - m.y) - Math.hypot(b.x - m.x, b.y - m.y))[0];
    const dest = m.team === 'blue' ? { x: 1770, y: 245 } : { x: 230, y: 1090 };
    if (foe && Math.hypot(foe.x - m.x, foe.y - m.y) < 70) {
      if (m.attack <= 0) { foe.hp -= 16; foe.hit = .12; m.attack = 1.15; if (foe.hp <= 0) foe.alive = false; }
    } else moveToward(m, dest, m.speed * dt);
  }
  world.minions = world.minions.filter(m => m.alive || m.hp > -120);
  for (const bot of [...world.red, ...world.blue.filter(x => x !== p)]) {
    if (!bot.alive) { bot.respawn -= dt; if (bot.respawn <= 0) { bot.alive = true; bot.hp = bot.max; bot.x = bot.team === 'red' ? 1700 : 300; bot.y = bot.team === 'red' ? 300 : 1080; } continue; }
    bot.cd -= dt;
    const target = bot.team === 'red' ? p : nearestEnemy(bot.x, bot.y, 500);
    if (!target || target.respawn > 0) continue;
    const d = Math.hypot(target.x - bot.x, target.y - bot.y);
    if (d > 100 && (bot.team === 'red' || d < 380)) moveToward(bot, target, bot.speed * dt * .7);
    if (d < 175 && bot.cd <= 0) { target.hp -= bot.team === 'red' ? 24 : 16; target.hit = .16; bot.cd = 1.2; addEffect(target.x, target.y, bot.team === 'red' ? '#ef7e77' : '#76d5e4', 'swing'); }
    if (bot.team === 'red' && p.hp <= 0 && p.respawn <= 0) { p.hp = 0; p.respawn = 3; recallTime = 0; world.redKills++; addFeed(heroes[heroIndex].name, 'WAS SLAIN', 'BY SHADOW'); }
    if (bot.team === 'blue' && target.hp <= 0 && target.type === 'hero') { target.alive = false; target.respawn = 5; world.blueKills++; p.gold += 80; p.xp += 100; addFeed('ALLY', 'DOWN', 'ENEMY'); }
  }
  for (const t of world.towers.filter(x => x.alive)) {
    t.cd -= dt;
    const target = t.team === 'blue' ? world.red.filter(x => x.alive).sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y))[0] : p;
    if (target && target.respawn <= 0 && Math.hypot(target.x - t.x, target.y - t.y) < 300 && t.cd <= 0) {
      target.hp -= 42; target.hit = .22; t.cd = 1.5; addEffect(target.x, target.y, '#ff8170', 'beam');
      if (target === p && p.hp <= 0) { p.hp = 0; p.respawn = 3; world.redKills++; addFeed(heroes[heroIndex].name, 'WAS SLAIN', 'BY TOWER'); }
    }
  }
  const blueCore = world.cores[0], redCore = world.cores[1];
  if (blueCore.alive && Math.hypot(p.x - blueCore.x, p.y - blueCore.y) < 150 && p.hp < p.max) p.hp = Math.min(p.max, p.hp + 65 * dt);
  if (redCore.hp <= 0) finishMatch(true);
  world.effects.forEach(e => e.t += dt); world.effects = world.effects.filter(e => e.t < e.life);
  if (p.xp >= 300 * p.level) { p.xp -= 300 * p.level; p.level++; p.max += 80; p.maxMana += 35; p.hp = Math.min(p.max, p.hp + 80); p.mana = Math.min(p.maxMana, p.mana + 35); toast(`Level ${p.level} reached`); }
  if (Math.floor(clock * 5) !== Math.floor((clock - dt) * 5)) updateUI();
}
function drawUnit(u, sx, sy, k) {
  const x = sx + u.x * k, y = sy + u.y * k, r = Math.max(3, u.r * k);
  if (u.type === 'tower') {
    ctx.fillStyle = '#090f18aa'; ctx.beginPath(); ctx.ellipse(x, y + r * .65, r * 1.05, r * .48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = u.team === 'blue' ? '#408caa' : '#a94e53'; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r * .8, y + r * .7); ctx.lineTo(x - r * .8, y + r * .7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f2d89b'; ctx.beginPath(); ctx.arc(x, y - r * .25, r * .24, 0, Math.PI * 2); ctx.fill();
  } else if (u.type === 'core') {
    ctx.save(); ctx.translate(x, y); ctx.rotate(clock * .35); ctx.fillStyle = u.team === 'blue' ? '#74d9eb' : '#ef7e76';
    ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 15 * k + 5; ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * .75, 0); ctx.lineTo(0, r); ctx.lineTo(-r * .75, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  } else {
    const blue = u.team === 'blue';
    ctx.fillStyle = '#0308118c'; ctx.beginPath(); ctx.ellipse(x, y + r * .72, r * 1.1, r * .55, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = blue ? (u.type === 'hero' ? '#73d2eb' : '#8ac5c9') : (u.type === 'hero' ? '#ee7777' : '#d78a77');
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = u.type === 'hero' ? '#f5e6c1' : '#dce3db'; ctx.beginPath(); ctx.arc(x, y - r * .1, r * .47, 0, Math.PI * 2); ctx.fill();
    if (u.type === 'hero' && u.hit > 0) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.stroke(); }
  }
  if (u.type !== 'minion' || u.team === 'red') {
    const bw = Math.max(18, r * 2.4), by = y - r - 9;
    ctx.fillStyle = '#09111b'; ctx.fillRect(x - bw / 2, by, bw, 4);
    ctx.fillStyle = u.team === 'blue' ? '#6fe0cb' : '#ef7973'; ctx.fillRect(x - bw / 2, by, bw * clamp(u.hp / u.max, 0, 1), 4);
  }
  if (u === world.player) {
    ctx.strokeStyle = '#f2d590'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 5 + Math.sin(clock * 5) * 1.3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff0bd'; ctx.font = `bold ${Math.max(9, 12 * k)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(heroes[heroIndex].symbol, x, y + 4 * k);
  }
}
function render() {
  if (!world) return;
  const vw = canvas.clientWidth, vh = canvas.clientHeight;
  const k = Math.min(vw / 1050, vh / 740), p = world.player;
  const camX = clamp(p.x - vw / (2 * k), 0, W - vw / k), camY = clamp(p.y - vh / (2 * k), 0, H - vh / k);
  const sx = -camX * k, sy = -camY * k;
  ctx.clearRect(0, 0, vw, vh);
  const bg = ctx.createLinearGradient(0, 0, vw, vh); bg.addColorStop(0, '#193d3b'); bg.addColorStop(.55, '#263d39'); bg.addColorStop(1, '#172e32'); ctx.fillStyle = bg; ctx.fillRect(0, 0, vw, vh);
  ctx.fillStyle = '#45614c'; ctx.globalAlpha = .24;
  for (let x = -((camX * k) % 80); x < vw; x += 80) for (let y = -((camY * k) % 80); y < vh; y += 80) { ctx.beginPath(); ctx.arc(x + 13, y + 19, 1.2, 0, 6.28); ctx.fill(); }
  ctx.globalAlpha = 1;
  // A broad stone lane joins the opposing keeps.
  ctx.lineCap = 'round'; ctx.strokeStyle = '#172d32'; ctx.lineWidth = 180 * k; ctx.beginPath(); ctx.moveTo(sx + 180 * k, sy + 1165 * k); ctx.bezierCurveTo(sx + 690 * k, sy + 1060 * k, sx + 1120 * k, sy + 600 * k, sx + 1850 * k, sy + 155 * k); ctx.stroke();
  ctx.strokeStyle = '#657067'; ctx.lineWidth = 152 * k; ctx.stroke(); ctx.setLineDash([12 * k, 18 * k]); ctx.strokeStyle = '#8a8b74'; ctx.lineWidth = 2 * k; ctx.stroke(); ctx.setLineDash([]);
  // River and pools add readable terrain landmarks.
  ctx.strokeStyle = '#3d8e91'; ctx.globalAlpha = .62; ctx.lineWidth = 62 * k; ctx.beginPath(); ctx.moveTo(sx + 1000 * k, sy + 0); ctx.bezierCurveTo(sx + 830 * k, sy + 420 * k, sx + 1180 * k, sy + 760 * k, sx + 910 * k, sy + H * k); ctx.stroke(); ctx.globalAlpha = 1;
  for (let i = 0; i < 9; i++) {
    const x = (i * 237 + 120) % W, y = (i * 179 + 110) % H, px = sx + x * k, py = sy + y * k;
    if (px < -40 || px > vw + 40 || py < -40 || py > vh + 40) continue;
    ctx.fillStyle = '#10282c'; ctx.beginPath(); ctx.arc(px, py, 37 * k, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#315147'; ctx.beginPath(); ctx.arc(px, py, 29 * k, 0, 6.28); ctx.fill();
    for (let j = 0; j < 5; j++) { const a = j * 1.256; ctx.fillStyle = '#4c7255'; ctx.beginPath(); ctx.arc(px + Math.cos(a) * 21 * k, py + Math.sin(a) * 18 * k, 8 * k, 0, 6.28); ctx.fill(); }
  }
  for (const t of world.towers) if (t.alive) drawUnit(t, sx, sy, k);
  for (const c of world.cores) if (c.alive) drawUnit(c, sx, sy, k);
  for (const u of [...world.minions, ...world.blue, ...world.red]) if (u.alive) drawUnit(u, sx, sy, k);
  for (const e of world.effects) {
    const x = sx + e.x * k, y = sy + e.y * k, f = e.t / e.life;
    ctx.globalAlpha = 1 - f; ctx.strokeStyle = e.color; ctx.lineWidth = Math.max(1, 3 * k);
    ctx.beginPath(); ctx.arc(x, y, (12 + f * (e.kind === 'burst' ? 42 : 22)) * k, 0, 6.28); ctx.stroke(); ctx.globalAlpha = 1;
  }
  if (moveTarget) { ctx.strokeStyle = '#f1d89b'; ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(sx + moveTarget.x * k, sy + moveTarget.y * k, 11 * k, 0, 6.28); ctx.stroke(); ctx.globalAlpha = 1; }
  drawMinimap();
}
function drawMinimap() {
  const w = mini.width, h = mini.height; mctx.clearRect(0, 0, w, h); mctx.fillStyle = '#203b39'; mctx.fillRect(0, 0, w, h);
  mctx.strokeStyle = '#8a8b74'; mctx.lineWidth = 9; mctx.lineCap = 'round'; mctx.beginPath(); mctx.moveTo(8, h - 8); mctx.quadraticCurveTo(w * .47, h * .74, w - 8, 8); mctx.stroke();
  for (const t of world.towers.filter(t => t.alive)) { mctx.fillStyle = t.team === 'blue' ? '#62d1e8' : '#ec7771'; mctx.fillRect(t.x / W * w - 2, t.y / H * h - 2, 4, 4); }
  for (const u of [...world.red, ...world.blue]) if (u.alive) { mctx.fillStyle = u.team === 'blue' ? '#75e3ef' : '#ff8277'; mctx.beginPath(); mctx.arc(u.x / W * w, u.y / H * h, u === world.player ? 4 : 2.5, 0, 6.28); mctx.fill(); }
  for (const c of world.cores) { mctx.fillStyle = c.team === 'blue' ? '#79e8ec' : '#ff8476'; mctx.fillRect(c.x / W * w - 3, c.y / H * h - 3, 6, 6); }
}
function loop(now) {
  const dt = Math.min(.04, Math.max(0, (now - last) / 1000)); last = now;
  tick(dt); render();
  if ($('#match').classList.contains('hidden') || matchState === 'ended' || paused) { raf = 0; return; }
  raf = requestAnimationFrame(loop);
}
function pauseMatch() {
  if (matchState !== 'playing') return;
  paused = !paused; $('#pausePanel').classList.toggle('hidden', !paused);
  if (paused) { cancelAnimationFrame(raf); raf = 0; } else { last = performance.now(); raf = requestAnimationFrame(loop); }
}
$('#quitMatch').onclick = pauseMatch; $('#matchSettings').onclick = pauseMatch;
$('#resumeMatch').onclick = pauseMatch;
$('#leaveMatch').onclick = () => { paused = false; matchState = 'idle'; $('#match').classList.add('hidden'); $('#pausePanel').classList.add('hidden'); $('#home').classList.remove('hidden'); if (raf) cancelAnimationFrame(raf); };
$('#playAgain').onclick = startMatch;
$('#returnHome').onclick = () => { $('#match').classList.add('hidden'); $('#matchNotice').classList.add('hidden'); $('#home').classList.remove('hidden'); matchState = 'idle'; };
$('#attackBtn').onclick = () => doAttack(); $('#mobileAttack').onclick = () => doAttack();
$('#skillOne').onclick = () => doAttack(false, 1); $('#skillTwo').onclick = () => doAttack(false, 2); $('#skillUlt').onclick = () => doAttack(true);
$('#mobileSkill').onclick = () => doAttack(false, 1);
$('#recallBtn').onclick = () => { if (!world || paused || matchState !== 'playing') return; recallTime = 3; moveTarget = null; toast('Recalling · stay still for 3 seconds'); };
window.addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
  keys[e.key] = true;
  if (e.repeat || $('#match').classList.contains('hidden')) return;
  if (e.key === 'Escape' || e.key.toLowerCase() === 'p') pauseMatch();
  else if (e.key.toLowerCase() === 'q') doAttack(false, 1);
  else if (e.key.toLowerCase() === 'w') doAttack(false, 2);
  else if (e.key.toLowerCase() === 'e') doAttack(true);
  else if (e.key.toLowerCase() === 'r') $('#recallBtn').click();
  else if (e.key === ' ') doAttack();
});
window.addEventListener('keyup', e => { keys[e.key] = false; });
const pad = $('#joystick'), knob = $('#stickKnob');
function moveStick(e) {
  const r = pad.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let dx = e.clientX - cx, dy = e.clientY - cy, max = r.width * .34, d = Math.hypot(dx, dy);
  if (d > max) { dx *= max / d; dy *= max / d; }
  stick.x = dx / max; stick.y = dy / max; knob.style.transform = `translate(${dx}px, ${dy}px)`;
}
pad.addEventListener('pointerdown', e => { e.preventDefault(); pad.setPointerCapture(e.pointerId); moveStick(e); });
pad.addEventListener('pointermove', e => { if (pad.hasPointerCapture(e.pointerId)) moveStick(e); });
function releaseStick() { stick = { x: 0, y: 0 }; knob.style.transform = ''; }
pad.addEventListener('pointerup', releaseStick); pad.addEventListener('pointercancel', releaseStick);
canvas.addEventListener('pointerdown', e => {
  if (!world || paused || matchState !== 'playing') return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const r = canvas.getBoundingClientRect(), vw = canvas.clientWidth, vh = canvas.clientHeight, k = Math.min(vw / 1050, vh / 740), p = world.player;
  const camX = clamp(p.x - vw / (2 * k), 0, W - vw / k), camY = clamp(p.y - vh / (2 * k), 0, H - vh / k);
  const x = clamp((e.clientX - r.left) / k + camX, 65, W - 65), y = clamp((e.clientY - r.top) / k + camY, 65, H - 65);
  if (e.detail > 1) doAttack(); else moveTarget = { x, y };
});
window.addEventListener('blur', () => { keys = {}; releaseStick(); });

