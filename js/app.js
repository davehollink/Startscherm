/**
 * Liquid Glass Dashboard Application
 * High-end Apple Neumorphic Glass aesthetic with NU.nl News & Google Search
 */

// =============================================================================
// Default Configurations
// =============================================================================

const DEFAULT_QA_TILES = [
  { id: '1', name: 'YouTube', url: 'https://www.youtube.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain=youtube.com' },
  { id: '2', name: 'GitHub', url: 'https://github.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain=github.com' },
  { id: '3', name: 'Gmail', url: 'https://mail.google.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain=mail.google.com' },
  { id: '4', name: 'Drive', url: 'https://drive.google.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain=drive.google.com' },
  { id: '5', name: 'Notion', url: 'https://www.notion.so', icon: 'https://www.google.com/s2/favicons?sz=64&domain=notion.so' },
  { id: '6', name: 'ChatGPT', url: 'https://chatgpt.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com' },
  { id: '7', name: 'Twitter', url: 'https://x.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain=x.com' }
];

const DEFAULT_TODOS = [
  { id: '1', text: 'Projectvoorstel afronden', done: true },
  { id: '2', text: 'Pull request controleren', done: false },
  { id: '3', text: 'Boodschappen doen', done: false },
  { id: '4', text: 'Hoofdstuk boek lezen', done: false }
];

const QUOTES_POOL = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "Focus is a muscle; the more you practice, the stronger it gets.", author: "Cal Newport" }
];

const CITIES = {
  Amsterdam: { lat: 52.3676, lon: 4.9041, country: 'NL' },
  Rotterdam: { lat: 51.9244, lon: 4.4777, country: 'NL' },
  Utrecht: { lat: 52.0907, lon: 5.1214, country: 'NL' },
  'Den Haag': { lat: 52.0705, lon: 4.3007, country: 'NL' },
  Eindhoven: { lat: 51.4416, lon: 5.4697, country: 'NL' },
  Groningen: { lat: 53.2194, lon: 6.5665, country: 'NL' },
  Maastricht: { lat: 50.8514, lon: 5.6910, country: 'NL' },
  Zwolle: { lat: 52.5168, lon: 6.0830, country: 'NL' },
  Arnhem: { lat: 51.9851, lon: 5.8987, country: 'NL' },
  Antwerpen: { lat: 51.2194, lon: 4.4025, country: 'BE' },
  Brussel: { lat: 50.8503, lon: 4.3517, country: 'BE' },
  Berlin: { lat: 52.5200, lon: 13.4050, country: 'DE' }
};

// =============================================================================
// Ambient Nature & Focus Audio Synthesizer (Web Audio API)
// =============================================================================
class FocusSoundSystem {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.tracks = [
      { name: 'Alpine Rain', sub: 'Zachte regen op meer' },
      { name: 'Ocean Waves', sub: 'Kabbelend water' },
      { name: 'Lo-Fi Focus Drone', sub: '432Hz kalmerend' },
      { name: 'Pure White Noise', sub: 'Diepe concentratie' }
    ];
    this.currentTrackIndex = 0;
    this.nodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggle() {
    this.init();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playCurrent();
      return true;
    }
  }

  next() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (this.isPlaying) this.playCurrent();
    return this.tracks[this.currentTrackIndex];
  }

  prev() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    if (this.isPlaying) this.playCurrent();
    return this.tracks[this.currentTrackIndex];
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  playCurrent() {
    this.stop();
    this.init();
    this.isPlaying = true;
    const name = this.tracks[this.currentTrackIndex].name;

    if (name.includes('Rain')) this.synthesizeRain();
    else if (name.includes('Waves')) this.synthesizeWaves();
    else if (name.includes('Drone')) this.synthesizeDrone();
    else this.synthesizeWhiteNoise();
  }

  stop() {
    this.nodes.forEach(n => {
      try { n.stop(); } catch(e) {}
      try { n.disconnect(); } catch(e) {}
    });
    this.nodes = [];
    this.isPlaying = false;
  }

  synthesizeRain() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520;
      out[i] = (b0 + b1 + b2) * 0.18;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.1;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();
    this.nodes.push(src, filter, gain);
  }

  synthesizeWaves() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 2.5;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.14;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.value = 0.16;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start();
    lfo.start();
    this.nodes.push(src, lfo, lfoGain, filter, gain);
  }

  synthesizeDrone() {
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    o1.type = 'sine'; o1.frequency.value = 108;
    o2.type = 'sine'; o2.frequency.value = 216;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.08;

    o1.connect(gain);
    o2.connect(gain);
    gain.connect(this.ctx.destination);
    o1.start();
    o2.start();
    this.nodes.push(o1, o2, gain);
  }

  synthesizeWhiteNoise() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = (Math.random() * 2 - 1) * 0.04;
    const src = this.ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    src.connect(this.ctx.destination);
    src.start();
    this.nodes.push(src);
  }
}

// =============================================================================
// Dashboard Controller
// =============================================================================
class LiquidDashboard {
  constructor() {
    this.tiles = this.load('liquid_tiles', DEFAULT_QA_TILES);
    this.todos = this.load('liquid_todos', DEFAULT_TODOS);
    this.notes = localStorage.getItem('liquid_notes') || '';
    this.settings = this.load('liquid_settings', {
      userName: 'Dave',
      bgTheme: 'bg-mountain-lake',
      customBg: '',
      weatherCity: 'Amsterdam',
      themeMode: 'light'
    });

    this.currentView = 'all';
    this.isEditMode = false;
    this.soundSystem = new FocusSoundSystem();

    this.initElements();
    this.bindEvents();
    this.applySettings();
    this.updateClock();
    this.renderTiles();
    this.renderTodos();
    this.initNotes();
    this.initQuote();
    this.fetchNews('Algemeen');
    this.fetchWeather();

    // Intervals
    setInterval(() => this.updateClock(), 1000);
    setInterval(() => this.fetchNews(this.newsCategorySelect.value), 12 * 60 * 1000);
    setInterval(() => this.fetchWeather(), 30 * 60 * 1000);
  }

  load(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {
      console.error(e);
    }
  }

  initElements() {
    // Pure Greeting (Without Window/Pill)
    this.pureGreetingText = document.getElementById('pure-greeting-text');
    this.toggleEditModeBtn = document.getElementById('toggle-edit-mode-btn');
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.openSettingsModalBtn = document.getElementById('open-settings-modal-btn');

    // Dock
    this.dockButtons = document.querySelectorAll('.liquid-dock .dock-btn:not(.add-btn)');
    this.dockAddTileBtn = document.getElementById('dock-add-tile-btn');

    // Hero Clock & Search
    this.clockMain = document.getElementById('clock-main');
    this.dateMain = document.getElementById('date-main');
    this.searchForm = document.getElementById('google-search-form');
    this.searchInput = document.getElementById('search-input');

    // Weather Floating Card
    this.weatherCard = document.getElementById('weather-card');
    this.weatherCardIcon = document.getElementById('weather-card-icon');
    this.weatherCardTemp = document.getElementById('weather-card-temp');
    this.weatherCardDesc = document.getElementById('weather-card-desc');
    this.weatherCardCity = document.getElementById('weather-card-city');

    // NU.nl News Card
    this.newsLiquidList = document.getElementById('news-liquid-list');
    this.newsCategorySelect = document.getElementById('news-category-select');

    // Quick Access
    this.quickAccessGrid = document.getElementById('quick-access-grid');
    this.editQuickAccessBtn = document.getElementById('edit-quick-access-btn');

    // To Do
    this.openAddTodoBtn = document.getElementById('open-add-todo-btn');
    this.todoAddForm = document.getElementById('todo-add-form');
    this.todoInputField = document.getElementById('todo-input-field');
    this.liquidTodoList = document.getElementById('liquid-todo-list');
    this.todoStatsLabel = document.getElementById('todo-stats-label');
    this.todoProgressFill = document.getElementById('todo-progress-fill');

    // Focus Sound Player Mini-Widget
    this.focusTrackName = document.getElementById('focus-track-name');
    this.focusTrackSub = document.getElementById('focus-track-sub');
    this.soundEqualizer = document.getElementById('sound-equalizer');
    this.playerPlayBtn = document.getElementById('player-play-btn');
    this.playBtnIcon = document.getElementById('play-btn-icon');
    this.playerPrevBtn = document.getElementById('player-prev-btn');
    this.playerNextBtn = document.getElementById('player-next-btn');

    // Bottom Cards
    this.liquidNotesInput = document.getElementById('liquid-notes-input');
    this.notesStatusBadge = document.getElementById('notes-status-badge');
    this.quoteText = document.getElementById('quote-text');
    this.quoteAuthor = document.getElementById('quote-author');
    this.refreshQuoteBtn = document.getElementById('refresh-quote-btn');

    // Modals
    this.tileModal = document.getElementById('tile-modal');
    this.tileModalTitle = document.getElementById('tile-modal-title');
    this.tileForm = document.getElementById('tile-form');
    this.tileFormId = document.getElementById('tile-form-id');
    this.tileNameInput = document.getElementById('tile-name-input');
    this.tileUrlInput = document.getElementById('tile-url-input');
    this.tileIconInput = document.getElementById('tile-icon-input');
    this.triggerFileUploadBtn = document.getElementById('trigger-file-upload-btn');
    this.tileFileInput = document.getElementById('tile-file-input');
    this.clearCustomIconBtn = document.getElementById('clear-custom-icon-btn');
    this.tileIconPreviewBox = document.getElementById('tile-icon-preview-box');
    this.currentUploadedIconBase64 = '';
    this.closeTileModal = document.getElementById('close-tile-modal');
    this.cancelTileBtn = document.getElementById('cancel-tile-btn');

    this.settingsModal = document.getElementById('settings-modal');
    this.closeSettingsModal = document.getElementById('close-settings-modal');
    this.wpCards = document.querySelectorAll('.wp-card');
    this.customBgInput = document.getElementById('custom-bg-input');
    this.applyCustomBg = document.getElementById('apply-custom-bg');
    this.userNameInput = document.getElementById('user-name-input');
    this.weatherCitySelect = document.getElementById('weather-city-select');
    this.exportJsonBtn = document.getElementById('export-json-btn');
    this.importJsonBtn = document.getElementById('import-json-btn');
    this.importFileInput = document.getElementById('import-file-input');
    this.resetDefaultsBtn = document.getElementById('reset-defaults-btn');
  }

  bindEvents() {
    // Search Submit Handler (Google Search + Direct URL navigation)
    this.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = this.searchInput.value.trim();
      if (!query) return;

      if (/^(https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/.*)?$/.test(query)) {
        window.location.href = query.startsWith('http') ? query : `https://${query}`;
      } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    });

    // Keyboard Shortcuts (⌘K, /)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.searchInput.focus();
        this.searchInput.select();
      } else if (e.key === '/' && document.activeElement !== this.searchInput && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        this.searchInput.focus();
      } else if (e.key === 'Escape') {
        this.closeAllModals();
        this.searchInput.blur();
      }
    });

    // Purposeful Dock Navigation Views
    this.dockButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.dockButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Plus button in dock: opens add tile modal
    this.dockAddTileBtn.addEventListener('click', () => this.openTileModalDialog());

    // Weather card click opens settings directly on city select
    this.weatherCard.addEventListener('click', () => {
      this.openSettingsModalDialog();
      setTimeout(() => this.weatherCitySelect.focus(), 100);
    });

    // Edit Mode Toggle
    const toggleEdit = () => {
      this.isEditMode = !this.isEditMode;
      document.body.classList.toggle('edit-mode', this.isEditMode);
      this.toggleEditModeBtn.classList.toggle('active', this.isEditMode);
      this.editQuickAccessBtn.textContent = this.isEditMode ? 'Done' : 'Edit';
    };
    this.toggleEditModeBtn.addEventListener('click', toggleEdit);
    this.editQuickAccessBtn.addEventListener('click', toggleEdit);

    // Theme Toggle (Light / Dark)
    this.themeToggleBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      this.settings.themeMode = next;
      this.save('liquid_settings', this.settings);
    });

    // Sound Controls
    this.playerPlayBtn.addEventListener('click', () => {
      const playing = this.soundSystem.toggle();
      this.updateSoundPlayerUI(playing);
    });

    this.playerNextBtn.addEventListener('click', () => {
      const trk = this.soundSystem.next();
      if (this.focusTrackName) this.focusTrackName.textContent = trk.name;
      if (this.focusTrackSub) this.focusTrackSub.textContent = trk.sub;
      this.updateSoundPlayerUI(this.soundSystem.isPlaying);
    });

    this.playerPrevBtn.addEventListener('click', () => {
      const trk = this.soundSystem.prev();
      if (this.focusTrackName) this.focusTrackName.textContent = trk.name;
      if (this.focusTrackSub) this.focusTrackSub.textContent = trk.sub;
      this.updateSoundPlayerUI(this.soundSystem.isPlaying);
    });

    // NU.nl News Category change
    this.newsCategorySelect.addEventListener('change', () => {
      this.fetchNews(this.newsCategorySelect.value);
    });

    // To Do inline add toggle
    this.openAddTodoBtn.addEventListener('click', () => {
      const isVisible = this.todoAddForm.style.display !== 'none';
      this.todoAddForm.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) this.todoInputField.focus();
    });

    this.todoAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = this.todoInputField.value.trim();
      if (!txt) return;
      this.todos.push({ id: Date.now().toString(), text: txt, done: false });
      this.save('liquid_todos', this.todos);
      this.todoInputField.value = '';
      this.renderTodos();
    });

    // Notes auto-save with debounce
    let noteTimer;
    this.liquidNotesInput.addEventListener('input', () => {
      this.notesStatusBadge.textContent = 'Opslaan...';
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        localStorage.setItem('liquid_notes', this.liquidNotesInput.value);
        this.notesStatusBadge.textContent = 'Opgeslagen';
      }, 500);
    });

    // Quote Refresh
    this.refreshQuoteBtn.addEventListener('click', () => this.initQuote());

    // Tile Modal Events & Image Upload
    this.triggerFileUploadBtn.addEventListener('click', () => {
      this.tileFileInput.click();
    });

    this.tileFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          // Resize to max 128x128px for crisp rendering and optimal localStorage space
          const maxDim = 128;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          const base64Data = canvas.toDataURL('image/png');
          this.currentUploadedIconBase64 = base64Data;
          this.tileIconInput.value = '';
          this.updateTileModalIconPreview(base64Data);
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });

    this.clearCustomIconBtn.addEventListener('click', () => {
      this.currentUploadedIconBase64 = '';
      this.tileIconInput.value = '';
      this.updateTileModalIconPreview('');
    });

    this.tileIconInput.addEventListener('input', () => {
      if (this.tileIconInput.value.trim()) {
        this.currentUploadedIconBase64 = '';
      }
      this.updateTileModalIconPreview(this.tileIconInput.value.trim());
    });

    this.tileUrlInput.addEventListener('input', () => {
      if (!this.currentUploadedIconBase64 && !this.tileIconInput.value.trim()) {
        this.updateTileModalIconPreview('');
      }
    });

    this.closeTileModal.addEventListener('click', () => this.closeAllModals());
    this.cancelTileBtn.addEventListener('click', () => this.closeAllModals());
    this.tileForm.addEventListener('submit', (e) => this.handleSaveTile(e));

    // Settings Modal
    this.openSettingsModalBtn.addEventListener('click', () => this.openSettingsModalDialog());
    this.closeSettingsModal.addEventListener('click', () => this.closeAllModals());

    this.wpCards.forEach(c => {
      c.addEventListener('click', () => {
        this.wpCards.forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        this.settings.bgTheme = c.getAttribute('data-bg');
        this.settings.customBg = '';
        this.applySettings();
        this.save('liquid_settings', this.settings);
      });
    });

    this.applyCustomBg.addEventListener('click', () => {
      const url = this.customBgInput.value.trim();
      if (url) {
        this.settings.bgTheme = 'bg-custom';
        this.settings.customBg = url;
        this.applySettings();
        this.save('liquid_settings', this.settings);
      }
    });

    this.userNameInput.addEventListener('input', () => {
      this.settings.userName = this.userNameInput.value.trim() || 'Dave';
      this.save('liquid_settings', this.settings);
      this.updateClock();
    });

    this.weatherCitySelect.addEventListener('change', () => {
      this.settings.weatherCity = this.weatherCitySelect.value;
      this.save('liquid_settings', this.settings);
      this.fetchWeather();
    });

    // Export / Import
    this.exportJsonBtn.addEventListener('click', () => this.exportConfig());
    this.importJsonBtn.addEventListener('click', () => this.importFileInput.click());
    this.importFileInput.addEventListener('change', (e) => this.importConfig(e));
    this.resetDefaultsBtn.addEventListener('click', () => this.factoryReset());

    // Close on backdrop click
    [this.tileModal, this.settingsModal].forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) this.closeAllModals();
      });
    });
  }

  // Update Mini Sound Player UI State (Equalizer animation, Play/Pause Icon)
  updateSoundPlayerUI(playing) {
    if (this.soundEqualizer) {
      this.soundEqualizer.classList.toggle('playing', playing);
    }
    if (this.playerPlayBtn) {
      this.playerPlayBtn.classList.toggle('is-playing', playing);
    }
    if (this.playBtnIcon) {
      if (playing) {
        this.playBtnIcon.innerHTML = `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      } else {
        this.playBtnIcon.innerHTML = `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="7 4 19 12 7 20 7 4"/></svg>`;
      }
    }
  }

  // Purposeful view switcher for dock tabs
  switchView(view) {
    this.currentView = view;
    document.body.classList.remove('view-news', 'view-apps', 'view-todo', 'view-notes');
    
    if (view === 'news') {
      document.body.classList.add('view-news');
    } else if (view === 'apps') {
      document.body.classList.add('view-apps');
    } else if (view === 'todo') {
      document.body.classList.add('view-todo');
    } else if (view === 'notes') {
      document.body.classList.add('view-notes');
    }
  }

  // ===========================================================================
  // Clock, Date & Greeting (No PM, Big 114px, Clean text)
  // ===========================================================================
  updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // 24-hour Dutch format without any PM
    this.clockMain.textContent = `${hours}:${minutes}`;

    // Date in Dutch without any comma: "Dinsdag 10 november"
    const weekday = now.toLocaleDateString('nl-NL', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleDateString('nl-NL', { month: 'long' });
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    this.dateMain.textContent = `${capitalizedWeekday} ${day} ${month}`;

    // Pure greeting text above the clock
    const h = now.getHours();
    let part = 'Goedemorgen';
    if (h >= 12 && h < 18) part = 'Goedemiddag';
    else if (h >= 18 && h < 23) part = 'Goedenavond';
    else if (h >= 23 || h < 6) part = 'Goedenacht';

    const name = this.settings.userName || 'Dave';
    this.pureGreetingText.textContent = `${part}, ${name}`;
  }

  // ===========================================================================
  // Quick Access Tiles
  // ===========================================================================
  renderTiles() {
    this.quickAccessGrid.innerHTML = '';
    const displayTiles = this.tiles.slice(0, 11);

    displayTiles.forEach(tile => {
      const a = document.createElement('div');
      a.className = 'qa-tile';
      a.title = tile.name;

      let iconHtml = '';
      if (tile.icon && (tile.icon.startsWith('data:') || tile.icon.startsWith('http'))) {
        const isData = tile.icon.startsWith('data:');
        const fallback = isData 
          ? `this.parentElement.innerHTML='<span class=\\'qa-icon-emoji\\'>🌐</span>'` 
          : `this.src='https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(tile.url)}'`;
        iconHtml = `<img src="${tile.icon}" class="qa-icon-img" alt="${tile.name}" onerror="${fallback}">`;
      } else if (tile.icon && tile.icon.length <= 4) {
        iconHtml = `<span class="qa-icon-emoji">${tile.icon}</span>`;
      } else {
        const fav = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(tile.url)}`;
        iconHtml = `<img src="${fav}" class="qa-icon-img" alt="${tile.name}" onerror="this.parentElement.innerHTML='<span class=\\'qa-icon-emoji\\'>🌐</span>'">`;
      }

      a.innerHTML = `
        <button class="tile-del-btn" title="Verwijderen" data-id="${tile.id}">✕</button>
        <button class="tile-edit-btn" title="Bewerken" data-id="${tile.id}">✎</button>
        <div class="qa-icon-wrap">
          ${iconHtml}
        </div>
        <span class="qa-label">${this.escape(tile.name)}</span>
      `;

      a.addEventListener('click', (e) => {
        if (this.isEditMode) return;
        if (e.target.closest('.tile-del-btn') || e.target.closest('.tile-edit-btn')) return;
        window.open(tile.url, '_blank', 'noopener,noreferrer');
      });

      a.querySelector('.tile-del-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteTile(tile.id);
      });

      a.querySelector('.tile-edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openTileModalDialog(tile);
      });

      this.quickAccessGrid.appendChild(a);
    });

    // Add Tile
    const addTile = document.createElement('div');
    addTile.className = 'qa-tile add-tile';
    addTile.innerHTML = `
      <div class="qa-icon-wrap">
        <span style="font-size: 24px; color: var(--text-muted); line-height: 1;">+</span>
      </div>
      <span class="qa-label">Add</span>
    `;
    addTile.addEventListener('click', () => this.openTileModalDialog());
    this.quickAccessGrid.appendChild(addTile);
  }

  openTileModalDialog(tile = null) {
    this.tileForm.reset();
    this.currentUploadedIconBase64 = '';

    if (tile) {
      this.tileModalTitle.textContent = 'Tegel Aanpassen';
      this.tileFormId.value = tile.id;
      this.tileNameInput.value = tile.name;
      this.tileUrlInput.value = tile.url;

      if (tile.icon && (tile.icon.startsWith('data:') || tile.icon.startsWith('http'))) {
        this.currentUploadedIconBase64 = tile.icon.startsWith('data:') ? tile.icon : '';
        this.tileIconInput.value = tile.icon.startsWith('http') ? tile.icon : '';
        this.updateTileModalIconPreview(tile.icon);
      } else {
        this.tileIconInput.value = tile.icon || '';
        this.updateTileModalIconPreview(tile.icon || '');
      }
    } else {
      this.tileModalTitle.textContent = 'Nieuwe Quick Access Tegel';
      this.tileFormId.value = '';
      this.updateTileModalIconPreview('');
    }

    this.tileModal.style.display = 'flex';
    this.tileNameInput.focus();
  }

  updateTileModalIconPreview(iconValue = '') {
    const val = iconValue || this.currentUploadedIconBase64;

    if (val && (val.startsWith('data:') || val.startsWith('http'))) {
      this.tileIconPreviewBox.innerHTML = `<img src="${val}" alt="icoon" onerror="this.parentElement.innerHTML='<span>🌐</span>'">`;
      this.clearCustomIconBtn.style.display = 'inline-block';
    } else if (val && val.length <= 4) {
      this.tileIconPreviewBox.innerHTML = `<span>${val}</span>`;
      this.clearCustomIconBtn.style.display = 'inline-block';
    } else {
      // Automatic favicon preview based on URL if available
      const url = this.tileUrlInput.value.trim();
      if (url && (url.includes('.') || url.startsWith('http'))) {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        const fav = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(fullUrl)}`;
        this.tileIconPreviewBox.innerHTML = `<img src="${fav}" alt="icoon" onerror="this.parentElement.innerHTML='<span>🌐</span>'">`;
      } else {
        this.tileIconPreviewBox.innerHTML = `<span>🌐</span>`;
      }
      this.clearCustomIconBtn.style.display = 'none';
    }
  }

  handleSaveTile(e) {
    e.preventDefault();
    const id = this.tileFormId.value;
    const name = this.tileNameInput.value.trim();
    let url = this.tileUrlInput.value.trim();
    // Prioritize uploaded file over manual input if present
    const icon = this.currentUploadedIconBase64 || this.tileIconInput.value.trim();

    if (!url.startsWith('http')) url = 'https://' + url;

    if (id) {
      const idx = this.tiles.findIndex(t => t.id === id);
      if (idx !== -1) this.tiles[idx] = { id, name, url, icon };
    } else {
      this.tiles.push({
        id: Date.now().toString(),
        name,
        url,
        icon
      });
    }

    this.save('liquid_tiles', this.tiles);
    this.renderTiles();
    this.closeAllModals();
  }

  deleteTile(id) {
    this.tiles = this.tiles.filter(t => t.id !== id);
    this.save('liquid_tiles', this.tiles);
    this.renderTiles();
  }

  // ===========================================================================
  // NU.nl News
  // ===========================================================================
  async fetchNews(category = 'Algemeen') {
    this.newsLiquidList.innerHTML = `
      <div class="liquid-loading">
        <span class="pulse-ring"></span>
        <p>Nieuws ophalen van NU.nl...</p>
      </div>
    `;

    const feedMap = {
      Algemeen: 'https://www.nu.nl/rss/Algemeen',
      Tech: 'https://www.nu.nl/rss/Tech',
      Economie: 'https://www.nu.nl/rss/Economie',
      Sport: 'https://www.nu.nl/rss/Sport'
    };
    const rss = feedMap[category] || feedMap.Algemeen;

    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`);
      const data = await res.json();
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        this.renderNewsRows(data.items);
        return;
      }
      throw new Error();
    } catch {
      this.renderFallbackNews(category);
    }
  }

  renderNewsRows(items) {
    this.newsLiquidList.innerHTML = '';
    const slice = items.slice(0, 7);

    slice.forEach(item => {
      const time = this.formatTimeAgo(new Date(item.pubDate));
      const a = document.createElement('a');
      a.className = 'news-liquid-item';
      a.href = item.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      a.innerHTML = `
        <div class="news-item-left">
          <span class="news-source-icon">🔴</span>
          <span class="news-headline">${this.escape(item.title)}</span>
        </div>
        <div class="news-item-meta">
          <span class="news-time-tag">${time}</span>
          <span class="news-chevron">›</span>
        </div>
      `;
      this.newsLiquidList.appendChild(a);
    });
  }

  renderFallbackNews(category) {
    const fallbackItems = [
      { title: 'Nederlandse techbedrijven tonen innovatieve cloudoplossingen', link: 'https://www.nu.nl/tech', pubDate: new Date() },
      { title: 'Europese beurzen sluiten handelsweek stabiel af', link: 'https://www.nu.nl/economie', pubDate: new Date(Date.now() - 35*60000) },
      { title: 'Kabinet bereikt akkoord over nieuwe verduurzamingsplannen', link: 'https://www.nu.nl', pubDate: new Date(Date.now() - 55*60000) },
      { title: 'Nederlandse sporters bereiden zich voor op kampioenschap', link: 'https://www.nu.nl/sport', pubDate: new Date(Date.now() - 80*60000) },
      { title: 'Bekijk het actuele overzicht van live updates op NU.nl', link: 'https://www.nu.nl', pubDate: new Date(Date.now() - 120*60000) }
    ];
    this.renderNewsRows(fallbackItems);
  }

  formatTimeAgo(d) {
    if (isNaN(d.getTime())) return 'Zojuist';
    const min = Math.floor((new Date() - d) / 60000);
    if (min < 1) return 'Zojuist';
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  // ===========================================================================
  // To Do List & Progress Bar
  // ===========================================================================
  renderTodos() {
    this.liquidTodoList.innerHTML = '';
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.done).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    this.todoStatsLabel.textContent = `Completed ${completed} / ${total}`;
    this.todoProgressFill.style.width = `${pct}%`;

    this.todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `liquid-todo-item ${todo.done ? 'done' : ''}`;
      li.innerHTML = `
        <div class="todo-item-left">
          <input type="checkbox" class="liquid-checkbox" ${todo.done ? 'checked' : ''}>
          <span>${this.escape(todo.text)}</span>
        </div>
        <button class="todo-del-btn" title="Verwijderen">✕</button>
      `;

      li.querySelector('.liquid-checkbox').addEventListener('change', (e) => {
        todo.done = e.target.checked;
        this.save('liquid_todos', this.todos);
        this.renderTodos();
      });

      li.querySelector('.todo-del-btn').addEventListener('click', () => {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.save('liquid_todos', this.todos);
        this.renderTodos();
      });

      this.liquidTodoList.appendChild(li);
    });
  }

  // ===========================================================================
  // Floating Weather Card (Open-Meteo)
  // ===========================================================================
  async fetchWeather() {
    const city = this.settings.weatherCity || 'Amsterdam';
    const coords = CITIES[city] || CITIES['Amsterdam'];

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const cur = data.current_weather;
      const temp = Math.round(cur.temperature);
      const isDay = cur.is_day === 1;

      const codeMap = {
        0: 'Clear Sky',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        51: 'Light Drizzle',
        61: 'Rainy',
        71: 'Snow',
        80: 'Rain Showers',
        95: 'Thunderstorm'
      };

      const cond = codeMap[cur.weathercode] || 'Clear Sky';
      const icon = isDay ? (cond.includes('Rain') ? '🌦️' : cond.includes('Cloud') ? '⛅' : '☀️') : '🌙';

      this.weatherCardTemp.textContent = `${temp}°C`;
      this.weatherCardIcon.textContent = icon;
      this.weatherCardDesc.textContent = cond;
      this.weatherCardCity.textContent = `${city}, ${coords.country}`;
    } catch {
      this.weatherCardTemp.textContent = '14°C';
      this.weatherCardIcon.textContent = '⛅';
      this.weatherCardDesc.textContent = 'Overcast';
      this.weatherCardCity.textContent = `${city}, ${coords.country}`;
    }
  }

  // ===========================================================================
  // Notes & Quotes
  // ===========================================================================
  initNotes() {
    this.liquidNotesInput.value = this.notes;
  }

  initQuote() {
    const q = QUOTES_POOL[Math.floor(Math.random() * QUOTES_POOL.length)];
    this.quoteText.textContent = `"${q.text}"`;
    this.quoteAuthor.textContent = `— ${q.author}`;
  }

  // ===========================================================================
  // Settings & Theme
  // ===========================================================================
  applySettings() {
    // Preserve view classes
    const viewClasses = [];
    if (document.body.classList.contains('view-news')) viewClasses.push('view-news');
    if (document.body.classList.contains('view-apps')) viewClasses.push('view-apps');
    if (document.body.classList.contains('view-todo')) viewClasses.push('view-todo');
    if (document.body.classList.contains('view-notes')) viewClasses.push('view-notes');

    document.body.className = '';
    viewClasses.forEach(c => document.body.classList.add(c));

    if (this.settings.bgTheme === 'bg-custom' && this.settings.customBg) {
      document.body.classList.add('bg-custom');
      document.getElementById('wallpaper-bg').style.backgroundImage = `url("${this.settings.customBg}")`;
    } else {
      document.getElementById('wallpaper-bg').style.backgroundImage = '';
      document.body.classList.add(this.settings.bgTheme || 'bg-mountain-lake');
    }

    if (this.settings.themeMode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    this.wpCards.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-bg') === this.settings.bgTheme);
    });

    this.userNameInput.value = this.settings.userName || 'Dave';
    this.weatherCitySelect.value = this.settings.weatherCity || 'Amsterdam';
    if (this.settings.customBg) this.customBgInput.value = this.settings.customBg;

    this.updateClock();
  }

  openSettingsModalDialog() {
    this.applySettings();
    this.settingsModal.style.display = 'flex';
  }

  closeAllModals() {
    this.tileModal.style.display = 'none';
    this.settingsModal.style.display = 'none';
  }

  exportConfig() {
    const cfg = {
      settings: this.settings,
      tiles: this.tiles,
      todos: this.todos,
      notes: localStorage.getItem('liquid_notes') || ''
    };
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liquid-startscherm-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importConfig(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const d = JSON.parse(evt.target.result);
        if (d.tiles) { this.tiles = d.tiles; this.save('liquid_tiles', this.tiles); }
        if (d.todos) { this.todos = d.todos; this.save('liquid_todos', this.todos); }
        if (d.settings) { this.settings = d.settings; this.save('liquid_settings', this.settings); }
        if (d.notes !== undefined) {
          localStorage.setItem('liquid_notes', d.notes);
          this.liquidNotesInput.value = d.notes;
        }
        this.applySettings();
        this.renderTiles();
        this.renderTodos();
        this.fetchWeather();
        this.closeAllModals();
        alert('Instellingen succesvol geïmporteerd!');
      } catch (err) {
        alert('Fout bij importeren: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  factoryReset() {
    if (confirm('Wil je alle instellingen terugzetten naar de beginwaarden?')) {
      this.tiles = [...DEFAULT_QA_TILES];
      this.todos = [...DEFAULT_TODOS];
      this.settings = {
        userName: 'Dave',
        bgTheme: 'bg-mountain-lake',
        customBg: '',
        weatherCity: 'Amsterdam',
        themeMode: 'light'
      };
      this.save('liquid_tiles', this.tiles);
      this.save('liquid_todos', this.todos);
      this.save('liquid_settings', this.settings);
      localStorage.removeItem('liquid_notes');
      this.liquidNotesInput.value = '';
      this.applySettings();
      this.renderTiles();
      this.renderTodos();
      this.fetchWeather();
      this.closeAllModals();
    }
  }

  escape(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new LiquidDashboard();
});
