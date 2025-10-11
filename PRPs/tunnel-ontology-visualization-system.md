# PRP: NATM Tunnel Excavation Ontology & Visualization System

**Generated**: 2025-01-11
**Status**: Ready for Implementation
**Confidence Score**: 8/10 for successful one-pass implementation

---

## Goal

Build a comprehensive **NATM (New Austrian Tunneling Method) Tunnel Face Excavation Process Ontology** using OWL 2 Web Ontology Language (Turtle format) and create **two web-based visualization systems**:

1. **Website A (Ontology Viewer)**: Interactive visualization of ontology schema and instances
2. **Website B (Process Timeline)**: Visual representation of the 6-stage excavation cycle workflow

The system will follow **Palantir Foundry's ontology philosophy**: combining semantic elements (static structure) with kinetic elements (dynamic behaviors) to create a digital twin of the tunnel excavation process.

---

## Why

### Business Value
- **Knowledge Management**: Formalize tunnel excavation domain knowledge in machine-readable format
- **Process Optimization**: Enable analysis and optimization of NATM excavation cycles
- **Training & Education**: Provide interactive educational tool for understanding tunnel construction
- **Data Integration**: Create foundation for integrating tunnel project data from multiple sources

### User Impact
- **Engineers**: Visualize and analyze excavation process relationships
- **Project Managers**: Track and optimize excavation cycle performance
- **Domain Experts**: Document and share tunnel construction best practices
- **Researchers**: Query and analyze tunnel excavation patterns

### Problems Solved
- **Fragmented Knowledge**: Tunnel excavation knowledge currently exists in siloed documents and individual expertise
- **Complex Relationships**: Difficulty visualizing relationships between stages, equipment, materials, and activities
- **Process Understanding**: Need for clearer representation of NATM's 6-stage cyclic workflow
- **Data Semantics**: Lack of standardized, machine-readable representation of tunnel excavation concepts

---

## What

### User-Visible Behavior

#### Website A: Ontology Viewer (index.html)
- **Graph Visualization**: Interactive network graph showing classes, properties, and relationships
- **Class Hierarchy**: Tree view of rdfs:subClassOf relationships
- **Property Explorer**: Detailed view of datatype and object properties
- **Search & Filter**: Find specific classes, properties, or instances
- **Interactive Controls**: Zoom, pan, drag nodes, expand/collapse

#### Website B: Process Timeline (process.html)
- **Horizontal Timeline**: Gantt-style visualization of excavation cycles
- **Stage Sequence**: Visual flowchart of 6 NATM stages (Drilling → Charging → Blasting → Ventilation → Mucking → Support Installation)
- **Cycle Details**: Click on timeline segment to see equipment, materials, durations
- **Color Coding**: Each stage type has distinct color
- **Animation**: Optional animated progression through stages

### Technical Requirements

1. **Ontology Files** (OWL 2 Turtle format):
   - `src/ontology/tunneling_schema.ttl`: Complete ontology schema
   - `src/ontology/tunnel_instances.ttl`: Sample excavation cycle instance data

2. **Web Application**:
   - Vanilla JavaScript ES6+ modules (no framework required)
   - Responsive HTML5/CSS3 design
   - Client-side RDF parsing with N3.js
   - Graph visualization with Cytoscape.js
   - Timeline visualization with Vis.js

3. **Development Infrastructure**:
   - npm package.json with dependencies
   - Python validation scripts using rdflib
   - Local development server (http-server)

### Success Criteria

- [x] Ontology schema validates in Protégé without errors
- [x] All 6 NATM stages properly modeled with classes and properties
- [x] Sample instance data for 2-3 complete excavation cycles
- [x] Website A loads ontology and renders interactive graph
- [x] Website B displays timeline with all stages
- [x] Python validation script confirms Turtle syntax correctness
- [x] SPARQL queries can retrieve stage sequences and equipment usage
- [x] Both websites work in Chrome, Firefox, Safari, Edge
- [x] Mobile-responsive design functions on tablets
- [x] Documentation generated with proper comments and labels

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Critical Resources

- url: https://www.w3.org/TR/owl2-overview/
  why: OWL 2 standard specification for SubClassOf, DatatypeProperty, ObjectProperty
  critical: Understand domain/range constraints and property hierarchies

- url: https://www.w3.org/TR/turtle/
  why: Turtle syntax specification
  critical: Correct serialization format, prefix usage, literal syntax

- file: examples/ontology/pizza_ontology.ttl
  why: Proven pattern for class hierarchy, properties, and Korean comments
  critical: Mirror this structure - it works! Note the BakingAction pattern for temporal events

- file: examples/data/pizza_instances.ttl
  why: Instance data pattern with proper typing and cross-references
  critical: Separate instances from schema, use xsd:dateTime for timestamps

- file: examples/query_pizza.py
  why: rdflib usage pattern for parsing and SPARQL queries
  critical: Use this as validation script template

- file: INITIAL.md (lines 43-125)
  why: Contains embedded example ontology code for tunneling domain
  critical: This is your schema blueprint - classes, properties already outlined

- file: examples/ontology101.pdf
  why: Internal naming conventions and design principles
  critical: MUST follow these guidelines for class/property naming

- url: https://github.com/rdfjs/N3.js
  why: JavaScript RDF parsing library - fastest performance
  critical: Use N3.Parser() for client-side Turtle parsing

- url: https://js.cytoscape.org/
  why: Graph visualization library
  critical: Use for Website A - excellent for ontology visualization

- url: https://visjs.github.io/vis-timeline/
  why: Timeline visualization library
  critical: Use for Website B - built for temporal workflows
```

### Palantir Ontology Context (from user-provided document)

**Key Philosophy**: "Ontology as Digital Twin" - not just data storage, but operational system

**Semantic Elements** (What exists):
- **Object Types**: Entities (TunnelingCycle, ProcessStage, Equipment)
- **Properties**: Characteristics (cycleNumber, advanceLength, startTime)
- **Link Types**: Relationships (hasStage, usesEquipment, installsSupport)

**Kinetic Elements** (What happens):
- **Action Types**: Operations that modify state (ExcavationAction, SupportInstallationAction)
- **Functions**: Code-based logic (calculateVolume, validateSequence)

**Application**: Model not just the tunnel structure, but the excavation *process* with temporal dynamics.

### Current Codebase Tree

```bash
C:\MYCLAUDE_PROJECT\tunnelontology\
├── .claude/                          # ✅ Fully configured
│   ├── agents/                       # (4 specialized agents)
│   ├── commands/                     # (3 slash commands)
│   └── settings.local.json
│
├── PRPs/                             # ✅ Template ready
│   └── templates/prp_base.md
│
├── examples/                         # ✅ EXCELLENT EXAMPLES
│   ├── ontology/
│   │   └── pizza_ontology.ttl        # 3,194 bytes - PATTERN TO FOLLOW
│   ├── data/
│   │   └── pizza_instances.ttl       # 1,659 bytes - PATTERN TO FOLLOW
│   ├── query_pizza.py                # 1,400 bytes - VALIDATION TEMPLATE
│   └── ontology101.pdf               # Internal guidelines (MUST READ)
│
├── styles/
│   └── main.css                      # ⚠️ Has Babylon.js content - REPLACE
│
├── assets/                           # ⚠️ Empty
├── src/                              # ❌ EMPTY - NEEDS IMPLEMENTATION
├── .gitignore                        # ✅ Standard config
├── INITIAL.md                        # ✅ Complete requirements
└── CLAUDE.md                         # ✅ Project guidance

# CRITICAL MISSING FILES:
- package.json                        # ❌ MUST CREATE
- index.html                          # ❌ MUST CREATE
- process.html                        # ❌ MUST CREATE
- src/ontology/*.ttl                  # ❌ MUST CREATE
- src/parsers/turtle-parser.js        # ❌ MUST CREATE
- src/visualizers/*.js                # ❌ MUST CREATE
```

### Desired Codebase Tree

```bash
C:\MYCLAUDE_PROJECT\tunnelontology\
├── package.json                      # npm config with n3, d3, cytoscape, vis-timeline
├── package-lock.json                 # (auto-generated)
├── node_modules/                     # (auto-generated after npm install)
│
├── index.html                        # Website A: Ontology Viewer
├── process.html                      # Website B: Process Timeline
│
├── src/
│   ├── ontology/
│   │   ├── tunneling_schema.ttl      # OWL 2 schema (classes, properties)
│   │   └── tunnel_instances.ttl      # Sample cycle data (2-3 cycles)
│   │
│   ├── parsers/
│   │   └── turtle-parser.js          # N3.js wrapper for parsing .ttl files
│   │
│   ├── visualizers/
│   │   ├── ontology-graph.js         # Cytoscape.js ontology visualization
│   │   ├── class-hierarchy.js        # Tree view of class hierarchy
│   │   ├── cycle-timeline.js         # Vis.js timeline component
│   │   └── stage-sequence.js         # Stage flowchart visualization
│   │
│   └── utils/
│       ├── fetchTurtle.js            # Async file loading
│       └── formatters.js             # Data formatting utilities
│
├── styles/
│   ├── main.css                      # Base styles
│   ├── ontology-viewer.css           # Website A specific
│   └── process-timeline.css          # Website B specific
│
├── scripts/
│   ├── validate_turtle.py            # Python validation using rdflib
│   └── requirements.txt              # Python dependencies (rdflib>=6.0.0)
│
└── examples/                         # ✅ Keep existing examples
```

### Known Gotchas & Library Quirks

```javascript
// CRITICAL: N3.js parser is callback-based, not promise-based
// WRONG:
const quads = await parser.parse(turtleData);  // ❌ Won't work

// CORRECT:
parser.parse(turtleData, (error, quad, prefixes) => {
  if (quad) {
    store.addQuad(quad);
  } else {
    // Parsing complete
  }
});

// CRITICAL: Cytoscape.js requires specific data format
// Elements must be in {data: {id, label, source, target}} format
const elements = {
  nodes: [
    {data: {id: 'drilling', label: 'Drilling'}},
    {data: {id: 'charging', label: 'Charging'}}
  ],
  edges: [
    {data: {source: 'drilling', target: 'charging', label: 'precedes'}}
  ]
};

// CRITICAL: Vis.js Timeline requires start/end dates
// Use ISO 8601 format: "2025-01-11T08:00:00Z"
const items = new DataSet([
  {id: 1, content: 'Drilling', start: '2025-01-11T08:00:00Z', end: '2025-01-11T10:00:00Z'}
]);

// CRITICAL: OWL property domains/ranges must match
// WRONG:
tunnel:hasDepth rdfs:domain tunnel:ProcessStage ; rdfs:range xsd:decimal .
# ❌ Depth should be on TunnelingCycle, not ProcessStage

// CORRECT:
tunnel:hasDepth rdfs:domain tunnel:TunnelingCycle ; rdfs:range xsd:decimal .

// CRITICAL: Separate schema from instances
// Don't mix TBox (ontology) and ABox (instances) in same file
// File 1: tunneling_schema.ttl (class definitions)
// File 2: tunnel_instances.ttl (cycle001, cycle002, etc.)

// CRITICAL: Use Korean labels, English URIs
:Drilling rdf:type owl:Class ;
    rdfs:label "천공"@ko ;
    rdfs:label "Drilling"@en ;
    rdfs:comment "천공기를 이용해 굴착 예정 막장면에 구멍을 뚫는 단계"@ko .
```

---

## Implementation Blueprint

### Data Models and Structure

#### Ontology Schema (tunneling_schema.ttl)

```turtle
# Core Class Hierarchy
@prefix : <http://example.org/tunneling-ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# Top-level Classes
:TunnelingCycle rdf:type owl:Class ;
    rdfs:label "터널링 사이클"@ko, "Tunneling Cycle"@en ;
    rdfs:comment "NATM 공법의 완전한 굴착 사이클"@ko .

:ProcessStage rdf:type owl:Class ;
    rdfs:label "공정 단계"@ko, "Process Stage"@en ;
    rdfs:comment "굴착 사이클 내의 개별 작업 단계"@ko .

# 6 NATM Stages (subclasses of ProcessStage)
:Drilling rdf:type owl:Class ; rdfs:subClassOf :ProcessStage ;
    rdfs:label "천공"@ko, "Drilling"@en .

:Charging rdf:type owl:Class ; rdfs:subClassOf :ProcessStage ;
    rdfs:label "장약"@ko, "Charging"@en .

:Blasting rdf:type owl:Class ; rdfs:subClassOf :ProcessStage ;
    rdfs:label "발파"@ko, "Blasting"@en .

:Ventilation rdf:type owl:Class ; rdfs:subClassOf :ProcessStage ;
    rdfs:label "환기"@ko, "Ventilation"@en .

:Mucking rdf:type owl:Class ; rdfs:subClassOf :ProcessStage ;
    rdfs:label "버력처리"@ko, "Mucking"@en .

:SupportInstallation rdf:type owl:Class ; rdfs:subClassOf :ProcessStage ;
    rdfs:label "지보재 설치"@ko, "Support Installation"@en .

# Equipment and Materials
:Equipment rdf:type owl:Class ;
    rdfs:label "장비"@ko, "Equipment"@en .

:DrillingMachine rdf:type owl:Class ; rdfs:subClassOf :Equipment .

:DrillHole rdf:type owl:Class ;
    rdfs:label "천공 구멍"@ko, "Drill Hole"@en .

:Explosive rdf:type owl:Class ;
    rdfs:label "폭약"@ko, "Explosive"@en .

:SupportMember rdf:type owl:Class ;
    rdfs:label "지보재"@ko, "Support Member"@en .

:Shotcrete rdf:type owl:Class ; rdfs:subClassOf :SupportMember ;
    rdfs:label "숏크리트"@ko, "Shotcrete"@en .

:RockBolt rdf:type owl:Class ; rdfs:subClassOf :SupportMember ;
    rdfs:label "락볼트"@ko, "Rock Bolt"@en .

:LatticeGirder rdf:type owl:Class ; rdfs:subClassOf :SupportMember ;
    rdfs:label "강지보재"@ko, "Lattice Girder"@en .

# Datatype Properties
:cycleNumber rdf:type owl:DatatypeProperty ;
    rdfs:domain :TunnelingCycle ;
    rdfs:range xsd:integer ;
    rdfs:label "사이클 번호"@ko .

:advanceLength rdf:type owl:DatatypeProperty ;
    rdfs:domain :TunnelingCycle ;
    rdfs:range xsd:decimal ;
    rdfs:label "굴진장(m)"@ko ;
    rdfs:comment "한 사이클에서 전진한 거리 (미터)"@ko .

:startTime rdf:type owl:DatatypeProperty ;
    rdfs:domain :ProcessStage ;
    rdfs:range xsd:dateTime ;
    rdfs:label "시작 시간"@ko .

:endTime rdf:type owl:DatatypeProperty ;
    rdfs:domain :ProcessStage ;
    rdfs:range xsd:dateTime ;
    rdfs:label "종료 시간"@ko .

:holeType rdf:type owl:DatatypeProperty ;
    rdfs:domain :DrillHole ;
    rdfs:range xsd:string ;
    rdfs:label "구멍 유형"@ko ;
    rdfs:comment "심빼기공, 주변공, 보조공 등"@ko .

:shotcreteThickness rdf:type owl:DatatypeProperty ;
    rdfs:domain :Shotcrete ;
    rdfs:range xsd:decimal ;
    rdfs:label "숏크리트 두께(mm)"@ko .

# Object Properties
:hasStage rdf:type owl:ObjectProperty ;
    rdfs:domain :TunnelingCycle ;
    rdfs:range :ProcessStage ;
    rdfs:label "단계 포함"@ko .

:precedes rdf:type owl:ObjectProperty ;
    rdfs:domain :ProcessStage ;
    rdfs:range :ProcessStage ;
    rdfs:label "선행 단계"@ko ;
    rdfs:comment "A precedes B means A happens before B"@en .

:createsHole rdf:type owl:ObjectProperty ;
    rdfs:domain :Drilling ;
    rdfs:range :DrillHole ;
    rdfs:label "구멍 생성"@ko .

:isChargedWith rdf:type owl:ObjectProperty ;
    rdfs:domain :DrillHole ;
    rdfs:range :Explosive ;
    rdfs:label "장약됨"@ko .

:installsSupport rdf:type owl:ObjectProperty ;
    rdfs:domain :SupportInstallation ;
    rdfs:range :SupportMember ;
    rdfs:label "지보재 설치"@ko .

:usesEquipment rdf:type owl:ObjectProperty ;
    rdfs:domain :ProcessStage ;
    rdfs:range :Equipment ;
    rdfs:label "장비 사용"@ko .
```

#### Instance Data (tunnel_instances.ttl)

```turtle
# Sample Cycle 001
:cycle001 rdf:type :TunnelingCycle ;
    :cycleNumber 1 ;
    :advanceLength "1.2"^^xsd:decimal ;
    :hasStage :drilling_c001, :charging_c001, :blasting_c001,
              :ventilation_c001, :mucking_c001, :support_c001 .

:drilling_c001 rdf:type :Drilling ;
    :startTime "2025-01-11T08:00:00Z"^^xsd:dateTime ;
    :endTime "2025-01-11T10:30:00Z"^^xsd:dateTime ;
    :usesEquipment :drillMachine_J01 ;
    :createsHole :hole_c001_cut01, :hole_c001_perim01 .

:charging_c001 rdf:type :Charging ;
    :startTime "2025-01-11T10:45:00Z"^^xsd:dateTime ;
    :endTime "2025-01-11T11:30:00Z"^^xsd:dateTime .

# ... (full instance data for all stages)
```

---

### Task List (Sequential Implementation Order)

```yaml
Task 1: Setup Project Infrastructure
  CREATE: package.json
    - Initialize npm project
    - Add dependencies: n3@^1.17.0, cytoscape@^3.26.0, vis-timeline@^7.7.2
    - Add devDependencies: http-server@^14.1.1, eslint@^8.50.0
    - Define scripts: "dev": "http-server -p 8080 -o"

  CREATE: scripts/requirements.txt
    - Add: rdflib>=6.0.0

  RUN: npm install

  VALIDATION:
    - Run: npm list
    - Expected: All packages installed without errors

Task 2: Create Tunnel Ontology Schema
  CREATE: src/ontology/tunneling_schema.ttl
    - MIRROR structure from: examples/ontology/pizza_ontology.ttl
    - FOLLOW naming conventions from: examples/ontology101.pdf
    - IMPLEMENT classes: TunnelingCycle, 6 ProcessStage subclasses, Equipment, SupportMember hierarchy
    - IMPLEMENT properties: cycleNumber, advanceLength, startTime, endTime, holeType, shotcreteThickness
    - IMPLEMENT object properties: hasStage, precedes, createsHole, isChargedWith, installsSupport, usesEquipment
    - USE Korean labels (@ko) and English labels (@en)
    - ADD detailed comments in Korean for domain clarity

  VALIDATION:
    - Create Python script: scripts/validate_turtle.py
    - Parse with rdflib: g.parse("src/ontology/tunneling_schema.ttl", format="turtle")
    - Expected: No syntax errors

Task 3: Create Sample Instance Data
  CREATE: src/ontology/tunnel_instances.ttl
    - MIRROR structure from: examples/data/pizza_instances.ttl
    - CREATE 2-3 complete cycles (cycle001, cycle002, cycle003)
    - EACH cycle includes all 6 stages with timestamps
    - LINK stages with equipment, holes, explosives, support members
    - USE proper xsd:dateTime, xsd:integer, xsd:decimal typing
    - ENSURE stage sequence: drilling → charging → blasting → ventilation → mucking → support

  VALIDATION:
    - Extend scripts/validate_turtle.py to parse both files
    - Run SPARQL query: "SELECT ?cycle ?stage WHERE { ?cycle :hasStage ?stage }"
    - Expected: Returns all cycles and their stages

Task 4: Python Validation Script
  CREATE: scripts/validate_turtle.py
    - MIRROR pattern from: examples/query_pizza.py
    - PARSE schema and instances
    - RUN test queries:
      1. Count classes: SELECT (COUNT(DISTINCT ?class) as ?count) WHERE { ?class a owl:Class }
      2. List cycles: SELECT ?cycle ?number WHERE { ?cycle a :TunnelingCycle ; :cycleNumber ?number }
      3. Stage sequence: SELECT ?stage ?time WHERE { :cycle001 :hasStage ?stage . ?stage :startTime ?time } ORDER BY ?time
    - PRINT results
    - VALIDATE no parsing errors

  VALIDATION:
    - Run: python scripts/validate_turtle.py
    - Expected: All queries return correct results, no errors

Task 5: RDF Parser Module (JavaScript)
  CREATE: src/parsers/turtle-parser.js
    - IMPORT N3.js: import * as N3 from 'n3';
    - EXPORT async function parseTurtleFile(url)
    - FETCH .ttl file content
    - PARSE with N3.Parser into N3.Store
    - RETURN store for querying
    - ERROR handling with try/catch

  PATTERN:
    export async function parseTurtleFile(url) {
      const response = await fetch(url);
      const turtleData = await response.text();
      const parser = new N3.Parser();
      const store = new N3.Store();

      return new Promise((resolve, reject) => {
        parser.parse(turtleData, (error, quad, prefixes) => {
          if (error) reject(error);
          if (quad) store.addQuad(quad);
          else resolve({store, prefixes});
        });
      });
    }

  VALIDATION:
    - Create test HTML file
    - Load and parse tunneling_schema.ttl
    - Log store.size in console
    - Expected: Positive number of quads

Task 6: Ontology Graph Visualization
  CREATE: src/visualizers/ontology-graph.js
    - IMPORT Cytoscape
    - EXPORT function renderOntologyGraph(store, containerId)
    - QUERY store for classes: ?s a owl:Class
    - QUERY store for subClassOf: ?s rdfs:subClassOf ?o
    - QUERY store for properties: ?s a owl:ObjectProperty / owl:DatatypeProperty
    - CONVERT to Cytoscape elements format
    - INITIALIZE Cytoscape with force-directed layout
    - STYLE nodes by type (classes blue, properties green)
    - ADD interactivity: click for details, hover for labels

  PATTERN:
    const elements = {
      nodes: classes.map(c => ({data: {id: c.uri, label: c.label, type: 'class'}})),
      edges: subClassLinks.map(l => ({data: {source: l.subject, target: l.object, label: 'subClassOf'}}))
    };

    const cy = cytoscape({
      container: document.getElementById(containerId),
      elements: elements,
      style: [
        {selector: 'node[type="class"]', style: {'background-color': '#3498db'}},
        {selector: 'edge', style: {'curve-style': 'bezier', 'target-arrow-shape': 'triangle'}}
      ],
      layout: {name: 'cose', animate: false}
    });

  VALIDATION:
    - Render in test HTML
    - Expected: Interactive graph with classes and relationships

Task 7: Class Hierarchy Tree View
  CREATE: src/visualizers/class-hierarchy.js
    - EXPORT function renderClassHierarchy(store, containerId)
    - BUILD tree structure from rdfs:subClassOf relationships
    - RENDER as nested <ul><li> HTML structure
    - ADD CSS classes for styling
    - IMPLEMENT collapsible nodes (click to expand/collapse)

  VALIDATION:
    - Render in test HTML
    - Expected: Nested tree with TunnelingCycle, ProcessStage with 6 children, etc.

Task 8: Timeline Visualization
  CREATE: src/visualizers/cycle-timeline.js
    - IMPORT vis-timeline: import { Timeline } from 'vis-timeline/standalone';
    - EXPORT function renderCycleTimeline(store, containerId)
    - QUERY stages with start/end times from tunnel_instances.ttl
    - CONVERT to Vis.js items format
    - GROUP by cycle
    - COLOR-CODE by stage type (drilling=blue, charging=yellow, blasting=red, etc.)
    - ADD click handlers for stage details

  PATTERN:
    const items = stagesData.map(stage => ({
      id: stage.uri,
      content: stage.label,
      start: new Date(stage.startTime),
      end: new Date(stage.endTime),
      group: stage.cycleNumber,
      className: `stage-${stage.type}`
    }));

    const timeline = new Timeline(container, items, groups, options);

  VALIDATION:
    - Render in test HTML with tunnel_instances.ttl
    - Expected: Horizontal timeline with colored bars for each stage

Task 9: Stage Sequence Flowchart
  CREATE: src/visualizers/stage-sequence.js
    - USE Cytoscape.js with dagre layout
    - QUERY :precedes relationships
    - RENDER stages as nodes in sequence
    - SHOW arrows between stages
    - DISPLAY stage labels in Korean
    - ADD stage durations on nodes

  VALIDATION:
    - Render in test HTML
    - Expected: Flowchart showing Drilling → Charging → Blasting → Ventilation → Mucking → Support

Task 10: Utility Functions
  CREATE: src/utils/fetchTurtle.js
    - EXPORT async function fetchTurtle(url)
    - WRAPPER around fetch with error handling

  CREATE: src/utils/formatters.js
    - EXPORT function formatURI(uri) - extract local name
    - EXPORT function formatDateTime(isoString) - human-readable
    - EXPORT function extractLabel(store, uri, lang) - get rdfs:label

  VALIDATION:
    - Unit test each function in browser console

Task 11: Website A - Ontology Viewer
  CREATE: index.html
    - HTML5 structure with semantic tags
    - INCLUDE <script type="module" src="src/parsers/turtle-parser.js">
    - INCLUDE <script type="module" src="src/visualizers/ontology-graph.js">
    - INCLUDE <script type="module" src="src/visualizers/class-hierarchy.js">
    - LAYOUT: Header, sidebar (hierarchy), main (graph), footer
    - LOADING indicator while parsing ontology
    - ERROR display if parsing fails

  PATTERN:
    <div id="app">
      <header><h1>터널 온톨로지 뷰어</h1></header>
      <div class="container">
        <aside id="hierarchy-panel"></aside>
        <main id="graph-panel"></main>
      </div>
    </div>

    <script type="module">
      import {parseTurtleFile} from './src/parsers/turtle-parser.js';
      import {renderOntologyGraph} from './src/visualizers/ontology-graph.js';
      import {renderClassHierarchy} from './src/visualizers/class-hierarchy.js';

      async function init() {
        try {
          const {store} = await parseTurtleFile('src/ontology/tunneling_schema.ttl');
          renderOntologyGraph(store, 'graph-panel');
          renderClassHierarchy(store, 'hierarchy-panel');
        } catch (error) {
          console.error('Failed to load ontology:', error);
        }
      }

      init();
    </script>

  VALIDATION:
    - Run: npm run dev
    - Open: http://localhost:8080/index.html
    - Expected: Graph and hierarchy render without errors

Task 12: Website B - Process Timeline
  CREATE: process.html
    - HTML5 structure
    - INCLUDE <script type="module" for timeline modules
    - LAYOUT: Header, timeline container, details panel
    - LOAD tunnel_instances.ttl
    - RENDER timeline and stage sequence

  VALIDATION:
    - Open: http://localhost:8080/process.html
    - Expected: Timeline with 2-3 cycles, each with 6 colored stages

Task 13: CSS Styling
  CREATE: styles/main.css
    - RESET styles, box-sizing
    - Base typography and colors
    - Responsive grid layout
    - Loading indicators

  CREATE: styles/ontology-viewer.css
    - Graph container sizing (100% viewport)
    - Sidebar width (25%) with scrolling
    - Hierarchy tree styling

  CREATE: styles/process-timeline.css
    - Timeline container height
    - Stage color classes (.stage-drilling, .stage-charging, etc.)
    - Details panel styling

  VALIDATION:
    - Check both websites in Chrome, Firefox
    - Test responsive behavior on smaller screens
    - Expected: Clean, professional appearance

Task 14: Documentation & README
  UPDATE: CLAUDE.md (if needed)
    - Ensure instructions match actual implementation

  CREATE: README.md (optional, if user requests)
    - Project overview
    - Installation: npm install
    - Running: npm run dev
    - File structure
    - Screenshot placeholders

  VALIDATION:
    - Follow README instructions from scratch
    - Expected: Works for new developer
```

---

### Integration Points

```yaml
ONTOLOGY FILES:
  - location: src/ontology/
  - pattern: "Separate schema (.ttl) from instances (.ttl)"
  - validation: "Python script using rdflib parses both files"

JAVASCRIPT MODULES:
  - pattern: "ES6 import/export, type='module' in HTML"
  - loading: "Async fetch for .ttl files, Promise-based parsing"
  - error handling: "try/catch with user-friendly error display"

VISUALIZATION LIBRARIES:
  - cytoscape: "npm install cytoscape@^3.26.0"
  - vis-timeline: "npm install vis-timeline@^7.7.2"
  - n3: "npm install n3@^1.17.0"

HTML STRUCTURE:
  - index.html: "Ontology viewer with graph + hierarchy"
  - process.html: "Timeline viewer with cycle details"
  - pattern: "Single-page apps, no routing needed"

CSS ORGANIZATION:
  - main.css: "Base styles, resets, typography"
  - ontology-viewer.css: "Graph-specific styles"
  - process-timeline.css: "Timeline-specific styles"
```

---

## Validation Loop

### Level 1: Ontology Syntax Validation

```bash
# Run Python validation script
cd C:\MYCLAUDE_PROJECT\tunnelontology
python scripts/validate_turtle.py

# Expected output:
# ✓ Schema parsed successfully
# ✓ Instances parsed successfully
# ✓ Found 15 classes
# ✓ Found 3 cycles
# ✓ Stage sequence correct for cycle001

# If errors occur:
# - Read rdflib parsing error message carefully
# - Check line number mentioned in error
# - Common issues: missing period, wrong prefix, unquoted literals
```

### Level 2: Browser Loading Test

```bash
# Start development server
npm run dev

# Browser opens at http://localhost:8080

# Manual checks:
1. Open browser DevTools console (F12)
2. Navigate to index.html
3. Check for errors in console
4. Expected: "Loaded X quads from ontology"
5. Expected: Graph renders with nodes and edges

# If errors occur:
# - Check network tab for 404s (missing .ttl files)
# - Check console for JavaScript errors
# - Verify file paths in import statements
```

### Level 3: Visualization Validation

```javascript
// Open browser console and run test queries

// Test 1: Check store has data
console.log('Store size:', store.size);
// Expected: > 0

// Test 2: Query classes
const classes = store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class');
console.log('Classes found:', classes.length);
// Expected: At least 15 (TunnelingCycle + 6 stages + equipment + support members)

// Test 3: Query instances
const cycles = store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://example.org/tunneling-ontology#TunnelingCycle');
console.log('Cycles found:', cycles.length);
// Expected: 2-3 cycles

// If tests fail:
// - Verify .ttl files loaded correctly
// - Check URIs match exactly (including # at end)
// - Verify N3.Store.getQuads() syntax
```

### Level 4: Cross-Browser Testing

```yaml
Test Matrix:
  - Chrome (latest): index.html + process.html
  - Firefox (latest): index.html + process.html
  - Safari (latest, if on Mac): index.html + process.html
  - Edge (latest): index.html + process.html

Test Cases:
  1. Load index.html → Graph renders
  2. Click node → Details appear
  3. Zoom/pan → Graph responds
  4. Load process.html → Timeline renders
  5. Click stage → Details appear
  6. Scroll timeline → Works smoothly

Known Issues:
  - Safari: May need polyfills for some ES6 features
  - Firefox: Slightly different font rendering
  - All: Test with DevTools network throttling (Fast 3G)
```

### Level 5: Python Validation Extended

```python
# scripts/validate_turtle.py - Extended validation

import rdflib
from rdflib import Graph, Namespace, RDF, RDFS, OWL

# Load ontology
g = Graph()
g.parse("src/ontology/tunneling_schema.ttl", format="turtle")
g.parse("src/ontology/tunnel_instances.ttl", format="turtle")

# Define namespace
TUNNEL = Namespace("http://example.org/tunneling-ontology#")

# Validation 1: Check all 6 stage classes exist
stages = ['Drilling', 'Charging', 'Blasting', 'Ventilation', 'Mucking', 'SupportInstallation']
for stage in stages:
    assert (TUNNEL[stage], RDF.type, OWL.Class) in g, f"Missing class: {stage}"
print("✓ All 6 NATM stages defined")

# Validation 2: Check cycles have all stages
cycles = list(g.subjects(RDF.type, TUNNEL.TunnelingCycle))
for cycle in cycles:
    stages_in_cycle = list(g.objects(cycle, TUNNEL.hasStage))
    assert len(stages_in_cycle) == 6, f"Cycle {cycle} missing stages"
print(f"✓ All {len(cycles)} cycles have 6 stages")

# Validation 3: Check temporal sequence
for cycle in cycles:
    drilling_stages = [s for s in g.objects(cycle, TUNNEL.hasStage)
                       if (s, RDF.type, TUNNEL.Drilling) in g]
    charging_stages = [s for s in g.objects(cycle, TUNNEL.hasStage)
                       if (s, RDF.type, TUNNEL.Charging) in g]

    if drilling_stages and charging_stages:
        drilling_time = g.value(drilling_stages[0], TUNNEL.startTime)
        charging_time = g.value(charging_stages[0], TUNNEL.startTime)
        assert drilling_time < charging_time, "Drilling must precede Charging"
print("✓ Temporal sequence validated")

# Run with: python scripts/validate_turtle.py
# Expected: All assertions pass, no errors
```

---

## Final Validation Checklist

- [ ] Ontology parses in Python (rdflib) without errors
- [ ] All 6 NATM stage classes defined in schema
- [ ] Sample instances include 2-3 complete cycles
- [ ] Each cycle has all 6 stages with timestamps
- [ ] npm install completes without errors
- [ ] index.html loads and renders graph visualization
- [ ] process.html loads and renders timeline
- [ ] Graph is interactive (zoom, pan, click nodes)
- [ ] Timeline shows stages in chronological order
- [ ] Class hierarchy tree view works
- [ ] Korean labels display correctly (UTF-8)
- [ ] Tested in Chrome, Firefox, Edge
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive (tested on tablet size)
- [ ] Python validation script passes all assertions

---

## Anti-Patterns to Avoid

### Ontology Design
- ❌ **Don't** mix schema and instance data in one .ttl file
- ❌ **Don't** use English class names with Korean URIs (use English URIs, Korean labels)
- ❌ **Don't** forget domain/range constraints on properties
- ❌ **Don't** create circular class hierarchies (A subClassOf B, B subClassOf A)
- ❌ **Don't** skip rdfs:label - needed for visualization
- ❌ **Don't** hardcode URIs in JavaScript - use prefixes and expand

### JavaScript Implementation
- ❌ **Don't** use synchronous XHR for loading .ttl files - use async fetch
- ❌ **Don't** parse Turtle manually - use N3.js library
- ❌ **Don't** forget error handling for fetch/parse operations
- ❌ **Don't** load large ontologies without performance testing
- ❌ **Don't** create global variables - use ES6 modules
- ❌ **Don't** forget to check browser console for errors

### Visualization
- ❌ **Don't** show entire large graph at once - overwhelming
- ❌ **Don't** use tiny fonts for node labels
- ❌ **Don't** forget loading indicators for async operations
- ❌ **Don't** hardcode colors - use CSS classes
- ❌ **Don't** forget mobile/tablet testing
- ❌ **Don't** ignore browser compatibility (test multiple browsers)

### Process Workflow
- ❌ **Don't** skip validation after each task
- ❌ **Don't** move to frontend before ontology validates
- ❌ **Don't** create all files at once - incremental implementation
- ❌ **Don't** ignore the pizza example - it's a proven pattern
- ❌ **Don't** skip reading ontology101.pdf - has naming conventions

---

## Confidence Score Justification

**Score: 8/10** for successful one-pass implementation

### Strengths (+5):
- ✅ Excellent existing examples (pizza ontology)
- ✅ Clear requirements in INITIAL.md
- ✅ Proven libraries (N3.js, Cytoscape.js, Vis.js)
- ✅ Python validation pattern available
- ✅ Claude AI agent framework for assistance

### Risks (-2):
- ⚠️ ontology101.pdf content unknown (binary file) - may contain critical naming rules
- ⚠️ Developer's familiarity with OWL/RDF standards unknown
- ⚠️ No existing triplestore/SPARQL endpoint (client-side only)
- ⚠️ Timeline visualization for cyclic workflows has known challenges

### Mitigations (+1):
- ✓ Validation loops at every task
- ✓ Python script catches ontology errors early
- ✓ Pizza example provides proven pattern to mirror
- ✓ Incremental task breakdown allows fixing issues early

**Overall**: High confidence due to excellent examples, clear requirements, and robust validation strategy. Main unknowns are ontology101.pdf conventions and developer's ontology experience, but validation loops should catch issues early.

---

## Next Steps After PRP Execution

1. **Execute PRP**: Use `/execute-prp PRPs/tunnel-ontology-visualization-system.md`
2. **Validation Gates**: Use `validation-gates` agent after implementation
3. **Documentation**: Use `documentation-manager` agent to generate final docs
4. **Iteration**: If any validation fails, fix and re-validate

**Estimated Implementation Time**: 12-16 hours for experienced developer

---

**END OF PRP**