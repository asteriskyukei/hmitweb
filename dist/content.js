const HM_CONTENT_DEFAULTS = {
  references: ['IBK기업은행','IBK캐피탈','한화투자증권','수협은행','OSB저축은행','행정공제회','소방재난본부','국립암센터','서울대학교','한국렌탈','현대약품','현대엘리베이터','공영홈쇼핑','시원스쿨','유진로봇','휴비츠','UIL'],
  products: ['Tgate','TCO!secuIP','TCO!stream','PriemSSL','Walker Series','SecureGate']
};

function getHmContent() {
  try {
    const saved = JSON.parse(localStorage.getItem('hmit-content') || '{}');
    return {
      references: Array.isArray(saved.references) ? saved.references : HM_CONTENT_DEFAULTS.references,
      products: Array.isArray(saved.products) ? saved.products : HM_CONTENT_DEFAULTS.products
    };
  } catch {
    return HM_CONTENT_DEFAULTS;
  }
}

function escapeHmText(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function renderReference(item, logoMap) {
  const name = escapeHmText(item);
  const logo = logoMap[item];
  if (!logo) return `<span class="reference-item reference-text">${name}</span>`;
  return `<span class="reference-item has-logo"><img src="./assets/reference-logos/${escapeHmText(logo)}" alt="${name} 로고" loading="lazy" onerror="this.nextElementSibling.className='reference-fallback';this.remove()"><span class="sr-only">${name}</span></span>`;
}

function renderHmContent(content = getHmContent(), logoMap = {}) {
  const references = document.querySelector('#reference-list');
  const referenceCount = document.querySelector('#reference-count');
  const products = document.querySelector('#product-list');
  if (references) {
    references.innerHTML = content.references.map((item) => renderReference(item, logoMap)).join('') + '<span class="reference-item reference-more">AND MORE</span>';
  }
  if (referenceCount) referenceCount.textContent = String(content.references.length);
  if (products) products.innerHTML = content.products.map((item) => `<span>${escapeHmText(item)}</span>`).join('');
}

renderHmContent();

Promise.all([
  fetch('./references.json', {cache:'no-store'}).then((response) => response.ok ? response.json() : HM_CONTENT_DEFAULTS.references),
  fetch('./products.json', {cache:'no-store'}).then((response) => response.ok ? response.json() : HM_CONTENT_DEFAULTS.products),
  fetch('./reference-logos.json', {cache:'no-store'}).then((response) => response.ok ? response.json() : {})
]).then(([references, products, logoMap]) => renderHmContent({
  references: Array.isArray(references) ? references : HM_CONTENT_DEFAULTS.references,
  products: Array.isArray(products) ? products : HM_CONTENT_DEFAULTS.products
}, logoMap)).catch(() => {});
