import { motion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const SECTIONS = [
  {
    title: 'The problem',
    body: 'Fablet is a conceptual architecture for autonomous AI swarm orchestration in content creation that addresses the fundamental economic asymmetry between the exponentially growing demand for diverse digital content and the prohibitive cost of traditional production methods, operating on the premise that the true bottleneck in generative AI adoption is not the availability of foundation models but the fragmented and manual nature of orchestrating them into coherent workflows, where organizations currently assemble disjointed collections of specialized tools—each requiring separate integration, separate prompting strategies, separate output validation, and separate quality control—resulting in production processes that are almost as labor-intensive as traditional content creation, merely shifting the nature of the work from manual crafting to manual orchestration without fundamentally solving the scalability problem.',
  },
  {
    title: 'A unified swarm intelligence',
    body: 'The Fablet architecture proposes a unified swarm intelligence where a flexible number of specialized AI agents—each built through fine-tuning of existing foundation models on domain-specific datasets—collaborate through a shared semantic framework, communicating not through rigid APIs but through a common understanding of content structure, narrative logic, and quality standards, enabling the swarm to adapt its composition and behavior to the specific requirements of each production task without requiring extensive re-engineering. The core of this architecture is the recognition that content generation is inherently a multi-faceted problem requiring distinct expertise across narrative development, visual design, temporal coordination, audio synthesis, quality validation, and output rendering, and that these expertise domains can be effectively embodied by fine-tuned foundation models that have been adapted to their specific roles through supervised learning on curated datasets, enabling them to operate with the efficiency and consistency that general-purpose models cannot achieve when forced to handle the full complexity of content production.',
  },
  {
    title: 'The Content Identity Warehouse',
    body: 'The semantic glue that binds this swarm together is the Content Identity Warehouse, a hybrid data infrastructure combining structured storage for deterministic relationships with vector embeddings for semantic understanding, serving not as a passive repository but as an active knowledge graph where every asset, relationship, and generation decision is captured and made queryable, enabling agents to reason about content at a conceptual level—understanding that characters have histories and relationships, that scenes have emotional tones and narrative functions, that props have significance to plot developments—rather than treating content as an opaque collection of files and parameters.',
  },
  {
    title: 'Flexible orchestration',
    body: 'The swarm operates through a flexible orchestration framework that supports multiple workflow patterns depending on production requirements: linear pipelines where agents process sequentially for straightforward content, parallel processing where independent elements are generated simultaneously for complex productions, iterative refinement where agents cycle through generation and validation to achieve quality standards, and human-in-the-loop configurations where expert oversight is interleaved at strategic decision points, with the orchestration logic itself being driven by the swarm\'s shared understanding of production state rather than by rigid pre-programmed workflows.',
  },
  {
    title: 'Agents, not a fixed set',
    body: 'The agents in this swarm are not predefined as a fixed set of six or any other arbitrary number, but are instantiated based on the requirements of each specific production, with the architecture supporting the creation of new agent types through fine-tuning of foundation models on appropriate domain data whenever the existing agent roster lacks a necessary capability, enabling the swarm to evolve its composition organically as new requirements emerge or new foundation models become available.',
  },
  {
    title: 'Training & fine-tuning',
    body: 'The training and fine-tuning approach for each agent type builds on proven techniques from the broader machine learning community: language-based agents are fine-tuned on domain-specific text corpora using standard supervised fine-tuning or instruction tuning methods, vision-based agents are fine-tuned on annotated visual datasets using established transfer learning approaches from vision transformers, audio agents are fine-tuned on speech datasets using well-documented TTS fine-tuning protocols, and multimodal agents that span multiple modalities are fine-tuned on aligned cross-modal datasets using techniques that preserve the semantic relationships across different content types.',
  },
  {
    title: 'Why it works',
    body: 'The practical viability of this approach is grounded in the demonstrated effectiveness of fine-tuning across a wide range of foundation models and domains, with the key insight being that specialized fine-tuning on focused datasets produces agents that are more reliable, more consistent, and more efficient than general-purpose models attempting to handle the full complexity of content creation, much as specialized models in other domains consistently outperform generalists on targeted tasks.',
  },
  {
    title: 'Semantic coherence',
    body: 'The swarm\'s ability to maintain semantic coherence across the entire production process stems from the Content Identity Warehouse\'s role as a persistent, shared memory that all agents can query and contribute to, enabling the Scripting Agent to generate dialogue that references character attributes stored in the warehouse, the Animation Logic Agent to generate movements that respect the spatial relationships captured in the warehouse, the Quality Assurance Agent to validate outputs against the generation history preserved in the warehouse, and any number of other specialized agents to coordinate their efforts through this shared understanding of what has been created and what remains to be done.',
  },
  {
    title: 'The economic case',
    body: 'The economic value proposition of this architecture lies in its ability to dramatically reduce the cost of high-quality content creation by replacing expensive manual orchestration with automated swarm coordination, where the primary cost becomes the computational resources required to run the fine-tuned models and manage the warehouse, rather than the thousands of human-hours that traditional animation and video production demand, though the specific cost reductions achievable depend on the particular foundation models used, the complexity of the content being generated, and the quality standards required for the specific use case.',
  },
  {
    title: 'Scalability',
    body: 'The scalability of this approach derives from the modular nature of both the agent architecture and the warehouse infrastructure, where individual agents can be replicated to handle increased loads, new agent types can be added to introduce new capabilities, and the warehouse can be scaled independently to support growing asset libraries and production histories, enabling the system to grow from small-scale prototype deployments to enterprise-level production environments without fundamental architectural changes.',
  },
  {
    title: 'Research contribution',
    body: 'The research contribution of this work lies in its integration of multiple established techniques—fine-tuned foundation models, semantic data infrastructure, multi-agent coordination frameworks, and iterative quality refinement—into a coherent architecture specifically designed for the content creation problem domain, rather than claiming novelty in any individual component, and in the systematic evaluation of this integrated architecture against relevant benchmarks to demonstrate that the whole is indeed greater than the sum of its parts when measured against practical content production metrics.',
  },
  {
    title: 'Implementation strategy',
    body: 'The implementation strategy focuses on pragmatic technology choices that balance capability with accessibility: language models like Llama or Mistral that are available under permissive licenses and can be fine-tuned with modest computational resources, vision models like CLIP or DINOv2 that provide robust representations for visual understanding and similarity search, speech models like Tacotron or VITS that have been extensively validated for TTS applications, and infrastructure components like PostgreSQL for structured data and vector extensions for semantic embeddings that are well-understood and widely deployed.',
  },
  {
    title: 'Model-agnostic by design',
    body: 'The architecture explicitly acknowledges that foundation models will continue to evolve rapidly, and therefore does not depend on any specific model architecture or provider, but instead defines interfaces and data formats that allow models to be swapped in and out as better alternatives become available, with the shared semantic warehouse ensuring that the swarm\'s collective understanding survives individual model replacements.',
  },
  {
    title: 'Quality assurance',
    body: 'The quality assurance mechanisms embedded in the swarm go beyond simple format checking to include semantic validation that compares generated outputs against the content specifications encoded in the warehouse, enabling the system to detect and correct inconsistencies in character behavior, plot logic, visual continuity, and tonal appropriateness that would be impossible to catch with simple syntactic validation rules.',
  },
  {
    title: 'The human role',
    body: 'The human role in this system is reframed from direct content creation to strategic direction and quality verification, with the web dashboard providing visibility into the swarm\'s operations and enabling users to guide high-level creative decisions, intervene when automated processes encounter ambiguity or uncertainty, and provide feedback that the swarm can incorporate into its future behavior through the warehouse\'s persistent memory of successful and unsuccessful productions.',
  },
  {
    title: 'Mobile interaction',
    body: 'The cross-platform mobile application extends this human interaction capability to mobile contexts, enabling preview, approval, and submission functionality from anywhere, recognizing that creative professionals increasingly work across multiple devices and locations and require access that is not tethered to a single workstation.',
  },
  {
    title: 'Maintenance & versioning',
    body: 'The maintenance capabilities of the system address the often-overlooked challenge of keeping content current in rapidly evolving information environments, where the warehouse\'s version control and relationship tracking enable efficient updates to existing content when underlying facts change or when content needs to be adapted for new platforms or audiences, maintaining consistency across content libraries without requiring complete regeneration.',
  },
  {
    title: 'Multi-genre adaptability',
    body: 'The multi-genre adaptability of the architecture emerges naturally from the warehouse\'s ability to store genre-specific templates and the agents\' ability to adapt their behavior based on these templates, with the templates defining visual styles, motion profiles, audio characteristics, and narrative conventions that are appropriate for each genre, enabling the same agent swarm to generate comedy sketches, educational animations, corporate communications, or documentary content by simply loading different template configurations into the warehouse without requiring any changes to the agents themselves.',
  },
  {
    title: 'Honest limitations',
    body: 'The practical limitations of this approach are honestly acknowledged: the system cannot achieve the quality of top-tier professional animation studios that employ hundreds of skilled artists, it cannot handle arbitrary complexity or novelty beyond the capabilities of the foundation models it builds upon, it requires careful curation of training data for each agent type to achieve consistent results, and it depends on computational infrastructure that, while modest compared to training foundation models from scratch, still represents a meaningful investment for many organizations.',
  },
  {
    title: 'Future trajectory',
    body: 'The future trajectory of this work recognizes that as foundation models continue to improve in capability and efficiency, the agents built upon them will similarly improve, and that the warehouse architecture provides a stable foundation that can persist across generations of models, accumulating knowledge and improving the swarm\'s collective intelligence over time.',
  },
  {
    title: 'Open questions',
    body: 'The open questions that this work does not fully resolve include the optimal number and specialization of agents for different content types, the most effective training strategies for domain-specific agent capabilities, the balance between automated quality assurance and human oversight, and the economic thresholds at which swarm-based production becomes competitive with alternative approaches, all of which are identified as avenues for future investigation.',
  },
  {
    title: 'Validation methodology',
    body: 'The validation methodology for the system focuses on practical metrics: production throughput in minutes of content per hour of computation, quality scores measured against professional human evaluations, consistency across generated content segments, and user satisfaction with the results, with specific targets calibrated against traditional production baselines rather than aspirational claims of superhuman performance.',
  },
  {
    title: 'Deployment model',
    body: 'The deployment model prioritizes practical accessibility, with the system designed to run on available cloud infrastructure or local high-performance workstations, recognizing that the specific computational requirements will vary dramatically based on the foundation models chosen, the complexity of the content being generated, and the quality standards demanded by the use case.',
  },
  {
    title: 'Intellectual honesty',
    body: 'The intellectual honesty of this framing is paramount: this is a proposal for integrating existing AI techniques into a coherent architecture for a specific problem domain, not a claim of having discovered fundamentally new AI capabilities or achieved breakthrough performance that exceeds established benchmarks.',
  },
  {
    title: 'The value of the work',
    body: 'The value of the work lies in its practical integration of proven techniques into a system that addresses a real and growing business need, and in its systematic evaluation of whether this integration actually delivers the promised benefits in terms of cost reduction, quality improvement, and production scalability.',
  },
  {
    title: 'Swarm coordination',
    body: 'The Fablet architecture, through its emphasis on shared semantic understanding, flexible agent composition, and practical deployment models, offers a concrete pathway to autonomous content creation that is achievable with current technology and that can evolve with the field as foundation models continue to advance. The swarm coordination framework that distinguishes Fablet from conventional AI toolchains is built on the principle that content creation is inherently a collaborative activity that requires multiple specialized capabilities working in concert, and that the most effective way to achieve this collaboration is through a shared understanding of the content being created, not through rigid interfaces or predetermined workflows.',
  },
  {
    title: 'Warehouse engineering',
    body: 'The Content Identity Warehouse that enables this shared understanding is conceptually straightforward—a combination of structured data for deterministic relationships and vector embeddings for semantic understanding—but its implementation and integration into a working system represents a significant engineering effort that is central to the project\'s feasibility and value.',
  },
  {
    title: 'Pragmatic fine-tuning',
    body: 'The agent fine-tuning approach is similarly pragmatic: start with established foundation models, curate appropriate training data for each agent role, apply standard fine-tuning techniques to adapt the models to their specific functions, and integrate the fine-tuned models into the broader swarm architecture through well-defined interfaces.',
  },
  {
    title: 'Iterative refinement',
    body: 'The iterative refinement capability that enables quality improvement without human intervention is built on the warehouse\'s ability to store not just successful outputs but also the failed attempts and correction signals that led to improvement, enabling agents to learn from mistakes and avoid repeating them in future productions.',
  },
  {
    title: 'Economic analysis',
    body: 'The economic analysis that underpins the business case for this work focuses on the dramatic reduction in labor costs that autonomous swarm orchestration enables, while honestly acknowledging the computational and development costs that must be amortized across the production volume, and recognizing that the specific economic benefits will vary significantly across different content types, quality standards, and deployment contexts.',
  },
  {
    title: 'Competitive positioning',
    body: 'The competitive positioning of Fablet relative to existing solutions is based on its integration of capabilities that currently exist only in fragmented form: script generation tools that lack visual understanding, visual generation tools that lack narrative awareness, voice synthesis tools that lack character context, and workflow coordination platforms that lack semantic intelligence, all of which are brought together through the warehouse and swarm architecture.',
  },
  {
    title: 'Technical feasibility',
    body: 'The technical feasibility of the approach is supported by the demonstrated capabilities of existing foundation models across the relevant domains, the established effectiveness of fine-tuning for domain adaptation, the proven performance of semantic data infrastructure for knowledge representation, and the demonstrated success of multi-agent systems in other coordination domains.',
  },
  {
    title: 'Risks & challenges',
    body: 'The risks and challenges facing the project are explicitly identified: the quality of generated content may not meet professional standards for all use cases, the integration of agents may reveal unexpected semantic inconsistencies that the warehouse cannot resolve, the computational costs may be higher than initially estimated, and the user acceptance of automated content creation may be limited by trust and quality concerns, all of which are addressed through the iterative development approach and the explicit maintenance of human oversight at critical decision points.',
  },
  {
    title: 'Long-term vision',
    body: 'The long-term vision for Fablet is not to replace human creativity but to augment it, handling the labor-intensive aspects of content production to free creative professionals to focus on higher-level strategic and creative decisions, and to enable content creation at scales and speeds that would be impossible with manual methods, thereby expanding the total volume and diversity of content available across all domains.',
  },
  {
    title: 'Practical milestones',
    body: 'The practical milestones for the project include the development of a working prototype that demonstrates the core concepts with at least three agent types, the validation of the system on at least three different content genres, the measurement of production throughput and quality against established baselines, and the development of comprehensive documentation that enables replication and extension of the work by the broader research community.',
  },
  {
    title: 'Contribution to knowledge',
    body: 'The contribution to knowledge that this work represents is not in the invention of fundamentally new AI techniques but in the thoughtful integration of existing techniques into a novel architecture for a specific problem domain, in the systematic evaluation of this architecture against meaningful metrics, and in the honest documentation of both the achievements and limitations of the approach, providing a foundation for future work to build upon.',
  },
  {
    title: 'Closing',
    body: 'The Fablet architecture, with its emphasis on practical deployment, realistic expectations, and honest assessment of capabilities and limitations, offers a credible pathway to autonomous content creation that respects both the current state of AI technology and the genuine needs of content creators and organizations.',
  },
]

export default function About() {
  return (
    <div className="bg-paper">
      {/* Hero — full width */}
      <section className="relative overflow-hidden border-b border-ink-100 pt-36 pb-20">
        <div className="w-full px-6 sm:px-12 lg:px-24">
          <Reveal>
            <span className="mb-6 inline-block rounded-md bg-ink-950 px-4 py-1.5 text-xs font-bold tracking-wider text-white">
              THE ARCHITECTURE
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-5xl font-extrabold leading-tight text-ink-950 sm:text-7xl">
              Fablet
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-4xl text-xl leading-relaxed text-ink-600">
              A conceptual architecture for autonomous AI swarm orchestration in
              content creation — a self-orchestrating network of agentic AIs that turns a
              single brief into a working product. No engineers. No code. No limits. Just
              intent, turned into something real.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Sections — full width, title left / body right */}
      <section className="pb-28">
        <div className="w-full px-6 sm:px-12 lg:px-24">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 0.02, 0.2)}>
              <div className="grid gap-4 border-t border-ink-100 py-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
                <h2 className="text-2xl font-bold text-ink-950 lg:sticky lg:top-24 lg:self-start">
                  {s.title}
                </h2>
                <p className="text-lg leading-relaxed text-ink-600">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
