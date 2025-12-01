function themeSwitch() {
  const KEY_THEME   = 'projecthades-theme';
  const KEY_BGM_VOL = 'hades-bgm-volume';
  const KEY_BGM_POS = 'hades-bgm-time';

  const linkEl      = document.getElementById('theme-css');
  const select      = document.getElementById('theme');
  const portraitImg = document.querySelector('.hero-art img');

  // Tema CSS dosyaları
  const THEME_FILES = {
    "1500-1800": "css/themes/theme-1500-1800.css",
    "1800s":     "css/themes/theme-1800.css",
    "1900-1950": "css/themes/theme-1900-1950.css",
    "1950-1990": "css/themes/theme-1950-1990.css",
    "1990-2010": "css/themes/theme-1990-2010.css",
    "2035":      "css/themes/theme-2035.css"
  };

  // Portre görselleri
  const PORTRAIT_FILES = {
    "1500-1800": "images/PortraitZagreus.webp",
    "1800s":     "images/PortraitZagreus2.png",
    "1900-1950": "images/PortraitZagreus3.png",
    "1950-1990": "images/PortraitZagreus4.png",
    "1990-2010": "images/PortraitZagreus5.png",
    "2035":      "images/PortraitZagreus6.jpg"
  };

  // Tema -> müzik dosyası
  const THEME_BGM = {
    "1500-1800": "audio/1500-1800.mp3",
    "1800s":     "audio/1800s.mp3",
    "1900-1950": "audio/1900-1950.mp3",
    "1950-1990": "audio/1950-1990.mp3",
    "1990-2010": "audio/1990-2010.mp3",
    "2035":      "audio/2035.mp3"
  };

  // Sayfada audio elementi yoksa oluştur
  let audioEl = document.getElementById('bgm');
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.id = 'bgm';
    audioEl.preload = 'auto';
    audioEl.loop = true;
    audioEl.style.display = 'none';
    document.body.appendChild(audioEl);
  }

  // ---------- Yardımcılar ----------

  function setPortrait(theme) {
    if (!portraitImg) return;
    const file = PORTRAIT_FILES[theme] || PORTRAIT_FILES["1990-2010"];

    if (!portraitImg.style.transition) {
      portraitImg.style.transition = 'opacity .25s ease';
    }

    const tmp = new Image();
    portraitImg.style.opacity = '0';
    tmp.onload = () => {
      portraitImg.src = file;
      requestAnimationFrame(() => {
        portraitImg.style.opacity = '1';
      });
    };
    tmp.src = file;
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

    // Aynı parça zaten yüklüyse boşuna resetleme
    if (audioEl.src && audioEl.src.includes(src)) {
      return;
    }

    audioEl.src = src;
    audioEl.load();

    audioEl.addEventListener('loadedmetadata', () => {
      try {
        const dur = audioEl.duration || 1;
        audioEl.currentTime = resumePoint % Math.max(1, dur);
      } catch (e) {}

      // Eğer önceki temada çalıyorduysa, yeni temada da devam etsin
      if (wasPlaying || sessionStorage.getItem('hades-bgm-ever-started') === '1') {
        audioEl.play().catch(() => {});
      }
    }, { once: true });
  }

  // **** DEĞİŞİKLİK BURADA: applyTheme fonksiyonuna animasyon eklendi ****
  function applyTheme(theme) {
    const t = THEME_FILES[theme] ? theme : "1990-2010";

    // 1. Ekranın o anki renginde geçici bir perde (overlay) oluştur
    const overlay = document.createElement('div');
    const currentBg = getComputedStyle(document.body).backgroundColor;
    
    // Perdenin stilini ayarla
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: currentBg !== 'rgba(0, 0, 0, 0)' ? currentBg : '#111', // Güvenlik için fallback renk
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0, // Başlangıçta görünmez
        transition: 'opacity 0.4s ease' // Geçiş hızı (0.4 saniye)
    });
    document.body.appendChild(overlay);

    // 2. Perdeyi yavaşça görünür yap (Fade In) -> Ekran kararır/renklenir
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });

    // 3. Perde tam kapandığında (0.4 sn sonra) asıl değişikliği yap
    setTimeout(() => {
        setThemeCss(t);
        localStorage.setItem(KEY_THEME, t);
        setPortrait(t);
        setThemeBgm(t);

        // 4. Yeni tema CSS'i yüklendikten sonra perdeyi kaldır (Fade Out)
        setTimeout(() => {
            overlay.style.opacity = '0';
            // Animasyon bitince DOM'dan tamamen sil
            setTimeout(() => {
                if(overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 400); 
        }, 150); // CSS'in tarayıcı tarafından işlenmesi için minik bir gecikme
        
    }, 400); // Fade In süresi ile eşleşmeli
  }

  // ---------- BGM QoL: ses & zaman ----------

  // Volume hatırla
  const savedVol = parseFloat(localStorage.getItem(KEY_BGM_VOL) || '0.5');
  audioEl.volume = Number.isFinite(savedVol)
    ? Math.min(1, Math.max(0, savedVol))
    : 0.5;

  // Konum hatırla
  const savedPos = parseFloat(localStorage.getItem(KEY_BGM_POS) || '0');
  if (Number.isFinite(savedPos) && savedPos > 0) {
    audioEl.addEventListener('loadedmetadata', () => {
      try {
        const dur = audioEl.duration || 1;
        audioEl.currentTime = savedPos % Math.max(1, dur);
      } catch (e) {}
    }, { once: true });
  }

  // Her 10sn'de bir currentTime kaydet
  setInterval(() => {
    if (!audioEl.paused) {
      localStorage.setItem(KEY_BGM_POS, String(audioEl.currentTime || 0));
    }
  }, 10);

  // Dışarıdan volume değiştirmek istersen:
  window.hadesBgmSetVolume = (v) => {
    const nv = Math.min(1, Math.max(0, Number(v)));
    if (Number.isFinite(nv)) {
      audioEl.volume = nv;
      localStorage.setItem(KEY_BGM_VOL, String(nv));
    }
  };

  // ---------- Autoplay davranışı ----------
  // Amaç: kullanıcı bir kere başlattıysa, aynı tab içinde tüm sayfalarda durmadan çalsın.

  const armAutoplay = () => {
    const everStarted = sessionStorage.getItem('hades-bgm-ever-started') === '1';

    // Eğer bu sekmede daha önce başladıysa, yeni sayfada direkt dene
    if (everStarted) {
      audioEl.play().catch(() => {});
      return;
    }

    // İlk sayfa / ilk giriş: bir kullanıcı etkileşimi bekleyelim
    const firstPlay = () => {
      audioEl.play().catch(() => {});
      sessionStorage.setItem('hades-bgm-ever-started', '1');
      window.removeEventListener('pointerdown', firstPlay);
      window.removeEventListener('keydown', firstPlay);
    };

    window.addEventListener('pointerdown', firstPlay, { once: true });
    window.addEventListener('keydown', firstPlay, { once: true });
  };

  // ---------- İlk yükleme + select değişimi ----------

  // Sayfa ilk açıldığında animasyonsuz yüklemek için direkt fonksiyonları çağırabilirsin
  // Ama "applyTheme" kullanırsan sayfa açılışında da hoş bir fade-in efekti olur.
  const savedTheme = localStorage.getItem(KEY_THEME) || '1990-2010';
  if (select) select.value = savedTheme;
  
  // İlk açılışta animasyon istemiyorsan burayı şöyle değiştirebilirsin:
  // setThemeCss(savedTheme); localStorage.setItem(KEY_THEME, savedTheme); setPortrait(savedTheme); setThemeBgm(savedTheme);
  // Ama mevcut haliyle bırakırsan sayfa açılırken de efekt verir:
  setThemeCss(savedTheme); localStorage.setItem(KEY_THEME, savedTheme); setPortrait(savedTheme); setThemeBgm(savedTheme);

  // Autoplay kolunu kur
  armAutoplay();

  // Tema değişimi
  if (select) {
    select.addEventListener('change', (e) => {
      const val = e.target.value;
      applyTheme(val);
    });
  }
}

// Sayfa yüklenince çalışsın
themeSwitch();