const MODEL = 'claude-haiku-4-5-20251001'

function buildPrompt(userInput, matrix, nodes, domainPrompt, dominant) {
  const top = Object.entries(matrix)
    .filter(([, v]) => v > 0.15)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([k, v]) => `${k}: ${v.toFixed(2)}`)
    .join(', ')

  const byOrbit = [0, 1, 2, 3].map(o =>
    nodes.filter(n => n.orbit === o)
         .map(n => n.speed < 0 ? `${n.label} (rétrograde)` : n.label)
         .join(', ')
  )
  const retrogrades = nodes.filter(n => n.speed < 0).map(n => n.label).join(', ')
  const functions   = nodes.map(n => `${n.label}=${n.fn}`).join(', ')

  return `Tu es le cœur d'une interface orbitale cyclique vivante nommée Revati.
Dans ce domaine, ${domainPrompt}

Nœuds répartis sur 4 orbites :
— Orbite 0 (rapide) : ${byOrbit[0]}
— Orbite 1           : ${byOrbit[1]}
— Orbite 2           : ${byOrbit[2]}
— Orbite 3 (lente)  : ${byOrbit[3]}

Fonctions : ${functions}

Mémoire relationnelle active (résonances les plus fortes) :
${top || 'aucune mémoire accumulée encore'}

L'utilisateur dit : "${userInput}"

Réponds UNIQUEMENT en JSON valide, sans texte autour :
{
  "activations": {"${nodes[0].label}": 0.9, "${nodes[4].label}": 0.6},
  "echo": "une phrase courte poétique max 8 mots",
  "question": "une question ouverte max 10 mots qui invite à continuer"
}

${dominant.length > 0 ? `Personnalité gravée (nœuds dominants — à favoriser sans imposer) : ${dominant.map(n => `${n.label} (${n.fn})`).join(', ')}` : ''}

Règles pour les activations et l'écho :
- Utilise les noms exacts : ${nodes.map(n => n.label).join(', ')}
- Choisis 3 à 6 nœuds selon leur résonance avec l'intention
- L'écho est une phrase poétique qui résonne avec l'intention
- Les rétrogrades (${retrogrades}) créent des tensions, des retours, des contradictions fécondes
- Si des nœuds dominants existent, ils doivent apparaître dans les activations sauf si l'intention les contredit

Règles pour la question :
- Elle naît des nœuds activés et de la mémoire, pas d'une analyse froide
- Elle est poétique, ouverte, jamais rhétorique ni didactique
- Elle ne répète pas l'intention — elle ouvre vers quelque chose d'inattendu
- Elle commence par : "et si…", "qu'est-ce qui…", "où est…", "comment…", "pourquoi…", ou similaire
- Elle invite l'utilisateur à explorer plus loin dans ce domaine`
}

export async function queryOracle(userInput, matrix, nodes, domainPrompt, dominant = []) {
  const labelToId = Object.fromEntries(nodes.map(n => [n.label, n.id]))
  const res = await fetch('/api/oracle', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content: buildPrompt(userInput, matrix, nodes, domainPrompt, dominant) }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = data.content[0].text.trim()

  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Réponse non JSON : ' + text)

  const parsed = JSON.parse(match[0])

  const activationsById = {}
  for (const [label, strength] of Object.entries(parsed.activations ?? {})) {
    const id = labelToId[label]
    if (id) activationsById[id] = strength
  }

  return { activations: activationsById, echo: parsed.echo, question: parsed.question }
}
