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
document.querySelector('.slider-prev')?.addEventListener('click', () => track?.scrollBy({ left: -410, behavior: reducedMotion ? 'auto' : 'smooth' }));
document.querySelector('.slider-next')?.addEventListener('click', () => track?.scrollBy({ left: 410, behavior: reducedMotion ? 'auto' : 'smooth' }));

window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const pastHero = window.scrollY > 40;
  header.style.background = pastHero ? 'rgba(11,22,52,.95)' : 'transparent';
  header.style.position = pastHero ? 'fixed' : 'absolute';
}, { passive: true });
