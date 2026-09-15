const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
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
