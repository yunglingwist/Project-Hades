/* ==========================================================================
   EXHIBITION MAP LOGIC
   ========================================================================== */

// 1. MARKER DATA
const MARKERS = [
    { x: 46, y: 92, label: 'Hades',          clickId: 'hades',    icon:'images/IconHades.webp'},
    { x: 30, y: 80, label: 'Ambrosia',       clickId: 'ambrosia', icon:'images/IconAmbrosia.webp'},
    { x: 70, y: 81, label: 'Stygian Blade',  clickId: 'blade',    icon:'images/IconBlade.webp'},
    { x: 46, y: 72, label: 'Tomb Trove',     clickId: 'trove',    icon:'images/IconTrove.webp'},
    { x: 63, y: 66, label: 'Ares',           clickId: 'ares',     icon:'images/IconAres.webp'},
    { x: 53, y: 61, label: 'Charon',         clickId: 'charon',   icon:'images/IconCharon.webp'},
    { x: 40, y: 53, label: 'Vase',           clickId: 'vase',     icon:'images/ItemVase.webp',}, 
    { x: 65, y: 49, label: 'Obol Coin',      clickId: 'obol',     icon:'images/IconObol.webp'},
    { x: 51, y: 47, label: 'Zeus',           clickId: 'zeus',     icon:'images/IconZeus.webp'},
    { x: 65, y: 38, label: 'Greek Shield',   clickId: 'shield',   icon:'images/IconShield.webp'},
    { x: 31, y: 36, label: 'Chariot',        clickId: 'chariot',  icon:'images/IconChariot.webp'},
    { x: 47, y: 26, label: 'Minotaur',       clickId: 'minotaur', icon:'images/IconMinotaur.webp'},
    { x: 66, y: 22, label: 'Bow & Arrow',    clickId: 'bow',      icon:'images/IconBow.webp'},
    { x: 18, y: 31, label: 'Athena',         clickId: 'athena',   icon:'images/IconAthena.webp'},
    { x: 46, y: 13, label: 'Cerberus',       clickId: 'cerberus', icon:'images/IconCerberus.webp'}
];

// 2. ROOM DATA (Layout Blueprints)
const ROOMS = [
        { label: 'House of Hades', x: 5,  y: 78, w: 90, h: 18, items: ['Hades', 'Ambrosia', 'Stygian Blade'] },
        { label: 'Tartarus',       x: 5,  y: 60, w: 90, h: 16, items: ['Tomb Trove', 'Ares', 'Charon'] },
        { label: 'Asphodel',       x: 5,  y: 44, w: 90, h: 14, items: ['Vase', 'Obol Coin', 'Zeus'] },
        { label: 'Elysium',        x: 5,  y: 30, w: 90, h: 12, items: ['Greek Shield', 'Chariot', 'Bow & Arrow'] },
        { label: 'Surface',        x: 5,  y: 12, w: 90, h: 16, items: ['Athena', 'Minotaur', 'Cerberus'] }
];


// 3. DRAW FUNCTIONS

function drawMarkers() {
  const host = document.getElementById('markers');
  const tip  = document.getElementById('tooltip');
  
  if (!host) return;

  host.innerHTML = '';

  MARKERS.forEach(p => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marker marker-buttons'; // Hook for script.js
    
    btn.style.left = p.x + '%';
    btn.style.top  = p.y + '%';
    btn.setAttribute('aria-label', p.label);
    btn.id = p.clickId; 

    const img = document.createElement('img');
    img.src = p.icon;
    img.alt = p.label;
    btn.appendChild(img);

    if (tip) {
      btn.addEventListener('mouseenter', () => {
        tip.hidden = false;
        tip.textContent = p.label;
      });
      btn.addEventListener('mousemove', (e) => {
        tip.style.left = (e.clientX + 10) + 'px';
        tip.style.top  = (e.clientY + 10) + 'px';
      });
      btn.addEventListener('mouseleave', () => { 
        tip.hidden = true; 
      });
    }
    host.appendChild(btn);
  });
}

function drawRooms() {
  const host = document.getElementById('rooms-layer');
  if (!host) return;

  host.innerHTML = '';

  ROOMS.forEach(room => {
    const div = document.createElement('div');
    div.className = 'room-rect';
    
    div.style.left   = room.x + '%';
    div.style.top    = room.y + '%';
    div.style.width  = room.w + '%';
    div.style.height = room.h + '%';
    
    // Add Label
    const span = document.createElement('span');
    span.className = 'room-label';
    span.textContent = room.label;
    div.appendChild(span);
    
    host.appendChild(div);
  });
}

// 4. SLIDER LOGIC (Cross-Fader)
function initSlider() {
    const slider = document.getElementById('view-slider');
    const mapLayer = document.getElementById('map');
    const roomsLayer = document.getElementById('rooms-layer');

    if (!slider || !mapLayer || !roomsLayer) return;

    slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        
        // Map fades OUT as value goes 0 -> 1
        mapLayer.style.opacity = 1 - val;
        
        // Rooms fade IN as value goes 0 -> 1
        roomsLayer.style.opacity = val;
    });
}

// 5. INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    drawMarkers();
    drawRooms();
    initSlider();
});