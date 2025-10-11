# 🚇 NATM 터널 굴착 온톨로지 & 시각화 시스템

## Tunnel Excavation Ontology & Visualization System

NATM(New Austrian Tunneling Method) 터널 막장 굴착 프로세스를 OWL 2 온톨로지로 모델링하고, 두 개의 인터랙티브 웹 애플리케이션으로 시각화하는 포괄적인 시스템입니다.

![Status](https://img.shields.io/badge/status-complete-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

---

## 📋 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [빠른 시작](#빠른-시작)
- [프로젝트 구조](#프로젝트-구조)
- [NATM 굴착 프로세스](#natm-굴착-프로세스)
- [온톨로지 스키마](#온톨로지-스키마)
- [웹사이트 A 온톨로지 뷰어](#웹사이트-a-온톨로지-뷰어)
- [웹사이트 B 프로세스 타임라인](#웹사이트-b-프로세스-타임라인)
- [유효성 검증](#유효성-검증)
- [개발 가이드](#개발-가이드)
- [기술 스택](#기술-스택)
- [참고 자료](#참고-자료)

---

## 🎯 개요

이 프로젝트는 NATM 터널 막장 굴착 프로세스의 **디지털 트윈(Digital Twin)**을 구축합니다:

1. **시맨틱 계층**: 도메인 구조를 모델링하는 OWL 2 온톨로지 (클래스, 속성, 관계)
2. **데이터 계층**: 실제 굴착 사이클을 나타내는 인스턴스 데이터
3. **시각화 계층**: 온톨로지와 프로세스를 탐색하는 두 개의 인터랙티브 웹 앱

### 핵심 가치

- 📊 **지식 관리**: 터널 굴착 도메인 지식을 기계 판독 가능한 형식으로 형식화
- 🔄 **프로세스 최적화**: NATM 굴착 사이클의 분석 및 최적화 지원
- 🎓 **교육 도구**: 터널 공사를 이해하기 위한 인터랙티브 학습 도구
- 🔗 **데이터 통합**: 여러 소스의 터널 프로젝트 데이터 통합 기반 제공

---

## ✨ 주요 기능

- **인터랙티브 온톨로지 그래프**: Cytoscape.js를 사용하여 온톨로지 스키마를 그래프 형태로 시각화합니다.
  - 클래스(Class), 객체 속성(Object Property), 데이터 속성(Datatype Property)을 각기 다른 스타일로 표현합니다.
  - 노드 클릭 시 세부 정보를 확인할 수 있습니다.
  - 그래프 확대/축소, 이동, 화면 맞춤, 초기화 기능을 지원합니다.
- **클래스 계층 구조 뷰**: 온톨로지에 정의된 클래스들을 계층 구조로 보여주며, 특정 클래스 선택 시 그래프에서 해당 노드를 강조합니다.
- **프로세스 타임라인**: 터널 공사 절차와 관련된 인스턴스 데이터를 타임라인 형태로 시각화합니다. (`process.html`)
- **웹 기반 인터페이스**: 별도의 소프트웨어 설치 없이 웹 브라우저에서 바로 온톨로지 데이터를 탐색할 수 있습니다.

---

## 🚀 빠른 시작

### 사전 요구사항

- **Node.js** v14 이상
- **npm** v6 이상
- **Python 3.7+** (선택사항, 온톨로지 검증용)

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 시작
npm run dev

# 서버가 http://127.0.0.1:8080 에서 시작되고 브라우저가 자동으로 열립니다
```

### 웹사이트 접속

- **온톨로지 뷰어**: <http://127.0.0.1:8080/index.html>
- **프로세스 타임라인**: <http://127.0.0.1:8080/process.html>

---

## 📁 프로젝트 구조

```
.
├── src
│   ├── ontology/         # 온톨로지 데이터 (스키마 및 인스턴스)
│   │   ├── tunneling_schema.ttl
│   │   └── tunnel_instances.ttl
│   ├── parsers/          # 데이터 파싱 관련 모듈
│   │   └── turtle-parser.js
│   ├── utils/            # 유틸리티 함수
│   │   └── formatters.js
│   └── visualizers/      # 시각화 로직 관련 모듈
│       ├── ontology-graph.js
│       └── cycle-timeline.js
├── scripts
│   ├── validate_turtle.py # Python을 이용한 Turtle 파일 유효성 검사 스크립트
│   └── requirements.txt
├── index.html            # 온톨로지 그래프 뷰어
├── process.html          # 프로세스 타임라인 뷰어
├── package.json          # Node.js 프로젝트 설정 및 의존성 관리
└── README.md             # 프로젝트 소개 문서
```

---

## 🏗️ NATM 굴착 프로세스

NATM(신오스트리아 터널공법)은 **6단계 순환 작업**으로 진행됩니다:

| 순서 | 단계 | 소요시간 | 설명 |
|------|------|----------|------|
| 1️⃣ | **천공 (Drilling)** | ~2.5시간 | 막장면에 구멍 뚫기 (심빼기공, 주변공, 보조공) |
| 2️⃣ | **장약 (Charging)** | ~45분 | 천공 구멍에 폭약과 뇌관 장전 |
| 3️⃣ | **발파 (Blasting)** | ~5분 | 폭약의 순차적 기폭 |
| 4️⃣ | **환기 (Ventilation)** | ~30분 | 유해 가스 및 분진 배출 |
| 5️⃣ | **버력처리 (Mucking)** | ~1.5시간 | 굴착된 암석 반출 |
| 6️⃣ | **지보재 설치 (Support)** | ~2시간 | 숏크리트, 록볼트, 강지보재 설치 |

**사이클당 소요시간**: 약 7-8시간 | **전진장**: 1.0-1.5m

---

## 🧬 온톨로지 스키마

### 주요 클래스

- **TunnelingCycle**: 완전한 굴착 사이클 (1.0-1.5m 전진)
- **ProcessStage**: 굴착 단계의 추상 클래스
  - `Drilling`, `Charging`, `Blasting`, `Ventilation`, `Mucking`, `SupportInstallation`
- **Equipment**: 천공기, 로더, 숏크리트 장비
- **SupportMember**: 숏크리트, 록볼트, 강지보재
- **DrillHole**: 심빼기공, 주변공, 보조공

### 주요 속성

**데이터 속성**:

- `cycleNumber` (xsd:integer): 사이클 순번
- `advanceLength` (xsd:decimal): 전진장 (미터)
- `startTime`, `endTime` (xsd:dateTime): 단계 시작/종료 시간

**객체 속성**:

- `hasStage`: TunnelingCycle → ProcessStage
- `usesEquipment`: ProcessStage → Equipment
- `installsSupport`: SupportInstallation → SupportMember

---

## 🖥️ 웹사이트 A: 온톨로지 뷰어

**URL**: <http://127.0.0.1:8080/index.html>

### 온톨로지 뷰어 기능

- 📊 **인터랙티브 그래프**: 온톨로지의 force-directed 네트워크 시각화
- 🎨 **노드 색상 구분**: 클래스(파랑), 객체 속성(초록), 데이터 속성(주황)
- 🔍 **클래스 계층**: 좌측 사이드바의 계층 구조 트리
- 📝 **노드 상세정보**: 우측 사이드바에 선택된 노드 정보 표시
- 🎮 **그래프 컨트롤**: 전체 보기, 줌 리셋 버튼

---

## ⏱️ 웹사이트 B: 프로세스 타임라인

**URL**: <http://127.0.0.1:8080/process.html>

### 타임라인 뷰어 기능

- 📅 **간트 타임라인**: 굴착 사이클의 수평 타임라인
- 🎨 **색상 구분**: 단계별 고유 색상 (천공=파랑, 발파=빨강 등)
- 📋 **사이클 리스트**: 좌측 사이드바의 사이클 요약
- 📊 **상세 정보**: 우측 사이드바에 장비, 소요시간, 생성물 표시
- 🔎 **타임라인 컨트롤**: 확대/축소, 전체 보기

---

## 🔍 유효성 검증

### Python 검증 (선택사항)

```bash
# Python 의존성 설치
pip install rdflib>=6.0.0

# 검증 스크립트 실행
python scripts/validate_turtle.py
```

**예상 출력**:

```text
✓ Parsed src/ontology/tunneling_schema.ttl: 201 triples
✓ All 6 NATM stages defined
✓ All 3 cycles have 6 stages
✓ Temporal sequence validated
```

---

## 🛠️ 개발 가이드

### 새 사이클 추가하기

`src/ontology/tunnel_instances.ttl` 파일을 수정:

```turtle
:cycle004 rdf:type :TunnelingCycle ;
    :cycleNumber 4 ;
    :advanceLength "1.3"^^xsd:decimal ;
    :hasStage :drilling_c004, :charging_c004, ... .
```

브라우저를 새로고침하면 타임라인에 새 사이클이 표시됩니다.

---

## 🔧 기술 스택

| 패키지 | 버전 | 용도 |
|--------|------|------|
| **n3** | ^1.17.0 | 브라우저 RDF/Turtle 파싱 |
| **cytoscape** | ^3.26.0 | 그래프 시각화 |
| **vis-timeline** | ^7.7.2 | 타임라인 시각화 |
| **http-server** | ^14.1.1 | 로컬 개발 서버 |

---

## 📚 참고 자료

### W3C 표준

- [OWL 2 Web Ontology Language](https://www.w3.org/TR/owl2-overview/)
- [RDF 1.1 Turtle](https://www.w3.org/TR/turtle/)

### 라이브러리 문서

- [N3.js Documentation](https://github.com/rdfjs/N3.js)
- [Cytoscape.js Documentation](https://js.cytoscape.org/)
- [Vis.js Timeline Documentation](https://visjs.github.io/vis-timeline/)

---

**Last Updated**: 2025-01-12
**Status**: ✅ 구현 완료
**Version**: 1.0.0
