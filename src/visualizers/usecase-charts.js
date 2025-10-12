/**
 * Use Case Charts Renderer
 * Chart.js를 사용하여 분석 결과를 시각화합니다
 */

import { getStageNameKo, getStageColor } from '../utils/formatters.js';

// Chart.js 글로벌 설정
Chart.defaults.font.family = "'Nanum Gothic', 'Apple SD Gothic Neo', sans-serif";
Chart.defaults.font.size = 12;

/**
 * Use Case 1: 사이클별 소요 시간 차트
 */
window.renderCycleDurationsChart = function(cycleDurations) {
    const ctx = document.getElementById('chart-cycle-durations').getContext('2d');

    const labels = cycleDurations.map(c => `Cycle ${c.cycleNumber}`);
    const totalDurations = cycleDurations.map(c => (c.totalDuration / 60).toFixed(2));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '총 소요시간 (시간)',
                data: totalDurations,
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '사이클별 총 소요 시간',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '시간 (h)'
                    }
                }
            }
        }
    });
};

window.renderCycleDurationsTable = function(cycleDurations) {
    const tbody = document.querySelector('#table-cycle-durations tbody');
    tbody.innerHTML = '';

    cycleDurations.forEach(cycle => {
        const longestStage = cycle.stages.reduce((max, stage) =>
            stage.duration > max.duration ? stage : max
        );

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Cycle ${cycle.cycleNumber}</td>
            <td>${cycle.totalDurationFormatted}</td>
            <td>${getStageNameKo(longestStage.type)} (${longestStage.percentage}%)</td>
        `;
        tbody.appendChild(row);
    });
};

/**
 * Use Case 2: 단계별 평균 소요 시간 차트
 */
window.renderStageAveragesChart = function(stageAverages) {
    const ctx = document.getElementById('chart-stage-averages').getContext('2d');

    const labels = stageAverages.map(s => getStageNameKo(s.stageType));
    const averages = stageAverages.map(s => (s.averageDuration / 60).toFixed(2));
    const colors = stageAverages.map(s => getStageColor(s.stageType));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '평균 소요시간 (시간)',
                data: averages,
                backgroundColor: colors.map(c => c + 'CC'),
                borderColor: colors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: '단계별 평균 소요 시간',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '시간 (h)'
                    }
                }
            }
        }
    });
};

window.renderStageInsights = function(stageAverages) {
    const list = document.getElementById('insights-stage-averages');
    list.innerHTML = '';

    // 가장 긴 단계
    const longest = stageAverages.reduce((max, s) =>
        s.averageDuration > max.averageDuration ? s : max
    );

    // 가장 짧은 단계
    const shortest = stageAverages.reduce((min, s) =>
        s.averageDuration < min.averageDuration ? s : min
    );

    list.innerHTML = `
        <li><strong>가장 긴 단계:</strong> ${getStageNameKo(longest.stageType)} (${longest.averageDurationFormatted})</li>
        <li><strong>가장 짧은 단계:</strong> ${getStageNameKo(shortest.stageType)} (${shortest.averageDurationFormatted})</li>
        <li><strong>병목 구간:</strong> ${getStageNameKo(longest.stageType)} 단계의 최적화가 전체 사이클 시간 단축에 가장 큰 영향을 미칩니다.</li>
    `;
};

/**
 * Use Case 3: 장비 사용 빈도 차트
 */
window.renderEquipmentUsageChart = function(equipmentUsage) {
    const ctx = document.getElementById('chart-equipment-usage').getContext('2d');

    const labels = equipmentUsage.map(e => e.name);
    const usageCounts = equipmentUsage.map(e => e.usageCount);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: '사용 빈도',
                data: usageCounts,
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(26, 188, 156, 0.8)',
                    'rgba(241, 196, 15, 0.8)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '장비 사용 빈도',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'right'
                }
            }
        }
    });
};

window.renderEquipmentList = function(equipmentUsage) {
    const list = document.getElementById('equipment-list');
    list.innerHTML = '<h3>장비 상세 정보</h3>';

    const ul = document.createElement('ul');
    ul.className = 'equipment-detail-list';

    equipmentUsage.forEach(equipment => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${equipment.name}</strong>
            <span>사용 횟수: ${equipment.usageCount}회</span>
            <span class="equipment-stages">사용 단계: ${equipment.usedInStages.map(s => getStageNameKo(s)).join(', ')}</span>
        `;
        ul.appendChild(li);
    });

    list.appendChild(ul);
};

/**
 * Use Case 4: 전진장 분석
 */
window.renderAdvanceLengthStats = function(stats) {
    document.getElementById('stat-avg-advance').textContent = `${stats.average} m`;
    document.getElementById('stat-max-advance').textContent = `${stats.max} m`;
    document.getElementById('stat-min-advance').textContent = `${stats.min} m`;
    document.getElementById('stat-total-advance').textContent = `${stats.total} m`;
};

window.renderAdvanceLengthChart = function(cycles) {
    const ctx = document.getElementById('chart-advance-length').getContext('2d');

    const labels = cycles.map(c => `Cycle ${c.cycleNumber}`);
    const advanceLengths = cycles.map(c => c.advanceLength);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '전진장 (m)',
                data: advanceLengths,
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '사이클별 전진장',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '전진장 (m)'
                    }
                }
            }
        }
    });
};

/**
 * Use Case 5: 효율성 지표 차트
 */
window.renderEfficiencyChart = function(efficiency) {
    const ctx = document.getElementById('chart-efficiency').getContext('2d');

    const labels = efficiency.map(e => `Cycle ${e.cycleNumber}`);
    const efficiencyValues = efficiency.map(e => parseFloat(e.efficiency));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '효율성 (m/h)',
                data: efficiencyValues,
                backgroundColor: 'rgba(241, 196, 15, 0.8)',
                borderColor: 'rgba(241, 196, 15, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '사이클별 굴착 효율성',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '효율성 (m/h)'
                    }
                }
            }
        }
    });
};

window.renderEfficiencyTable = function(efficiency) {
    const tbody = document.querySelector('#table-efficiency tbody');
    tbody.innerHTML = '';

    efficiency.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Cycle ${item.cycleNumber}</td>
            <td>${item.advanceLength}</td>
            <td>${item.totalHours}</td>
            <td><strong>${item.efficiency}</strong></td>
        `;
        tbody.appendChild(row);
    });
};

/**
 * Use Case 6: 지보재 설치 통계
 */
window.renderSupportMembersChart = function(supportInstallation) {
    const ctx = document.getElementById('chart-support-members').getContext('2d');

    const labels = supportInstallation.map(s => `Cycle ${s.cycleNumber}`);
    const supportCounts = supportInstallation.map(s => s.supportCount);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '지보재 수량',
                data: supportCounts,
                backgroundColor: 'rgba(46, 204, 113, 0.8)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '사이클별 지보재 설치 수량',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '수량'
                    }
                }
            }
        }
    });
};

window.renderSupportDetails = function(supportInstallation) {
    const details = document.getElementById('support-details');
    details.innerHTML = '<h3>사이클별 지보재 상세</h3>';

    supportInstallation.forEach(cycle => {
        const cycleDiv = document.createElement('div');
        cycleDiv.className = 'support-cycle-detail';

        const types = {};
        cycle.supportMembers.forEach(member => {
            types[member.type] = (types[member.type] || 0) + 1;
        });

        const typesList = Object.entries(types)
            .map(([type, count]) => `${type}: ${count}개`)
            .join(', ');

        cycleDiv.innerHTML = `
            <strong>Cycle ${cycle.cycleNumber}:</strong> ${typesList || '없음'}
        `;
        details.appendChild(cycleDiv);
    });
};

/**
 * Use Case 7: 천공 구멍 분석
 */
window.renderDrillHolesChart = function(drillHoles) {
    const ctx = document.getElementById('chart-drill-holes').getContext('2d');

    const labels = drillHoles.map(d => `Cycle ${d.cycleNumber}`);
    const cutHoles = drillHoles.map(d => d.drillHoles.CutHole);
    const perimeterHoles = drillHoles.map(d => d.drillHoles.PerimeterHole);
    const helperHoles = drillHoles.map(d => d.drillHoles.HelperHole);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '심빼기공',
                    data: cutHoles,
                    backgroundColor: 'rgba(231, 76, 60, 0.8)'
                },
                {
                    label: '주변공',
                    data: perimeterHoles,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)'
                },
                {
                    label: '보조공',
                    data: helperHoles,
                    backgroundColor: 'rgba(241, 196, 15, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '사이클별 천공 구멍 수량',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '구멍 수량'
                    }
                }
            }
        }
    });
};

window.renderDrillHoleDetails = function(drillHoles) {
    const details = document.getElementById('drillhole-details');
    details.innerHTML = '<h3>사이클별 천공 구멍 상세</h3>';

    drillHoles.forEach(cycle => {
        const cycleDiv = document.createElement('div');
        cycleDiv.className = 'drillhole-cycle-detail';

        cycleDiv.innerHTML = `
            <strong>Cycle ${cycle.cycleNumber}:</strong>
            심빼기공 ${cycle.drillHoles.CutHole}개,
            주변공 ${cycle.drillHoles.PerimeterHole}개,
            보조공 ${cycle.drillHoles.HelperHole}개
            (총 ${cycle.drillHoles.total}개)
        `;
        details.appendChild(cycleDiv);
    });
};
