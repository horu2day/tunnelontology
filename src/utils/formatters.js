/**
 * Formatter Utilities
 * 데이터 포맷팅 및 변환을 위한 유틸리티 함수들
 */

/**
 * ISO 8601 날짜 문자열을 한국어 형식으로 변환
 * @param {string} isoString - ISO 8601 형식의 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열
 */
export function formatDateTime(isoString) {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Date parsing error:', error);
    return isoString;
  }
}

/**
 * 두 날짜 사이의 시간 차이를 계산 (분 단위)
 * @param {string} startTime - 시작 시간 (ISO 8601)
 * @param {string} endTime - 종료 시간 (ISO 8601)
 * @returns {number} 시간 차이 (분)
 */
export function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    return Math.round(diffMs / (1000 * 60)); // 밀리초를 분으로 변환
  } catch (error) {
    console.error('Duration calculation error:', error);
    return 0;
  }
}

/**
 * 분 단위 시간을 '2시간 30분' 형식으로 변환
 * @param {number} minutes - 분 단위 시간
 * @returns {string} 포맷된 시간 문자열
 */
export function formatDuration(minutes) {
  if (!minutes || minutes === 0) return '0분';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}분`;
  } else if (mins === 0) {
    return `${hours}시간`;
  } else {
    return `${hours}시간 ${mins}분`;
  }
}

/**
 * 소수점 숫자를 지정된 자릿수로 포맷
 * @param {number} value - 숫자 값
 * @param {number} decimals - 소수점 자릿수 (기본값: 1)
 * @returns {string} 포맷된 숫자 문자열
 */
export function formatNumber(value, decimals = 1) {
  if (value === null || value === undefined) return '-';
  return Number(value).toFixed(decimals);
}

/**
 * 스테이지 타입에 따른 한글 이름 반환
 * @param {string} stageType - 스테이지 타입 (Drilling, Charging, 등)
 * @returns {string} 한글 이름
 */
export function getStageNameKo(stageType) {
  const stageNames = {
    'Drilling': '천공',
    'Charging': '장약',
    'Blasting': '발파',
    'Ventilation': '환기',
    'Mucking': '버력처리',
    'SupportInstallation': '지보재 설치'
  };

  return stageNames[stageType] || stageType;
}

/**
 * 스테이지 타입에 따른 색상 반환 (시각화용)
 * @param {string} stageType - 스테이지 타입
 * @returns {string} CSS 색상 코드
 */
export function getStageColor(stageType) {
  const stageColors = {
    'Drilling': '#3498db',      // 파랑
    'Charging': '#f39c12',      // 주황
    'Blasting': '#e74c3c',      // 빨강
    'Ventilation': '#9b59b6',   // 보라
    'Mucking': '#1abc9c',       // 청록
    'SupportInstallation': '#2ecc71'  // 초록
  };

  return stageColors[stageType] || '#95a5a6';  // 기본 회색
}

/**
 * URI를 읽기 쉬운 형식으로 축약
 * @param {string} uri - 전체 URI
 * @param {Object} prefixes - 프리픽스 맵 {prefix: namespace}
 * @returns {string} 축약된 URI (예: "tunnel:Drilling")
 */
export function shortenURI(uri, prefixes = {}) {
  if (!uri) return '';

  // 프리픽스와 매칭 시도
  for (const [prefix, namespace] of Object.entries(prefixes)) {
    if (uri.startsWith(namespace)) {
      const localName = uri.substring(namespace.length);
      return `${prefix}:${localName}`;
    }
  }

  // 매칭 실패 시 로컬 이름만 반환
  if (uri.includes('#')) {
    return uri.split('#').pop();
  }
  if (uri.includes('/')) {
    return uri.split('/').pop();
  }

  return uri;
}

/**
 * 객체 배열을 특정 속성으로 그룹화
 * @param {Array} array - 객체 배열
 * @param {string} key - 그룹화할 속성 키
 * @returns {Object} 그룹화된 객체 {키: [객체들]}
 */
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
}

/**
 * HTML 이스케이프 (XSS 방지)
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
export function escapeHTML(text) {
  if (!text) return '';

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 로딩 인디케이터 표시/숨김
 * @param {boolean} show - true면 표시, false면 숨김
 * @param {string} containerId - 컨테이너 ID
 */
export function toggleLoading(show, containerId = 'loading') {
  const loadingElement = document.getElementById(containerId);
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

/**
 * 에러 메시지 표시
 * @param {string} message - 에러 메시지
 * @param {string} containerId - 표시할 컨테이너 ID
 */
export function showError(message, containerId = 'error-message') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(message);
    return;
  }

  container.innerHTML = `
    <div class="error-box">
      <h3>⚠️ 오류 발생</h3>
      <p>${escapeHTML(message)}</p>
    </div>
  `;
  container.style.display = 'block';
}
