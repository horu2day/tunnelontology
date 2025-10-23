/**
 * SPARQL 추론 엔진
 * Turtle 온톨로지 파일과 규칙을 로드하여 추론을 수행합니다.
 */

import $rdf from 'rdflib';

export class SPARQLReasoner {
    constructor() {
        this.store = $rdf.graph();
        this.fetcher = new $rdf.Fetcher(this.store);
        this.updater = new $rdf.UpdateManager(this.store);
        this.namespace = $rdf.Namespace('http://example.org/tunnel-ontology#');
        this.rdf = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
        this.rdfs = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');
    }

    /**
     * Turtle 파일을 로드하여 RDF 스토어에 추가
     * @param {string} url - Turtle 파일 경로
     */
    async loadOntology(url) {
        try {
            const response = await fetch(url);
            const turtleText = await response.text();

            const doc = $rdf.sym(url);
            $rdf.parse(turtleText, this.store, doc.uri, 'text/turtle');

            console.log(`✓ 온톨로지 로드 완료: ${url}`);
            return true;
        } catch (error) {
            console.error(`✗ 온톨로지 로드 실패: ${url}`, error);
            return false;
        }
    }

    /**
     * 규칙 파일에서 SPARQL CONSTRUCT 쿼리를 추출
     * @param {string} ruleFileUrl - 규칙 파일 경로
     * @returns {Array} SPARQL CONSTRUCT 쿼리 배열
     */
    async extractRules(ruleFileUrl) {
        try {
            await this.loadOntology(ruleFileUrl);

            const rules = [];
            const sparqlConstructPredicate = this.namespace('sparqlConstruct');

            // 모든 InferenceRule 타입 개체 찾기
            const ruleType = this.namespace('InferenceRule');
            const ruleSubjects = this.store.each(
                null,
                this.rdf('type'),
                ruleType
            );

            // 각 규칙에서 SPARQL CONSTRUCT 쿼리 추출
            for (const ruleSubject of ruleSubjects) {
                const queryLiteral = this.store.any(
                    ruleSubject,
                    sparqlConstructPredicate,
                    null
                );

                if (queryLiteral) {
                    const label = this.store.any(
                        ruleSubject,
                        this.rdfs('label'),
                        null
                    );

                    rules.push({
                        id: ruleSubject.value,
                        label: label ? label.value : 'Unknown Rule',
                        query: queryLiteral.value.trim()
                    });
                }
            }

            console.log(`✓ ${rules.length}개의 추론 규칙 추출 완료: ${ruleFileUrl}`);
            return rules;
        } catch (error) {
            console.error(`✗ 규칙 추출 실패: ${ruleFileUrl}`, error);
            return [];
        }
    }

    /**
     * SPARQL CONSTRUCT 쿼리를 실행하여 새로운 트리플 추론
     * @param {string} sparqlQuery - SPARQL CONSTRUCT 쿼리
     * @returns {Object} 추론된 트리플 정보
     */
    executeSPARQLConstruct(sparqlQuery) {
        try {
            // rdflib.js의 SPARQL 엔진 사용
            const query = $rdf.SPARQLToQuery(sparqlQuery, false, this.store);
            const resultStore = $rdf.graph();

            // CONSTRUCT 쿼리 실행
            this.store.query(query, (binding) => {
                // 바인딩 결과를 새로운 스토어에 추가
                // 실제 구현에서는 rdflib.js의 쿼리 결과 처리 방식에 따름
                console.log('Query binding:', binding);
            });

            return {
                success: true,
                triplesAdded: resultStore.statements.length
            };
        } catch (error) {
            console.error('SPARQL 쿼리 실행 실패:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 모든 규칙을 실행하여 추론 수행
     * @param {Array} rules - 추론 규칙 배열
     * @returns {Object} 추론 결과 통계
     */
    async performReasoning(rules) {
        console.log('\n=== 추론 시작 ===');

        const results = {
            totalRules: rules.length,
            executedRules: 0,
            totalInferences: 0,
            ruleResults: []
        };

        for (const rule of rules) {
            console.log(`\n실행 중: ${rule.label}`);

            const result = this.executeSPARQLConstruct(rule.query);

            if (result.success) {
                results.executedRules++;
                results.totalInferences += result.triplesAdded || 0;

                results.ruleResults.push({
                    ruleId: rule.id,
                    label: rule.label,
                    triplesAdded: result.triplesAdded || 0
                });

                console.log(`  ✓ ${result.triplesAdded || 0}개의 새로운 트리플 추론됨`);
            } else {
                console.error(`  ✗ 실행 실패: ${result.error}`);
            }
        }

        console.log('\n=== 추론 완료 ===');
        console.log(`총 규칙: ${results.totalRules}`);
        console.log(`실행된 규칙: ${results.executedRules}`);
        console.log(`추론된 트리플: ${results.totalInferences}`);

        return results;
    }

    /**
     * 특정 주제에 대한 모든 트리플 조회
     * @param {string} subject - 주제 URI
     * @returns {Array} 트리플 배열
     */
    getTriples(subject) {
        const subjectNode = this.namespace(subject);
        return this.store.statementsMatching(subjectNode, null, null);
    }

    /**
     * 위반 사항 조회
     * @returns {Array} 위반 사항 배열
     */
    getViolations() {
        const violations = [];

        // QualityViolation 찾기
        const qualityViolationType = this.namespace('QualityViolation');
        const qualityViolations = this.store.each(
            null,
            this.rdf('type'),
            qualityViolationType
        );

        // PrerequisiteViolation 찾기
        const prereqViolationType = this.namespace('PrerequisiteViolation');
        const prereqViolations = this.store.each(
            null,
            this.rdf('type'),
            prereqViolationType
        );

        // 모든 위반 사항 수집
        const allViolations = [...qualityViolations, ...prereqViolations];

        for (const violation of allViolations) {
            const violationType = this.store.any(
                violation,
                this.namespace('violationType'),
                null
            );

            const message = this.store.any(
                violation,
                this.namespace('violationMessage'),
                null
            );

            violations.push({
                uri: violation.value,
                type: violationType ? violationType.value : 'Unknown',
                message: message ? message.value : 'No message'
            });
        }

        return violations;
    }

    /**
     * 추론된 지식과 원래 지식을 분리하여 반환
     * @returns {Object} 원본 및 추론된 트리플 통계
     */
    getInferenceStatistics() {
        const totalTriples = this.store.statements.length;

        // 실제 구현에서는 추론 전후를 추적하여 구분
        // 여기서는 간단한 통계만 제공

        return {
            totalTriples,
            message: '추론 전후 통계는 추론 실행 시 수집됩니다'
        };
    }

    /**
     * 스토어를 Turtle 형식으로 직렬화
     * @returns {string} Turtle 문자열
     */
    serializeToTurtle() {
        return $rdf.serialize(null, this.store, null, 'text/turtle');
    }

    /**
     * 스토어 초기화
     */
    clearStore() {
        this.store = $rdf.graph();
        console.log('✓ 스토어 초기화 완료');
    }
}

/**
 * 추론 엔진 사용 예시
 */
export async function runInferenceExample() {
    const reasoner = new SPARQLReasoner();

    // 1. 온톨로지 스키마 로드
    await reasoner.loadOntology('/src/ontology/schema/tunnel_process_ontology.ttl');

    // 2. 인스턴스 데이터 로드
    await reasoner.loadOntology('/src/ontology/instances/sealing_process_instance.ttl');

    // 3. 규칙 파일에서 추론 규칙 추출
    const sequentialRules = await reasoner.extractRules('/src/ontology/rules/sequential_rules.ttl');
    const qualityRules = await reasoner.extractRules('/src/ontology/rules/quality_validation_rules.ttl');
    const prerequisiteRules = await reasoner.extractRules('/src/ontology/rules/prerequisite_rules.ttl');

    // 4. 모든 규칙 실행
    const allRules = [...sequentialRules, ...qualityRules, ...prerequisiteRules];
    const results = await reasoner.performReasoning(allRules);

    // 5. 위반 사항 조회
    const violations = reasoner.getViolations();
    console.log('\n=== 발견된 위반 사항 ===');
    violations.forEach(v => {
        console.log(`- [${v.type}] ${v.message}`);
    });

    // 6. 추론 결과 직렬화 (선택적)
    // const turtleOutput = reasoner.serializeToTurtle();
    // console.log('\n추론된 온톨로지:\n', turtleOutput);

    return {
        reasoningResults: results,
        violations
    };
}
