'use strict';
const gate = document.getElementById('gate');
const viewer = document.getElementById('viewer');
const password = document.getElementById('password');
const status = document.getElementById('status');
const submit = document.getElementById('submit');
const frame = document.getElementById('document');
const toggle = document.getElementById('toggle');
const bytes = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));

toggle.addEventListener('click', () => {
  const show = password.type === 'password';
  password.type = show ? 'text' : 'password';
  toggle.textContent = show ? '숨김' : '표시';
  toggle.setAttribute('aria-pressed', String(show));
});

document.getElementById('login').addEventListener('submit', async event => {
  event.preventDefault();
  if (!window.crypto?.subtle) {
    status.textContent = 'HTTPS 또는 localhost 주소에서 열어 주세요.';
    return;
  }
  submit.disabled = true;
  password.readOnly = true;
  status.textContent = '교육 자료를 여는 중입니다…';
  try {
    const response = await fetch('./content.enc.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('load');
    const payload = await response.json();
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password.value), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(payload.salt),iterations:payload.iterations,hash:'SHA-256'}, material, {name:'AES-GCM',length:256}, false, ['decrypt']);
    let plain;
    try {
      plain = await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(payload.iv)}, key, bytes(payload.data));
    } catch {
      status.textContent = '비밀번호가 올바르지 않습니다. 다시 입력해 주세요.';
      password.select();
      return;
    }
    // srcdoc keeps the original document and scripts without publishing plaintext.
    // An opaque sandbox origin isolates the training document from the parent site.
    frame.srcdoc = new TextDecoder('utf-8', {fatal:true}).decode(plain);
    password.value = '';
    password.type = 'password';
    toggle.textContent = '표시';
    toggle.setAttribute('aria-pressed', 'false');
    status.textContent = '';
    gate.hidden = true;
    viewer.hidden = false;
    document.getElementById('lock').focus();
  } catch {
    status.textContent = '자료를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
  } finally {
    submit.disabled = false;
    password.readOnly = false;
  }
});

document.getElementById('lock').addEventListener('click', () => {
  frame.removeAttribute('srcdoc');
  frame.src = 'about:blank';
  viewer.hidden = true;
  gate.hidden = false;
  password.focus();
});
