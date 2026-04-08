// Theme toggle
const themeToggle = document.getElementById('themeToggle');

if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.documentElement.classList.add('light-mode');
  themeToggle.textContent = '◐';
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light-mode');
  themeToggle.textContent = document.documentElement.classList.contains('light-mode') ? '◐' : '◑';
});

const greetings = [
  '¡hola!',
  '¡buenas!',
  '¡hey!',
  '¿qué pasa?',
  '¡bienvenido!',
  '¡bienvenida!',
  '👋',
  '👍',
  '🤘',
];

const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
document.getElementById('greeting').textContent = randomGreeting;

// Randomizar orden de proyectos
const projectsSection = document.querySelector('.projects-section');
const allProjects = Array.from(document.querySelectorAll('.project')).filter(p => p.style.display !== 'none');
const dividers = Array.from(document.querySelectorAll('.project-divider'));

// Crear array de proyectos con sus dividers
const projectsWithDividers = allProjects.map((project, index) => ({
  project: project,
  divider: dividers[index]
}));

// Shuffle usando Fisher-Yates
for (let i = projectsWithDividers.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [projectsWithDividers[i], projectsWithDividers[j]] = [projectsWithDividers[j], projectsWithDividers[i]];
}

// El primer proyecto nunca puede ser de Spotify
const isSpotify = (item) => !!item.project.querySelector('.project-client.spotify');
if (isSpotify(projectsWithDividers[0])) {
  const firstNonSpotify = projectsWithDividers.findIndex((item, i) => i > 0 && !isSpotify(item));
  if (firstNonSpotify !== -1) {
    [projectsWithDividers[0], projectsWithDividers[firstNonSpotify]] = [projectsWithDividers[firstNonSpotify], projectsWithDividers[0]];
  }
}

// Limpiar la sección de proyectos
projectsSection.innerHTML = '';

// Re-insertar en orden aleatorio y actualizar números
projectsWithDividers.forEach((item, index) => {
  // Actualizar número de proyecto
  const projectNumber = item.project.querySelector('.project-number');
  if (projectNumber) {
    projectNumber.textContent = `Proyecto ${String(index + 1).padStart(2, '0')}`;
  }

  projectsSection.appendChild(item.project);
  if (item.divider) {
    projectsSection.appendChild(item.divider);
  }
});

// Ahora configurar el Intersection Observer con los proyectos ya reorganizados
const projects = document.querySelectorAll('.project');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
projects.forEach(p => observer.observe(p));

document.querySelectorAll('[data-scroll-container]').forEach(container => {
  let isDown = false, startX, scrollLeft;
  container.addEventListener('mousedown', (e) => { isDown = true; container.style.cursor = 'grabbing'; startX = e.pageX - container.offsetLeft; scrollLeft = container.scrollLeft; });
  container.addEventListener('mouseleave', () => { isDown = false; container.style.cursor = 'grab'; });
  container.addEventListener('mouseup', () => { isDown = false; container.style.cursor = 'grab'; });
  container.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); container.scrollLeft = scrollLeft - (e.pageX - container.offsetLeft - startX) * 1.5; });
});

const modal = document.getElementById('mediaModal');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalMediaContainer = document.getElementById('modalMediaContainer');

const allMediaItems = [];
document.querySelectorAll('[data-media-type]').forEach((item) => {
  const type = item.getAttribute('data-media-type');
  const src = item.getAttribute('data-media-src');
  const caption = item.getAttribute('data-caption') || '';
  if (type && src) {
    allMediaItems.push({ type, src, caption });
  }
});

let currentMediaIndex = 0;

document.querySelectorAll('[data-media-type]').forEach((item, index) => {
  // No agregar click listener si es una tarjeta de texto
  if (item.classList.contains('text-card')) return;

  item.addEventListener('click', () => {
    const src = item.getAttribute('data-media-src');
    currentMediaIndex = allMediaItems.findIndex(m => m.src === src);
    openModal();
  });
});

function openModal() {
  modal.classList.add('active');
  displayMedia();
}

function closeModal() {
  modal.classList.remove('active');
}

function displayMedia() {
  if (allMediaItems.length === 0) return;
  const media = allMediaItems[currentMediaIndex];
  const captionHtml = media.caption ? `<p class="modal-caption">${media.caption}</p>` : '';
  if (media.type === 'image') {
    modalMediaContainer.innerHTML = `<img src="${media.src}" alt="Imagen ampliada">${captionHtml}`;
  } else if (media.type === 'video') {
    modalMediaContainer.innerHTML = `<video controls autoplay style="width: 100%; height: 100%;"><source src="${media.src}" type="video/mp4"></video>${captionHtml}`;
  }
}

function showNext() {
  currentMediaIndex = (currentMediaIndex + 1) % allMediaItems.length;
  displayMedia();
}

function showPrev() {
  currentMediaIndex = (currentMediaIndex - 1 + allMediaItems.length) % allMediaItems.length;
  displayMedia();
}

modalClose.addEventListener('click', closeModal);
modalNext.addEventListener('click', showNext);
modalPrev.addEventListener('click', showPrev);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'Escape') closeModal();
});

// Scroll dots
document.querySelectorAll('.project').forEach(project => {
  const container = project.querySelector('[data-scroll-container]');
  const dotsContainer = project.querySelector('.scroll-dots');
  if (!container || !dotsContainer) return;

  const cards = Array.from(container.querySelectorAll('.scroll-card'));
  if (cards.length === 0) return;

  cards.forEach((card, i) => {
    const dot = document.createElement('span');
    dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.scroll-dot');

  container.addEventListener('scroll', () => {
    const containerLeft = container.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - containerLeft);
      if (dist < closestDist) { closestDist = dist; closestIndex = i; }
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));
  }, { passive: true });
});

// Cursor tooltip
const cursorTooltip = document.getElementById('cursor-tooltip');
const tooltipTargets = document.querySelectorAll('.scroll-card.image-card, .scroll-card.wide-image-card, .scroll-card.video-card, .scroll-card.portrait-image-card');

tooltipTargets.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const caption = card.getAttribute('data-caption');
    cursorTooltip.textContent = caption || '';
    if (caption) cursorTooltip.classList.add('visible');
  });
  card.addEventListener('mouseleave', () => cursorTooltip.classList.remove('visible'));
});

document.addEventListener('mousemove', (e) => {
  cursorTooltip.style.left = e.clientX + 'px';
  cursorTooltip.style.top = e.clientY + 'px';
});

// Logo pixel animation
const logoRects = Array.from(document.querySelectorAll('.logo svg rect'));
if (logoRects.length > 0) {
  const offsets = new Map(logoRects.map(r => [r, { x: 0, y: 0 }]));
  setInterval(() => {
    for (let i = 0; i < 4; i++) {
      const rect = logoRects[Math.floor(Math.random() * logoRects.length)];
      const off = offsets.get(rect);
      const step = () => [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
      const newX = Math.max(-4, Math.min(4, off.x + step()));
      const newY = Math.max(-4, Math.min(4, off.y + step()));
      offsets.set(rect, { x: newX, y: newY });
      rect.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  }, 600);
}

const heroGreeting = document.querySelector('.hero-greeting');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const s = window.scrollY;
      if (s < window.innerHeight) {
        heroGreeting.style.transform = `translateY(${s * 0.5}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
});
