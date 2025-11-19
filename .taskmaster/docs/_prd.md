# 개요

select와 modal 컴포넌트를 만듭니다.
디자인 시스템에 맞게 설계합니다.

## 공통 요구 사항

기술 스택

- React / Typescript / Storybook / Tailwind / Vite 스타일링 관련 라이브러리만 사용 가능 (예: Tailwind, styled-components, Emotion 등)
- 헤드리스 라이브러리는 사용 불가 (예: headless UI, radix-ui, react-aria 등)

공통 구현

- Storybook에서 컴포넌트를 직접 조작할 수 있어야 합니다.
- 컴포넌트는 범용적으로 재사용 가능한 형태로 설계합니다.
- 상태 주입(Controlled) 혹은 상태 내부 관리(Uncontrolled) 모두 가능하며, 선택한 방식은 문서 / 스토리에서 설명해주세요.
- 테스트는 옵션입니다.
- 웹표준과 접근성을 준수합니다.

## 구현 요구 사항

### select

#### 필수 기능

- label + trigger + popup(list) 구성
- option 선택 → trigger에 반영
- keyboard navigation(예: ↑↓, Enter, Esc)
- focus management
- aria 속성 준수
- 기본 디자인과 비활성화 디자인, 총 2종으로 구성(variant)
- default
- disabled

#### 🟢 선택 기능

- disabled option(특정 옵션 비활성화)
- grouped options

#### ❌ 제외 범위

- 검색(Autocomplete), multi-select, 가상스크롤, 비동기 로딩 등 기능

### modal

#### 필수 기능

- open/close 제어
- ESC로 닫기 / backdrop 클릭 닫기
- focus management, focus trap
- aria 속성 준수
- 기본 디자인 1종만 구성(variant)

#### 🟢 선택 기능

- 여닫기 애니메이션(fade, slide 등)

#### ❌ 제외 범위

- 모달을 여닫는 트리거 버튼(스토리북에서 open 여부를 조작할 수 있는 형태면 충분합니다.)
- nested modal 등 기능
