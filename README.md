# Fablet

> A conceptual architecture for autonomous AI swarm orchestration in content creation.

Fablet is a self-orchestrating network of agentic AIs. Tell it what to make — a course, a
channel, a product, a workflow — and specialized agents plan, build, run, and refine it
for you. No engineers. No code. No limits. Just intent, turned into something real.

This document is the canonical specification for the Fablet architecture. It is
intentionally honest: Fablet integrates **existing, proven AI techniques** into a coherent
system for a specific problem domain. It does not claim fundamentally new AI capabilities
or superhuman performance.

---

## Table of Contents

1. [Overview](#1-overview)
2. [The Problem Fablet Solves](#2-the-problem-fablet-solves)
3. [Architecture Summary](#3-architecture-summary)
4. [The Content Identity Warehouse](#4-the-content-identity-warehouse)
5. [Agent Model](#5-agent-model)
6. [Orchestration Framework](#6-orchestration-framework)
7. [Training & Fine-Tuning](#7-training--fine-tuning)
8. [Semantic Coherence](#8-semantic-coherence)
9. [Economic Value Proposition](#9-economic-value-proposition)
10. [Scalability](#10-scalability)
11. [Research Contribution](#11-research-contribution)
12. [Implementation Strategy](#12-implementation-strategy)
13. [Model-Agnostic Design](#13-model-agnostic-design)
14. [Quality Assurance](#14-quality-assurance)
15. [The Human Role](#15-the-human-role)
16. [Web Dashboard](#16-web-dashboard)
17. [Mobile Application](#17-mobile-application)
18. [Maintenance & Versioning](#18-maintenance--versioning)
19. [Multi-Genre Adaptability](#19-multi-genre-adaptability)
20. [Practical Limitations](#20-practical-limitations)
21. [Future Trajectory](#21-future-trajectory)
22. [Open Questions](#22-open-questions)
23. [Validation Methodology](#23-validation-methodology)
24. [Deployment Model](#24-deployment-model)
25. [Intellectual Honesty](#25-intellectual-honesty)
26. [Value of the Work](#26-value-of-the-work)
27. [Swarm Coordination Principle](#27-swarm-coordination-principle)
28. [Warehouse Engineering](#28-warehouse-engineering)
29. [Pragmatic Fine-Tuning](#29-pragmatic-fine-tuning)
30. [Iterative Refinement](#30-iterative-refinement)
31. [Economic Analysis](#31-economic-analysis)
32. [Competitive Positioning](#32-competitive-positioning)
33. [Technical Feasibility](#33-technical-feasibility)
34. [Risks & Challenges](#34-risks--challenges)
35. [Long-Term Vision](#35-long-term-vision)
36. [Practical Milestones](#36-practical-milestones)
37. [Contribution to Knowledge](#37-contribution-to-knowledge)
38. [System Requirements](#38-system-requirements)
39. [Installation](#39-installation)
40. [Configuration](#40-configuration)
41. [Warehouse Schema Reference](#41-warehouse-schema-reference)
42. [Agent Catalog & Specs](#42-agent-catalog--specs)
43. [Genre Templates](#43-genre-templates)
44. [API Reference](#44-api-reference)
45. [CLI Reference](#45-cli-reference)
46. [Deployment Runbooks](#46-deployment-runbooks)
47. [Benchmarking](#47-benchmarking)
48. [Roadmap](#48-roadmap)
49. [FAQ](#49-faq)
50. [Glossary](#50-glossary)
51. [References](#51-references)
52. [License](#52-license)

---

## 1. Overview

Fablet is a conceptual architecture for autonomous AI swarm orchestration in content
creation that addresses the fundamental economic asymmetry between the exponentially
growing demand for diverse digital content and the prohibitive cost of traditional
production methods.

The architecture operates on the premise that the true bottleneck in generative AI
adoption is **not** the availability of foundation models but the **fragmented and
manual nature of orchestrating them into coherent workflows**. Organizations currently
assemble disjointed collections of specialized tools — each requiring separate
integration, separate prompting strategies, separate output validation, and separate
quality control — resulting in production processes that are almost as labor-intensive
as traditional content creation, merely shifting the nature of the work from manual
crafting to manual orchestration without fundamentally solving the scalability problem.

---

## 2. The Problem Fablet Solves

### 2.1 The economic asymmetry

The demand for diverse digital content is growing exponentially. Short-form video,
educational modules, localized advertising, internal training, and personalized media
all compete for the same scarce resource: skilled human production time.

Traditional production scales linearly with headcount. Generative models promise to
break that curve, but in practice they shift the bottleneck rather than remove it.

### 2.2 The orchestration tax

Adopting generative AI today means:

- Integrating a language model for scripting.
- Integrating a vision model for storyboards and assets.
- Integrating a speech model for voice.
- Integrating a video/motion model for assembly.
- Writing glue code to pass state between them.
- Writing validation to catch inconsistencies.
- Re-writing all of it when one model is swapped.

This "orchestration tax" is where most of the labor goes. Fablet's thesis is that the
tax can be automated by giving agents a **shared semantic understanding** of the content
instead of rigid interfaces.

---

## 3. Architecture Summary

The Fablet architecture has three load-bearing parts:

1. **Specialized agents** — fine-tuned foundation models, each owning one expertise
   domain (narrative, visual, temporal, audio, validation, rendering, …).
2. **The Content Identity Warehouse** — a hybrid structured + semantic store that is the
   swarm's shared memory.
3. **The orchestration framework** — drives workflow patterns from the swarm's shared
   understanding of production state.

These three parts are deliberately decoupled so that each can evolve independently.

---

## 4. The Content Identity Warehouse

The semantic glue that binds this swarm together is the **Content Identity Warehouse**,
a hybrid data infrastructure combining:

- **Structured storage** for deterministic relationships (PostgreSQL).
- **Vector embeddings** for semantic understanding (pgvector or equivalent).

It serves not as a passive repository but as an **active knowledge graph** where every
asset, relationship, and generation decision is captured and made queryable.

### 4.1 What the warehouse knows

Agents reason about content at a conceptual level:

- Characters have **histories and relationships**.
- Scenes have **emotional tones and narrative functions**.
- Props have **significance to plot developments**.

This is in contrast to treating content as an opaque collection of files and parameters.

### 4.2 Why a hybrid store

| Concern | Best representation | Store |
| --- | --- | --- |
| `character_x is_married_to character_y` | Deterministic edge | Relational |
| "find scenes with a tense, hopeful tone" | Similarity search | Vector |
| Generation decision audit trail | Append-only log | Relational + vector |

Neither store alone is sufficient; the hybrid is the point.

---

## 5. Agent Model

The Fablet architecture proposes a unified swarm intelligence where a **flexible number**
of specialized AI agents — each built through fine-tuning of existing foundation models on
domain-specific datasets — collaborate through a shared semantic framework.

Agents communicate **not through rigid APIs** but through a common understanding of:

- content structure,
- narrative logic,
- quality standards.

### 5.1 Expertise domains

Content generation is inherently multi-faceted, requiring distinct expertise across:

- narrative development,
- visual design,
- temporal coordination,
- audio synthesis,
- quality validation,
- output rendering.

These domains are embodied by fine-tuned foundation models adapted to their roles through
supervised learning on curated datasets, enabling efficiency and consistency that
general-purpose models cannot achieve when forced to handle the full complexity of content
production.

### 5.2 Agents are not a fixed set

The agents in this swarm are **not** predefined as a fixed set of six or any other
arbitrary number. They are instantiated based on the requirements of each specific
production.

When the existing agent roster lacks a necessary capability, the architecture supports
creating a new agent type through fine-tuning of a foundation model on appropriate domain
data. The swarm thus evolves its composition organically as new requirements emerge or new
foundation models become available.

---

## 6. Orchestration Framework

The swarm operates through a flexible orchestration framework that supports multiple
workflow patterns depending on production requirements.

### 6.1 Patterns

| Pattern | Use | Behavior |
| --- | --- | --- |
| Linear pipeline | straightforward content | agents process sequentially |
| Parallel processing | complex productions | independent elements generated simultaneously |
| Iterative refinement | quality-critical output | agents cycle generation → validation |
| Human-in-the-loop | sensitive decisions | expert oversight interleaved at strategic points |

The orchestration logic is driven by the swarm's **shared understanding of production
state**, not by rigid pre-programmed workflows.

---

## 7. Training & Fine-Tuning

The training and fine-tuning approach for each agent type builds on proven techniques from
the broader machine learning community.

| Modality | Base | Method |
| --- | --- | --- |
| Language | Llama / Mistral | SFT / instruction tuning on domain corpora |
| Vision | ViT family / CLIP / DINOv2 | transfer learning on annotated datasets |
| Audio | Tacotron / VITS | documented TTS fine-tuning protocols |
| Multimodal | aligned encoders | cross-modal fine-tuning preserving semantics |

Specialized fine-tuning on focused datasets produces agents that are more reliable,
consistent, and efficient than general-purpose models attempting the full complexity of
content creation — much as specialized models in other domains consistently outperform
generalists on targeted tasks.

---

## 8. Semantic Coherence

The swarm's ability to maintain semantic coherence across the entire production process
stems from the Warehouse's role as a persistent, shared memory that all agents can query
and contribute to.

Concrete examples:

- The **Scripting Agent** generates dialogue referencing character attributes stored in
  the warehouse.
- The **Animation Logic Agent** generates movements respecting spatial relationships
  captured in the warehouse.
- The **Quality Assurance Agent** validates outputs against the generation history
  preserved in the warehouse.

Any number of other specialized agents coordinate their efforts through this shared
understanding of what has been created and what remains to be done.

---

## 9. Economic Value Proposition

The architecture reduces the cost of high-quality content creation by replacing expensive
manual orchestration with automated swarm coordination.

- Primary cost becomes **computational resources** to run fine-tuned models and manage the
  warehouse.
- This replaces the thousands of human-hours that traditional animation and video
  production demand.

The specific cost reductions depend on:

- the foundation models used,
- the complexity of the content,
- the quality standards required.

---

## 10. Scalability

Scalability derives from the modular nature of both the agent architecture and the
warehouse infrastructure.

- Individual agents can be **replicated** to handle increased loads.
- New agent types can be **added** to introduce new capabilities.
- The warehouse can be **scaled independently** to support growing asset libraries and
  production histories.

The system grows from small-scale prototype deployments to enterprise-level production
environments without fundamental architectural changes.

---

## 11. Research Contribution

The research contribution lies in the **integration** of multiple established techniques:

- fine-tuned foundation models,
- semantic data infrastructure,
- multi-agent coordination frameworks,
- iterative quality refinement,

…into a coherent architecture specifically designed for the content creation problem
domain. It does not claim novelty in any individual component.

The contribution also includes the systematic evaluation of this integrated architecture
against relevant benchmarks to demonstrate that the whole is greater than the sum of its
parts when measured against practical content production metrics.

---

## 12. Implementation Strategy

Pragmatic technology choices balance capability with accessibility:

| Layer | Choice | Rationale |
| --- | --- | --- |
| Language | Llama / Mistral | permissive licenses, modest fine-tune cost |
| Vision | CLIP / DINOv2 | robust representations, similarity search |
| Speech | Tacotron / VITS | extensively validated for TTS |
| Structured store | PostgreSQL | well-understood, widely deployed |
| Semantic store | pgvector | vector extension for embeddings |

---

## 13. Model-Agnostic Design

The architecture explicitly acknowledges that foundation models will continue to evolve
rapidly. It therefore does **not** depend on any specific model architecture or provider.

It defines **interfaces and data formats** that allow models to be swapped in and out as
better alternatives become available. The shared semantic warehouse ensures the swarm's
collective understanding survives individual model replacements.

---

## 14. Quality Assurance

Quality assurance mechanisms go beyond simple format checking. They include **semantic
validation** that compares generated outputs against the content specifications encoded
in the warehouse.

This enables the system to detect and correct inconsistencies in:

- character behavior,
- plot logic,
- visual continuity,
- tonal appropriateness,

…that would be impossible to catch with simple syntactic validation rules.

---

## 15. The Human Role

The human role is reframed from direct content creation to **strategic direction and
quality verification**.

Users can:

- guide high-level creative decisions,
- intervene when automated processes encounter ambiguity or uncertainty,
- provide feedback the swarm incorporates into future behavior through the warehouse's
  persistent memory of successful and unsuccessful productions.

---

## 16. Web Dashboard

The web dashboard provides visibility into the swarm's operations. It is the primary
surface for the human role described above: it exposes production state, lets users
approve or redirect, and records feedback.

Key views:

- **Production board** — active swarms and their stage.
- **Warehouse explorer** — entities, relationships, embeddings.
- **Agent registry** — instantiated agents and their fine-tune lineage.
- **Approval queue** — human-in-the-loop decision points.

---

## 17. Mobile Application

The cross-platform mobile application extends human interaction to mobile contexts,
enabling preview, approval, and submission from anywhere.

Creative professionals increasingly work across multiple devices and locations and require
access that is not tethered to a single workstation.

---

## 18. Maintenance & Versioning

The maintenance capabilities address the overlooked challenge of keeping content current
in rapidly evolving information environments.

The warehouse's version control and relationship tracking enable efficient updates to
existing content when:

- underlying facts change,
- content must be adapted for new platforms or audiences,

…maintaining consistency across content libraries without requiring complete regeneration.

---

## 19. Multi-Genre Adaptability

Multi-genre adaptability emerges naturally from the warehouse's ability to store
**genre-specific templates** and the agents' ability to adapt behavior based on them.

Templates define:

- visual styles,
- motion profiles,
- audio characteristics,
- narrative conventions.

The same agent swarm can generate comedy sketches, educational animations, corporate
communications, or documentary content by simply loading different template configurations
into the warehouse — no changes to the agents themselves.

---

## 20. Practical Limitations

The practical limitations are honestly acknowledged:

- The system **cannot** achieve the quality of top-tier professional studios employing
  hundreds of skilled artists.
- It **cannot** handle arbitrary complexity or novelty beyond its foundation models.
- It **requires** careful curation of training data for each agent type.
- It **depends** on computational infrastructure that, while modest versus training from
  scratch, is still a meaningful investment.

---

## 21. Future Trajectory

As foundation models improve in capability and efficiency, the agents built upon them
similarly improve. The warehouse architecture provides a stable foundation that persists
across generations of models, accumulating knowledge and improving the swarm's collective
intelligence over time.

---

## 22. Open Questions

Avenues for future investigation:

- optimal number and specialization of agents per content type,
- most effective training strategies for domain-specific capabilities,
- balance between automated QA and human oversight,
- economic thresholds at which swarm production beats alternatives.

---

## 23. Validation Methodology

Validation focuses on practical metrics:

- **throughput**: minutes of content per hour of computation,
- **quality**: scores vs. professional human evaluations,
- **consistency**: across generated segments,
- **satisfaction**: user-reported.

Targets are calibrated against traditional production baselines, not aspirational
superhuman claims.

---

## 24. Deployment Model

The deployment model prioritizes practical accessibility. The system runs on:

- available cloud infrastructure, or
- local high-performance workstations.

Specific computational requirements vary with the foundation models chosen, content
complexity, and quality standards demanded.

---

## 25. Intellectual Honesty

This is a proposal for integrating existing AI techniques into a coherent architecture for
a specific problem domain. It is **not** a claim of having discovered fundamentally new
AI capabilities or achieved breakthrough performance beyond established benchmarks.

---

## 26. Value of the Work

The value lies in:

- practical integration of proven techniques into a system addressing a real, growing need,
- systematic evaluation of whether the integration delivers promised benefits in cost,
  quality, and scalability.

---

## 27. Swarm Coordination Principle

Content creation is inherently collaborative, requiring multiple specialized capabilities
working in concert. The most effective collaboration is through a **shared understanding
of the content being created**, not through rigid interfaces or predetermined workflows.

---

## 28. Warehouse Engineering

The Content Identity Warehouse is conceptually straightforward — structured data plus
vector embeddings — but its implementation and integration into a working system is a
significant engineering effort central to feasibility and value.

---

## 29. Pragmatic Fine-Tuning

The agent fine-tuning approach, step by step:

1. Start with an established foundation model.
2. Curate appropriate training data for the agent role.
3. Apply standard fine-tuning to adapt the model to its function.
4. Integrate the fine-tuned model through well-defined interfaces.

---

## 30. Iterative Refinement

Iterative refinement enables quality improvement without human intervention. The warehouse
stores not just successful outputs but also **failed attempts and correction signals** that
led to improvement, so agents learn from mistakes and avoid repeating them.

---

## 31. Economic Analysis

The business case rests on dramatic reduction in labor costs via autonomous orchestration,
while honestly acknowledging computational and development costs that must be amortized
across production volume. Benefits vary across content types, quality standards, and
deployment contexts.

---

## 32. Competitive Positioning

Fablet integrates capabilities that currently exist only in fragmented form:

- script generation tools that lack visual understanding,
- visual generation tools that lack narrative awareness,
- voice synthesis tools that lack character context,
- workflow platforms that lack semantic intelligence,

…all brought together through the warehouse and swarm architecture.

---

## 33. Technical Feasibility

Feasibility is supported by:

- demonstrated capabilities of existing foundation models,
- established effectiveness of fine-tuning for domain adaptation,
- proven performance of semantic data infrastructure,
- demonstrated success of multi-agent systems in other coordination domains.

---

## 34. Risks & Challenges

Explicitly identified:

- quality may not meet professional standards for all use cases,
- integration may reveal semantic inconsistencies the warehouse cannot resolve,
- computational costs may exceed estimates,
- user acceptance may be limited by trust and quality concerns.

All are addressed through iterative development and explicit human oversight at critical
points.

---

## 35. Long-Term Vision

Not to replace human creativity but to **augment** it: handle labor-intensive production so
creative professionals focus on strategic and creative decisions, and enable content
creation at scales and speeds impossible manually — expanding total volume and diversity of
content.

---

## 36. Practical Milestones

- working prototype demonstrating core concepts with ≥ 3 agent types,
- validation on ≥ 3 content genres,
- measurement of throughput and quality vs. baselines,
- comprehensive documentation enabling replication by the research community.

---

## 37. Contribution to Knowledge

Not the invention of new AI techniques, but the thoughtful integration of existing
techniques into a novel architecture for a specific domain, systematic evaluation against
meaningful metrics, and honest documentation of achievements and limitations — a foundation
for future work.

---

## 38. System Requirements

| Component | Minimum | Recommended |
| --- | --- | --- |
| CPU | 4 cores | 8+ cores |
| RAM | 16 GB | 32 GB |
| GPU | 8 GB VRAM | 24 GB VRAM |
| Disk | 20 GB | 100 GB SSD |
| PostgreSQL | 15+ | 16+ |
| pgvector | 0.5+ | 0.7+ |
| Node.js | 20 LTS | 22 LTS |

Requirements scale with the foundation models chosen and the quality standards demanded.

---

## 39. Installation

```bash
# Clone
git clone https://github.com/your-org/fablet.git
cd fablet

# Install frontend
cd Frontend
npm install
npm run dev

# Install backend
cd ../Backend
npm install
npm run dev
```

See the per-package READMEs in `Frontend/`, `Backend/`, `MobileApp/`, and `Server/` for
details.

---

## 40. Configuration

Configuration is environment-driven. Example `Server/.env`:

```env
DATABASE_URL=postgresql://fablet:fablet@localhost:5432/fablet
VECTOR_DIM=768
LANGAUGE_MODEL=meta-llama/llama-3-8b
VISION_MODEL=openai/clip-vit-base-patch32
SPEECH_MODEL=coqui/xtts-v2
WAREHOUSE_EMBED_MODEL=dimasgadzi/static-similarity
LOG_LEVEL=info
```

Swarm behavior is configured per production via warehouse templates, not via code changes.

---

## 41. Warehouse Schema Reference

### 41.1 `entities`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| kind | text | character / scene / prop / asset |
| name | text | display name |
| attrs | jsonb | domain attributes |
| embedding | vector | semantic representation |

### 41.2 `relationships`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| subject | uuid | FK entities.id |
| predicate | text | married_to / appears_in / owns |
| object | uuid | FK entities.id |

### 41.3 `generations`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| agent | text | agent type |
| production | uuid | FK productions.id |
| input_ref | uuid | what it consumed |
| output_ref | uuid | what it produced |
| outcome | text | success / failure |
| correction | text | signal if failed |

### 41.4 `productions`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| brief | text | user brief |
| genre | text | template key |
| quality | text | standard / high |
| state | text | orchestrating / refining / done |
| created_at | timestamptz | |

### 41.5 `templates`

| Column | Type | Notes |
| --- | --- | --- |
| key | text | PK (e.g. comedy) |
| visual_style | jsonb | palette, line, shading |
| motion_profile | jsonb | pacing, easing |
| audio_char | jsonb | voice, sfx, music |
| narrative | jsonb | conventions |

---

## 42. Agent Catalog & Specs

A non-exhaustive catalog of agent roles the swarm can instantiate. Each agent is a
fine-tuned foundation model with a defined I/O contract.

| # | Agent | Modality | Inputs | Outputs | Training data |
| --- | --- | --- | --- | --- | --- |
| 1 | Scripting Agent | language | brief, characters, outline | dialogue, beats | screenplays |
| 2 | Outline Agent | language | brief | structure, acts | story bibles |
| 3 | Visual Asset Agent | vision | character sheet | sprites, props | annotated art |
| 4 | Background Agent | vision | scene tone | environments | matte paintings |
| 5 | Animation Logic Agent | vision+language | script beat, spatial refs | keyframes, motion | motion captures |
| 6 | Temporal Coordinator | multimodal | shot list | edit timeline | edited reels |
| 7 | Audio Synthesis Agent | audio | line, voice id | speech clip | TTS corpora |
| 8 | Music Agent | audio | mood | score | licensed stems |
| 9 | SFX Agent | audio | event | sound effect | Foley libraries |
| 10 | Quality Assurance Agent | multimodal | output, spec | pass/fail + reasons | reviewed outputs |
| 11 | Rendering Agent | vision | layers | final composited frame | render sets |
| 12 | Localization Agent | language | script, locale | translated script | parallel corpora |
| 13 | Dubbing Agent | audio+language | speech, locale | localized voice | multilingual VO |
| 14 | Research Agent | language | claim | sourced facts | articles |
| 15 | Style Agent | vision | genre template | style guide | art directs |
| 16 | Character Consistency Agent | vision | prior frames | consistent face/body | face sets |
| 17 | Continuity Agent | multimodal | sequence | continuity report | edited sequences |
| 18 | Caption Agent | language+vision | frame | captions, subtitles | captioned media |
| 19 | Thumbnail Agent | vision | highlights | thumbnail | CTR datasets |
| 20 | SEO Agent | language | title, desc | tags, metadata | search logs |
| 21 | Brand Agent | multimodal | brand book | on-brand checks | brand assets |
| 22 | Accessibility Agent | multimodal | media | descriptions, signs | a11y corpora |
| 23 | Fact-Check Agent | language | claim | verdict + cites | fact bases |
| 24 | Feedback Agent | language | user notes | warehouse updates | past feedback |

### 42.1 Adding a new agent type

1. Identify the missing capability from a failed production.
2. Curate or synthesize a domain dataset.
3. Fine-tune the closest foundation model.
4. Register the agent with an I/O contract in the Agent Registry.
5. The orchestrator can now instantiate it on demand.

No change to the warehouse or orchestration core is required.

---

## 43. Genre Templates

Templates live in the warehouse (`templates` table) and are loaded per production. They
define the four adaptation axes: visual style, motion profile, audio characteristics, and
narrative conventions.

### 43.1 Comedy

- **Visual style**: bold flat colors, exaggerated proportions, snap-zoom-friendly framing.
- **Motion profile**: fast cuts, overshoot easing, punchy beats on the joke.
- **Audio**: bright delivery, laugh-friendly pacing, light quirky score.
- **Narrative**: setup → misdirection → payoff; running gags referenced across episodes.

### 43.2 Educational

- **Visual style**: clean diagrams, calm palette, high legibility typography.
- **Motion profile**: steady, paced to explanation; pause on key terms.
- **Audio**: clear neutral narration, minimal sfx, soft focus music.
- **Narrative**: question → explain → example → recap; concept hierarchy in warehouse.

### 43.3 Corporate

- **Visual style**: brand-aligned, restrained, professional.
- **Motion profile**: smooth, confident, minimal flourish.
- **Audio**: authoritative voice, corporate bed.
- **Narrative**: problem → solution → proof → CTA; brand agent enforced.

### 43.4 Documentary

- **Visual style**: naturalistic, grain-tolerant, archival-friendly.
- **Motion profile**: deliberate, interview-driven, B-roll cutaways.
- **Audio**: somber or warm narration, ambient bed, real sfx.
- **Narrative**: thesis → evidence → counterpoint → resolution; research agent sourced.

Loading a different template changes swarm output without touching agent code.

---

## 44. API Reference

All endpoints are prefixed with `/api`. Requests and responses are JSON unless noted.
Authentication uses a bearer token (`Authorization: Bearer <token>`).

### 44.1 Productions

#### `POST /api/productions`
Create a production from a brief.

Request:
```json
{
  "brief": "A 3-minute explainer on photosynthesis for 12-year-olds",
  "genre": "educational",
  "quality": "standard"
}
```
Response `201`:
```json
{ "production_id": "uuid", "state": "orchestrating" }
```

#### `GET /api/productions`
List productions. Query: `?state=done&limit=20`.

#### `GET /api/productions/:id`
Get one production with its current state and stage.

#### `DELETE /api/productions/:id`
Cancel a running production.

### 44.2 Warehouse

#### `GET /api/warehouse/entities`
Query entities. Query: `?kind=character&q=hopeful`.

#### `GET /api/warehouse/entities/:id`
Get a single entity with its relationships.

#### `POST /api/warehouse/entities`
Create an entity.
```json
{ "kind": "character", "name": "Ada", "attrs": { "trait": "curious" } }
```

#### `GET /api/warehouse/relationships`
List edges. Query: `?subject=:id&predicate=appears_in`.

#### `POST /api/warehouse/relationships`
Create an edge.
```json
{ "subject": ":id", "predicate": "married_to", "object": ":id" }
```

#### `POST /api/warehouse/search`
Semantic search.
```json
{ "vector": [0.1, 0.2, ...], "top_k": 10 }
```

### 44.3 Agents

#### `GET /api/agents`
List instantiated agents for the swarm.

#### `POST /api/agents`
Instantiate a new agent type.
```json
{ "role": "Scripting Agent", "model": "meta-llama/llama-3-8b", " FineTune": "sft" }
```

#### `GET /api/agents/:id/spec`
Get the I/O contract for an agent.

### 44.4 Feedback (human-in-the-loop)

#### `POST /api/productions/:id/feedback`
Submit a verdict on a segment.
```json
{ "segment": "uuid", "verdict": "approve", "note": "tone too dark" }
```

#### `GET /api/productions/:id/queue`
Get pending human-in-the-loop decisions.

### 44.5 Benchmarks

#### `POST /api/bench/run`
Start a benchmark.
```json
{ "genre": "comedy", "minutes": 5, "baseline": "traditional" }
```

#### `GET /api/bench/:run_id`
Get benchmark results (throughput, quality, consistency, satisfaction).

### 44.6 Templates

#### `GET /api/templates`
List genre templates.

#### `POST /api/templates/:key/load`
Load a template into the active warehouse for a production.

### 44.7 Health

#### `GET /api/health`
Returns `{ "status": "ok" }`.

---

## 45. CLI Reference

```bash
# Create a production
fablet swarm create --brief "..." --genre educational

# Inspect the warehouse
fablet warehouse query --kind character
fablet warehouse search --text "hopeful scene"

# Manage agents
fablet agent list
fablet agent fine-tune --role scripting --data ./corpus --model llama-3-8b
fablet agent instantiate --role "Fact-Check Agent"

# Run benchmarks
fablet bench --genre comedy --minutes 5 --baseline traditional

# Submit feedback
fablet feedback approve --segment <uuid>
fablet feedback reject --segment <uuid> --reason "tone too dark"

# Deploy helpers
fablet deploy docker --tag v0.1
fablet deploy local
```

---

## 46. Deployment Runbooks

### 46.1 Docker (single host)

`docker-compose.yml` brings up Postgres+pgvector, the Server, and the Frontend.

```bash
# 1. Set env
cp Server/.env.example Server/.env
# edit DATABASE_URL, model keys

# 2. Build and start
docker compose -f deploy/docker-compose.yml up --build -d

# 3. Run migrations
docker compose exec server node scripts/migrate.js

# 4. Verify
curl http://localhost:8080/api/health
```

Expose the Frontend port (default 5173) and Server port (default 8080) via your reverse
proxy.

### 46.2 Local workstation

```bash
# PostgreSQL + pgvector
brew install postgresql pgvector
initdb && pg_ctl start
createdb fablet
psql fablet -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Server
cd Server && npm install && npm run migrate && npm run dev

# Frontend
cd Frontend && npm install && npm run dev
```

Best for prototype evaluation. GPU optional; CPU inference works at lower throughput.

### 46.3 AWS

1. Provision an RDS for PostgreSQL 16 with pgvector.
2. Provision an EC2 (g5.xlarge recommended) or ECS task for the Server.
3. Push the Frontend to S3 + CloudFront (it is a static SPA; `vercel.json`/`_redirects`
   already handle SPA fallback).
4. Set `DATABASE_URL` to the RDS endpoint, `VECTOR_DIM` to match your embed model.
5. Use Secrets Manager for model API keys.
6. Scale the Server horizontally behind an ALB; the warehouse scales independently.

### 46.4 GCP

1. Create a Cloud SQL for PostgreSQL 16 instance, enable pgvector.
2. Deploy the Server to Cloud Run (CPU + optional GPU).
3. Host the Frontend on Cloud Storage + Cloud CDN.
4. Store model keys in Secret Manager.
5. Scale Cloud Run via concurrency; warehouse scales with Cloud SQL tier.

In all clouds, computational cost varies with the foundation models chosen and the quality
tier requested.

---

## 47. Benchmarking

### 47.1 Metric definitions

| Metric | Definition | Unit |
| --- | --- | --- |
| Throughput | generated content minutes / compute hour | min/hr |
| Quality | mean human-eval score (1–5) | score |
| Consistency | fraction of segments with no semantic conflict | % |
| Satisfaction | user-reported (1–5) | score |

### 47.2 Procedure

1. Pick a genre and a baseline (traditional studio estimate or manual pipeline).
2. Run `fablet bench --genre <g> --minutes <m> --baseline <b>`.
3. Collect human evaluations on a blinded sample.
4. Record throughput, quality, consistency, satisfaction.
5. Compare against the baseline; report deltas, not absolutes.

### 47.3 Example result table

| Genre | Throughput (min/hr) | Quality (1–5) | Consistency % | Satisfaction (1–5) |
| --- | --- | --- | --- | --- |
| Comedy | 12.4 | 3.6 | 91 | 3.8 |
| Educational | 9.1 | 4.0 | 95 | 4.1 |
| Corporate | 7.7 | 4.2 | 97 | 4.0 |
| Documentary | 5.2 | 3.9 | 88 | 3.7 |

Numbers are illustrative; real runs populate `Research/results`.

---

## 48. Roadmap

- [x] Architecture specification
- [ ] Prototype with ≥ 3 agent types
- [ ] Validation on ≥ 3 genres
- [ ] Web dashboard GA
- [ ] Mobile app GA
- [ ] Enterprise warehouse scaling
- [ ] Multi-region warehouse

---

## 49. FAQ

**Is Fablet a product?** No — it is a conceptual architecture and reference implementation.

**Does it replace artists?** No. It augments them by handling labor-intensive production.

**Can I swap the models?** Yes. The architecture is model-agnostic by design.

**Is it production-ready?** The architecture is specified; the reference implementation is
at prototype maturity.

**Where do I start?** `npm install` in `Frontend/` and `Server/`, then `fablet swarm create`.

---

## 50. Glossary

- **Swarm** — the set of specialized agents instantiated for a production.
- **Warehouse** — the hybrid structured + semantic shared memory.
- **Agent** — a fine-tuned foundation model owning one expertise domain.
- **Template** — genre-specific configuration loaded into the warehouse.
- **Orchestration** — the framework driving workflow patterns from shared state.
- **Generation** — one agent's produce-and-record cycle, stored in `generations`.

---

## 51. References

- Fine-tuning of foundation models (SFT, instruction tuning).
- Vision transformers and transfer learning.
- TTS fine-tuning (Tacotron, VITS).
- Semantic data infrastructure and vector search.
- Multi-agent coordination frameworks.

Specific citations are maintained in `Research/`.

---

## 52. License

Fablet is provided for research and evaluation. See `LICENSE` in the repository root.

---

*This README documents a conceptual architecture. Claims of capability are scoped to the
techniques referenced and the honest limitations stated above.*
