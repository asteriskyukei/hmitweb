const HM_CONTENT_DEFAULTS = {
  references: ['IBK기업은행','IBK캐피탈','한화투자증권','수협은행','OSB저축은행','행정공제회','소방재난본부','국립암센터','서울대학교','한국렌탈','현대약품','현대엘리베이터','공영홈쇼핑','시원스쿨','유진로봇','휴비츠','UIL'],
  products: ['Tgate','TCO!secuIP','TCO!stream','PriemSSL','Walker Series','SecureGate']
};
function getHmContent(){try{const saved=JSON.parse(localStorage.getItem('hmit-content')||'{}');return{references:Array.isArray(saved.references)?saved.references:HM_CONTENT_DEFAULTS.references,products:Array.isArray(saved.products)?saved.products:HM_CONTENT_DEFAULTS.products}}catch{return HM_CONTENT_DEFAULTS}}
function escapeHmText(value){return String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function renderHmContent(){const content=getHmContent();const references=document.querySelector('#reference-list');const referenceCount=document.querySelector('#reference-count');const products=document.querySelector('#product-list');if(references)references.innerHTML=[...content.references,'AND MORE'].map((item)=>`<span>${escapeHmText(item)}</span>`).join('');if(referenceCount)referenceCount.textContent=String(content.references.length);if(products)products.innerHTML=content.products.map((item)=>`<span>${escapeHmText(item)}</span>`).join('')}
renderHmContent();
if(!localStorage.getItem('hmit-content')){fetch('./references.json').then((response)=>{if(!response.ok)throw new Error('references unavailable');return response.json()}).then((references)=>{if(Array.isArray(references))renderHmContent({...getHmContent(),references})}).catch(()=>{})}
