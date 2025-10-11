# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tunnel Excavation Process Ontology & Visualization System**

This project builds an ontology for the NATM (New Austrian Tunneling Method) tunnel face excavation process and creates web-based visualization tools to display and explain the ontology models and the cyclic excavation workflow.

### Core Objectives

1. **Build Ontology**: Model the repetitive tunnel face excavation cycle using OWL/RDF (Turtle format)
   - Process: Drilling → Charging → Blasting → Ventilation → Mucking → Support Installation
   - Capture entities, properties, relationships, and temporal sequences

2. **Visualization Website A**: Display and explain the ontology modeling results
   - Interactive visualization of ontology schema and instances
   - Educational interface for understanding the tunnel excavation domain model

3. **Visualization Website B**: Display the tunnel face excavation cyclic process
   - Visual representation of the 6-stage excavation workflow
   - Timeline and sequence visualization of each cycle

### Tech Stack

- **Ontology Language**: OWL 2 Web Ontology Language (Turtle/RDF format)
- **Web Technologies**: HTML5, CSS3, JavaScript (ES6+ modules)
- **Potential Libraries**:
  - Ontology visualization: D3.js, Cytoscape.js, or WebVOWL
  - Process visualization: Timeline.js, Vis.js, or custom SVG/Canvas
  - RDF parsing: rdflib.js or N3.js

## Development Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run linting checks
npm run lint

# Run tests (if applicable)
npm test
```

## Project Structure

```
tunnelontology/
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # Specialized task agents
│   │   ├── code-analyst.md     # Analyzes codebase structure
│   │   ├── web-researcher.md   # Researches external docs
│   │   ├── validation-gates.md # Testing specialist
│   │   └── documentation-manager.md
│   ├── commands/               # Custom slash commands
│   │   ├── generate-prp.md     # Generate Product Requirements Prompt
│   │   ├── execute-prp.md      # Execute PRP with validation
│   │   └── primer.md
│   └── settings.local.json
│
├── PRPs/                       # Product Requirements Prompts
│   └── templates/
│       └── prp_base.md         # Feature implementation template
│
├── examples/                   # Reference examples
│   ├── schema/
│   │   └── tunneling_ontology.ttl    # Schema definition example
│   ├── instances/
│   │   └── cycle_001_data.ttl        # Instance data example
│   └── ontology101.pdf         # Internal modeling guidelines
│
├── assets/                     # Static assets (images, icons)
├── src/                        # Source code (to be created)
│   ├── ontology/              # Ontology files (.ttl)
│   ├── parsers/               # RDF parsing utilities
│   ├── visualizers/           # Visualization components
│   └── utils/                 # Helper functions
│
├── styles/                     # CSS stylesheets
│   └── main.css
│
├── index.html                  # Main entry (ontology viewer)
├── process.html                # Process workflow viewer
└── package.json                # Dependencies and scripts
```

## Ontology Architecture

### NATM Tunnel Excavation Cycle

The excavation process follows a repeating 6-stage cycle:

1. **천공 (Drilling)**: Drill holes in the tunnel face
   - 심빼기공 (Cut holes): Central holes for initial breakage
   - 주변공 (Perimeter holes): Outer boundary holes
   - 보조공 (Helper holes): Intermediate holes for even distribution

2. **장약 (Charging)**: Load explosives into drill holes with detonators

3. **발파 (Blasting)**: Sequential detonation starting from cut holes

4. **환기 (Ventilation)**: Exhaust harmful gases and dust

5. **버력처리 (Mucking)**: Remove excavated rock debris using loaders/conveyors

6. **지보재 설치 (Support Installation)**: Install support members
   - Shotcrete: Surface reinforcement
   - Rock bolts: Anchor into rock mass
   - Lattice girders: Structural steel support

### Ontology Schema Pattern

```turtle
# Core Classes Hierarchy
:ProcessStage (abstract)
  ├── :Drilling
  ├── :Charging
  ├── :Blasting
  ├── :Ventilation
  ├── :Mucking
  └── :SupportInstallation

:TunnelingCycle
  └── hasStage → :ProcessStage

:Equipment
  └── :DrillingMachine

:SupportMember
  ├── :Shotcrete
  ├── :RockBolt
  └── :LatticeGirder

# Key Properties
:cycleNumber (integer)
:advanceLength (decimal, meters)
:startTime (dateTime)
:createsHole (Drilling → DrillHole)
:installsSupport (SupportInstallation → SupportMember)
```

### Data Modeling Principles

- **Follow Internal Guidelines**: Adhere to naming conventions in [examples/ontology101.pdf](examples/ontology101.pdf)
- **W3C OWL 2 Compliance**: Use standard OWL constructs (SubClassOf, DatatypeProperty, ObjectProperty)
- **Temporal Modeling**: Capture sequence and timing of process stages
- **Reusability**: Design schema for multiple tunnel projects
- **Clarity**: Use Korean labels (rdfs:label) for domain clarity, English URIs for technical clarity

## Development Workflow

### PRP-Driven Development

This project uses a structured **Product Requirements Prompt (PRP)** approach:

1. **Generate PRP**:
   ```bash
   /generate-prp INITIAL.md
   ```
   - Invokes `code-analyst` agent to analyze existing codebase
   - Invokes `web-researcher` agent to gather OWL/RDF documentation and best practices
   - Synthesizes comprehensive implementation plan in `PRPs/` directory

2. **Execute PRP**:
   ```bash
   /execute-prp PRPs/[generated-prp].md
   ```
   - Creates backup/branch before implementation
   - Implements features step-by-step with validation gates
   - Iterative error fixing (max 3 attempts per validation)
   - Progress reporting every 3 steps

3. **Validation**: Use `validation-gates` agent after implementation
   - Validates ontology syntax (Turtle parser)
   - Runs linting checks
   - Verifies web visualizations load correctly
   - Checks for logical consistency

## Code Standards

### Ontology Files (.ttl)

- **Naming Convention**: Follow `examples/ontology101.pdf` guidelines
- **URI Pattern**: `http://example.org/tunneling-ontology#`
- **Prefixes**: Consistent use of standard prefixes (owl:, rdf:, rdfs:, xsd:)
- **Comments**: Use `# comment` syntax to explain complex relationships
- **Modularity**: Separate schema definitions from instance data
- **Validation**: Validate Turtle syntax using online validators or rdflib.js

### JavaScript Modules

- **ES6+ Syntax**: Use modern JavaScript with import/export
- **Async/Await**: For file loading and RDF parsing operations
- **Error Handling**: Try...catch blocks with meaningful error messages
- **Naming**: Clear, descriptive function names (e.g., `parseOntologySchema`, `renderCycleTimeline`)
- **Comments**: Document complex ontology traversal logic

### Visualization Components

- **Responsive Design**: Work on desktop and mobile browsers
- **Interactive**: Allow zooming, panning, filtering of ontology graphs
- **Educational**: Clear labels, tooltips, and legends
- **Performance**: Optimize for large ontology graphs (lazy loading, virtualization)

## Key Documentation

### Essential Reading (MUST READ before implementation)

1. **[examples/ontology101.pdf](examples/ontology101.pdf)**: Internal modeling guidelines
   - Naming conventions, design principles, best practices

2. **[W3C OWL 2 Overview](https://www.w3.org/TR/owl2-overview/)**: OWL 2 standard specification
   - Core concepts: SubClassOf, DatatypeProperty, ObjectProperty, domain, range

3. **[Examples in this repo](examples/)**:
   - `schema/tunneling_ontology.ttl`: Schema blueprint
   - `instances/cycle_001_data.ttl`: Instance data example

### Reference Materials (helpful but not critical)

- [Smart Factory Ontology Case Study](https://www.google.com/search?q=smart-factory-ontology-case-study): Similar domain modeling
- [Digital Twins for Built Environment](https://www.mdpi.com/2076-3417/11/19/9191): Academic research on construction ontologies
- [Korean Tunnel Standard Specification (KCS 11 40 00)](https://www.codil.or.kr/): Domain terminology and procedures
- [Palantir Foundry Ontology](https://www.palantir.com/docs/foundry/ontology/overview/): Commercial ontology system as benchmark

## Testing & Validation

### Ontology Validation

```bash
# Validate Turtle syntax
npm run validate-ontology

# Check logical consistency (using reasoner)
npm run reason-ontology
```

### Web Visualization Testing

1. **Manual Browser Testing**:
   - Load ontology files successfully
   - Render graph visualizations correctly
   - Test interactive features (zoom, pan, filter)
   - Verify timeline animations for process cycles

2. **Cross-browser Testing**: Chrome, Firefox, Safari, Edge

3. **Performance Testing**:
   - Large ontology graphs (>1000 triples)
   - Animation frame rates

## Custom Slash Commands

- `/generate-prp <feature-file>`: Generate comprehensive PRP by analyzing codebase and researching docs
- `/execute-prp <prp-file>`: Execute PRP with safety checks and validation gates
- `/primer`: Initialize Claude session by reading this CLAUDE.md

## Session Management

### Context Preservation
After major milestones (ontology schema complete, visualization working), summarize:
- Completed work
- Resolved issues
- Next steps

This enables effective session recovery if interrupted.

### Token Management
Use `/compact` when conversations get long:
- Before starting new major features
- When switching between ontology modeling and web development

### Session Recovery
Use `/primer` to restore context by re-reading this CLAUDE.md file.

## Anti-Patterns to Avoid

- ❌ Don't create ontology classes without consulting `ontology101.pdf` naming conventions
- ❌ Don't mix schema and instance data in the same .ttl file
- ❌ Don't hardcode ontology data in JavaScript - load from .ttl files
- ❌ Don't skip Turtle syntax validation before committing
- ❌ Don't create visualization without considering performance for large graphs
- ❌ Don't use proprietary ontology formats - stick to W3C standards (OWL/RDF)
