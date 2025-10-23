# 터널 온톨로지 RuleSet 기반 추론 시스템

## 개요

이 시스템은 NATM 터널 시공 프로세스를 OWL 온톨로지로 모델링하고, **SPARQL CONSTRUCT 규칙**을 사용하여 자동 추론을 수행합니다.

### 핵심 기능

1. **온톨로지 모델링**: 터널 시공 프로세스의 계층 구조와 순차 관계를 OWL/RDF로 표현
2. **RuleSet 기반 추론**: SPARQL CONSTRUCT 쿼리를 사용한 자동 추론
3. **품질 검증**: 시공 품질 위반 및 선행 조건 위반 자동 탐지
4. **웹 시각화**: 추론 결과를 실시간으로 확인할 수 있는 인터페이스

---

## 프로젝트 구조

```
tunnelontology/
├── src/
│   ├── ontology/
│   │   ├── schema/
│   │   │   └── tunnel_process_ontology.ttl     # 온톨로지 스키마
│   │   ├── instances/
│   │   │   └── sealing_process_instance.ttl    # 인스턴스 데이터
│   │   └── rules/
│   │       ├── sequential_rules.ttl            # 순차 관계 규칙
│   │       ├── quality_validation_rules.ttl    # 품질 검증 규칙
│   │       └── prerequisite_rules.ttl          # 선행 조건 규칙
│   ├── reasoners/
│   │   └── sparql_reasoner.js                  # SPARQL 추론 엔진
│   └── visualizers/
│       └── inference_viewer.js                 # 추론 결과 시각화
├── styles/
│   ├── main.css
│   └── inference.css
├── inference.html                               # 추론 엔진 페이지
└── README_INFERENCE.md                          # 이 문서
```

---

## 온톨로지 구조

### 클래스 계층

```
ProcessActivity (추상 클래스)
├── MainProcess          # h.Sealing(N) 같은 주 프로세스
├── SubProcess           # h-4.Sealing(N) 같은 하위 프로세스
├── Task                 # h-4-2.사전조치 같은 작업
└── Step                 # h-4-2-1.시공계획서 작성 같은 단계

QualityControl
├── MaterialInspection   # 자재 검사
└── CompletionInspection # 완료 검사

Material
├── Shotcrete           # 숏크리트
├── SteelFiber          # 강섬유
├── Accelerator         # 급결제
└── Admixture           # 혼화제
```

### 주요 속성

#### Object Properties
- `:hasParent` - 상위 프로세스 참조
- `:hasPreviousStep` - 이전 단계 참조
- `:hasNextStep` - 다음 단계 참조 (추론 가능)
- `:requiresMaterial` - 필요한 자재
- `:performsQualityCheck` - 수행하는 품질 검사

#### Datatype Properties
- `:uid` - 고유 식별자 (예: "0x6f7e")
- `:activityID` - 활동 ID (예: "131", "h-4-2-1")
- `:activityName` - 활동명 (예: "뜬돌제거")
- `:sequenceOrder` - 실행 순서

---

## RuleSet 추론 규칙

### 1. 순차 관계 규칙 (Sequential Rules)

#### Rule 1.1: 역방향 순차 관계 추론
```sparql
CONSTRUCT {
    ?previous :hasNextStep ?current .
}
WHERE {
    ?current :hasPreviousStep ?previous .
}
```
**설명**: `hasPreviousStep`이 있으면 자동으로 `hasNextStep` 관계 생성

#### Rule 1.2: 계층 소속 추론
```sparql
CONSTRUCT {
    ?child :belongsToProcess ?mainProcess .
}
WHERE {
    ?child :hasParent+ ?mainProcess .
    ?mainProcess a :MainProcess .
}
```
**설명**: 하위 활동이 어떤 메인 프로세스에 속하는지 자동으로 추론

#### Rule 1.3: 순환 참조 탐지
```sparql
CONSTRUCT {
    ?activity :hasPrerequisiteViolation [
        a :SequenceViolation ;
        :violationType "CircularReference"
    ] .
}
WHERE {
    ?activity :hasPreviousStep+ ?activity .
}
```
**설명**: 프로세스 순서에 순환 참조가 있는지 탐지

---

### 2. 품질 검증 규칙 (Quality Validation Rules)

#### Rule 2.1: 숏크리트 시공 후 품질 검사 필수
```sparql
CONSTRUCT {
    ?shotcrete :hasQualityViolation [
        a :QualityViolation ;
        :violationType "MissingInspection"
    ] .
}
WHERE {
    ?shotcrete a :ShotcreteConstruction .
    FILTER NOT EXISTS {
        ?shotcrete :hasNextStep* ?inspection .
        ?inspection a :CompletionInspection .
    }
}
```
**설명**: 숏크리트 시공 이후 완료 검사가 없으면 위반

#### Rule 2.2: 품질검사 세부 항목 완전성
```sparql
CONSTRUCT {
    ?inspection :hasQualityViolation [
        a :QualityViolation ;
        :violationType "IncompleteInspection"
    ] .
}
WHERE {
    ?inspection a :CompletionInspection .
    # 6개 미만의 하위 단계를 가진 경우
}
```
**설명**: 완료 검사가 필수 6개 항목을 모두 포함하는지 확인

---

### 3. 선행 조건 규칙 (Prerequisite Rules)

#### Rule 3.1: 시공 전 자재 검사 필수
```sparql
CONSTRUCT {
    ?construction :hasPrerequisiteViolation [
        a :PrerequisiteViolation ;
        :violationType "MaterialNotInspected"
    ] .
}
WHERE {
    ?construction a :ShotcreteConstruction .
    FILTER NOT EXISTS {
        ?construction :hasPreviousStep* ?inspection .
        ?inspection a :MaterialInspection .
    }
}
```
**설명**: 숏크리트 시공 전에 자재 검사가 완료되지 않으면 위반

#### Rule 3.2: 시공 전 사전 조치 완료 필수
```sparql
CONSTRUCT {
    ?construction :hasPrerequisiteViolation [
        a :PrerequisiteViolation ;
        :violationType "PreparationNotCompleted"
    ] .
}
WHERE {
    ?construction a :ShotcreteConstruction .
    FILTER NOT EXISTS {
        ?construction :hasPreviousStep* ?preparation .
        ?preparation :activityName "h-4-4.시공 전 조치" .
    }
}
```
**설명**: 시공 전 조치가 완료되지 않으면 위반

---

## 사용 방법

### 1. 개발 서버 시작

```bash
npm install
npm run dev
```

서버가 시작되면 `http://localhost:8080/inference.html`에 접속합니다.

### 2. 추론 실행

1. 웹 페이지에서 **"추론 실행"** 버튼 클릭
2. 시스템이 자동으로:
   - 온톨로지 스키마 로드
   - 인스턴스 데이터 로드
   - 추론 규칙 추출
   - SPARQL CONSTRUCT 쿼리 실행
   - 위반 사항 탐지

### 3. 결과 확인

#### 추론 통계
- 총 규칙 수
- 실행된 규칙 수
- 추론된 트리플 수

#### 규칙별 결과
각 규칙이 몇 개의 새로운 트리플을 생성했는지 확인

#### 위반 사항
발견된 품질 위반 및 선행 조건 위반 목록 표시

---

## 추론 예시

### 입력 데이터

```turtle
:Activity_153 a :ShotcreteConstruction ;
    :activityName "h-4-5.숏크리트 시공" ;
    :hasPreviousStep :Activity_148 .

# 자재 검사가 없음 (누락)
```

### 추론 결과

```turtle
# Rule 3.1 실행 결과
:Activity_153 :hasPrerequisiteViolation [
    a :PrerequisiteViolation ;
    :violationType "MaterialNotInspected" ;
    :violationMessage "시공 전 자재 검사가 완료되지 않았습니다"@ko
] .
```

**해석**: 시스템이 자동으로 "숏크리트 시공 전에 자재 검사가 없음"을 탐지하고 위반으로 표시합니다.

---

## 프로그래밍 방식 사용

### JavaScript에서 추론 엔진 사용

```javascript
import { SPARQLReasoner } from './src/reasoners/sparql_reasoner.js';

async function runCustomInference() {
    const reasoner = new SPARQLReasoner();

    // 온톨로지 로드
    await reasoner.loadOntology('/src/ontology/schema/tunnel_process_ontology.ttl');
    await reasoner.loadOntology('/src/ontology/instances/sealing_process_instance.ttl');

    // 규칙 추출
    const rules = await reasoner.extractRules('/src/ontology/rules/sequential_rules.ttl');

    // 추론 실행
    const results = await reasoner.performReasoning(rules);

    // 위반 사항 조회
    const violations = reasoner.getViolations();

    console.log('추론 결과:', results);
    console.log('위반 사항:', violations);
}

runCustomInference();
```

---

## 추론 규칙 확장

### 새로운 규칙 추가 방법

1. **규칙 파일 생성** (예: `custom_rules.ttl`)

```turtle
@prefix : <http://example.org/tunnel-ontology#> .

:CustomRule_Example a :InferenceRule ;
    rdfs:label "사용자 정의 규칙"@ko ;
    :sparqlConstruct """
        PREFIX : <http://example.org/tunnel-ontology#>

        CONSTRUCT {
            ?activity :hasCustomProperty "Value" .
        }
        WHERE {
            ?activity a :ProcessActivity .
            # 조건 추가
        }
    """ .
```

2. **추론 엔진에 규칙 추가**

```javascript
const customRules = await reasoner.extractRules('/src/ontology/rules/custom_rules.ttl');
const allRules = [...existingRules, ...customRules];
await reasoner.performReasoning(allRules);
```

---

## 기술 스택

- **온톨로지 언어**: OWL 2 (Turtle/RDF 형식)
- **추론 방식**: SPARQL CONSTRUCT
- **RDF 라이브러리**: rdflib.js
- **프론트엔드**: Vanilla JavaScript (ES6 modules)
- **서버**: http-server

---

## 제한 사항

1. **브라우저 기반 추론**: 서버 측 추론기(Pellet, HermiT)보다 제한적
2. **SPARQL 1.1 지원**: rdflib.js의 SPARQL 지원 범위에 따름
3. **대규모 온톨로지**: 수천 개 이상의 트리플에서는 성능 저하 가능

---

## 향후 개선 계획

- [ ] 서버 측 추론 엔진 통합 (Apache Jena Fuseki)
- [ ] SHACL 규칙 지원 추가
- [ ] 추론 과정 단계별 시각화
- [ ] 위반 사항 수정 제안 기능
- [ ] 추론 결과 Neo4j 저장

---

## 참고 자료

- [W3C OWL 2 Overview](https://www.w3.org/TR/owl2-overview/)
- [SPARQL 1.1 Query Language](https://www.w3.org/TR/sparql11-query/)
- [rdflib.js Documentation](https://github.com/linkeddata/rdflib.js)
- [SHACL Specification](https://www.w3.org/TR/shacl/)

---

## 라이선스

MIT License

## 문의

프로젝트 관련 문의사항은 이슈로 등록해 주세요.
