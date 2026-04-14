/* ============================================================
   VELTRIX STORE — script.js
   ============================================================ */

const items     = document.querySelectorAll('.item');
const dots      = document.querySelectorAll('.dot');
const numCurrent = document.querySelector('.num-current');
const progressFill = document.getElementById('progress-fill');

const AUTOPLAY_MS = 5000;

let active   = 0;
let timer    = null;
let progTimer = null;

/* ============================================================
   SLIDE — atualiza o item ativo
   ============================================================ */
function goTo(index) {
  const prev = active;

  // Remove estado ativo
  items[prev].classList.remove('active');
  items[prev].classList.add('exit');
  dots[prev].classList.remove('active');

  // Atualiza índice
  active = ((index % items.length) + items.length) % items.length;

  // Activa novo slide
  items[active].classList.add('active');
  items[active].classList.remove('exit');
  dots[active].classList.add('active');

  // Remove classe exit depois da transição
  setTimeout(() => items[prev].classList.remove('exit'), 800);

  // Atualiza número
  if (numCurrent) {
    numCurrent.textContent = String(active + 1).padStart(2, '0');
  }

  // Reinicia progress bar
  resetProgress();
}

function next() { goTo(active + 1); }
function prev() { goTo(active - 1); }

/* ============================================================
   AUTOPLAY + PROGRESS BAR
   ============================================================ */
function startAutoplay() {
  clearInterval(timer);
  timer = setInterval(next, AUTOPLAY_MS);
}

function resetProgress() {
  if (!progressFill) return;
  progressFill.style.transition = 'none';
  progressFill.style.width = '0%';

  // Força reflow
  progressFill.offsetWidth;

  progressFill.style.transition = `width ${AUTOPLAY_MS}ms linear`;
  progressFill.style.width = '100%';
}

function resetAutoplay() {
  clearInterval(timer);
  startAutoplay();
  resetProgress();
}

/* ============================================================
   EVENTOS DAS SETAS
   ============================================================ */
document.getElementById('prev')?.addEventListener('click', () => {
  prev();
  resetAutoplay();
});

document.getElementById('next')?.addEventListener('click', () => {
  next();
  resetAutoplay();
});

/* ============================================================
   CLIQUE NOS DOTS
   ============================================================ */
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    if (i === active) return;
    goTo(i);
    resetAutoplay();
  });
});

/* ============================================================
   SWIPE TOUCH (mobile)
   ============================================================ */
let touchStartX = 0;
let touchEndX   = 0;
const SWIPE_THRESHOLD = 50;

document.querySelector('.list')?.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.querySelector('.list')?.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    diff > 0 ? next() : prev();
    resetAutoplay();
  }
}, { passive: true });

/* ============================================================
   TECLADO (acessibilidade)
   ============================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
  if (e.key === 'ArrowLeft')  { prev(); resetAutoplay(); }
});

/* ============================================================
   HAMBURGER + DRAWER
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const navOverlay = document.getElementById('nav-overlay');

function toggleNav(force) {
  const open = force !== undefined ? force : !mobileNav.classList.contains('open');
  mobileNav.classList.toggle('open', open);
  navOverlay.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
}

hamburger?.addEventListener('click', () => toggleNav());
navOverlay?.addEventListener('click', () => toggleNav(false));

// Fecha drawer ao clicar em item
mobileNav?.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', () => toggleNav(false));
});

/* ============================================================
   INIT
   ============================================================ */
startAutoplay();
resetProgress();