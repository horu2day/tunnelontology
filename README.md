# 🚇 터널 온톨로지 시각화 시스템 (Tunnel Ontology Visualization)

## 1. 개요

이 프로젝트는 NATM(New Austrian Tunnelling Method) 터널 공사 프로세스를 기술하는 온톨로지(Ontology)를 시각적으로 탐색하고 분석할 수 있는 웹 기반 시스템입니다. Turtle 형식(`.ttl`)으로 작성된 터널링 스키마를 읽어와, 사용자가 클래스, 속성, 관계를 쉽게 이해할 수 있도록 인터랙티브 그래프와 타임라인 형태로 제공합니다.

## 2. 주요 기능

- **인터랙티브 온톨로지 그래프**: Cytoscape.js를 사용하여 온톨로지 스키마를 그래프 형태로 시각화합니다.
  - 클래스(Class), 객체 속성(Object Property), 데이터 속성(Datatype Property)을 각기 다른 스타일로 표현합니다.
  - 노드 클릭 시 세부 정보를 확인할 수 있습니다.
  - 그래프 확대/축소, 이동, 화면 맞춤, 초기화 기능을 지원합니다.
- **클래스 계층 구조 뷰**: 온톨로지에 정의된 클래스들을 계층 구조로 보여주며, 특정 클래스 선택 시 그래프에서 해당 노드를 강조합니다.
- **프로세스 타임라인**: 터널 공사 절차와 관련된 인스턴스 데이터를 타임라인 형태로 시각화합니다. (`process.html`)
- **웹 기반 인터페이스**: 별도의 소프트웨어 설치 없이 웹 브라우저에서 바로 온톨로지 데이터를 탐색할 수 있습니다.

## 3. 사용된 주요 기술

- **Frontend**: HTML5, CSS3, JavaScript (ESM)
- **Visualization**:
  - **[Cytoscape.js](https://js.cytoscape.org/)**: 온톨로지 그래프 시각화를 위한 라이브러리
  - **[vis-timeline](https://visjs.github.io/vis-timeline/docs/timeline/)**: 프로세스 타임라인 시각화를 위한 라이브러리
- **Ontology Parsing**:
  - **[N3.js](https://github.com/rdfjs/N3.js)**: Turtle(`.ttl`) 파일을 파싱하고 RDF 데이터를 처리하기 위한 라이브러리
- **Development Environment**:
  - **[Node.js](https://nodejs.org/)**: 프로젝트 개발 환경 및 패키지 관리
  - **[http-server](https://www.npmjs.com/package/http-server)**: 간단한 로컬 개발 서버
  - **[ESLint](https://eslint.org/)**: 코드 스타일 및 오류 검사를 위한 린터

## 4. 프로젝트 구조

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

## 5. 설치 및 실행 방법

1.  **저장소 복제**
    ```bash
    git clone <repository-url>
    cd tunnelontology
    ```

2.  **Node.js 의존성 설치**
    프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 필요한 라이브러리를 설치합니다.
    ```bash
    npm install
    ```

3.  **개발 서버 실행**
    다음 명령어를 실행하여 로컬 개발 서버를 시작합니다.
    ```bash
    npm run dev
    ```
    서버가 시작되면 자동으로 브라우저에서 `http://localhost:8080` 주소로 애플리케이션이 열립니다.

## 6. 유효성 검사 스크립트

`scripts` 디렉토리에는 `rdflib` 라이브러리를 사용하여 Turtle 파일의 구문이 유효한지 검사하는 Python 스크립트가 포함되어 있습니다.

1.  **Python 의존성 설치**
    ```bash
    cd scripts
    pip install -r requirements.txt
    ```

2.  **스크립트 실행**
    ```bash
    python validate_turtle.py <path_to_your_turtle_file.ttl>
    ```
    예시:
    ```bash
    python validate_turtle.py ../src/ontology/tunneling_schema.ttl
    ```
