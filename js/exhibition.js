/* ==========================================================================
   EXHIBITION MAP LOGIC
   Handles drawing markers, tooltips, and room overlays on the map.
   ========================================================================== */

// 1. MARKER DATA
// x/y are percentages relative to the map container.
// clickId corresponds to keys in DATA_STORE (script.js).
const MARKERS = [
  { x: 51, y: 85, label: 'Hades',          clickId: 'hades',    icon:'images/IconHades.webp'},
  { x: 35, y: 80, label: 'Ambrosia',       clickId: 'ambrosia', icon:'images/IconAmbrosia.webp'},
  { x: 67, y: 83, label: 'Stygian Blade',  clickId: 'blade',    icon:'images/IconBlade.webp'},
  { x: 51, y: 72, label: 'Tomb Trove',     clickId: 'trove',    icon:'images/IconTrove.webp'},
  { x: 68, y: 66, label: 'Ares',           clickId: 'ares',     icon:'images/IconAres.webp'},
  { x: 58, y: 56, label: 'Charon',         clickId: 'charon',   icon:'images/IconCharon.webp'},
  { x: 50, y: 53, label: 'Vase',           clickId: 'vase',     icon:'images/ItemVase.png'}, // Note: .png
  { x: 70, y: 49, label: 'Obol Coin',      clickId: 'obol',     icon:'images/IconObol.webp'},
  { x: 56, y: 47, label: 'Zeus',           clickId: 'zeus',     icon:'images/IconZeus.webp'},
  { x: 70, y: 38, label: 'Greek Shield',   clickId: 'shield',   icon:'images/IconShield.webp'},
  { x: 36, y: 36, label: 'Chariot',        clickId: 'chariot',  icon:'images/IconChariot.webp'},
  { x: 52, y: 26, label: 'Minotaur',       clickId: 'minotaur', icon:'images/IconMinotaur.webp'},
  { x: 71, y: 22, label: 'Bow & Arrow',    clickId: 'bow',      icon:'images/IconBow.webp'},
  { x: 17, y: 36, label: 'Athena',         clickId: 'athena',   icon:'images/IconAthena.webp'},
  { x: 51, y: 13, label: 'Cerberus',       clickId: 'cerberus', icon:'images/IconCerberus.webp'}
];

// 2. ROOM DATA (OVERLAYS)
// These define the rectangular areas representing game regions.
const ROOMS = [
  { id: 'room-house',    x: 10, y: 80, w: 80, h: 15 }, // House of Hades (Bottom)
  { id: 'room-tartarus', x: 40, y: 60, w: 40, h: 15 }, // Tartarus
  { id: 'room-asphodel', x: 40, y: 40, w: 40, h: 15 }, // Asphodel
  { id: 'room-elysium',  x: 20, y: 20, w: 60, h: 15 }, // Elysium
  { id: 'room-surface',  x: 10, y: 5,  w: 80, h: 15 }  // Surface (Top)
];


// 3. DRAW FUNCTIONS

function drawMarkers() {
  const host = document.getElementById('markers');
  const tip  = document.getElementById('tooltip');
  
  if (!host) return; // Exit if element doesn't exist

  host.innerHTML = '';

  MARKERS.forEach(p => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marker marker-buttons'; // Hook for script.js event listener
    
    // Positioning
    btn.style.left = p.x + '%';
    btn.style.top  = p.y + '%';
    btn.setAttribute('aria-label', p.label);
    
    // ID Assignment (Direct mapping from MARKERS array)
    btn.id = p.clickId; 

    // Icon Image
    const img = document.createElement('img');
    img.src = p.icon;
    img.alt = p.label;
    btn.appendChild(img);

    // Tooltip Events
    if (tip) {
      btn.addEventListener('mouseenter', () => {
        tip.hidden = false;
        tip.textContent = p.label;
      });
      
      btn.addEventListener('mousemove', (e) => {
        // Offset tooltip slightly from cursor
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
    div.className = 'room-rect'; // Styled in css/style-map.css
    
    // Assign percentage-based dimensions
    div.style.left   = room.x + '%';
    div.style.top    = room.y + '%';
    div.style.width  = room.w + '%';
    div.style.height = room.h + '%';
    
    // Optional ID for debugging
    div.id = room.id; 
    
    host.appendChild(div);
  });
}

// 4. INITIALIZE
// Run drawing functions when script loads
drawMarkers();
drawRooms();