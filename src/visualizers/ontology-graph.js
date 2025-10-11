/**
 * Ontology Graph Visualization
 * Cytoscape.js를 사용하여 온톨로지 그래프를 시각화합니다
 */

// Cytoscape is loaded via CDN in index.html
// Access it from the global window object
const cytoscape = window.cytoscape;
import { getLabel, extractLocalName } from '../parsers/turtle-parser.js';

// 네임스페이스 상수
const RDF = {
  type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
};

const RDFS = {
  subClassOf: 'http://www.w3.org/2000/01/rdf-schema#subClassOf',
  domain: 'http://www.w3.org/2000/01/rdf-schema#domain',
  range: 'http://www.w3.org/2000/01/rdf-schema#range'
};

const OWL = {
  Class: 'http://www.w3.org/2002/07/owl#Class',
  ObjectProperty: 'http://www.w3.org/2002/07/owl#ObjectProperty',
  DatatypeProperty: 'http://www.w3.org/2002/07/owl#DatatypeProperty'
};

/**
 * 온톨로지 그래프를 렌더링합니다
 * @param {N3.Store} store - RDF 스토어
 * @param {string} containerId - 렌더링할 HTML 컨테이너 ID
 * @returns {Object} Cytoscape 인스턴스
 */
export function renderOntologyGraph(store, containerId) {
  console.log('Rendering ontology graph...');

  // 1. 클래스 노드 추출
  const classNodes = extractClasses(store);
  console.log(`Found ${classNodes.length} classes`);

  // 2. 속성 노드 추출
  const propertyNodes = extractProperties(store);
  console.log(`Found ${propertyNodes.length} properties`);

  // 3. 노드 ID 집합 생성 (엣지 필터링용)
  const allNodes = [...classNodes, ...propertyNodes];
  const nodeIds = new Set(allNodes.map(n => n.data.id));

  // 4. 관계 엣지 추출 (존재하는 노드만 연결)
  const edges = extractRelationships(store, nodeIds);
  console.log(`Found ${edges.length} relationships`);

  // 5. Cytoscape 요소 구성
  const elements = {
    nodes: allNodes,
    edges: edges
  };

  // 5. Cytoscape 인스턴스 생성
  const cy = cytoscape({
    container: document.getElementById(containerId),
    elements: elements,
    style: getCytoscapeStyle(),
    layout: {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    }
  });

  // 6. 이벤트 핸들러 등록
  setupEventHandlers(cy);

  console.log('✓ Ontology graph rendered successfully');
  return cy;
}

/**
 * 스토어에서 클래스들을 추출하여 Cytoscape 노드로 변환
 * @param {N3.Store} store - RDF 스토어
 * @returns {Array} Cytoscape 노드 배열
 */
function extractClasses(store) {
  const classQuads = store.getQuads(null, RDF.type, OWL.Class);
  const nodes = [];

  for (const quad of classQuads) {
    const uri = quad.subject.value;
    const label = getLabel(store, uri, 'ko');
    const localName = extractLocalName(uri);

    nodes.push({
      data: {
        id: uri,
        label: label,
        localName: localName,
        type: 'class',
        uri: uri
      }
    });
  }

  return nodes;
}

/**
 * 스토어에서 속성들을 추출하여 Cytoscape 노드로 변환
 * @param {N3.Store} store - RDF 스토어
 * @returns {Array} Cytoscape 노드 배열
 */
function extractProperties(store) {
  const objectProps = store.getQuads(null, RDF.type, OWL.ObjectProperty);
  const datatypeProps = store.getQuads(null, RDF.type, OWL.DatatypeProperty);
  const nodes = [];

  // ObjectProperty 노드
  for (const quad of objectProps) {
    const uri = quad.subject.value;
    const label = getLabel(store, uri, 'ko');
    const localName = extractLocalName(uri);

    nodes.push({
      data: {
        id: uri,
        label: label,
        localName: localName,
        type: 'objectProperty',
        uri: uri
      }
    });
  }

  // DatatypeProperty 노드
  for (const quad of datatypeProps) {
    const uri = quad.subject.value;
    const label = getLabel(store, uri, 'ko');
    const localName = extractLocalName(uri);

    nodes.push({
      data: {
        id: uri,
        label: label,
        localName: localName,
        type: 'datatypeProperty',
        uri: uri
      }
    });
  }

  return nodes;
}

/**
 * 스토어에서 관계들을 추출하여 Cytoscape 엣지로 변환
 * @param {N3.Store} store - RDF 스토어
 * @param {Set} nodeIds - 존재하는 노드 ID 집합
 * @returns {Array} Cytoscape 엣지 배열
 */
function extractRelationships(store, nodeIds) {
  const edges = [];

  // 1. rdfs:subClassOf 관계
  const subClassQuads = store.getQuads(null, RDFS.subClassOf, null);
  for (const quad of subClassQuads) {
    const source = quad.subject.value;
    const target = quad.object.value;

    // 양쪽 노드가 모두 존재하는 경우에만 엣지 추가
    if (nodeIds.has(source) && nodeIds.has(target)) {
      edges.push({
        data: {
          id: `${source}-subClassOf-${target}`,
          source: source,
          target: target,
          label: 'subClassOf',
          type: 'subClassOf'
        }
      });
    }
  }

  // 2. rdfs:domain 관계 (속성 → 클래스)
  const domainQuads = store.getQuads(null, RDFS.domain, null);
  for (const quad of domainQuads) {
    const source = quad.subject.value;
    const target = quad.object.value;

    if (nodeIds.has(source) && nodeIds.has(target)) {
      edges.push({
        data: {
          id: `${source}-domain-${target}`,
          source: source,
          target: target,
          label: 'domain',
          type: 'domain'
        }
      });
    }
  }

  // 3. rdfs:range 관계 (속성 → 클래스/데이터타입)
  // XSD 데이터타입은 노드가 아니므로 필터링됨
  const rangeQuads = store.getQuads(null, RDFS.range, null);
  for (const quad of rangeQuads) {
    const source = quad.subject.value;
    const target = quad.object.value;

    if (nodeIds.has(source) && nodeIds.has(target)) {
      edges.push({
        data: {
          id: `${source}-range-${target}`,
          source: source,
          target: target,
          label: 'range',
          type: 'range'
        }
      });
    }
  }

  return edges;
}

/**
 * Cytoscape 스타일 정의
 * @returns {Array} 스타일 배열
 */
function getCytoscapeStyle() {
  return [
    // 기본 노드 스타일
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '12px',
        'font-family': 'Arial, sans-serif',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'width': '60px',
        'height': '60px',
        'border-width': '2px',
        'border-color': '#fff'
      }
    },

    // 클래스 노드
    {
      selector: 'node[type="class"]',
      style: {
        'background-color': '#3498db',
        'shape': 'ellipse'
      }
    },

    // ObjectProperty 노드
    {
      selector: 'node[type="objectProperty"]',
      style: {
        'background-color': '#2ecc71',
        'shape': 'diamond',
        'width': '50px',
        'height': '50px'
      }
    },

    // DatatypeProperty 노드
    {
      selector: 'node[type="datatypeProperty"]',
      style: {
        'background-color': '#f39c12',
        'shape': 'rectangle',
        'width': '50px',
        'height': '30px'
      }
    },

    // 기본 엣지 스타일
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#95a5a6',
        'target-arrow-color': '#95a5a6',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '10px',
        'text-rotation': 'autorotate',
        'text-margin-y': -10
      }
    },

    // subClassOf 엣지
    {
      selector: 'edge[type="subClassOf"]',
      style: {
        'line-color': '#3498db',
        'target-arrow-color': '#3498db',
        'width': 3
      }
    },

    // domain 엣지
    {
      selector: 'edge[type="domain"]',
      style: {
        'line-color': '#2ecc71',
        'target-arrow-color': '#2ecc71',
        'line-style': 'dashed'
      }
    },

    // range 엣지
    {
      selector: 'edge[type="range"]',
      style: {
        'line-color': '#e74c3c',
        'target-arrow-color': '#e74c3c',
        'line-style': 'dotted'
      }
    },

    // 선택된 요소
    {
      selector: ':selected',
      style: {
        'background-color': '#e74c3c',
        'line-color': '#e74c3c',
        'target-arrow-color': '#e74c3c',
        'source-arrow-color': '#e74c3c',
        'border-width': '3px',
        'border-color': '#e74c3c'
      }
    }
  ];
}

/**
 * 이벤트 핸들러 설정
 * @param {Object} cy - Cytoscape 인스턴스
 */
function setupEventHandlers(cy) {
  // 노드 클릭 이벤트
  cy.on('tap', 'node', function(evt) {
    const node = evt.target;
    const data = node.data();
    console.log('Node clicked:', data);

    // 세부 정보 표시 (구현 예정)
    displayNodeDetails(data);
  });

  // 노드 호버 이벤트
  cy.on('mouseover', 'node', function(evt) {
    const node = evt.target;
    node.style('border-width', '4px');
  });

  cy.on('mouseout', 'node', function(evt) {
    const node = evt.target;
    if (!node.selected()) {
      node.style('border-width', '2px');
    }
  });
}

/**
 * 노드 세부 정보 표시
 * @param {Object} data - 노드 데이터
 */
function displayNodeDetails(data) {
  const detailsPanel = document.getElementById('node-details');
  if (!detailsPanel) return;

  const html = `
    <div class="node-detail-card">
      <h3>${data.label}</h3>
      <p><strong>타입:</strong> ${data.type}</p>
      <p><strong>로컬 이름:</strong> ${data.localName}</p>
      <p><strong>URI:</strong> <code>${data.uri}</code></p>
    </div>
  `;

  detailsPanel.innerHTML = html;
  detailsPanel.style.display = 'block';
}

export default { renderOntologyGraph };
