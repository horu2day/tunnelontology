#!/usr/bin/env python3
"""
Tunnel Ontology Validation Script
이 스크립트는 터널 온톨로지 파일들의 Turtle 구문을 검증하고 기본 SPARQL 쿼리를 실행합니다.
"""

import rdflib
from rdflib import Graph, Namespace, RDF, RDFS, OWL
import sys

# 온톨로지 네임스페이스 정의
TUNNEL = Namespace("http://example.org/tunneling-ontology#")

def main():
    print("=" * 60)
    print("터널 온톨로지 검증 스크립트")
    print("=" * 60)
    print()

    # 1. 그래프 생성
    g = Graph()

    # 2. 스키마 파일 파싱
    print("[1/5] 스키마 파일 파싱 중...")
    try:
        g.parse("src/ontology/tunneling_schema.ttl", format="turtle")
        print("✓ 스키마 파일 파싱 성공")
        print(f"  - 로드된 트리플 수: {len(g)} triples")
    except Exception as e:
        print(f"✗ 스키마 파일 파싱 실패: {e}")
        sys.exit(1)

    # 3. 인스턴스 파일 파싱 (파일이 존재하는 경우)
    print("\n[2/5] 인스턴스 파일 파싱 중...")
    try:
        g.parse("src/ontology/tunnel_instances.ttl", format="turtle")
        print("✓ 인스턴스 파일 파싱 성공")
        print(f"  - 총 트리플 수: {len(g)} triples")
    except FileNotFoundError:
        print("⚠ 인스턴스 파일이 아직 생성되지 않았습니다 (예상된 동작)")
    except Exception as e:
        print(f"✗ 인스턴스 파일 파싱 실패: {e}")
        sys.exit(1)

    # 4. 클래스 개수 확인
    print("\n[3/5] 정의된 클래스 확인 중...")
    query_classes = """
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT (COUNT(DISTINCT ?class) as ?count)
        WHERE {
            ?class rdf:type owl:Class .
        }
    """

    result = list(g.query(query_classes))
    class_count = int(result[0][0])
    print(f"✓ 정의된 클래스 수: {class_count}개")

    # 5. 6개 NATM 단계 클래스 확인
    print("\n[4/5] NATM 6단계 클래스 존재 확인...")
    stages = ['Drilling', 'Charging', 'Blasting', 'Ventilation', 'Mucking', 'SupportInstallation']
    missing_stages = []

    for stage in stages:
        if (TUNNEL[stage], RDF.type, OWL.Class) in g:
            print(f"  ✓ {stage}")
        else:
            print(f"  ✗ {stage} - 누락!")
            missing_stages.append(stage)

    if missing_stages:
        print(f"\n✗ 경고: {len(missing_stages)}개 단계 클래스가 누락되었습니다: {', '.join(missing_stages)}")
        sys.exit(1)
    else:
        print("\n✓ 모든 6개 NATM 단계 클래스가 정의되었습니다")

    # 6. 속성 개수 확인
    print("\n[5/5] 정의된 속성 확인 중...")
    query_properties = """
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT (COUNT(DISTINCT ?prop) as ?count)
        WHERE {
            {?prop rdf:type owl:DatatypeProperty .}
            UNION
            {?prop rdf:type owl:ObjectProperty .}
        }
    """

    result = list(g.query(query_properties))
    prop_count = int(result[0][0])
    print(f"✓ 정의된 속성 수: {prop_count}개")

    # 7. 터널링 사이클 인스턴스 확인 (있는 경우)
    print("\n[추가] 터널링 사이클 인스턴스 확인...")
    query_cycles = """
        PREFIX : <http://example.org/tunneling-ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?cycle ?number
        WHERE {
            ?cycle rdf:type :TunnelingCycle .
            OPTIONAL { ?cycle :cycleNumber ?number . }
        }
        ORDER BY ?number
    """

    cycles = list(g.query(query_cycles))
    if cycles:
        print(f"✓ {len(cycles)}개의 터널링 사이클 발견:")
        for cycle, number in cycles:
            cycle_name = cycle.split('#')[-1] if '#' in str(cycle) else str(cycle)
            if number:
                print(f"  - {cycle_name} (사이클 번호: {number})")
            else:
                print(f"  - {cycle_name}")
    else:
        print("⚠ 터널링 사이클 인스턴스가 아직 없습니다 (예상된 동작)")

    # 최종 요약
    print("\n" + "=" * 60)
    print("검증 완료!")
    print("=" * 60)
    print(f"✓ 총 트리플 수: {len(g)}")
    print(f"✓ 클래스 수: {class_count}")
    print(f"✓ 속성 수: {prop_count}")
    print(f"✓ NATM 6단계 모두 정의됨")
    if cycles:
        print(f"✓ 터널링 사이클: {len(cycles)}개")
    print("\n모든 검증이 성공적으로 완료되었습니다! 🎉")

if __name__ == "__main__":
    main()
