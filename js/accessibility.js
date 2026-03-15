(function() {
  'use strict';

  const STORAGE_KEY = 'roza_a11y_settings';

  const defaults = {
    fontSize: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    highContrast: false,
    invert: false,
    highlightLinks: false,
    grayscale: false,
    stopAnimations: false,
    readableFont: false,
    focusHighlight: false,
    bigCursor: false
  };

  let settings = Object.assign({}, defaults);

  /* =========================
     SVG Icons
     ========================= */
  const icons = {
    a11y: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/></svg>',
    textSize: '<svg viewBox="0 0 24 24"><path d="M2 4v3h5v12h3V7h5V4H2zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>',
    lineHeight: '<svg viewBox="0 0 24 24"><path d="M9 4h12v2H9zm0 14h12v2H9zm0-7h12v2H9zM4 7l-3 3h2v4H1l3 3 3-3H5v-4h2z"/></svg>',
    letterSpacing: '<svg viewBox="0 0 24 24"><path d="M2 18h2v-2H2zm0-4h2v-2H2zm0 8h2v-2H2zm0-12h2V8H2zM2 2h2V0H2zm4 8h12v2H6zm0-4v2h12V6zm16 14h2v-2h-2zm-4-2v2h2v-2zM6 16v2h12v-2zm14-8h2V6h-2zm0-4v2h2V2zM6 4v2h12V4zm14 12h2v-2h-2zm0 8h2v-2h-2z"/></svg>',
    contrast: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86z"/></svg>',
    invert: '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7v14z"/></svg>',
    links: '<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
    grayscale: '<svg viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    font: '<svg viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>',
    focus: '<svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/></svg>',
    cursor: '<svg viewBox="0 0 24 24"><path d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5l-1.9-4.2-1.71 1.71c-.18.19-.44.29-.7.29-.1 0-.56-.1-.56-.1V5.04s.01-.03.01-.04c.04-.23.15-.44.34-.57.24-.17.54-.2.8-.07l10.67 5.93c.42.23.63.76.47 1.2-.15.44-.58.72-1.02.68l-3.07-.28 1.9 4.2c.23.49.02 1.09-.48 1.32l-3.42 1.56z"/></svg>'
  };

  /* =========================
     Create Panel DOM
     ========================= */
  function createPanel() {
    // Trigger button
    const trigger = document.createElement('button');
    trigger.className = 'a11y-trigger';
    trigger.id = 'a11yTrigger';
    trigger.setAttribute('aria-label', 'הגדרות נגישות');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'a11yPanel');
    trigger.innerHTML = icons.a11y;
    document.body.appendChild(trigger);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'a11y-overlay';
    overlay.id = 'a11yOverlay';
    document.body.appendChild(overlay);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.id = 'a11yPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'הגדרות נגישות');
    panel.setAttribute('aria-hidden', 'true');

    panel.innerHTML = `
      <div class="a11y-panel__header">
        <h2 class="a11y-panel__title">הגדרות נגישות</h2>
        <button class="a11y-panel__close" id="a11yClose" aria-label="סגור">&times;</button>
      </div>
      <div class="a11y-panel__body">

        <div class="a11y-section">
          <div class="a11y-section__title">${icons.textSize} גודל טקסט</div>
          <div class="a11y-btn-row" data-setting="fontSize">
            <button class="a11y-btn active" data-value="normal">רגיל</button>
            <button class="a11y-btn" data-value="large">גדול</button>
            <button class="a11y-btn" data-value="xlarge">גדול מאוד</button>
          </div>
        </div>

        <div class="a11y-section">
          <div class="a11y-section__title">${icons.lineHeight} ריווח שורות</div>
          <div class="a11y-btn-row" data-setting="lineHeight">
            <button class="a11y-btn active" data-value="normal">רגיל</button>
            <button class="a11y-btn" data-value="medium">מרווח</button>
            <button class="a11y-btn" data-value="large">מרווח מאוד</button>
          </div>
        </div>

        <div class="a11y-section">
          <div class="a11y-section__title">${icons.letterSpacing} ריווח אותיות</div>
          <div class="a11y-btn-row" data-setting="letterSpacing">
            <button class="a11y-btn active" data-value="normal">רגיל</button>
            <button class="a11y-btn" data-value="medium">מרווח</button>
            <button class="a11y-btn" data-value="large">מרווח מאוד</button>
          </div>
        </div>

        <div class="a11y-section">
          <div class="a11y-section__title">התאמות תצוגה</div>
          <div class="a11y-grid">
            <button class="a11y-toggle" data-toggle="highContrast">
              ${icons.contrast}
              <span class="a11y-btn__label">ניגודיות גבוהה</span>
            </button>
            <button class="a11y-toggle" data-toggle="invert">
              ${icons.invert}
              <span class="a11y-btn__label">היפוך צבעים</span>
            </button>
            <button class="a11y-toggle" data-toggle="highlightLinks">
              ${icons.links}
              <span class="a11y-btn__label">הדגשת קישורים</span>
            </button>
            <button class="a11y-toggle" data-toggle="grayscale">
              ${icons.grayscale}
              <span class="a11y-btn__label">גווני אפור</span>
            </button>
            <button class="a11y-toggle" data-toggle="stopAnimations">
              ${icons.pause}
              <span class="a11y-btn__label">עצירת אנימציות</span>
            </button>
            <button class="a11y-toggle" data-toggle="readableFont">
              ${icons.font}
              <span class="a11y-btn__label">פונט קריא</span>
            </button>
            <button class="a11y-toggle" data-toggle="focusHighlight">
              ${icons.focus}
              <span class="a11y-btn__label">הדגשת פוקוס</span>
            </button>
            <button class="a11y-toggle" data-toggle="bigCursor">
              ${icons.cursor}
              <span class="a11y-btn__label">סמן גדול</span>
            </button>
          </div>
        </div>

        <button class="a11y-reset-btn" id="a11yReset">↻ איפוס כל ההגדרות</button>
        <a href="accessibility.html" class="a11y-link">הצהרת נגישות</a>

      </div>
    `;

    document.body.appendChild(panel);
  }

  /* =========================
     Settings Management
     ========================= */
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        settings = Object.assign({}, defaults, JSON.parse(saved));
      }
    } catch (e) {
      settings = Object.assign({}, defaults);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) { /* silently fail */ }
  }

  function applySettings() {
    const html = document.documentElement;
    const body = document.body;

    // Font size
    const fontSizes = { normal: '16px', large: '18px', xlarge: '20px' };
    html.style.fontSize = fontSizes[settings.fontSize] || '16px';

    // Line height
    body.classList.remove('a11y-line-height-medium', 'a11y-line-height-large');
    if (settings.lineHeight === 'medium') body.classList.add('a11y-line-height-medium');
    if (settings.lineHeight === 'large') body.classList.add('a11y-line-height-large');

    // Letter spacing
    body.classList.remove('a11y-letter-spacing-medium', 'a11y-letter-spacing-large');
    if (settings.letterSpacing === 'medium') body.classList.add('a11y-letter-spacing-medium');
    if (settings.letterSpacing === 'large') body.classList.add('a11y-letter-spacing-large');

    // Toggles
    const toggleMap = {
      highContrast: 'a11y-high-contrast',
      invert: 'a11y-invert',
      highlightLinks: 'a11y-highlight-links',
      grayscale: 'a11y-grayscale',
      stopAnimations: 'a11y-stop-animations',
      readableFont: 'a11y-readable-font',
      focusHighlight: 'a11y-focus-highlight',
      bigCursor: 'a11y-big-cursor'
    };

    Object.entries(toggleMap).forEach(([key, cls]) => {
      body.classList.toggle(cls, !!settings[key]);
    });

    // Update UI
    updateUI();
  }

  function updateUI() {
    const panel = document.getElementById('a11yPanel');
    if (!panel) return;

    // Update button rows
    panel.querySelectorAll('.a11y-btn-row').forEach(row => {
      const setting = row.dataset.setting;
      row.querySelectorAll('.a11y-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === settings[setting]);
      });
    });

    // Update toggles
    panel.querySelectorAll('.a11y-toggle').forEach(toggle => {
      const key = toggle.dataset.toggle;
      toggle.classList.toggle('active', !!settings[key]);
    });
  }

  function resetSettings() {
    settings = Object.assign({}, defaults);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    applySettings();
  }

  /* =========================
     Panel Open / Close
     ========================= */
  function openPanel() {
    const panel = document.getElementById('a11yPanel');
    const overlay = document.getElementById('a11yOverlay');
    const trigger = document.getElementById('a11yTrigger');
    if (!panel || !overlay) return;

    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus the close button
    const closeBtn = document.getElementById('a11yClose');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
  }

  function closePanel() {
    const panel = document.getElementById('a11yPanel');
    const overlay = document.getElementById('a11yOverlay');
    const trigger = document.getElementById('a11yTrigger');
    if (!panel || !overlay) return;

    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    if (trigger) trigger.focus();
  }

  /* =========================
     Focus Trap
     ========================= */
  function trapFocus(e) {
    const panel = document.getElementById('a11yPanel');
    if (!panel || !panel.classList.contains('open')) return;

    const focusable = panel.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* =========================
     Event Listeners
     ========================= */
  function setupEventListeners() {
    // Trigger
    document.getElementById('a11yTrigger').addEventListener('click', () => {
      const panel = document.getElementById('a11yPanel');
      if (panel && panel.classList.contains('open')) closePanel();
      else openPanel();
    });

    // Close button
    document.getElementById('a11yClose').addEventListener('click', closePanel);

    // Overlay
    document.getElementById('a11yOverlay').addEventListener('click', closePanel);

    // Escape key + focus trap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const panel = document.getElementById('a11yPanel');
        if (panel && panel.classList.contains('open')) closePanel();
      }
      trapFocus(e);
    });

    // Button rows (fontSize, lineHeight, letterSpacing)
    document.querySelectorAll('.a11y-btn-row').forEach(row => {
      row.querySelectorAll('.a11y-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const setting = row.dataset.setting;
          settings[setting] = btn.dataset.value;
          saveSettings();
          applySettings();
        });
      });
    });

    // Toggle buttons
    document.querySelectorAll('.a11y-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const key = toggle.dataset.toggle;
        settings[key] = !settings[key];
        saveSettings();
        applySettings();
      });
    });

    // Reset
    document.getElementById('a11yReset').addEventListener('click', resetSettings);
  }

  /* =========================
     Init
     ========================= */
  function init() {
    createPanel();
    loadSettings();
    applySettings();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
