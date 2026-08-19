const EMAILJS_PUBLIC_KEY  = "sds-kbzJ3s7BHXYaN";
const EMAILJS_SERVICE_ID  = "service_0xtq7js";
const EMAILJS_TEMPLATE_ID = "template_5bvpzse";
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// ═══════════════════════════════
// MOBILE MENU
// ═══════════════════════════════
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const menuIconUse = document.getElementById('menuIconUse');
let menuOpen = false;

function openMobileMenu() {
  menuOpen = true;
  mobileNav.style.display = 'flex';
  setTimeout(() => mobileNav.style.opacity = '1', 10);
  menuIconUse.setAttribute('href', '#icon-xmark');
  menuBtn.setAttribute('aria-label', 'Menü schließen');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  menuOpen = false;
  mobileNav.style.opacity = '0';
  setTimeout(() => { mobileNav.style.display = 'none'; }, 300);
  menuIconUse.setAttribute('href', '#icon-bars');
  menuBtn.setAttribute('aria-label', 'Menü öffnen');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
menuBtn.addEventListener('click', () => menuOpen ? closeMobileMenu() : openMobileMenu());
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

// ═══════════════════════════════
// NAVBAR SCROLL EFFECT
// ═══════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ═══════════════════════════════
// ACTIVE NAV LINKS
// ═══════════════════════════════
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

// ═══════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
  .forEach(el => observer.observe(el));

// ═══════════════════════════════
// COUNT-UP ANIMATION
// ═══════════════════════════════
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

// ═══════════════════════════════
// MODAL
// ═══════════════════════════════
function openModal(id) {
  const m = document.getElementById('modal-' + id);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModalEl(overlay) {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(el.dataset.modal);
  });
});
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModalEl(btn.closest('.modal-overlay')));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModalEl(overlay);
  });
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(closeModalEl);
  }
});

// ═══════════════════════════════
// COOKIE-HINWEIS
// ═══════════════════════════════
(function () {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAcceptBtn');
  if (!banner || !acceptBtn) return;
  const CONSENT_KEY = 'cookie-hinweis-bestaetigt';
  let alreadyAcknowledged = false;
  try {
    alreadyAcknowledged = !!localStorage.getItem(CONSENT_KEY);
  } catch (e) { /* localStorage nicht verfügbar (z. B. privater Modus) */ }

  // Banner sitzt oben fest; Navbar & Mobilmenü rücken per CSS-Variable
  // um die Bannerhöhe nach unten, damit nichts verdeckt wird.
  function syncBannerHeight() {
    const height = banner.classList.contains('visible') ? banner.offsetHeight : 0;
    document.documentElement.style.setProperty('--cookie-banner-h', height + 'px');
  }

  if (!alreadyAcknowledged) {
    setTimeout(() => {
      banner.classList.add('visible');
      requestAnimationFrame(syncBannerHeight);
    }, 600);
  }

  window.addEventListener('resize', () => {
    if (banner.classList.contains('visible')) syncBannerHeight();
  }, { passive: true });

  acceptBtn.addEventListener('click', () => {
    banner.classList.remove('visible');
    syncBannerHeight();
    try { localStorage.setItem(CONSENT_KEY, '1'); } catch (e) {}
  });
})();

// ═══════════════════════════════
// KONTAKTFORMULAR (EmailJS)
// ═══════════════════════════════
function submitForm() {
  const name     = document.getElementById('f-name');
  const email    = document.getElementById('f-email');
  const phone    = document.getElementById('f-phone');
  const message  = document.getElementById('f-message');
  const dsgvo    = document.getElementById('f-dsgvo');
  const website  = document.getElementById('f-website');
  const btn      = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  // Honeypot: Bots füllen dieses versteckte Feld aus, Menschen nicht
  if (website.value.trim()) return;

  [name, email, message].forEach(el => el.classList.remove('invalid'));
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  let valid = true;
  if (!name.value.trim())    { name.classList.add('invalid');    valid = false; }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('invalid'); valid = false;
  }
  if (!message.value.trim()) { message.classList.add('invalid'); valid = false; }
  if (!dsgvo.checked) {
    feedback.className = 'form-feedback error';
    feedback.textContent = '⚠ Bitte stimmen Sie der Datenschutzerklärung zu.';
    valid = false;
  }
  if (!valid) {
    if (dsgvo.checked) {
      feedback.className = 'form-feedback error';
      feedback.textContent = '⚠ Bitte füllen Sie alle Pflichtfelder aus.';
    }
    return;
  }

  if (typeof emailjs === 'undefined') {
    feedback.className = 'form-feedback error';
    feedback.textContent = '✗ Formular wird noch geladen, bitte versuchen Sie es in ein paar Sekunden erneut.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Wird gesendet …';

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name: name.value.trim(),
    from_email: email.value.trim(),
    phone: phone.value.trim() || '–',
    message: message.value.trim()
  }).then(() => {
    feedback.className = 'form-feedback success';
    feedback.textContent = '✓ Vielen Dank! Ihre Anfrage wurde erfolgreich versendet. Wir melden uns innerhalb von 24 Stunden.';
    name.value = ''; email.value = ''; phone.value = ''; message.value = ''; dsgvo.checked = false;
    btn.disabled = false;
    btn.textContent = 'Anfrage absenden →';
  }).catch((err) => {
    console.error('EmailJS Fehler:', err);
    feedback.className = 'form-feedback error';
    feedback.textContent = '✗ Beim Senden ist ein Fehler aufgetreten. Bitte rufen Sie uns direkt an oder schreiben Sie eine E-Mail.';
    btn.disabled = false;
    btn.textContent = 'Anfrage absenden →';
  });
}

document.getElementById('submitBtn').addEventListener('click', submitForm);
