# HMIT 홈페이지 로컬 수정 안내

## 홈페이지 확인

`dist/index.html`을 브라우저로 열면 홈페이지를 확인할 수 있습니다.

## 콘텐츠 관리

`dist/manage.html`을 브라우저로 열면 고객 레퍼런스와 파트너 제품 목록을 수정할 수 있습니다.

- “이 브라우저에 저장”은 현재 브라우저에만 반영됩니다.
- 다른 PC나 실제 공개 사이트에 반영하려면 “설정 파일 받기”로 내보낸 파일을 홈페이지 관리자에게 전달하거나 `dist/content.js`의 기본 목록을 수정해야 합니다.

## 일반 문구 수정

- 회사 소개와 연락처: `dist/index.html`
- 고객사와 제품 기본 목록: `dist/content.js`
- 디자인: `dist/styles.css`
- 이미지와 로고: `dist/assets/`

공개 서버에는 보안을 위해 `manage.html`, `manage.js`, `manage.css`가 포함되지 않습니다. 이 ZIP에만 관리자 파일이 들어 있습니다.
