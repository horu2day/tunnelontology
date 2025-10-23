# 터널 온톨로지 추론 시스템 세미나 가이드

## 📋 세미나 개요

**주제**: OWL 온톨로지와 SPARQL 추론을 활용한 터널 시공 품질 관리 자동화

**목표**:
- 온톨로지 기반 추론의 개념 이해
- SPARQL CONSTRUCT 규칙 작성 방법 학습
- 실제 터널 시공 프로세스에 적용 사례 제시

**대상**: 건설 IT, 시맨틱 웹, 지식 그래프 관심자

**소요 시간**: 45-60분

---

## 🎯 세미나 진행 순서

### 1단계: 문제 정의 (5분)

#### 현재 터널 시공 관리의 문제점
- ❌ 수작업 품질 검사 → 누락 가능성
- ❌ 선행 조건 확인 불완전 → 안전 사고 위험
- ❌ 공정 순서 위반 탐지 어려움
- ❌ 데이터가 있어도 활용 못함

#### 온톨로지 추론 솔루션
- ✅ 자동으로 품질 위반 탐지
- ✅ 선행 조건 누락 즉시 발견
- ✅ 순서 관계 자동 추론
- ✅ 명시적 지식 → 암묵적 지식 도출

---

### 2단계: 추론 개념 설명 (10분)

#### 추론(Reasoning)이란?

```
명시적 지식 (입력)              추론 규칙               추론된 지식 (출력)
─────────────────  +  ────────────────  →  ──────────────────
Activity_133          CONSTRUCT {              Activity_132
:hasPreviousStep        ?prev                  :hasNextStep
Activity_132            :hasNextStep           Activity_133
                        ?curr
                      }
                      WHERE {
                        ?curr
                        :hasPreviousStep
                        ?prev
                      }
```

#### 5단계 추론 프로세스

1️⃣ **온톨로지 로드**: RDF 그래프로 데이터 읽기
2️⃣ **규칙 추출**: SPARQL CONSTRUCT 쿼리 파싱
3️⃣ **패턴 매칭**: WHERE 절 실행으로 조건 만족 데이터 찾기
4️⃣ **새 지식 생성**: CONSTRUCT 절로 새 트리플 생성
5️⃣ **결과 통합**: 원본 + 추론 데이터 통합

---

### 3단계: 실제 데모 (15분)

#### 데모 준비
```bash
# 브라우저에서 접속
http://127.0.0.1:8080/inference.html
```

#### 데모 시나리오

**시나리오 1: 순차 관계 추론**
1. "추론 실행" 버튼 클릭
2. "역방향 순차 관계 추론" 규칙 설명
3. 결과: 32개 트리플 생성 확인

**시나리오 2: 계층 소속 추론**
1. SPARQL 쿼리 예시 2번 보여주기
2. Activity_153이 Activity_131에 속한다는 관계 추론
3. 결과: 5개 트리플 생성

**시나리오 3: 품질 검사 완료 확인**
1. 완료 검사에 강도 검사 2개 포함 여부 확인
2. SPARQL 쿼리 예시 3번 설명
3. 자동으로 `:StrengthTestCompleted` 상태 추론

---

### 4단계: SPARQL 규칙 작성법 (15분)

#### 규칙 1: 역방향 순차 관계 추론

```sparql
PREFIX : <http://example.org/tunnel-ontology#>

CONSTRUCT {
    ?previous :hasNextStep ?current .
}
WHERE {
    ?current :hasPreviousStep ?previous .
}
```

**설명**:
- WHERE: "이전 단계를 가진 모든 활동 찾기"
- CONSTRUCT: "이전 활동에 다음 단계 관계 추가"
- 효과: 33개 previous → 33개 next 자동 생성

---

#### 규칙 2: 품질 위반 탐지

```sparql
PREFIX : <http://example.org/tunnel-ontology#>

CONSTRUCT {
    ?shotcrete :hasQualityViolation [
        a :QualityViolation ;
        :violationType "MissingInspection" ;
        :violationMessage "숏크리트 시공 후 품질 검사가 누락되었습니다"@ko
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

**설명**:
- WHERE: "숏크리트 시공 후 완료 검사가 없는 경우"
- CONSTRUCT: "품질 위반 개체 자동 생성"
- 효과: 누락된 검사 즉시 탐지

---

#### 규칙 3: 선행 조건 검증

```sparql
PREFIX : <http://example.org/tunnel-ontology#>

CONSTRUCT {
    ?construction :hasPrerequisiteViolation [
        a :PrerequisiteViolation ;
        :violationType "MaterialNotInspected" ;
        :violationMessage "시공 전 자재 검사가 완료되지 않았습니다"@ko
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

**설명**:
- WHERE: "시공 이전에 자재 검사가 없는 경우"
- CONSTRUCT: "선행 조건 위반 표시"
- 효과: 안전 절차 누락 방지

---

### 5단계: 실제 적용 효과 (10분)

#### 통계 결과

| 항목 | 수치 |
|------|------|
| 원본 트리플 | 33개 |
| 추론 규칙 | 18개 |
| 추론된 트리플 | 47개 |
| **총 지식** | **80개** (145% 증가) |

#### 주요 추론 결과

1. **역방향 관계 추론**: 32개
   - Activity_132 → Activity_133 (next)
   - Activity_133 → Activity_134 (next)
   - ... (총 32개 연결)

2. **계층 소속 추론**: 5개
   - Activity_153 → Activity_131 (belongs to)
   - Activity_157 → Activity_131 (belongs to)

3. **품질 검사 확인**: 3개
   - StrengthTestCompleted
   - ThicknessFinishCompleted
   - AllMaterialsInspected

4. **선행 조건 검증**: 5개
   - AllPrerequisitesCompleted (5개 활동)

#### 위반 사항

✅ **현재 데이터: 위반 없음** (잘 구성된 프로세스)

만약 누락이 있었다면:
- ❌ MissingInspection: 숏크리트 시공 후 검사 누락
- ❌ MaterialNotInspected: 자재 미검사
- ❌ SequenceViolation: 순서 위반

---

### 6단계: 확장 가능성 (5분)

#### 추가 가능한 규칙

1. **시간 기반 규칙**
   ```sparql
   # 발파 후 30분 이내 환기 필수
   FILTER (?ventStart - ?blastEnd > "PT30M")
   ```

2. **수치 기반 규칙**
   ```sparql
   # 숏크리트 두께 10cm 미만 위반
   FILTER (?thickness < 0.1)
   ```

3. **복합 조건 규칙**
   ```sparql
   # 여러 조건 동시 만족 시 경고
   ```

#### 실제 활용 시나리오

- 🏗️ 실시간 공정 모니터링
- 📊 품질 대시보드 자동 생성
- ⚠️ 안전 위반 즉시 알림
- 📈 통계 분석 및 예측

---

## 💡 Q&A 예상 질문

### Q1: 왜 SPARQL을 사용하나요?
**A**: SPARQL은 W3C 표준이며, RDF 그래프 쿼리에 최적화되어 있습니다. CONSTRUCT 절을 통해 새로운 그래프를 생성할 수 있어 추론에 적합합니다.

### Q2: 성능은 어떤가요?
**A**: 현재 데모는 33개 트리플로 즉시 실행됩니다. 수천~수만 개 규모에서는 서버 측 추론 엔진(Apache Jena, Stardog) 사용을 권장합니다.

### Q3: 다른 건설 분야에도 적용 가능한가요?
**A**: 네! 교량, 댐, 건축 등 순차적 공정이 있는 모든 분야에 적용 가능합니다. 온톨로지 스키마만 재정의하면 됩니다.

### Q4: 실제 시스템과 통합 방법은?
**A**: REST API로 온톨로지 데이터를 받아 추론 실행 후 결과를 JSON으로 반환하는 방식으로 통합 가능합니다.

### Q5: 규칙은 몇 개까지 만들 수 있나요?
**A**: 제한 없습니다. 본 프로젝트는 18개 규칙으로 시작하지만, 필요에 따라 수백 개 추가 가능합니다.

---

## 📚 추가 학습 자료

1. **W3C SPARQL 1.1 Query Language**
   - https://www.w3.org/TR/sparql11-query/

2. **OWL 2 Web Ontology Language**
   - https://www.w3.org/TR/owl2-overview/

3. **Apache Jena 추론 엔진**
   - https://jena.apache.org/documentation/inference/

4. **본 프로젝트 문서**
   - [README_INFERENCE.md](README_INFERENCE.md)
   - [INFERENCE_QUICKSTART.md](INFERENCE_QUICKSTART.md)

---

## 🎤 세미나 준비 체크리스트

### 기술 준비
- [ ] 개발 서버 실행 확인 (`npm run dev`)
- [ ] 브라우저에서 inference.html 접속 확인
- [ ] 추론 실행 버튼 작동 확인
- [ ] 스크롤 및 모든 섹션 표시 확인

### 자료 준비
- [ ] 프레젠테이션 슬라이드 (이 문서 기반)
- [ ] 라이브 데모 시나리오 연습
- [ ] 백업 스크린샷 준비
- [ ] Q&A 답변 준비

### 발표 준비
- [ ] 마이크/스피커 테스트
- [ ] 화면 공유 설정
- [ ] 네트워크 연결 확인
- [ ] 시간 배분 연습 (45-60분)

---

## 🚀 세미나 후 액션 아이템

### 참석자용
1. 프로젝트 GitHub 클론
2. 로컬에서 실행 테스트
3. 자신의 도메인에 맞게 온톨로지 수정
4. 새로운 규칙 작성 실습

### 발표자용
1. 피드백 수집 및 정리
2. 추가 질문 문서화
3. 개선 사항 반영
4. 후속 워크샵 기획

---

**Good Luck!** 🎉

세미나 준비에 문제가 있으면 언제든지 문의하세요!
