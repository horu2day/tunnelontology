/**
 * Query Utilities for Ontology Data Analysis
 * 온톨로지 데이터를 분석하고 통계를 생성하는 유틸리티
 */

import { queryStore, findInstancesOfClass } from '../parsers/turtle-parser.js';
import { calculateDuration, formatDuration } from './formatters.js';

const TUNNEL_NS = 'http://example.org/tunneling-ontology#';
const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

/**
 * Use Case 1: 사이클별 소요 시간 분석
 * 각 굴착 사이클의 총 소요 시간과 단계별 소요 시간을 계산
 */
export function analyzeCycleDurations(store) {
  const cycles = findInstancesOfClass(store, `${TUNNEL_NS}TunnelingCycle`);
  const results = [];

  cycles.forEach(cycleUri => {
    const cycleNumberQuads = queryStore(store, cycleUri, `${TUNNEL_NS}cycleNumber`, null);
    const cycleNumber = cycleNumberQuads.length > 0 ? cycleNumberQuads[0].object.value : '?';

    const stageQuads = queryStore(store, cycleUri, `${TUNNEL_NS}hasStage`, null);
    let totalDuration = 0;
    const stageDurations = [];

    stageQuads.forEach(stageQuad => {
      const stageUri = stageQuad.object.value;
      const startTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}startTime`, null);
      const endTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}endTime`, null);

      if (startTimeQuads.length > 0 && endTimeQuads.length > 0) {
        const duration = calculateDuration(
          startTimeQuads[0].object.value,
          endTimeQuads[0].object.value
        );
        totalDuration += duration;

        const typeQuads = queryStore(store, stageUri, RDF_TYPE, null);
        const stageType = typeQuads.length > 0
          ? typeQuads[0].object.value.replace(TUNNEL_NS, '')
          : 'Unknown';

        stageDurations.push({
          type: stageType,
          duration: duration,
          percentage: 0 // 계산 후 업데이트
        });
      }
    });

    // 각 단계의 비율 계산
    stageDurations.forEach(stage => {
      stage.percentage = ((stage.duration / totalDuration) * 100).toFixed(1);
    });

    results.push({
      cycleNumber: cycleNumber,
      totalDuration: totalDuration,
      totalDurationFormatted: formatDuration(totalDuration),
      stages: stageDurations
    });
  });

  return results;
}

/**
 * Use Case 2: 장비 사용 빈도 분석
 * 어떤 장비가 얼마나 자주 사용되는지 분석
 */
export function analyzeEquipmentUsage(store) {
  const equipmentUsage = new Map();

  // 모든 usesEquipment 관계 찾기
  const usesEquipmentQuads = store.getQuads(null, `${TUNNEL_NS}usesEquipment`, null);

  usesEquipmentQuads.forEach(quad => {
    const stageUri = quad.subject.value;
    const equipmentUri = quad.object.value;

    // 장비 이름 가져오기
    const labelQuads = queryStore(store, equipmentUri, 'http://www.w3.org/2000/01/rdf-schema#label', null);
    const equipmentName = labelQuads.length > 0
      ? labelQuads[0].object.value
      : equipmentUri.split('#')[1];

    // 단계 타입 가져오기
    const typeQuads = queryStore(store, stageUri, RDF_TYPE, null);
    const stageType = typeQuads.length > 0
      ? typeQuads[0].object.value.replace(TUNNEL_NS, '')
      : 'Unknown';

    if (!equipmentUsage.has(equipmentUri)) {
      equipmentUsage.set(equipmentUri, {
        name: equipmentName,
        uri: equipmentUri,
        usageCount: 0,
        usedInStages: []
      });
    }

    const equipment = equipmentUsage.get(equipmentUri);
    equipment.usageCount++;
    equipment.usedInStages.push(stageType);
  });

  return Array.from(equipmentUsage.values())
    .sort((a, b) => b.usageCount - a.usageCount);
}

/**
 * Use Case 3: 지보재 설치 통계
 * 각 사이클에서 설치된 지보재의 종류와 수량 분석
 */
export function analyzeSupportInstallation(store) {
  const cycles = findInstancesOfClass(store, `${TUNNEL_NS}TunnelingCycle`);
  const results = [];

  cycles.forEach(cycleUri => {
    const cycleNumberQuads = queryStore(store, cycleUri, `${TUNNEL_NS}cycleNumber`, null);
    const cycleNumber = cycleNumberQuads.length > 0 ? cycleNumberQuads[0].object.value : '?';

    // SupportInstallation 단계 찾기
    const stageQuads = queryStore(store, cycleUri, `${TUNNEL_NS}hasStage`, null);
    const supportMembers = [];

    stageQuads.forEach(stageQuad => {
      const stageUri = stageQuad.object.value;
      const typeQuads = queryStore(store, stageUri, RDF_TYPE, null);

      const isSupportStage = typeQuads.some(quad =>
        quad.object.value === `${TUNNEL_NS}SupportInstallation`
      );

      if (isSupportStage) {
        const installsQuads = queryStore(store, stageUri, `${TUNNEL_NS}installsSupport`, null);

        installsQuads.forEach(installQuad => {
          const supportUri = installQuad.object.value;
          const supportTypeQuads = queryStore(store, supportUri, RDF_TYPE, null);

          supportTypeQuads.forEach(typeQuad => {
            const supportType = typeQuad.object.value.replace(TUNNEL_NS, '');
            if (supportType !== 'SupportMember') {
              supportMembers.push({
                type: supportType,
                uri: supportUri
              });
            }
          });
        });
      }
    });

    results.push({
      cycleNumber: cycleNumber,
      supportMembers: supportMembers,
      supportCount: supportMembers.length
    });
  });

  return results;
}

/**
 * Use Case 4: 전진장(Advance Length) 비교
 * 각 사이클의 전진장을 비교하여 효율성 분석
 */
export function analyzeAdvanceLength(store) {
  const cycles = findInstancesOfClass(store, `${TUNNEL_NS}TunnelingCycle`);
  const results = [];

  cycles.forEach(cycleUri => {
    const cycleNumberQuads = queryStore(store, cycleUri, `${TUNNEL_NS}cycleNumber`, null);
    const advanceLengthQuads = queryStore(store, cycleUri, `${TUNNEL_NS}advanceLength`, null);

    if (cycleNumberQuads.length > 0 && advanceLengthQuads.length > 0) {
      results.push({
        cycleNumber: cycleNumberQuads[0].object.value,
        advanceLength: parseFloat(advanceLengthQuads[0].object.value),
        unit: 'm'
      });
    }
  });

  // 통계 계산
  const lengths = results.map(r => r.advanceLength);
  const average = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const max = Math.max(...lengths);
  const min = Math.min(...lengths);

  return {
    cycles: results,
    statistics: {
      average: average.toFixed(2),
      max: max,
      min: min,
      total: lengths.reduce((a, b) => a + b, 0).toFixed(2)
    }
  };
}

/**
 * Use Case 5: 단계별 평균 소요 시간
 * 각 단계(천공, 장약, 발파 등)의 평균 소요 시간 계산
 */
export function analyzeStageAverageDurations(store) {
  const stageDurations = new Map();

  // 모든 ProcessStage 찾기
  const allStages = [
    'Drilling', 'Charging', 'Blasting',
    'Ventilation', 'Mucking', 'SupportInstallation'
  ];

  allStages.forEach(stageType => {
    const stageInstances = findInstancesOfClass(store, `${TUNNEL_NS}${stageType}`);
    const durations = [];

    stageInstances.forEach(stageUri => {
      const startTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}startTime`, null);
      const endTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}endTime`, null);

      if (startTimeQuads.length > 0 && endTimeQuads.length > 0) {
        const duration = calculateDuration(
          startTimeQuads[0].object.value,
          endTimeQuads[0].object.value
        );
        durations.push(duration);
      }
    });

    if (durations.length > 0) {
      const average = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      const min = Math.min(...durations);

      stageDurations.set(stageType, {
        stageType: stageType,
        count: durations.length,
        averageDuration: average,
        averageDurationFormatted: formatDuration(average),
        minDuration: min,
        minDurationFormatted: formatDuration(min),
        maxDuration: max,
        maxDurationFormatted: formatDuration(max)
      });
    }
  });

  return Array.from(stageDurations.values());
}

/**
 * Use Case 6: 천공 구멍 분석
 * 각 사이클에서 뚫린 천공 구멍의 종류와 수량
 */
export function analyzeDrillHoles(store) {
  const cycles = findInstancesOfClass(store, `${TUNNEL_NS}TunnelingCycle`);
  const results = [];

  cycles.forEach(cycleUri => {
    const cycleNumberQuads = queryStore(store, cycleUri, `${TUNNEL_NS}cycleNumber`, null);
    const cycleNumber = cycleNumberQuads.length > 0 ? cycleNumberQuads[0].object.value : '?';

    // Drilling 단계 찾기
    const stageQuads = queryStore(store, cycleUri, `${TUNNEL_NS}hasStage`, null);
    const drillHoles = {
      CutHole: 0,
      PerimeterHole: 0,
      HelperHole: 0,
      total: 0
    };

    stageQuads.forEach(stageQuad => {
      const stageUri = stageQuad.object.value;
      const typeQuads = queryStore(store, stageUri, RDF_TYPE, null);

      const isDrillingStage = typeQuads.some(quad =>
        quad.object.value === `${TUNNEL_NS}Drilling`
      );

      if (isDrillingStage) {
        const createsHoleQuads = queryStore(store, stageUri, `${TUNNEL_NS}createsHole`, null);

        createsHoleQuads.forEach(holeQuad => {
          const holeUri = holeQuad.object.value;
          const holeTypeQuads = queryStore(store, holeUri, RDF_TYPE, null);

          holeTypeQuads.forEach(typeQuad => {
            const holeType = typeQuad.object.value.replace(TUNNEL_NS, '');
            if (drillHoles.hasOwnProperty(holeType)) {
              drillHoles[holeType]++;
              drillHoles.total++;
            }
          });
        });
      }
    });

    results.push({
      cycleNumber: cycleNumber,
      drillHoles: drillHoles
    });
  });

  return results;
}

/**
 * Use Case 7: 효율성 지표 계산
 * 사이클당 전진장/시간 비율 (m/h)
 */
export function calculateEfficiencyMetrics(store) {
  const cycles = findInstancesOfClass(store, `${TUNNEL_NS}TunnelingCycle`);
  const results = [];

  cycles.forEach(cycleUri => {
    const cycleNumberQuads = queryStore(store, cycleUri, `${TUNNEL_NS}cycleNumber`, null);
    const advanceLengthQuads = queryStore(store, cycleUri, `${TUNNEL_NS}advanceLength`, null);
    const stageQuads = queryStore(store, cycleUri, `${TUNNEL_NS}hasStage`, null);

    if (cycleNumberQuads.length === 0 || advanceLengthQuads.length === 0) return;

    let totalDuration = 0;

    stageQuads.forEach(stageQuad => {
      const stageUri = stageQuad.object.value;
      const startTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}startTime`, null);
      const endTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}endTime`, null);

      if (startTimeQuads.length > 0 && endTimeQuads.length > 0) {
        totalDuration += calculateDuration(
          startTimeQuads[0].object.value,
          endTimeQuads[0].object.value
        );
      }
    });

    const advanceLength = parseFloat(advanceLengthQuads[0].object.value);
    const totalHours = totalDuration / 60;
    const efficiency = advanceLength / totalHours;

    results.push({
      cycleNumber: cycleNumberQuads[0].object.value,
      advanceLength: advanceLength,
      totalDuration: totalDuration,
      totalHours: totalHours.toFixed(2),
      efficiency: efficiency.toFixed(3),
      efficiencyUnit: 'm/h'
    });
  });

  return results;
}
