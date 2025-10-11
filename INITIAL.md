## FEATURE

a. 아래 터널 막장 굴착 프로세스 반복에 대해 온톨로지를 구축

터널 막장 굴착은 일반적으로 '천공-장약-발파-환기-버력처리-지보재 설치'의 반복적인 순서로 진행됩니다. 터널의 지질, 규모, 공법에 따라 굴착 방법과 순서에 차이가 있을 수 있습니다. 여기서는 대표적인 NATM(New Austrian Tunneling Method) 공법의 막장 굴착 프로세스를 기준으로 설명합니다.

1. **천공 (Drilling)**
   굴착 예정 막장면에 발파 계획에 따라 천공기를 이용해 여러 개의 구멍을 뚫습니다.
   - 심빼기공: 터널 중심부의 암석을 먼저 파쇄하기 위한 구멍으로, 발파 시 자유면을 만들어 발파 효율을 높입니다.
   - 주변공: 터널의 최종 단면을 형성하기 위해 외곽에 뚫는 구멍입니다.
   - 보조공: 주변공과 심빼기공 사이에 뚫어 폭약의 효과가 터널 전면에 고르게 미치도록 하는 구멍입니다.
   - 시험 시추: 굴착 전에 막장면 전방의 지반 상태를 미리 파악하기 위해 시추조사를 시행하기도 합니다.
2. **장약 (Charging)**
   천공된 구멍에 정해진 순서와 양에 따라 폭약을 넣고, 발파를 유도하는 뇌관을 설치하는 과정입니다. 폭약은 주변 지반에 미치는 영향을 최소화하도록 종류와 양, 장약 방법 등을 신중하게 결정합니다.
3. **발파 (Blasting)**
   장약이 완료되면 모든 인원과 장비가 안전지대로 대피한 후 발파 작업을 실시합니다. 발파는 보통 심빼기공부터 순차적으로 터지도록 하여 효과적인 암반 파쇄가 이루어지도록 합니다.
4. **환기 (Ventilation)**
   발파 후 발생하는 유해가스와 분진을 외부로 배출하여 작업 환경을 확보하는 과정입니다.
5. **버력처리 (Mucking)**
   환기 후 굴착된 암석 조각(버력)을 로더 등의 장비를 이용해 밖으로 운반하는 작업입니다. 버력의 운반은 컨베이어벨트나 덤프트럭 등을 이용할 수 있습니다.
6. **막장관찰 및 지보재 설치 (Face Mapping & Support)**
   버력처리가 끝나면 노출된 막장면의 지질 상태를 관찰하고 기록합니다(페이스 매핑). 관찰 결과에 따라 붕괴 방지를 위해 숏크리트를 분사하고, 락볼트를 설치하는 등 지보재를 시공합니다.
   - 숏크리트(Shotcrete): 굴착면의 표면을 보강하고, 풍화를 방지하며, 지반 이완을 억제하는 역할을 합니다.
   - 락볼트(Rock bolt): 천공 후 강봉을 삽입하여 암반을 고정함으로써 터널의 안정성을 높입니다.
   - 강지보재(Lattice Girder): 필요한 경우 격자형의 강재를 설치하여 터널 단면을 보강합니다.

위의 굴착 및 지보재 설치 과정이 한 사이클(cycle)을 이루며, 이를 반복하여 터널을 전진시킵니다.

b. 모델링 결과를 디스플레이해서 설명할 수 있는 웹 사이트를 만들어라.
c. 터널 막장 굴착 반복 프로세스를 또한 디스플레이 할 수있는 웹사이트도 만들어라.

---

## EXAMPLES

온톨로지 모델링 언어(OWL/RDF in Turtle)를 사용하여 터널링 프로세스를 표현한 샘플 코드입니다. 스키마 정의, 실제 데이터 인스턴스, 그리고 동적 행위를 나타내는 액션 기록으로 구성됩니다.

아주 쉬운 "피자 만들기" 예제를 examples 폴더 하위에 넣어 놓았다.
또 아래와 같이 tunneling에 대한 샘플도 있다.

#### `examples/schema/tunneling_ontology.ttl`

```turtle
# Ontology Schema Definition
# 이 파일은 터널링 온톨로지의 청사진(클래스, 속성, 관계)을 정의합니다.

@prefix : <http://example.org/tunneling-ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# --- Classes (Object Types) ---
:TunnelingCycle rdf:type owl:Class ; rdfs:label "Tunneling Cycle" .
:ProcessStage rdf:type owl:Class ; rdfs:label "Process Stage" .
:Drilling rdf:type owl:Class ; rdfs:subClassOf :ProcessStage .
:Charging rdf:type owl:Class ; rdfs:subClassOf :ProcessStage .
:Blasting rdf:type owl:Class ; rdfs:subClassOf :ProcessStage .
:Ventilation rdf:type owl:Class ; rdfs:subClassOf :ProcessStage .
:Mucking rdf:type owl:Class ; rdfs:subClassOf :ProcessStage .
:SupportInstallation rdf:type owl:Class ; rdfs:subClassOf :ProcessStage .

:DrillHole rdf:type owl:Class .
:Explosive rdf:type owl:Class .
:SupportMember rdf:type owl:Class .
:Shotcrete rdf:type owl:Class ; rdfs:subClassOf :SupportMember .
:RockBolt rdf:type owl:Class ; rdfs:subClassOf :SupportMember .
:Equipment rdf:type owl:Class .
:DrillingMachine rdf:type owl:Class ; rdfs:subClassOf :Equipment .

# --- Datatype Properties ---
:cycleNumber rdf:type owl:DatatypeProperty ; rdfs:domain :TunnelingCycle ; rdfs:range xsd:integer .
:advanceLength rdf:type owl:DatatypeProperty ; rdfs:domain :TunnelingCycle ; rdfs:range xsd:decimal . # 굴진장 (m)
:startTime rdf:type owl:DatatypeProperty ; rdfs:domain :ProcessStage ; rdfs:range xsd:dateTime .
:holeType rdf:type owl:DatatypeProperty ; rdfs:domain :DrillHole ; rdfs:range xsd:string . # 예: "심빼기공", "주변공"
:shotcreteThickness rdf:type owl:DatatypeProperty ; rdfs:domain :Shotcrete ; rdfs:range xsd:decimal . # 단위: mm

# --- Object Properties (Link Types) ---
:hasStage rdf:type owl:ObjectProperty ; rdfs:domain :TunnelingCycle ; rdfs:range :ProcessStage .
:createsHole rdf:type owl:ObjectProperty ; rdfs:domain :Drilling ; rdfs:range :DrillHole .
:isChargedWith rdf:type owl:ObjectProperty ; rdfs:domain :DrillHole ; rdfs:range :Explosive .
:installsSupport rdf:type owl:ObjectProperty ; rdfs:domain :SupportInstallation ; rdfs:range :SupportMember .
:usesEquipment rdf:type owl:ObjectProperty ; rdfs:domain :ProcessStage ; rdfs:range :Equipment .
```

#### `examples/instances/cycle_001_data.ttl`

```turtle
# Instance Data for a Single Cycle
# 이 파일은 스키마를 기반으로 실제 1번 사이클의 데이터를 표현합니다.

@prefix : <http://example.org/tunneling-ontology#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# --- Tunneling Cycle 1 ---
:cycle001 rdf:type :TunnelingCycle ;
    :cycleNumber 1 ;
    :advanceLength "1.2"^^xsd:decimal ;
    :hasStage :drilling_c001, :support_c001 .

# --- Stages in Cycle 1 ---
:drilling_c001 rdf:type :Drilling ;
    :startTime "2025-10-11T08:00:00Z"^^xsd:dateTime ;
    :usesEquipment :drillMachine_J-01 ;
    :createsHole :hole_c001_v01, :hole_c001_p01 .

:support_c001 rdf:type :SupportInstallation ;
    :startTime "2025-10-11T14:00:00Z"^^xsd:dateTime ;
    :installsSupport :shotcrete_c001, :rockbolt_c001_1 .

# --- Objects created/used in Cycle 1 ---
:drillMachine_J-01 rdf:type :DrillingMachine .

:hole_c001_v01 rdf:type :DrillHole ;
    :holeType "심빼기공" .

:hole_c001_p01 rdf:type :DrillHole ;
    :holeType "주변공" .

:shotcrete_c001 rdf:type :Shotcrete ;
    :shotcreteThickness "150.0"^^xsd:decimal .

:rockbolt_c001_1 rdf:type :RockBolt .
```

---

## DOCUMENTATION

사내 온톨로지 모델링 가이드라인
[examples\ontology101.pdf]
사내 표준 명명 규칙(naming convention), 클래스 및 속성 설계 원칙, 베스트 프랙티스를 따르기 위해 필수적인 문서입니다.
W3C OWL 2 Web Ontology Language - Document Overview (Second Edition)
[https://www.w3.org/TR/owl2-overview/]
온톨로지 모델링의 기술적 기반이 되는 OWL2 표준 명세서입니다. SubClassOf, DatatypeProperty, ObjectProperty 등의 개념을 정확히 이해하기 위해 필요합니다

---

## OTHER CONSIDERATIONS

구현에 직접적으로 필요하지는 않지만, 더 나은 설계를 위해 **참고하면 좋은 문서** 목록입니다.

- **[스마트 팩토리 온톨로지 구축 사례 연구](https://www.google.com/search?q=https://internal.your-company.com/wiki/smart-factory-ontology-case-study)**
  - 유사한 도메인(제조 공정)의 디지털 트윈 온톨로지 구축 프로젝트의 설계 철학과 구현 과정에서 겪었던 시행착오를 참고할 수 있습니다.
- **[Building Information Models and Digital Twins for the Built Environment (학술 논문)](https://www.mdpi.com/2076-3417/11/19/9191)**
  - 건설/토목 분야의 디지털 트윈 및 BIM(Building Information Modeling) 관련 최신 연구 동향과 온톨로지 활용 방안에 대한 아이디어를 얻을 수 있는 외부 자료입니다.
- **[국토교통부 터널 표준시방서 (KCS 11 40 00)](https://www.google.com/search?q=https://www.codil.or.kr/view.do%3Fpart%3D11%26st%3DC%26cd%3D114000)**
  - 온톨로지로 모델링하려는 '터널 굴착' 도메인 자체의 용어, 절차, 안전 규정 등을 정확히 이해하기 위한 공신력 있는 참고 자료입니다.
- **[Palantir Foundry - Ontology Technical Overview](https://www.palantir.com/docs/foundry/ontology/overview/)**
  - '디지털 트윈'으로서의 온톨로지 개념을 상업적으로 성공시킨 제품의 기술 문서를 통해, 우리가 구축하려는 온톨로지의 장기적인 발전 방향과 활용 방안을 벤치마킹할 수 있습니다.
