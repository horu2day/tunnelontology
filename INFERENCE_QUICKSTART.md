# 추론 엔진 빠른 시작 가이드

## 접속 방법

1. **개발 서버 시작** (이미 실행 중인 경우 생략)
   ```bash
   npm run dev
   ```

2. **브라우저에서 추론 엔진 페이지 접속**
   ```
   http://127.0.0.1:8080/inference.html
   ```

## 사용 방법

### 1. 추론 실행
- 페이지 중앙의 **"추론 실행"** 버튼 클릭
- 시스템이 자동으로:
  - ✓ 온톨로지 스키마 로드 ([tunnel_process_ontology.ttl](src/ontology/schema/tunnel_process_ontology.ttl))
  - ✓ 인스턴스 데이터 로드 ([sealing_process_instance.ttl](src/ontology/instances/sealing_process_instance.ttl))
  - ✓ 18개 추론 규칙 추출
  - ✓ SPARQL CONSTRUCT 쿼리 실행
  - ✓ 추론 결과 표시

### 2. 추론 결과 확인

#### 추론 통계
- **총 규칙**: 18개 (순차 5개 + 품질 6개 + 선행조건 7개)
- **실행된 규칙**: 18개
- **추론된 트리플**: 47개

#### 규칙별 결과 테이블
각 규칙이 생성한 새로운 트리플 수를 테이블로 표시:

| 규칙 이름 | 추론된 트리플 수 |
|----------|--------------|
| 역방향 순차 관계 추론 | 32 |
| 계층 소속 추론 | 5 |
| 강도 검사 수행 확인 | 1 |
| 두께 및 마무리 검사 완료 | 1 |
| ... | ... |

#### 위반 사항
현재 제공된 Sealing 프로세스 데이터는 잘 구성되어 있어 **위반 사항이 없습니다** ✓

### 3. Turtle 내보내기
- **"Turtle 내보내기"** 버튼 클릭
- 추론된 온톨로지를 `inferred_ontology.ttl` 파일로 다운로드

---

## 추론 규칙 예시

### 규칙 1: 역방향 순차 관계 추론
```sparql
CONSTRUCT {
    ?previous :hasNextStep ?current .
}
WHERE {
    ?current :hasPreviousStep ?previous .
}
```

**설명**: `Activity_133`이 `Activity_132`를 `:hasPreviousStep`으로 참조하면, 자동으로 `Activity_132 :hasNextStep Activity_133` 관계가 추론됩니다.

### 규칙 2: 계층 소속 추론
```sparql
CONSTRUCT {
    ?child :belongsToProcess ?mainProcess .
}
WHERE {
    ?child :hasParent+ ?mainProcess .
    ?mainProcess a :MainProcess .
}
```

**설명**: `Activity_153` (숏크리트 시공)이 `Activity_135`, `Activity_131` (Sealing 메인 프로세스)의 하위에 있으면, `:belongsToProcess` 관계가 추론됩니다.

### 규칙 3: 품질 검사 완료 확인
```sparql
CONSTRUCT {
    ?inspection :hasQualityCheck :StrengthTestCompleted .
}
WHERE {
    ?inspection a :CompletionInspection .
    ?generalStrength :hasParent ?inspection ;
                    :activityName "h-4-6-1.강도 확인(일반)" .
    ?fiberStrength :hasParent ?inspection ;
                  :activityName "h-4-6-2.강도 확인(강섬유)" .
}
```

**설명**: 완료 검사에 일반 강도 및 강섬유 강도 검사가 모두 포함되어 있으면, `:StrengthTestCompleted` 상태가 추론됩니다.

---

## 추론 결과의 의미

### 명시적 지식 (입력)
```turtle
:Activity_132 a :Task ;
    :activityName "h-1.뜬돌제거" .

:Activity_133 a :Task ;
    :activityName "h-2.측량 및 여굴량 확인" ;
    :hasPreviousStep :Activity_132 .
```

### 추론된 지식 (출력)
```turtle
# 규칙에 의해 자동 생성됨
:Activity_132 :hasNextStep :Activity_133 .

:Activity_133 :belongsToProcess :Activity_131 .
:Activity_132 :belongsToProcess :Activity_131 .
```

---

## 데모 vs 실제 구현

### 현재 (데모 버전)
- ✅ UI/UX 완성
- ✅ 추론 규칙 18개 정의
- ✅ 시뮬레이션 결과 표시
- ⚠️ 실제 SPARQL 추론은 시뮬레이션

### 완전한 구현을 위한 다음 단계
1. rdflib.js를 사용한 실제 RDF 스토어 구현
2. SPARQL CONSTRUCT 쿼리 실행 엔진
3. 추론 전/후 비교 기능
4. 위반 사항 실시간 탐지

---

## 문제 해결

### 페이지가 비어있는 경우
1. 브라우저 개발자도구 (F12) 콘솔 확인
2. JavaScript 오류 확인
3. 서버 재시작: `npm run dev`

### 추론 실행 버튼이 작동하지 않는 경우
1. 페이지 새로고침 (Ctrl+F5)
2. 브라우저 캐시 삭제
3. 콘솔에서 오류 메시지 확인

---

## 다음 단계

추론 시스템을 실제로 구현하려면 [README_INFERENCE.md](README_INFERENCE.md)를 참고하세요.

---

**현재 상태**: 데모 버전 작동 중 ✅
**브라우저 접속**: http://127.0.0.1:8080/inference.html
