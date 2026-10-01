const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
  nav.classList.toggle('is-open', !isOpen);
});

document.addEventListener('click', (event) => {
  if (!nav?.classList.contains('is-open')) return;
  if (nav.contains(event.target) || menuButton?.contains(event.target)) return;
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', '메뉴 열기');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !nav?.classList.contains('is-open')) return;
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', '메뉴 열기');
  menuButton?.focus();
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', '메뉴 열기');
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const track = document.querySelector('.service-track');
const serviceCards = track ? [...track.querySelectorAll('.service-card')] : [];
let activeService = Math.max(0, serviceCards.findIndex((card) => card.classList.contains('is-dark')));
let serviceTimer;
let scrollTimer;

function setActiveService(index, shouldScroll = true) {
  if (!serviceCards.length) return;
  activeService = (index + serviceCards.length) % serviceCards.length;
  serviceCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === activeService;
    card.classList.toggle('is-dark', isActive);
    card.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
  if (shouldScroll) {
    track.scrollTo({
      left: serviceCards[activeService].offsetLeft - track.offsetLeft,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  }
}

function startServiceTimer() {
  window.clearInterval(serviceTimer);
  if (!reducedMotion && serviceCards.length > 1) {
    serviceTimer = window.setInterval(() => setActiveService(activeService + 1), 5000);
  }
}

function moveService(direction) {
  setActiveService(activeService + direction);
  startServiceTimer();
}

document.querySelector('.slider-prev')?.addEventListener('click', () => moveService(-1));
document.querySelector('.slider-next')?.addEventListener('click', () => moveService(1));

track?.addEventListener('scroll', () => {
  window.clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(() => {
    const closestIndex = serviceCards.reduce((closest, card, index) => {
      const distance = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
    setActiveService(closestIndex, false);
  }, 120);
}, { passive: true });

const hero = document.querySelector('.hero');

const fieldItems = [
  { label: '현장 구축 및 운영 지원', alt: '현장에서 IT 장비를 구축하고 점검하는 엔지니어' },
  { label: 'IT 인프라 점검', alt: '관리 화면을 확인하며 IT 인프라를 점검하는 엔지니어' },
  { label: 'NAC 장비 설치', alt: '네트워크 랙에 설치된 NAC 및 네트워크 장비' }
];

document.querySelectorAll('.field-gallery figure').forEach((figure, index) => {
  const content = fieldItems[index];
  if (!content) return;
  const image = figure.querySelector('img');
  const caption = figure.querySelector('figcaption');
  if (image) image.alt = content.alt;
  if (caption) caption.textContent = content.label;
});

const contactCopy = document.querySelector('.contact-copy');
if (contactCopy) {
  const supportEmail = document.createElement('a');
  supportEmail.className = 'support-email';
  supportEmail.href = 'mailto:help@hongminit.com';
  supportEmail.innerHTML = '<span>고객지원 이메일</span><strong>help@hongminit.com</strong><b>↗</b>';
  contactCopy.append(supportEmail);
}

if (hero) {
  const heroCanvas = document.createElement('canvas');
  heroCanvas.id = 'heroDotted';
  heroCanvas.className = 'hero-canvas';
  heroCanvas.setAttribute('aria-hidden', 'true');
  hero.prepend(heroCanvas);

  const context = heroCanvas.getContext('2d');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palette = ['#21b8e6', '#ffffff', '#6289d8'];
  let width = 0;
  let height = 0;
  let frame;
  let pointer = { x: 0, y: 0, active: false };
  let particles = [];

  function resetParticles() {
    const count = Math.min(76, Math.max(34, Math.round(width / 22)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      size: index % 11 === 0 ? 4 + Math.random() * 5 : 1.2 + Math.random() * 2.2,
      shape: index % 17 === 0 ? 'square' : index % 13 === 0 ? 'ring' : 'dot',
      color: palette[index % palette.length]
    }));
  }

  function resizeCanvas() {
    const bounds = hero.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    heroCanvas.width = Math.round(width * ratio);
    heroCanvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    resetParticles();
  }

  function drawParticle(particle) {
    context.beginPath();
    context.strokeStyle = particle.color;
    context.fillStyle = particle.color;
    context.lineWidth = 1;
    if (particle.shape === 'square') {
      context.strokeRect(particle.x - particle.size, particle.y - particle.size, particle.size * 2, particle.size * 2);
    } else {
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      particle.shape === 'ring' ? context.stroke() : context.fill();
    }
  }

  function renderCanvas() {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      if (!motionReduced) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -10 || particle.x > width + 10) particle.vx *= -1;
        if (particle.y < -10 || particle.y > height + 10) particle.vy *= -1;
      }

      if (pointer.active && !motionReduced) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 130 && distance > 0) {
          particle.x += (dx / distance) * 0.45;
          particle.y += (dy / distance) * 0.45;
        }
      }

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 118) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(121,190,230,${0.17 * (1 - distance / 118)})`;
          context.stroke();
        }
      }

      context.globalAlpha = particle.shape === 'dot' ? 0.58 : 0.82;
      drawParticle(particle);
      context.globalAlpha = 1;
    });
    if (!motionReduced) frame = window.requestAnimationFrame(renderCanvas);
  }

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
  });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });
  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(frame);
    resizeCanvas();
    renderCanvas();
  });

  resizeCanvas();
  renderCanvas();
}

track?.addEventListener('mouseenter', () => window.clearInterval(serviceTimer));
track?.addEventListener('mouseleave', startServiceTimer);
track?.addEventListener('focusin', () => window.clearInterval(serviceTimer));
track?.addEventListener('focusout', startServiceTimer);

setActiveService(activeService, false);
startServiceTimer();

window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const pastHero = window.scrollY > 40;
  header.style.background = pastHero ? 'rgba(11,22,52,.95)' : 'transparent';
  header.style.position = pastHero ? 'fixed' : 'absolute';
}, { passive: true });
