function themeSwitch() {
  const KEY_THEME   = 'projecthades-theme';
  const KEY_BGM_VOL = 'hades-bgm-volume';
  const KEY_BGM_POS = 'hades-bgm-time';

  const linkEl      = document.getElementById('theme-css');
  const select      = document.getElementById('theme');
  const portraitImg = document.querySelector('.hero-art img');

  // Configuration - Sadece CSS dosyalarını tutuyoruz
  const THEME_FILES = {
    "1500-1800": "css/themes/theme-1500-1800.css",
    "1800s":     "css/themes/theme-1800.css",
    "1900-1950": "css/themes/theme-1900-1950.css",
    "1950-1990": "css/themes/theme-1950-1990.css",
    "1990-2010": "css/themes/theme-1990-2010.css",
    "2035":      "css/themes/theme-2035.css"
  };

  // Portreler (Header logosu artık CSS'te, buraya gerek yok)
  const PORTRAIT_FILES = {
    "1500-1800": "images/PortraitZagreus.webp",
    "1800s":     "images/PortraitZagreus2.png",
    "1900-1950": "images/PortraitZagreus3.png",
    "1950-1990": "images/PortraitZagreus4.png",
    "1990-2010": "images/PortraitZagreus5.png",
    "2035":      "images/PortraitZagreus6.jpg"
  };

  const THEME_BGM = {
    "1500-1800": "audio/1500-1800.mp3",
    "1800s":     "audio/1800s.mp3",
    "1900-1950": "audio/1900-1950.mp3",
    "1950-1990": "audio/1950-1990.mp3",
    "1990-2010": "audio/1990-2010.mp3",
    "2035":      "audio/2035.mp3"
  };

  // Init Audio
  let audioEl = document.getElementById('bgm');
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.id = 'bgm';
    audioEl.preload = 'auto';
    audioEl.loop = true;
    audioEl.style.display = 'none';
    document.body.appendChild(audioEl);
  }

  // --- Helpers ---

  function setPortrait(theme) {
    if (!portraitImg) return;
    const file = PORTRAIT_FILES[theme] || PORTRAIT_FILES["1990-2010"];
    if (!portraitImg.style.transition) portraitImg.style.transition = 'opacity .25s ease';
    
    const tmp = new Image();
    tmp.src = file;
    tmp.onload = () => {
        portraitImg.style.opacity = '0';
        setTimeout(() => {
            portraitImg.src = file;
            portraitImg.style.opacity = '1';
        }, 250);
    };
  }

  function setThemeCss(theme) {
    const href = THEME_FILES[theme] || THEME_FILES["1990-2010"];
    if (linkEl) linkEl.setAttribute('href', href);
  }

  function setThemeBgm(theme) {
    if (!audioEl) return;
    const src = THEME_BGM[theme] || THEME_BGM["1990-2010"];
    const wasPlaying  = !audioEl.paused && !audioEl.ended;
    const resumePoint = audioEl.currentTime || parseFloat(localStorage.getItem(KEY_BGM_POS) || '0') || 0;

    if (audioEl.src && audioEl.src.includes(src)) return;

    audioEl.src = src;
    audioEl.load();
    audioEl.addEventListener('loadedmetadata', () => {
      try {
        const dur = audioEl.duration || 1;
        audioEl.currentTime = resumePoint % Math.max(1, dur);
      } catch (e) {}
      if (wasPlaying || sessionStorage.getItem('hades-bgm-ever-started') === '1') {
        audioEl.play().catch(() => {});
      }
    }, { once: true });
  }

  // --- Core Logic (Animation Included) ---

  function applyTheme(theme, animate = false) {
    const t = THEME_FILES[theme] ? theme : "1990-2010";

    // Animasyonsuz geçiş (İlk açılış)
    if (!animate) {
        setThemeCss(t);
        localStorage.setItem(KEY_THEME, t);
        setPortrait(t);
        setThemeBgm(t);
        return;
    }

    // Animasyonlu geçiş (Kullanıcı değiştirdiğinde)
    const overlay = document.createElement('div');
    const currentBg = getComputedStyle(document.body).backgroundColor;
    
    Object.assign(overlay.style, {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: currentBg !== 'rgba(0, 0, 0, 0)' ? currentBg : '#111',
        zIndex: 9999, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.4s ease'
    });
    document.body.appendChild(overlay);

    // Fade In
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // Change Content & Fade Out
    setTimeout(() => {
        setThemeCss(t);
        localStorage.setItem(KEY_THEME, t);
        setPortrait(t);
        setThemeBgm(t);

        // Logo artık CSS değişkeni ile otomatik değişiyor, JS müdahalesine gerek yok.

        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => { if(overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 400); 
        }, 150); 
        
    }, 400); 
  }

  // --- Audio Persistence ---
  const savedVol = parseFloat(localStorage.getItem(KEY_BGM_VOL) || '0.5');
  audioEl.volume = Number.isFinite(savedVol) ? Math.min(1, Math.max(0, savedVol)) : 0.5;

  const savedPos = parseFloat(localStorage.getItem(KEY_BGM_POS) || '0');
  if (Number.isFinite(savedPos) && savedPos > 0) {
    audioEl.addEventListener('loadedmetadata', () => {
      try {
        const dur = audioEl.duration || 1;
        audioEl.currentTime = savedPos % Math.max(1, dur);
      } catch (e) {}
    }, { once: true });
  }

  setInterval(() => {
    if (!audioEl.paused) localStorage.setItem(KEY_BGM_POS, String(audioEl.currentTime || 0));
  }, 1000); // Performans için 10ms yerine 1000ms yaptım

  // --- Init ---
  const savedTheme = localStorage.getItem(KEY_THEME) || '1990-2010';
  if (select) select.value = savedTheme;
  
  applyTheme(savedTheme, false); // Animasyonsuz başlat

  // Autoplay
  const armAutoplay = () => {
    const everStarted = sessionStorage.getItem('hades-bgm-ever-started') === '1';
    if (everStarted) { audioEl.play().catch(() => {}); return; }
    const firstPlay = () => {
      audioEl.play().catch(() => {});
      sessionStorage.setItem('hades-bgm-ever-started', '1');
      window.removeEventListener('pointerdown', firstPlay);
      window.removeEventListener('keydown', firstPlay);
    };
    window.addEventListener('pointerdown', firstPlay, { once: true });
    window.addEventListener('keydown', firstPlay, { once: true });
  };
  armAutoplay();

  if (select) {
    select.addEventListener('change', (e) => {
      applyTheme(e.target.value, true); // Animasyonlu geçiş
    });
  }
}

themeSwitch();