/**
 * Cycle Timeline Visualization
 * Vis.js Timeline을 사용하여 터널 굴착 사이클의 시간 흐름을 시각화합니다
 */

// Vis.js는 CDN에서 로드됨
const vis = window.vis;

import { getLabel, findInstancesOfClass, queryStore } from '../parsers/turtle-parser.js';
import { formatDateTime, getStageColor, getStageNameKo } from '../utils/formatters.js';

// 네임스페이스 상수
const TUNNEL_NS = 'http://example.org/tunneling-ontology#';
const RDF = {
  type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
};

/**
 * 터널 굴착 사이클 타임라인을 렌더링합니다
 * @param {N3.Store} store - RDF 스토어
 * @param {string} containerId - 렌더링할 HTML 컨테이너 ID
 * @returns {Object} Vis.js Timeline 인스턴스
 */
export function renderCycleTimeline(store, containerId) {
  console.log('Rendering cycle timeline...');

  // 1. 모든 TunnelingCycle 인스턴스 찾기
  const cycles = findInstancesOfClass(store, `${TUNNEL_NS}TunnelingCycle`);
  console.log(`Found ${cycles.length} tunneling cycles`);

  if (cycles.length === 0) {
    console.warn('No tunneling cycles found');
    return null;
  }

  // 2. 각 사이클의 단계(stage) 추출
  const timelineItems = [];
  const groups = [];

  cycles.forEach((cycleUri, index) => {
    // 사이클 번호 가져오기
    const cycleNumberQuads = queryStore(store, cycleUri, `${TUNNEL_NS}cycleNumber`, null);
    const cycleNumber = cycleNumberQuads.length > 0
      ? cycleNumberQuads[0].object.value
      : index + 1;

    // 그룹 추가 (각 사이클이 하나의 그룹)
    groups.push({
      id: cycleUri,
      content: `Cycle ${cycleNumber}`,
      order: parseInt(cycleNumber)
    });

    // 사이클의 모든 단계(stage) 가져오기
    const stageQuads = queryStore(store, cycleUri, `${TUNNEL_NS}hasStage`, null);

    stageQuads.forEach(stageQuad => {
      const stageUri = stageQuad.object.value;

      // 단계 타입 확인
      const typeQuads = queryStore(store, stageUri, RDF.type, null);
      if (typeQuads.length === 0) return;

      const stageType = typeQuads[0].object.value.replace(TUNNEL_NS, '');

      // 시작 및 종료 시간 가져오기
      const startTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}startTime`, null);
      const endTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}endTime`, null);

      if (startTimeQuads.length === 0 || endTimeQuads.length === 0) {
        console.warn(`Missing time data for stage: ${stageUri}`);
        return;
      }

      const startTime = startTimeQuads[0].object.value;
      const endTime = endTimeQuads[0].object.value;

      // 한글 레이블 가져오기
      const labelKo = getStageNameKo(stageType);
      const color = getStageColor(stageType);

      // 타임라인 아이템 추가
      timelineItems.push({
        id: stageUri,
        group: cycleUri,
        content: labelKo,
        start: startTime,
        end: endTime,
        type: 'range',
        className: `stage-${stageType.toLowerCase()}`,
        style: `background-color: ${color}; border-color: ${color};`,
        title: `${labelKo}<br/>${formatDateTime(startTime)} ~ ${formatDateTime(endTime)}`
      });
    });
  });

  console.log(`Created ${timelineItems.length} timeline items`);

  // 3. Vis.js Timeline 옵션 설정
  const options = {
    width: '100%',
    height: '100%',
    stack: false,
    showCurrentTime: false,
    zoomMin: 1000 * 60 * 10, // 최소 줌: 10분
    zoomMax: 1000 * 60 * 60 * 24 * 7, // 최대 줌: 7일
    editable: false,
    selectable: true,
    orientation: 'top',
    groupOrder: 'order',
    margin: {
      item: {
        horizontal: 5,
        vertical: 10
      }
    },
    tooltip: {
      followMouse: true,
      overflowMethod: 'cap'
    }
  };

  // 4. Timeline 인스턴스 생성
  const container = document.getElementById(containerId);
  const timeline = new vis.Timeline(container, timelineItems, groups, options);

  // 5. 이벤트 핸들러 설정
  timeline.on('select', (properties) => {
    if (properties.items.length > 0) {
      const selectedItemId = properties.items[0];
      const item = timelineItems.find(i => i.id === selectedItemId);

      if (item) {
        console.log('Selected stage:', item);
        // 이벤트 발생 (다른 컴포넌트에서 처리 가능)
        const event = new CustomEvent('stageSelected', {
          detail: {
            uri: item.id,
            label: item.content,
            startTime: item.start,
            endTime: item.end
          }
        });
        document.dispatchEvent(event);
      }
    }
  });

  console.log('Timeline rendered successfully');
  return timeline;
}

/**
 * 특정 사이클의 상세 정보를 반환합니다
 * @param {N3.Store} store - RDF 스토어
 * @param {string} cycleUri - 사이클 URI
 * @returns {Object} 사이클 상세 정보
 */
export function getCycleDetails(store, cycleUri) {
  const details = {
    uri: cycleUri,
    cycleNumber: null,
    advanceLength: null,
    stages: []
  };

  // 사이클 번호
  const cycleNumberQuads = queryStore(store, cycleUri, `${TUNNEL_NS}cycleNumber`, null);
  if (cycleNumberQuads.length > 0) {
    details.cycleNumber = cycleNumberQuads[0].object.value;
  }

  // 전진장
  const advanceLengthQuads = queryStore(store, cycleUri, `${TUNNEL_NS}advanceLength`, null);
  if (advanceLengthQuads.length > 0) {
    details.advanceLength = parseFloat(advanceLengthQuads[0].object.value);
  }

  // 단계 정보
  const stageQuads = queryStore(store, cycleUri, `${TUNNEL_NS}hasStage`, null);
  stageQuads.forEach(stageQuad => {
    const stageUri = stageQuad.object.value;
    const typeQuads = queryStore(store, stageUri, RDF.type, null);

    if (typeQuads.length > 0) {
      const stageType = typeQuads[0].object.value.replace(TUNNEL_NS, '');
      const startTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}startTime`, null);
      const endTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}endTime`, null);

      details.stages.push({
        uri: stageUri,
        type: stageType,
        label: getStageNameKo(stageType),
        startTime: startTimeQuads.length > 0 ? startTimeQuads[0].object.value : null,
        endTime: endTimeQuads.length > 0 ? endTimeQuads[0].object.value : null
      });
    }
  });

  return details;
}

/**
 * 단계(stage)의 상세 정보를 반환합니다
 * @param {N3.Store} store - RDF 스토어
 * @param {string} stageUri - 단계 URI
 * @returns {Object} 단계 상세 정보
 */
export function getStageDetails(store, stageUri) {
  const details = {
    uri: stageUri,
    type: null,
    label: null,
    startTime: null,
    endTime: null,
    equipment: [],
    outputs: []
  };

  // 타입 정보
  const typeQuads = queryStore(store, stageUri, RDF.type, null);
  if (typeQuads.length > 0) {
    details.type = typeQuads[0].object.value.replace(TUNNEL_NS, '');
    details.label = getStageNameKo(details.type);
  }

  // 시간 정보
  const startTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}startTime`, null);
  if (startTimeQuads.length > 0) {
    details.startTime = startTimeQuads[0].object.value;
  }

  const endTimeQuads = queryStore(store, stageUri, `${TUNNEL_NS}endTime`, null);
  if (endTimeQuads.length > 0) {
    details.endTime = endTimeQuads[0].object.value;
  }

  // 사용 장비
  const equipmentQuads = queryStore(store, stageUri, `${TUNNEL_NS}usesEquipment`, null);
  equipmentQuads.forEach(eq => {
    details.equipment.push({
      uri: eq.object.value,
      label: getLabel(store, eq.object.value, 'ko')
    });
  });

  // 생성물 (드릴홀, 지보재 등)
  const outputPredicates = [
    `${TUNNEL_NS}createsHole`,
    `${TUNNEL_NS}installsSupport`,
    `${TUNNEL_NS}removesDebris`
  ];

  outputPredicates.forEach(pred => {
    const outputQuads = queryStore(store, stageUri, pred, null);
    outputQuads.forEach(out => {
      details.outputs.push({
        uri: out.object.value,
        predicate: pred.replace(TUNNEL_NS, ''),
        label: getLabel(store, out.object.value, 'ko')
      });
    });
  });

  return details;
}
