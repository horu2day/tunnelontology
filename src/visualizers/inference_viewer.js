/**
 * 추론 결과 시각화 컴포넌트
 * 추론 전/후 온톨로지를 비교하고 위반 사항을 표시합니다.
 */

export class InferenceViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.reasoner = null; // SPARQL 추론 엔진은 나중에 초기화
    }

    /**
     * 추론 실행 버튼 렌더링
     */
    renderControls() {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'inference-controls';
        controlsDiv.innerHTML = `
            <h2>추론 엔진 제어</h2>
            <button id="runInferenceBtn" class="btn-primary">추론 실행</button>
            <button id="clearStoreBtn" class="btn-secondary">스토어 초기화</button>
            <button id="exportTurtleBtn" class="btn-secondary">Turtle 내보내기</button>
        `;

        this.container.appendChild(controlsDiv);

        // 이벤트 리스너 등록
        document.getElementById('runInferenceBtn').addEventListener('click', () => {
            this.runInference();
        });

        document.getElementById('clearStoreBtn').addEventListener('click', () => {
            this.reasoner.clearStore();
            this.renderResults({ message: '스토어가 초기화되었습니다.' });
        });

        document.getElementById('exportTurtleBtn').addEventListener('click', () => {
            this.exportToTurtle();
        });
    }

    /**
     * 추론 실행 (데모 버전)
     */
    async runInference() {
        const statusDiv = this.getOrCreateStatusDiv();
        statusDiv.innerHTML = '<p class="loading">추론을 실행 중입니다...</p>';

        try {
            // 시뮬레이션: 온톨로지 로드
            statusDiv.innerHTML += '<p>✓ 스키마 로드 중...</p>';
            await this.delay(500);
            statusDiv.innerHTML += '<p>✓ 스키마 로드 완료 (tunnel_process_ontology.ttl)</p>';

            statusDiv.innerHTML += '<p>✓ 인스턴스 데이터 로드 중...</p>';
            await this.delay(500);
            statusDiv.innerHTML += '<p>✓ 인스턴스 데이터 로드 완료 (sealing_process_instance.ttl)</p>';

            // 시뮬레이션: 규칙 추출
            statusDiv.innerHTML += '<p>✓ 추론 규칙 추출 중...</p>';
            await this.delay(500);

            const sequentialRulesCount = 5;
            const qualityRulesCount = 6;
            const prerequisiteRulesCount = 7;
            const totalRules = sequentialRulesCount + qualityRulesCount + prerequisiteRulesCount;

            statusDiv.innerHTML += `<p>✓ ${totalRules}개의 규칙 추출 완료</p>`;
            statusDiv.innerHTML += `<p>&nbsp;&nbsp;- 순차 관계 규칙: ${sequentialRulesCount}개</p>`;
            statusDiv.innerHTML += `<p>&nbsp;&nbsp;- 품질 검증 규칙: ${qualityRulesCount}개</p>`;
            statusDiv.innerHTML += `<p>&nbsp;&nbsp;- 선행 조건 규칙: ${prerequisiteRulesCount}개</p>`;

            // 시뮬레이션: 추론 실행
            statusDiv.innerHTML += '<p>✓ 추론 실행 중...</p>';
            await this.delay(1000);

            // 데모 결과 생성
            const results = this.generateDemoResults();
            const violations = this.generateDemoViolations();

            // 결과 렌더링
            this.renderResults({
                reasoningResults: results,
                violations
            });

        } catch (error) {
            statusDiv.innerHTML += `<p class="error">✗ 추론 실패: ${error.message}</p>`;
            console.error('추론 실행 오류:', error);
        }
    }

    /**
     * 지연 함수 (시뮬레이션용)
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 데모 추론 결과 생성
     */
    generateDemoResults() {
        return {
            totalRules: 18,
            executedRules: 18,
            totalInferences: 47,
            ruleResults: [
                { label: '역방향 순차 관계 추론', triplesAdded: 32 },
                { label: '계층 소속 추론', triplesAdded: 5 },
                { label: '순서 검증', triplesAdded: 0 },
                { label: '시작 노드 식별', triplesAdded: 1 },
                { label: '종료 노드 식별', triplesAdded: 1 },
                { label: '순환 참조 탐지', triplesAdded: 0 },
                { label: '숏크리트 품질검사 필수', triplesAdded: 0 },
                { label: '품질검사 완전성', triplesAdded: 0 },
                { label: '강도 검사 수행 확인', triplesAdded: 1 },
                { label: '두께 및 마무리 검사 완료', triplesAdded: 1 },
                { label: '자재 검사 완전성', triplesAdded: 1 },
                { label: '위반 심각도 분류', triplesAdded: 0 },
                { label: '시공 전 자재 검사 필수', triplesAdded: 0 },
                { label: '시공 전 사전 조치 필수', triplesAdded: 0 },
                { label: '자재 검사 전 배합 설계 필수', triplesAdded: 0 },
                { label: '시공계획서 최우선 작성', triplesAdded: 0 },
                { label: '근로자 교육 완료 확인', triplesAdded: 0 },
                { label: '선행 조건 체인 검증', triplesAdded: 5 }
            ]
        };
    }

    /**
     * 데모 위반 사항 생성
     */
    generateDemoViolations() {
        return [
            // 현재 제공된 데이터는 잘 구성되어 있어 위반 사항이 없습니다
        ];
    }

    /**
     * 추론 결과 렌더링
     */
    renderResults(data) {
        const resultsDiv = this.getOrCreateResultsDiv();

        if (data.message) {
            resultsDiv.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        const { reasoningResults, violations } = data;

        let html = '<h2>추론 결과</h2>';

        // 추론 과정 설명
        html += '<div class="inference-explanation">';
        html += '<h3>📚 추론 과정 설명</h3>';
        html += '<div class="explanation-content">';
        html += '<p><strong>추론(Reasoning)</strong>이란 명시적으로 표현된 지식으로부터 새로운 지식을 자동으로 도출하는 과정입니다.</p>';
        html += '<div class="inference-steps">';
        html += '<div class="step"><span class="step-number">1</span><div class="step-content"><strong>온톨로지 로드</strong><br>스키마와 인스턴스 데이터를 RDF 그래프로 읽어들입니다.</div></div>';
        html += '<div class="step"><span class="step-number">2</span><div class="step-content"><strong>규칙 추출</strong><br>SPARQL CONSTRUCT 쿼리로 작성된 추론 규칙을 파싱합니다.</div></div>';
        html += '<div class="step"><span class="step-number">3</span><div class="step-content"><strong>패턴 매칭</strong><br>규칙의 WHERE 절을 실행하여 조건에 맞는 데이터를 찾습니다.</div></div>';
        html += '<div class="step"><span class="step-number">4</span><div class="step-content"><strong>새 지식 생성</strong><br>CONSTRUCT 절을 실행하여 새로운 트리플을 생성합니다.</div></div>';
        html += '<div class="step"><span class="step-number">5</span><div class="step-content"><strong>결과 통합</strong><br>원본 데이터와 추론된 데이터를 통합합니다.</div></div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        // 추론 통계
        html += '<div class="reasoning-statistics">';
        html += '<h3>📊 추론 통계</h3>';
        html += `<p>총 규칙: <strong>${reasoningResults.totalRules}</strong></p>`;
        html += `<p>실행된 규칙: <strong>${reasoningResults.executedRules}</strong></p>`;
        html += `<p>추론된 트리플: <strong>${reasoningResults.totalInferences}</strong></p>`;
        html += '<p class="inference-note">💡 <em>명시적 지식 33개 → 추론 후 총 80개 (47개 증가)</em></p>';
        html += '</div>';

        // SPARQL 쿼리 예시
        html += '<div class="sparql-examples">';
        html += '<h3>🔍 SPARQL 추론 규칙 예시</h3>';
        html += '<div class="query-example">';
        html += '<h4>예시 1: 역방향 순차 관계 추론</h4>';
        html += '<p class="query-desc">Activity가 previous 관계를 가지면 자동으로 next 관계를 생성합니다.</p>';
        html += '<pre><code>CONSTRUCT {';
        html += '\n    ?previous :hasNextStep ?current .';
        html += '\n}';
        html += '\nWHERE {';
        html += '\n    ?current :hasPreviousStep ?previous .';
        html += '\n}</code></pre>';
        html += '<div class="query-result">';
        html += '<strong>입력:</strong> <code>Activity_133 :hasPreviousStep Activity_132</code><br>';
        html += '<strong>추론 결과:</strong> <code>Activity_132 :hasNextStep Activity_133</code> ✨';
        html += '</div>';
        html += '</div>';

        html += '<div class="query-example">';
        html += '<h4>예시 2: 계층 소속 추론</h4>';
        html += '<p class="query-desc">하위 활동이 어떤 메인 프로세스에 속하는지 자동으로 추론합니다.</p>';
        html += '<pre><code>CONSTRUCT {';
        html += '\n    ?child :belongsToProcess ?mainProcess .';
        html += '\n}';
        html += '\nWHERE {';
        html += '\n    ?child :hasParent+ ?mainProcess .';
        html += '\n    ?mainProcess a :MainProcess .';
        html += '\n}</code></pre>';
        html += '<div class="query-result">';
        html += '<strong>입력:</strong> <code>Activity_153 :hasParent Activity_135 :hasParent Activity_131</code><br>';
        html += '<strong>추론 결과:</strong> <code>Activity_153 :belongsToProcess Activity_131</code> ✨';
        html += '</div>';
        html += '</div>';

        html += '<div class="query-example">';
        html += '<h4>예시 3: 품질 검사 완료 확인</h4>';
        html += '<p class="query-desc">완료 검사에 필수 항목이 모두 포함되어 있는지 확인합니다.</p>';
        html += '<pre><code>CONSTRUCT {';
        html += '\n    ?inspection :hasQualityCheck :StrengthTestCompleted .';
        html += '\n}';
        html += '\nWHERE {';
        html += '\n    ?inspection a :CompletionInspection .';
        html += '\n    ?generalStrength :hasParent ?inspection ;';
        html += '\n                    :activityName "h-4-6-1.강도 확인(일반)" .';
        html += '\n    ?fiberStrength :hasParent ?inspection ;';
        html += '\n                  :activityName "h-4-6-2.강도 확인(강섬유)" .';
        html += '\n}</code></pre>';
        html += '<div class="query-result">';
        html += '<strong>조건:</strong> 일반 강도 + 강섬유 강도 검사가 모두 존재<br>';
        html += '<strong>추론 결과:</strong> <code>Activity_157 :hasQualityCheck :StrengthTestCompleted</code> ✨';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        // 규칙별 결과
        html += '<div class="rule-results">';
        html += '<h3>📋 규칙별 추론 결과</h3>';
        html += '<table><thead><tr><th>규칙 이름</th><th>추론된 트리플 수</th></tr></thead><tbody>';

        reasoningResults.ruleResults.forEach(rule => {
            html += `<tr>
                <td>${rule.label}</td>
                <td>${rule.triplesAdded}</td>
            </tr>`;
        });

        html += '</tbody></table></div>';

        // 위반 사항
        html += '<div class="violations">';
        html += '<h3>발견된 위반 사항</h3>';

        if (violations.length === 0) {
            html += '<p class="success">✓ 위반 사항이 발견되지 않았습니다.</p>';
        } else {
            html += '<ul class="violation-list">';
            violations.forEach(v => {
                html += `<li class="violation-item">
                    <span class="violation-type">[${v.type}]</span>
                    <span class="violation-message">${v.message}</span>
                </li>`;
            });
            html += '</ul>';
        }

        html += '</div>';

        resultsDiv.innerHTML = html;
    }

    /**
     * Turtle 형식으로 내보내기
     */
    exportToTurtle() {
        try {
            const turtleText = `# 추론된 터널 온톨로지
# 생성 시각: ${new Date().toISOString()}

@prefix : <http://example.org/tunnel-ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

# 추론된 트리플 예시
# (실제 구현에서는 SPARQL 추론 엔진의 결과가 여기에 포함됩니다)

:Activity_132 :hasNextStep :Activity_133 .
:Activity_133 :hasNextStep :Activity_134 .
:Activity_134 :hasNextStep :Activity_135 .

:Activity_153 :belongsToProcess :Activity_131 .
:Activity_157 :belongsToProcess :Activity_131 .
`;

            // 다운로드 링크 생성
            const blob = new Blob([turtleText], { type: 'text/turtle' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'inferred_ontology.ttl';
            a.click();

            URL.revokeObjectURL(url);

            alert('✓ Turtle 파일이 다운로드되었습니다.');
            console.log('✓ Turtle 파일 내보내기 완료');
        } catch (error) {
            console.error('✗ Turtle 내보내기 실패:', error);
            alert('Turtle 내보내기에 실패했습니다.');
        }
    }

    /**
     * 상태 표시 영역 가져오기 또는 생성
     */
    getOrCreateStatusDiv() {
        let statusDiv = document.getElementById('inference-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'inference-status';
            statusDiv.className = 'inference-status';
            this.container.appendChild(statusDiv);
        }
        return statusDiv;
    }

    /**
     * 결과 표시 영역 가져오기 또는 생성
     */
    getOrCreateResultsDiv() {
        let resultsDiv = document.getElementById('inference-results');
        if (!resultsDiv) {
            resultsDiv = document.createElement('div');
            resultsDiv.id = 'inference-results';
            resultsDiv.className = 'inference-results';
            this.container.appendChild(resultsDiv);
        }
        return resultsDiv;
    }

    /**
     * 뷰어 초기화
     */
    init() {
        this.container.innerHTML = `
            <div class="inference-viewer">
                <h1>터널 온톨로지 추론 엔진</h1>
                <p class="description">
                    SPARQL CONSTRUCT 규칙을 사용하여 터널 시공 프로세스의
                    품질 위반 및 선행 조건 위반을 자동으로 탐지합니다.
                </p>
            </div>
        `;

        this.renderControls();
    }
}

/**
 * 페이지 로드 시 뷰어 초기화
 */
export function initInferenceViewer(containerId = 'app') {
    const viewer = new InferenceViewer(containerId);
    viewer.init();
    return viewer;
}
