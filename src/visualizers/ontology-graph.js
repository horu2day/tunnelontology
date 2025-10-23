
/**
 * Ontology Graph Visualization (Instance-Aware)
 * Cytoscape.js를 사용하여 온톨로지 스키마와 인스턴스를 함께 시각화합니다.
 */

const cytoscape = window.cytoscape;
import { getLabel } from '../parsers/turtle-parser.js';

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
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

export function renderOntologyGraph(store, containerId) {
    console.log('Starting ontology graph rendering...');
    const allClasses = getAllClasses(store);
    console.log(`Found ${allClasses.size} classes in total.`);

    const classNodes = Array.from(allClasses).map(uri => createNode(store, uri, 'class'));

    const propertyNodes = extractProperties(store);
    console.log(`Found ${propertyNodes.length} properties.`);

    const instanceNodes = extractInstances(store, allClasses);
    console.log(`Found ${instanceNodes.length} instances.`);

    const allNodes = [...classNodes, ...propertyNodes, ...instanceNodes];
    const nodeIds = new Set(allNodes.map(n => n.data.id));
    console.log(`Total nodes for graph: ${allNodes.length}`);

    const edges = extractRelationships(store, nodeIds);
    console.log(`Found ${edges.length} relationships.`);

    const elements = { nodes: allNodes, edges };

    const cy = cytoscape({
        container: document.getElementById(containerId),
        elements: elements,
        style: getCytoscapeStyle(),
        layout: { name: 'cose', idealEdgeLength: 150, nodeRepulsion: 5000 },
        wheelSensitivity: 0.1
    });

    setupEventHandlers(cy);
    console.log('Graph rendering complete.');
    return cy;
}

function createNode(store, uri, type, parent = null) {
    const data = {
        id: uri,
        label: getLabel(store, uri, 'ko'),
        type: type
    };
    if (parent) {
        data.parent = parent;
    }
    return { data };
}

function getAllClasses(store) {
    const classes = new Set();
    // Add all subjects and objects of rdfs:subClassOf triples
    store.getQuads(null, RDFS.subClassOf, null).forEach(q => {
        classes.add(q.subject.value);
        classes.add(q.object.value);
    });
    // Add all subjects of rdf:type owl:Class triples
    store.getQuads(null, RDF_TYPE, OWL.Class).forEach(q => {
        classes.add(q.subject.value);
    });
    return classes;
}

function extractProperties(store) {
    const objProps = store.getQuads(null, RDF_TYPE, OWL.ObjectProperty);
    const dtProps = store.getQuads(null, RDF_TYPE, OWL.DatatypeProperty);
    
    const processProps = (quads, type) => quads.map(quad => createNode(store, quad.subject.value, type));

    return [...processProps(objProps, 'objectProperty'), ...processProps(dtProps, 'datatypeProperty')];
}

function extractInstances(store, classIds) {
    const instanceQuads = store.getQuads(null, RDF_TYPE, null);
    const nodes = [];
    const addedInstances = new Set();

    instanceQuads.forEach(quad => {
        const subjectUri = quad.subject.value;
        const typeUri = quad.object.value;

        if (classIds.has(typeUri) && !addedInstances.has(subjectUri)) {
            nodes.push(createNode(store, subjectUri, 'instance', typeUri));
            addedInstances.add(subjectUri);
        }
    });
    return nodes;
}

function extractRelationships(store, nodeIds) {
    const edges = [];
    const addedEdges = new Set();

    store.getQuads(null, null, null).forEach(quad => {
        const source = quad.subject.value;
        const target = quad.object.value;
        const predicate = quad.predicate.value;

        if (nodeIds.has(source) && nodeIds.has(target)) {
            const edgeId = `${source}-${predicate}-${target}`;
            if (!addedEdges.has(edgeId)) {
                let edgeType = 'link';
                if (predicate === RDFS.subClassOf) edgeType = 'subClassOf';
                else if (predicate === RDF_TYPE) return; // Handled by parent property

                edges.push({
                    data: {
                        id: edgeId,
                        source: source,
                        target: target,
                        label: getLabel(store, predicate, 'ko'),
                        type: edgeType
                    }
                });
                addedEdges.add(edgeId);
            }
        }
    });

    return edges;
}

function getCytoscapeStyle() {
    return [
        { selector: 'node', style: { 'label': 'data(label)', 'text-wrap': 'wrap', 'text-max-width': '80px', 'font-size': '12px' } },
        { selector: 'node[type="class"]', style: { 'background-color': '#3498db', 'shape': 'ellipse' } },
        { selector: 'node[type="objectProperty"]', style: { 'background-color': '#2ecc71', 'shape': 'diamond' } },
        { selector: 'node[type="datatypeProperty"]', style: { 'background-color': '#f39c12', 'shape': 'rectangle' } },
        { selector: 'node[type="instance"]', style: { 'background-color': '#e74c3c', 'shape': 'round-rectangle' } },
        { selector: 'edge', style: { 'width': 2, 'line-color': '#95a5a6', 'target-arrow-color': '#95a5a6', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'label': 'data(label)', 'font-size': '10px' } },
        { selector: 'edge[type="subClassOf"]', style: { 'line-color': '#3498db', 'target-arrow-color': '#3498db', 'width': 3 } },
        { selector: ':selected', style: { 'border-width': 3, 'border-color': '#e74c3c' } }
    ];
}

function setupEventHandlers(cy) {
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        console.log('Node clicked:', node.data());
    });
}
