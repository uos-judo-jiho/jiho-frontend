# [설계 계획] 회비 및 영수증 관리 (Accounting) 모듈

## 1. 개요
지호 유도부의 투명한 운영을 위해 영수증 관리, 입출금 내역 확인, 회원별 회비 납부 상태를 관리하는 모듈을 구축합니다. 이 모듈은 관리자(Admin) 앱 내에 통합되며, 모바일 환경에서의 사용성을 최우선으로 설계합니다.

- **대상**: 지호 운영진 및 회계 담당자
- **핵심 가치**: 투명성, 모바일 접근성, 데이터 무결성

---

## 2. 아키텍처 (Feature-Sliced Design)
FSD 가이드라인에 따라 다음과 같이 레이어를 구성합니다.

### 📂 `features/accounting` (핵심 비즈니스 로직)
- **`receipt-upload`**: 영수증 사진 촬영 및 업로드 기능 (모바일 카메라 연동)
- **`transaction-filter`**: 입출금 내역 기간별/유형별 필터링
- **`dues-status-toggle`**: 회원별 회비 납부 상태 변경 (미납/완납)
- **`accounting-schemas`**: Zod를 이용한 입출금 기록 및 회비 스키마 정의

### 📂 `pages/accounting` (페이지 구성)
- **`AccountingDashboardPage`**: 전체 현황 요약 (잔액, 이번 달 입출금 그래프)
- **`TransactionListPage`**: 전체 입출금 내역 리스트 (무한 스크롤 적용)
- **`MembershipDuesPage`**: 기수별/회원별 회비 납부 현황 관리
- **`ReceiptGalleryPage`**: 업로드된 영수증 모아보기 및 상세 확인

### 📂 `entities/accounting` (데이터 구조)
- `Transaction`: 입출금 내역 모델
- `Dues`: 회비 납부 상태 모델
- `Receipt`: 영수증 이미지 및 메타데이터 모델

---

## 3. UI/UX 전략 (Mobile-First)

### 레이아웃
- **`MobileFinanceLayout`**: 기존 사이드바 대신 하단 탭 바(Bottom Navigation)를 제공하여 모바일 엄지 제어가 용이하도록 구성합니다.
- **Floating Action Button (FAB)**: 영수증 업로드 및 지출 기록 추가 버튼을 우측 하단에 상시 배치합니다.

### 컴포넌트 (`@packages/jds` 및 `shared/ui` 활용)
- **Card-based List**: 테이블 대신 카드 형태의 리스트를 사용하여 좁은 화면에서도 가독성을 확보합니다.
- **Bottom Sheets**: 상세 정보 확인 및 필터 선택 시 `overlay-kit`을 활용한 바텀 시트를 사용합니다.

---

## 4. 데이터 및 API 연동
- **API**: `@packages/api` (v2Admin)의 엔드포인트를 확장하여 사용합니다.
- **State Management**: 입금/출금 필터 상태 등은 `Zustand`를 사용하여 전역 관리합니다.
- **Validation**: `react-hook-form` + `zod`를 사용하여 입력 데이터의 정확성을 검증합니다.

---

## 5. 단계별 구현 로드맵

### Phase 1: 기반 인프라 구축
- [ ] `apps/admin/src/pages/accounting` 폴더 및 기본 라우팅 설정
- [ ] 모바일 전용 레이아웃(`BottomNav`) 및 FAB 구현

### Phase 2: 입출금 및 영수증 관리
- [ ] 입출금 내역 리스트 페이지 구현 (Card UI)
- [ ] 영수증 업로드 및 이미지 미리보기 기능 (`receipt-upload` feature)
- [ ] 지출/수입 수동 기록 폼 구현

### Phase 3: 회비 납부 관리
- [ ] 회원 목록과 연동된 회비 납부 현황판 구현
- [ ] 기수별 필터링 및 납부 상태 토글 기능 추가

### Phase 4: 대시보드 및 고도화
- [ ] 통계 대시보드 (Chart.js 또는 간단한 SVG 그래프)
- [ ] 엑셀 다운로드 (보고용) 기능 검토

---

## 6. 기술적 고려사항
- **이미지 최적화**: 모바일에서 촬영한 고해상도 사진을 서버 전송 전 클라이언트에서 압축(Resizing) 처리합니다.
- **오프라인 대응**: 네트워크 불안정 시 업로드 대기열(Queue) 관리 방안을 고려합니다.
