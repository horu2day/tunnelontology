/**
 * Turtle Parser Module
 * N3.js를 사용하여 Turtle (.ttl) 파일을 파싱하는 유틸리티 모듈
 */

// N3 is loaded via CDN in index.html
// Access it from the global window object
const N3 = window.N3;

/**
 * Turtle 파일을 비동기로 로드하고 파싱합니다
 * @param {string} url - .ttl 파일의 URL 경로
 * @returns {Promise<{store: N3.Store, prefixes: Object}>} 파싱된 RDF 스토어와 프리픽스
 */
export async function parseTurtleFile(url) {
  try {
    // 1. 파일 내용 가져오기
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const turtleData = await response.text();

    // 2. N3 파서 및 스토어 초기화
    const parser = new N3.Parser();
    const store = new N3.Store();

    // 3. 파싱 (콜백 기반이므로 Promise로 래핑)
    return new Promise((resolve, reject) => {
      let prefixes = {};

      parser.parse(turtleData, (error, quad, prefixesParsed) => {
        if (error) {
          reject(error);
          return;
        }

        if (quad) {
          // 쿼드를 스토어에 추가
          store.addQuad(quad);
        } else {
          // 파싱 완료 (quad가 null일 때)
          prefixes = prefixesParsed || {};
          console.log(`✓ Parsed ${url}: ${store.size} triples`);
          resolve({ store, prefixes });
        }
      });
    });

  } catch (error) {
    console.error(`✗ Failed to parse ${url}:`, error);
    throw error;
  }
}

/**
 * 여러 Turtle 파일을 병합하여 하나의 스토어로 반환합니다
 * @param {string[]} urls - .ttl 파일 URL 배열
 * @returns {Promise<{store: N3.Store, prefixes: Object}>}
 */
export async function parseMultipleTurtleFiles(urls) {
  const mergedStore = new N3.Store();
  let mergedPrefixes = {};

  for (const url of urls) {
    const { store, prefixes } = await parseTurtleFile(url);

    // 모든 쿼드를 병합된 스토어에 추가
    for (const quad of store) {
      mergedStore.addQuad(quad);
    }

    // 프리픽스 병합
    mergedPrefixes = { ...mergedPrefixes, ...prefixes };
  }

  console.log(`✓ Merged ${urls.length} files: ${mergedStore.size} total triples`);
  return { store: mergedStore, prefixes: mergedPrefixes };
}

/**
 * 스토어에서 특정 패턴의 쿼드를 쿼리합니다
 * @param {N3.Store} store - RDF 스토어
 * @param {string|null} subject - 주어 (null이면 모든 주어)
 * @param {string|null} predicate - 서술어 (null이면 모든 서술어)
 * @param {string|null} object - 목적어 (null이면 모든 목적어)
 * @returns {Array} 매칭되는 쿼드 배열
 */
export function queryStore(store, subject, predicate, object) {
  return store.getQuads(subject, predicate, object, null);
}

/**
 * 특정 클래스의 모든 인스턴스를 찾습니다
 * @param {N3.Store} store - RDF 스토어
 * @param {string} classURI - 클래스 URI
 * @returns {Array} 인스턴스 URI 배열
 */
export function findInstancesOfClass(store, classURI) {
  const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  const quads = queryStore(store, null, RDF_TYPE, classURI);
  return quads.map(quad => quad.subject.value);
}

/**
 * 특정 주어의 모든 속성과 값을 객체로 반환합니다
 * @param {N3.Store} store - RDF 스토어
 * @param {string} subjectURI - 주어 URI
 * @returns {Object} {속성URI: [값들]} 형태의 객체
 */
export function getPropertiesOf(store, subjectURI) {
  const quads = queryStore(store, subjectURI, null, null);
  const properties = {};

  for (const quad of quads) {
    const predicate = quad.predicate.value;
    const object = quad.object.value;

    if (!properties[predicate]) {
      properties[predicate] = [];
    }
    properties[predicate].push(object);
  }

  return properties;
}

/**
 * rdfs:label을 가져옵니다 (언어 태그 지원)
 * @param {N3.Store} store - RDF 스토어
 * @param {string} uri - 리소스 URI
 * @param {string} lang - 언어 코드 (예: 'ko', 'en'), 기본값 'ko'
 * @returns {string|null} 레이블 텍스트 또는 null
 */
export function getLabel(store, uri, lang = 'ko') {
  const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label';
  const quads = queryStore(store, uri, RDFS_LABEL, null);

  // 먼저 해당 언어의 레이블 찾기
  for (const quad of quads) {
    if (quad.object.language === lang) {
      return quad.object.value;
    }
  }

  // 언어가 없으면 첫 번째 레이블 반환
  if (quads.length > 0) {
    return quads[0].object.value;
  }

  // 레이블이 없으면 URI의 로컬 이름 반환
  return extractLocalName(uri);
}

/**
 * URI에서 로컬 이름을 추출합니다
 * @param {string} uri - 전체 URI
 * @returns {string} 로컬 이름
 */
export function extractLocalName(uri) {
  if (!uri) return '';

  // # 뒤의 이름
  if (uri.includes('#')) {
    return uri.split('#').pop();
  }

  // / 뒤의 이름
  if (uri.includes('/')) {
    return uri.split('/').pop();
  }

  return uri;
}
