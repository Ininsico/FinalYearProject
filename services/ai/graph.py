SYSTEM = (
    'You are Fablet, an academic course author. You extract compact, accurate '
    'knowledge graphs from educational course material.'
)


def extract_graph(llm, brief, context):
    """Ask the LLM for a concept graph from retrieved course context."""
    user = '\n\n'.join(
        part
        for part in [
            f"Title: {brief.get('title', '')}\nSubject: {brief.get('subject', '')}\nLevel: {brief.get('level', '')}",
            f'Course material:\n{context}' if context else '',
            'Extract a knowledge graph of the key concepts.',
            'Respond with JSON only, shaped exactly like:',
            '{ "nodes": [{ "label": "Concept", "summary": "one sentence" }], '
            '"edges": [{ "from": "Concept", "to": "Concept", "relation": "relates to" }] }',
            'Use 6-14 nodes and only reference node labels that exist in nodes.',
        ]
        if part
    )

    parsed = llm.chat_json(SYSTEM, user, temperature=0.2)
    raw_nodes = parsed.get('nodes') if isinstance(parsed, dict) else None
    raw_edges = parsed.get('edges') if isinstance(parsed, dict) else None

    nodes = []
    for i, node in enumerate(raw_nodes or []):
        label = str(node.get('label', '')).strip()[:80]
        if not label:
            continue
        nodes.append(
            {
                'id': f'n{i + 1}',
                'label': label,
                'summary': str(node.get('summary', '')).strip()[:240],
            }
        )
    nodes = nodes[:16]

    label_to_id = {node['label'].lower(): node['id'] for node in nodes}
    edges = []
    for edge in raw_edges or []:
        source = label_to_id.get(str(edge.get('from', '')).strip().lower())
        target = label_to_id.get(str(edge.get('to', '')).strip().lower())
        if not source or not target or source == target:
            continue
        edges.append(
            {
                'from': source,
                'to': target,
                'relation': str(edge.get('relation', 'relates to')).strip()[:60],
            }
        )

    return {'nodes': nodes, 'edges': edges[:40]}
