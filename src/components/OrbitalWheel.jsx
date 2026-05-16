import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { queryOracle } from '../api/claude'

const ORBITS = [
  { radius: 80,  strokeColor: '#2a2a6e' },
  { radius: 160, strokeColor: '#1a3a5e' },
  { radius: 240, strokeColor: '#0f2a40' },
  { radius: 320, strokeColor: '#0a1e30' },
]

const ORBITAL_BASE = [
  { id: 'a', orbit: 0, angle: 17,  speed:  28.0 },
  { id: 'b', orbit: 0, angle: 143, speed:  22.5 },
  { id: 'c', orbit: 0, angle: 251, speed:  19.0 },
  { id: 'd', orbit: 1, angle: 38,  speed:  13.5 },
  { id: 'e', orbit: 1, angle: 112, speed:  11.0 },
  { id: 'f', orbit: 1, angle: 197, speed: -10.0 },
  { id: 'g', orbit: 1, angle: 303, speed:  14.5 },
  { id: 'h', orbit: 2, angle: 27,  speed:   6.5 },
  { id: 'i', orbit: 2, angle: 97,  speed:   7.8 },
  { id: 'j', orbit: 2, angle: 163, speed:  -5.5 },
  { id: 'k', orbit: 2, angle: 247, speed:   6.0 },
  { id: 'l', orbit: 2, angle: 331, speed:   8.2 },
  { id: 'm', orbit: 3, angle: 53,  speed:   3.8 },
  { id: 'n', orbit: 3, angle: 131, speed:   4.5 },
  { id: 'o', orbit: 3, angle: 209, speed:  -3.2 },
  { id: 'p', orbit: 3, angle: 287, speed:   4.0 },
  { id: 'q', orbit: 3, angle: 347, speed:   3.5 },
]

const DOMAINS = {
  psychologie: {
    name: 'Psychologie', accent: '#7c6af7',
    prompt: 'ses nœuds sont des dimensions de l\'âme humaine (Racine=instinct, Ombre=inconscient, Étoile=transcendance)',
    nodes: {
      a: { label: 'Racine',    color: '#f76a6a', fn: 'sécurité intérieure' },
      b: { label: 'Sang',      color: '#a05070', fn: 'mémoire émotionnelle' },
      c: { label: 'Désir',     color: '#7c6af7', fn: 'pulsion créatrice' },
      d: { label: 'Feu',       color: '#f7a06a', fn: 'affirmation personnelle' },
      e: { label: 'Cœur',      color: '#6af76a', fn: 'empathie' },
      f: { label: 'Regard',    color: '#c4a0f7', fn: 'intuition' },
      g: { label: 'Verbe',     color: '#6ab4f7', fn: 'expression sincère' },
      h: { label: 'Silence',   color: '#8090c0', fn: 'calme mental' },
      i: { label: 'Masque',    color: '#b0c0d0', fn: 'ego social' },
      j: { label: 'Ombre',     color: '#5050a0', fn: 'inconscient' },
      k: { label: 'Rupture',   color: '#f7f76a', fn: 'crise intérieure' },
      l: { label: 'Passage',   color: '#80a0c0', fn: 'reconstruction' },
      m: { label: 'Équilibre', color: '#c4f76a', fn: 'stabilité psychique' },
      n: { label: 'Sagesse',   color: '#f7e0a0', fn: 'compréhension profonde' },
      o: { label: 'Destin',    color: '#f7c46a', fn: 'sens de la vie' },
      p: { label: 'Éveil',     color: '#fff0a0', fn: 'conscience élargie' },
      q: { label: 'Étoile',    color: '#6af7f7', fn: 'transcendance' },
    },
  },
  climat: {
    name: 'Climat', accent: '#6af7a0',
    prompt: 'ses nœuds sont des forces et cycles du système climatique terrestre (Eau=cycle hydro, Seuil=point de bascule, Homéostasie=équilibre planétaire)',
    nodes: {
      a: { label: 'Eau',          color: '#6ab4f7', fn: 'cycle hydrologique' },
      b: { label: 'Vent',         color: '#c0e0ff', fn: 'circulation atmosphérique' },
      c: { label: 'Chaleur',      color: '#f7a06a', fn: 'énergie thermique' },
      d: { label: 'Forêt',        color: '#6af76a', fn: 'puits de carbone' },
      e: { label: 'Océan',        color: '#2080f7', fn: 'régulateur climatique' },
      f: { label: 'Glace',        color: '#e0f4ff', fn: 'albédo terrestre' },
      g: { label: 'Sol',          color: '#a07040', fn: 'stockage carbone' },
      h: { label: 'CO₂',          color: '#f0a060', fn: 'gaz à effet de serre' },
      i: { label: 'Cycle',        color: '#80c080', fn: 'rythme saisonnier' },
      j: { label: 'Seuil',        color: '#f76a6a', fn: 'point de bascule' },
      k: { label: 'Biodiversité', color: '#6af7a0', fn: 'équilibre du vivant' },
      l: { label: 'Migration',    color: '#c0a0f7', fn: 'déplacement des espèces' },
      m: { label: 'Adaptation',   color: '#f7e0a0', fn: 'résilience des systèmes' },
      n: { label: 'Effondrement', color: '#8050a0', fn: 'rupture systémique' },
      o: { label: 'Territoire',   color: '#70a070', fn: 'espace vital' },
      p: { label: 'Société',      color: '#f7c4a0', fn: 'organisation humaine' },
      q: { label: 'Homéostasie',  color: '#6af7f7', fn: 'équilibre planétaire' },
    },
  },
  algorithmes: {
    name: 'Algorithmes', accent: '#f7c46a',
    prompt: 'ses nœuds sont des paradigmes algorithmiques (Donnée=unité, Émergence=comportement global imprévu, Complexité=mesure de la difficulté)',
    nodes: {
      a: { label: 'Donnée',       color: '#6ab4f7', fn: 'unité d\'information' },
      b: { label: 'Opération',    color: '#f7c46a', fn: 'transformation élémentaire' },
      c: { label: 'Mémoire',      color: '#c4a0f7', fn: 'stockage et accès' },
      d: { label: 'Tri',          color: '#6af76a', fn: 'ordonnancement' },
      e: { label: 'Graphe',       color: '#f76a7c', fn: 'relations et chemins' },
      f: { label: 'Récursion',    color: '#f7f76a', fn: 'auto-référence' },
      g: { label: 'Recherche',    color: '#6af7f7', fn: 'exploration de l\'espace' },
      h: { label: 'Dynamique',    color: '#f7a06a', fn: 'optimisation par sous-problèmes' },
      i: { label: 'Agent',        color: '#a0f7a0', fn: 'comportement autonome' },
      j: { label: 'Réseau',       color: '#7c6af7', fn: 'architecture distribuée' },
      k: { label: 'Compression',  color: '#f7e0a0', fn: 'réduction de complexité' },
      l: { label: 'Probabilité',  color: '#c0b8ff', fn: 'incertitude et aléa' },
      m: { label: 'Apprentissage',color: '#6af76a', fn: 'adaptation par données' },
      n: { label: 'Émergence',    color: '#f76af7', fn: 'comportement global imprévu' },
      o: { label: 'Réduction',    color: '#8090c0', fn: 'simplification formelle' },
      p: { label: 'Parallèle',    color: '#6af7f7', fn: 'exécution simultanée' },
      q: { label: 'Complexité',   color: '#f76a6a', fn: 'mesure de la difficulté' },
    },
  },
  philosophie: {
    name: 'Philosophie', accent: '#f76af7',
    prompt: 'ses nœuds sont des tensions philosophiques fondamentales (Être=présence, Vide=espace du possible, Absolu=totalité sans reste)',
    nodes: {
      a: { label: 'Être',          color: '#f7e0a0', fn: 'présence fondamentale' },
      b: { label: 'Devenir',       color: '#f7a06a', fn: 'transformation permanente' },
      c: { label: 'Néant',         color: '#5050a0', fn: 'absence et vide' },
      d: { label: 'Logos',         color: '#6ab4f7', fn: 'raison et langage' },
      e: { label: 'Corps',         color: '#f76a6a', fn: 'matérialité de l\'existence' },
      f: { label: 'Temps',         color: '#c4a0f7', fn: 'durée et mémoire' },
      g: { label: 'Langage',       color: '#6af76a', fn: 'expression de la pensée' },
      h: { label: 'Sujet',         color: '#f7c46a', fn: 'conscience de soi' },
      i: { label: 'Pouvoir',       color: '#f76a7c', fn: 'force organisatrice' },
      j: { label: 'Vide',          color: '#8090c0', fn: 'espace du possible' },
      k: { label: 'Structure',     color: '#b0c0d0', fn: 'forme organisante' },
      l: { label: 'Sens',          color: '#6af7f7', fn: 'signification' },
      m: { label: 'Liberté',       color: '#c4f76a', fn: 'autodétermination' },
      n: { label: 'Justice',       color: '#f7e0a0', fn: 'équité et droit' },
      o: { label: 'Transcendance', color: '#7c6af7', fn: 'au-delà du donné' },
      p: { label: 'Éthique',       color: '#6af7a0', fn: 'art de bien agir' },
      q: { label: 'Absolu',        color: '#fff0a0', fn: 'totalité sans reste' },
    },
  },
}

const ORBITAL_MAP = Object.fromEntries(ORBITAL_BASE.map(n => [n.id, n]))

const CONNECTIONS_BASE = [
  { from: 'a', to: 'd', phase: 0.0,  freq: 0.38 },
  { from: 'b', to: 'e', phase: 1.2,  freq: 0.27 },
  { from: 'c', to: 'f', phase: 2.1,  freq: 0.51 },
  { from: 'c', to: 'g', phase: 0.8,  freq: 0.19 },
  { from: 'd', to: 'h', phase: 1.5,  freq: 0.33 },
  { from: 'e', to: 'i', phase: 0.3,  freq: 0.44 },
  { from: 'f', to: 'j', phase: 2.5,  freq: 0.22 },
  { from: 'g', to: 'k', phase: 1.0,  freq: 0.41 },
  { from: 'g', to: 'l', phase: 0.5,  freq: 0.29 },
  { from: 'h', to: 'm', phase: 1.8,  freq: 0.18 },
  { from: 'i', to: 'n', phase: 0.6,  freq: 0.47 },
  { from: 'j', to: 'o', phase: 2.2,  freq: 0.34 },
  { from: 'k', to: 'p', phase: 1.1,  freq: 0.42 },
  { from: 'l', to: 'q', phase: 0.9,  freq: 0.31 },
  { from: 'a', to: 'b', phase: 1.7,  freq: 0.17 },
  { from: 'b', to: 'c', phase: 0.4,  freq: 0.23 },
  { from: 'd', to: 'e', phase: 2.3,  freq: 0.26 },
  { from: 'f', to: 'g', phase: 1.0,  freq: 0.20 },
  { from: 'h', to: 'i', phase: 0.7,  freq: 0.32 },
  { from: 'j', to: 'k', phase: 1.4,  freq: 0.25 },
  { from: 'm', to: 'n', phase: 2.0,  freq: 0.19 },
  { from: 'o', to: 'p', phase: 0.2,  freq: 0.28 },
  { from: 'a', to: 'h', phase: 0.7,  freq: 0.14 },
  { from: 'b', to: 'j', phase: 1.9,  freq: 0.16 },
  { from: 'c', to: 'k', phase: 1.1,  freq: 0.13 },
  { from: 'd', to: 'm', phase: 2.4,  freq: 0.11 },
]

const BASE_PAIRS = new Set(CONNECTIONS_BASE.flatMap(c => [`${c.from}-${c.to}`, `${c.to}-${c.from}`]))
const NODE_IDS   = ORBITAL_BASE.map(n => n.id)
const CANDIDATE_PAIRS = []
for (let i = 0; i < NODE_IDS.length; i++) {
  for (let j = i + 1; j < NODE_IDS.length; j++) {
    const key = `${NODE_IDS[i]}-${NODE_IDS[j]}`
    if (!BASE_PAIRS.has(key) && !BASE_PAIRS.has(`${NODE_IDS[j]}-${NODE_IDS[i]}`)) {
      CANDIDATE_PAIRS.push({ from: NODE_IDS[i], to: NODE_IDS[j] })
    }
  }
}

const TRAIL_MAX      = 40
const TRAIL_SAMPLE   = 3
const ECHO_LIFE      = 3.5
const ECHO_EVERY     = 1.0
const DECAY          = 0.9994
const REINFORCE      = 0.008
const EMERGE_THRESH  = 0.55
const RESONANCE_TRESH = 0.85

function polarToCart(angleDeg, radius) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }
}

function currentPos(node, t, mult) {
  return polarToCart(node.angle + node.speed * mult * t, ORBITS[node.orbit].radius)
}

function angularProximity(na, nb, t, mult) {
  const angA = na.angle + na.speed * mult * t
  const angB = nb.angle + nb.speed * mult * t
  const diff = Math.abs(((angA - angB) % 360 + 360) % 360)
  const delta = diff > 180 ? 360 - diff : diff
  return 1 - delta / 180
}

function curvePath(pa, pb, curvature = 0.15) {
  const mx = (pa.x + pb.x) / 2
  const my = (pa.y + pb.y) / 2
  const dx = pb.x - pa.x
  const dy = pb.y - pa.y
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const bend = len * curvature
  return `M ${pa.x} ${pa.y} Q ${mx + nx * bend} ${my + ny * bend} ${pb.x} ${pb.y}`
}

function pulseIntensity(conn, t) {
  return (Math.sin(t * conn.freq * Math.PI * 2 + conn.phase) + 1) / 2
}

const SAVE_EVERY = 10

function matrixKey(domainId)      { return `revati-memory-${domainId}-v1` }
function personalityKey(domainId) { return `revati-personality-${domainId}-v1` }
function customNodesKey(domainId) { return `revati-custom-${domainId}-v1` }

function loadPersonality(domainId) {
  try { return JSON.parse(localStorage.getItem(personalityKey(domainId)) ?? '{}') } catch { return {} }
}
function savePersonality(p, domainId) {
  try { localStorage.setItem(personalityKey(domainId), JSON.stringify(p)) } catch {}
}
function loadCustomNodes(domainId) {
  try { return JSON.parse(localStorage.getItem(customNodesKey(domainId)) ?? '[]') } catch { return [] }
}
function saveCustomNodes(nodes, domainId) {
  try { localStorage.setItem(customNodesKey(domainId), JSON.stringify(nodes)) } catch {}
}

function initMatrix() {
  const m = {}
  for (const c of CONNECTIONS_BASE) m[`${c.from}-${c.to}`] = 0
  for (const c of CANDIDATE_PAIRS)  m[`${c.from}-${c.to}`] = 0
  return m
}

function loadMatrix(domainId) {
  try {
    const saved = localStorage.getItem(matrixKey(domainId))
    if (!saved) return initMatrix()
    return { ...initMatrix(), ...JSON.parse(saved) }
  } catch { return initMatrix() }
}

function saveMatrix(matrix, domainId) {
  try { localStorage.setItem(matrixKey(domainId), JSON.stringify(matrix)) } catch {}
}

function exportMatrix(matrix, profileName, domainId) {
  const payload = {
    type: 'revati-carte',
    profil: profileName || 'Anonyme',
    domaine: domainId,
    date: new Date().toISOString().slice(0, 10),
    matrix,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  const slug = (profileName || 'memoire').toLowerCase().replace(/\s+/g, '-')
  a.href = url; a.download = `revati-${slug}-${domainId}-${payload.date}.json`
  a.click(); URL.revokeObjectURL(url)
}

function importMatrix(file, onDone) {
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result)
      // Support ancien format (matrix brute) et nouveau format (carte avec profil)
      const matrix = parsed.type === 'revati-carte' ? parsed.matrix : parsed
      onDone({ ...initMatrix(), ...matrix })
    } catch {}
  }
  reader.readAsText(file)
}

// Largest angular gap → midpoint for new node placement
function autoAngle(orbit, existingNodes) {
  const angles = existingNodes.filter(n => n.orbit === orbit).map(n => n.angle).sort((a, b) => a - b)
  if (angles.length === 0) return Math.floor(Math.random() * 360)
  let maxGap = 0, bestMid = 0
  const n = angles.length
  for (let i = 0; i < n; i++) {
    const a = angles[i]
    const b = i === n - 1 ? angles[0] + 360 : angles[i + 1]
    const gap = b - a
    if (gap > maxGap) { maxGap = gap; bestMid = (a + gap / 2) % 360 }
  }
  return Math.round(bestMid)
}

const ORBIT_SPEEDS  = [22, 12, 7, 3.8]
const CUSTOM_COLORS = ['#f76a6a', '#f7a06a', '#f7c46a', '#6af76a', '#6ab4f7', '#c4a0f7', '#f76af7', '#6af7f7', '#fff0a0', '#a07040']

const SPEED_PRESETS = [
  { label: 'Lent',   mult: 0.3 },
  { label: 'Normal', mult: 1.0 },
  { label: 'Rapide', mult: 2.5 },
]

const ACTIVATION_DECAY     = 0.988
const ACTIVATION_PROPAGATE = 0.28
const ACTIVATION_MIN       = 0.03

const ALL_LINKS  = [...CONNECTIONS_BASE, ...CANDIDATE_PAIRS]
const NODE_LINKS = Object.fromEntries(NODE_IDS.map(id => [
  id,
  ALL_LINKS.filter(c => c.from === id || c.to === id)
    .map(c => ({ neighbor: c.from === id ? c.to : c.from, key: `${c.from}-${c.to}` }))
]))

export default function OrbitalWheel() {
  const svgRef = useRef(null)
  const [time, setTime]           = useState(0)
  const [scale, setScale]         = useState(1)
  const [selected, setSelected]   = useState(null)
  const [isPaused, setIsPaused]   = useState(false)
  const [speedMult, setSpeedMult] = useState(1.0)
  const [showMemory, setShowMemory] = useState(true)
  const [showMap, setShowMap]     = useState(false)
  const [input, setInput]         = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [apiError, setApiError]   = useState(null)
  const [journal, setJournal]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('revati-journal-v1') ?? '[]') } catch { return [] }
  })
  const [focusId, setFocusId]       = useState(null)
  const [navHistory, setNavHistory] = useState([])
  const [dataInfo, setDataInfo]     = useState(null)
  const [domainId, setDomainId]       = useState(() => localStorage.getItem('revati-domain') ?? 'psychologie')
  const [personality, setPersonality] = useState(() => loadPersonality(localStorage.getItem('revati-domain') ?? 'psychologie'))
  const [customNodes, setCustomNodes] = useState(() => loadCustomNodes(localStorage.getItem('revati-domain') ?? 'psychologie'))
  const [createMode, setCreateMode]   = useState(false)
  const [createForm, setCreateForm]   = useState({ label: '', color: '#6ab4f7', orbit: 2, retrograde: false })
  const [profileName, setProfileName] = useState(() => localStorage.getItem('revati-profile-name') ?? '')
  const [comparisonData, setComparisonData] = useState(null)
  const [showComparison, setShowComparison] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [isFollowUp, setIsFollowUp]           = useState(false)

  const activeNodes   = useMemo(() => [
    ...ORBITAL_BASE.map(n => ({ ...n, ...DOMAINS[domainId].nodes[n.id] })),
    ...customNodes,
  ], [domainId, customNodes])
  const activeNodeMap = useMemo(() => Object.fromEntries(activeNodes.map(n => [n.id, n])), [activeNodes])

  const personalityRef  = useRef(personality)
  const customNodesRef  = useRef(customNodes)
  const activeNodesRef  = useRef(activeNodes)
  const customPairsRef  = useRef([])
  const customNodeMapRef = useRef({})

  useEffect(() => {
    personalityRef.current = personality
    savePersonality(personality, domainId)
  }, [personality, domainId])

  useEffect(() => {
    customNodesRef.current = customNodes
    customNodeMapRef.current = Object.fromEntries(customNodes.map(n => [n.id, n]))
    // Rebuild custom pairs for memory matrix
    const baseIds = ORBITAL_BASE.map(n => n.id)
    const customIds = customNodes.map(n => n.id)
    const pairs = []
    for (const cn of customNodes) {
      for (const id of [...baseIds, ...customIds]) {
        if (id === cn.id) continue
        const key = cn.id < id ? `${cn.id}-${id}` : `${id}-${cn.id}`
        if (!pairs.some(p => `${p.from}-${p.to}` === key)) {
          pairs.push({ from: cn.id, to: id })
          if (matrixRef.current[key] === undefined) matrixRef.current[key] = 0
        }
      }
    }
    customPairsRef.current = pairs
  }, [customNodes])

  useEffect(() => {
    activeNodesRef.current = activeNodes
  }, [activeNodes])

  const trailsRef      = useRef(Object.fromEntries(ORBITAL_BASE.map(n => [n.id, []])))
  const echoesRef      = useRef([])
  const matrixRef      = useRef(loadMatrix(localStorage.getItem('revati-domain') ?? 'psychologie'))
  const activationsRef = useRef({})
  const echoTextRef    = useRef(null)
  const frameRef       = useRef(0)
  const lastEchoRef    = useRef(0)

  const stateRef = useRef({ time: 0, lastTs: null, speedMult: 1.0, domainId: 'psychologie' })
  useEffect(() => { stateRef.current.speedMult = speedMult }, [speedMult])
  useEffect(() => { stateRef.current.domainId  = domainId  }, [domainId])

  useEffect(() => {
    try { localStorage.setItem('revati-journal-v1', JSON.stringify(journal)) } catch {}
  }, [journal])

  useEffect(() => {
    try { localStorage.setItem('revati-profile-name', profileName) } catch {}
  }, [profileName])

  // ── Oracle ────────────────────────────────────────────────────────────────────
  const callOracle = useCallback(async () => {
    if (!input.trim() || isThinking) return
    setIsThinking(true); setApiError(null)
    const intention = input.trim()
    try {
      const dominantNodes = activeNodes.filter(n => personalityRef.current[n.id] !== undefined)
      const result = await queryOracle(intention, matrixRef.current, activeNodes, DOMAINS[domainId].prompt, dominantNodes)
      for (const [nodeId, strength] of Object.entries(result.activations)) {
        if (activeNodeMap[nodeId]) activationsRef.current[nodeId] = Math.min(1, strength)
      }
      if (result.echo) echoTextRef.current = { text: result.echo, born: stateRef.current.time }

      // Question en retour
      if (result.question) {
        const topId = Object.entries(result.activations).sort(([, a], [, b]) => b - a)[0]?.[0]
        const nodeColor = topId ? (activeNodeMap[topId]?.color ?? '#7c6af7') : '#7c6af7'
        setCurrentQuestion({ text: result.question, nodeColor })
      }

      const nodesActivated = Object.entries(result.activations)
        .sort(([, a], [, b]) => b - a).map(([id]) => activeNodeMap[id]?.label ?? id)
      setJournal(j => [{
        ts: new Date().toISOString(), intention,
        echo: result.echo ?? '',
        question: result.question ?? '',
        noeuds: nodesActivated,
        followUp: isFollowUp,
      }, ...j].slice(0, 200))
      setInput('')
      setIsFollowUp(false)
    } catch (e) { setApiError(e.message) }
    finally { setIsThinking(false) }
  }, [input, isThinking, activeNodes, activeNodeMap, domainId])

  const loadDataJSON = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result)
        for (const [label, strength] of Object.entries(parsed.activations ?? {})) {
          const node = activeNodes.find(n => n.label === label)
          if (node) activationsRef.current[node.id] = Math.min(1, Math.max(0, strength))
        }
        setDataInfo({ source: parsed.source, annee: parsed.annee, notes: parsed.notes ?? {} })
        if (parsed.source) echoTextRef.current = { text: parsed.source, born: stateRef.current.time }
      } catch {}
    }
    reader.readAsText(file)
  }, [activeNodes])

  const graveNode = useCallback((nodeId, weight) => {
    setPersonality(p => {
      const next = { ...p }
      if (weight === null) delete next[nodeId]
      else next[nodeId] = weight
      return next
    })
  }, [])

  const switchDomain = useCallback((newId) => {
    saveMatrix(matrixRef.current, stateRef.current.domainId)
    saveCustomNodes(customNodesRef.current, stateRef.current.domainId)
    localStorage.setItem('revati-domain', newId)
    setDomainId(newId)
    setFocusId(null); setSelected(null); setNavHistory([])
    setCreateMode(false)
    setCurrentQuestion(null)
    activationsRef.current = {}; echoTextRef.current = null
    matrixRef.current = loadMatrix(newId)
    setPersonality(loadPersonality(newId))
    setCustomNodes(loadCustomNodes(newId))
  }, [])

  const navigateTo = useCallback((nodeId) => {
    setFocusId(nodeId); setSelected(nodeId)
    setNavHistory(h => h[h.length - 1] === nodeId ? h : [...h.slice(-4), nodeId])
    activationsRef.current[nodeId] = Math.max(activationsRef.current[nodeId] ?? 0, 0.65)
  }, [])

  const createNode = useCallback(() => {
    const label = createForm.label.trim()
    if (!label) return
    const orbit = createForm.orbit
    const angle = autoAngle(orbit, activeNodesRef.current)
    const base  = ORBIT_SPEEDS[orbit]
    const jitter = (Math.random() * 0.3 - 0.15) * base
    const speed  = parseFloat((createForm.retrograde ? -(base + jitter) : (base + jitter)).toFixed(2))
    const node = { id: `cx${Date.now()}`, orbit, angle, speed, label, color: createForm.color, fn: label.toLowerCase(), isCustom: true }
    setCustomNodes(prev => {
      const next = [...prev, node]
      saveCustomNodes(next, domainId)
      return next
    })
    setCreateForm(f => ({ ...f, label: '' }))
    setCreateMode(false)
  }, [createForm, domainId])

  const deleteCustomNode = useCallback((nodeId) => {
    setCustomNodes(prev => {
      const next = prev.filter(n => n.id !== nodeId)
      saveCustomNodes(next, domainId)
      return next
    })
    setFocusId(null); setSelected(null)
  }, [domainId])

  const importComparison = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (parsed.type === 'revati-carte') {
          setComparisonData({ profil: parsed.profil, domaine: parsed.domaine, matrix: parsed.matrix })
        } else {
          setComparisonData({ profil: 'Autre', domaine: domainId, matrix: parsed })
        }
        setShowComparison(true)
      } catch {}
    }
    reader.readAsText(file)
  }, [domainId])

  const exportJournal = useCallback(() => {
    const lines = journal.map(e =>
      `[${e.ts.slice(0, 16).replace('T', ' ')}]\n` +
      `  Intention : ${e.intention}\n  Écho : ${e.echo}\n  Nœuds : ${e.noeuds.join(', ')}\n`
    ).join('\n')
    const blob = new Blob([lines], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `revati-journal-${new Date().toISOString().slice(0, 10)}.txt`
    a.click(); URL.revokeObjectURL(url)
  }, [journal])

  // ── Animation loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused) return
    stateRef.current.lastTs = null
    let rafId

    const animate = (ts) => {
      const s   = stateRef.current
      if (!s.lastTs) s.lastTs = ts
      const delta = (ts - s.lastTs) / 1000
      s.lastTs = ts
      s.time += delta
      frameRef.current++

      const matrix = matrixRef.current
      const mult   = s.speedMult

      // ── Mémoire : paires de base ───────────────────────────────────────────
      const allPairs = [...CONNECTIONS_BASE, ...CANDIDATE_PAIRS]
      for (const pair of allPairs) {
        const key  = `${pair.from}-${pair.to}`
        const na   = ORBITAL_MAP[pair.from]
        const nb   = ORBITAL_MAP[pair.to]
        const prox = angularProximity(na, nb, s.time, mult)
        let score  = (matrix[key] ?? 0) * DECAY
        if (prox > RESONANCE_TRESH) score = Math.min(1, score + REINFORCE)
        matrix[key] = score
      }

      // ── Mémoire : paires custom ────────────────────────────────────────────
      const cnMap = customNodeMapRef.current
      for (const pair of customPairsRef.current) {
        const key = `${pair.from}-${pair.to}`
        const na  = ORBITAL_MAP[pair.from] ?? cnMap[pair.from]
        const nb  = ORBITAL_MAP[pair.to]   ?? cnMap[pair.to]
        if (!na || !nb) continue
        const prox = angularProximity(na, nb, s.time, mult)
        let score  = (matrix[key] ?? 0) * DECAY
        if (prox > RESONANCE_TRESH) score = Math.min(1, score + REINFORCE)
        matrix[key] = score
      }

      // ── Propagation des activations ────────────────────────────────────────
      const acts = activationsRef.current
      const nextActs = {}
      for (const [nodeId, strength] of Object.entries(acts)) {
        const decayed = strength * ACTIVATION_DECAY
        if (decayed < ACTIVATION_MIN) continue
        nextActs[nodeId] = Math.max(nextActs[nodeId] ?? 0, decayed)
        for (const { neighbor, key } of (NODE_LINKS[nodeId] ?? [])) {
          const memScore  = matrix[key] ?? matrix[`${neighbor}-${nodeId}`] ?? 0
          const propagated = decayed * ACTIVATION_PROPAGATE * (0.2 + memScore * 0.8)
          if (propagated >= ACTIVATION_MIN) nextActs[neighbor] = Math.max(nextActs[neighbor] ?? 0, propagated)
        }
      }

      // ── Personnalité gravée ────────────────────────────────────────────────
      const pers = personalityRef.current
      for (const [nodeId, weight] of Object.entries(pers)) {
        nextActs[nodeId] = Math.max(nextActs[nodeId] ?? 0, weight * 0.2)
        for (const { key } of (NODE_LINKS[nodeId] ?? [])) {
          matrix[key] = Math.max(matrix[key] ?? 0, weight * 0.22)
        }
      }

      activationsRef.current = nextActs

      // ── Traces ────────────────────────────────────────────────────────────
      if (frameRef.current % TRAIL_SAMPLE === 0) {
        for (const node of activeNodesRef.current) {
          if (!trailsRef.current[node.id]) trailsRef.current[node.id] = []
          const trail = trailsRef.current[node.id]
          const pos   = currentPos(node, s.time, mult)
          trail.push({ x: pos.x, y: pos.y })
          if (trail.length > TRAIL_MAX) trail.shift()
        }
      }

      // ── Échos ─────────────────────────────────────────────────────────────
      if (s.time - lastEchoRef.current > ECHO_EVERY) {
        lastEchoRef.current = s.time
        for (const node of activeNodesRef.current) {
          const pos = currentPos(node, s.time, mult)
          echoesRef.current.push({ nodeId: node.id, x: pos.x, y: pos.y, t: s.time })
        }
        echoesRef.current = echoesRef.current.filter(e => s.time - e.t < ECHO_LIFE)
      }

      // ── Sauvegarde automatique ─────────────────────────────────────────────
      if (Math.floor(s.time) % SAVE_EVERY === 0 && Math.floor(s.time) !== s.lastSave) {
        s.lastSave = Math.floor(s.time)
        saveMatrix(matrixRef.current, s.domainId)
      }

      setTime(s.time)
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isPaused])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    setScale(s => Math.min(3, Math.max(0.3, s - e.deltaY * 0.001)))
  }, [])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  const positions   = Object.fromEntries(activeNodes.map(n => [n.id, currentPos(n, time, speedMult)]))
  const matrix      = matrixRef.current
  const trails      = trailsRef.current
  const echoes      = echoesRef.current
  const activations = activationsRef.current
  const echoText    = echoTextRef.current

  const focusNode       = focusId ? activeNodeMap[focusId] : null
  const focusResonances = focusNode
    ? Object.entries(matrix)
        .filter(([key, score]) => { const [a, b] = key.split('-'); return (a === focusId || b === focusId) && score > 0.04 })
        .map(([key, score])    => { const [a, b] = key.split('-'); return { id: a === focusId ? b : a, score } })
        .filter(({ id }) => activeNodeMap[id])
        .sort((x, y) => y.score - x.score)
        .slice(0, 6)
    : []
  const breadcrumb = navHistory.map(id => activeNodeMap[id]).filter(Boolean)

  const emergent = CANDIDATE_PAIRS.filter(p => (matrix[`${p.from}-${p.to}`] ?? 0) >= EMERGE_THRESH)

  const selectedConns = selected
    ? new Set([...CONNECTIONS_BASE, ...emergent]
        .filter(c => c.from === selected || c.to === selected)
        .map(c => `${c.from}-${c.to}`))
    : null

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#0a0a0f' }}>

      {/* ── PANNEAU JOURNAL ─────────────────────────────────────────────────── */}
      <div style={{ width: 260, minWidth: 260, height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1a1a3e', background: 'rgba(6,6,18,0.95)' }}>
        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #1a1a3e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#7c6af7', fontSize: 12, letterSpacing: '0.08em' }}>JOURNAL</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={exportJournal} disabled={journal.length === 0} style={{ ...btnSm(), opacity: journal.length === 0 ? 0.3 : 1 }}>Exporter</button>
            <button onClick={() => { setJournal([]); localStorage.removeItem('revati-journal-v1') }} style={{ ...btnSm('#6e2a2a', '#f76a6a'), opacity: journal.length === 0 ? 0.3 : 1 }}>Vider</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {journal.length === 0 && (
            <p style={{ color: '#2a2a4e', fontSize: 11, textAlign: 'center', marginTop: 40, padding: '0 20px', lineHeight: 1.6 }}>
              Les réponses de l'oracle apparaîtront ici.
            </p>
          )}
          {journal.map((entry, i) => (
            <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid #12122a', borderLeft: `2px solid ${i === 0 ? '#7c6af7' : '#1a1a3e'}` }}>
              <div style={{ color: '#3a3a6e', fontSize: 9, marginBottom: 6 }}>{entry.ts.slice(0, 16).replace('T', ' · ')}</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 5, alignItems: 'flex-start' }}>
                {entry.followUp
                  ? <span style={{ color: '#5a5a9e', fontSize: 8, letterSpacing: '0.06em', marginTop: 2, flexShrink: 0 }}>→</span>
                  : <span style={{ color: '#3a3a7e', fontSize: 8, letterSpacing: '0.06em', marginTop: 2, flexShrink: 0 }}>TOI</span>
                }
                <span style={{
                  color: entry.followUp ? '#8a8acf' : '#c0b8ff',
                  fontSize: 11,
                  fontWeight: entry.followUp ? 400 : 500,
                  fontStyle: entry.followUp ? 'italic' : 'normal',
                  lineHeight: 1.4,
                }}>{entry.intention}</span>
              </div>
              {entry.echo && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 3, alignItems: 'flex-start' }}>
                  <span style={{ color: '#9a8aff', fontSize: 10, fontWeight: 'bold', letterSpacing: '0.08em', marginTop: 1, flexShrink: 0 }}>REVATI</span>
                  <span style={{ color: '#9a9adf', fontSize: 11, fontStyle: 'italic', lineHeight: 1.4 }}>"{entry.echo}"</span>
                </div>
              )}
              {entry.question && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 5, alignItems: 'flex-start' }}>
                  <span style={{ color: '#5a5a9e', fontSize: 8, letterSpacing: '0.06em', marginTop: 2, flexShrink: 0 }}>↩</span>
                  <span style={{ color: '#6a6aae', fontSize: 10, fontStyle: 'italic', lineHeight: 1.4 }}>{entry.question}</span>
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {entry.noeuds.map(n => (
                  <span key={n} style={{ background: '#1a1a3e', color: '#7c6af7', fontSize: 9, padding: '2px 6px', borderRadius: 4 }}>{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ZONE PRINCIPALE ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg ref={svgRef} viewBox="0 0 1000 1000" style={{ width: '90vmin', height: '90vmin', cursor: 'grab' }}
          onClick={() => { setSelected(null); setFocusId(null) }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g transform={`translate(500,500) scale(${scale})`}>

            {/* Orbites */}
            {ORBITS.map((orbit, i) => (
              <circle key={i} r={orbit.radius} fill="none" stroke={orbit.strokeColor} strokeWidth={1} strokeDasharray="4 8" opacity={0.5} />
            ))}

            {/* Centre */}
            <circle r={5} fill="#7c6af7" filter="url(#glow)" />
            <circle r={11} fill="none" stroke="#7c6af7" strokeWidth={0.8} opacity={0.3} />

            {/* ── CARTE MÉMOIRE ─────────────────────────────────────────────── */}
            {showMap && (
              <g opacity={0.85}>
                {/* Ma carte — violet/rose */}
                {[...CONNECTIONS_BASE, ...CANDIDATE_PAIRS].map((pair) => {
                  const key   = `${pair.from}-${pair.to}`
                  const score = matrix[key] ?? 0
                  if (score < 0.05 || !positions[pair.from] || !positions[pair.to]) return null
                  const isBase = BASE_PAIRS.has(key)
                  return (
                    <path key={`map-${key}`} d={curvePath(positions[pair.from], positions[pair.to], 0.1)}
                      fill="none" stroke={isBase ? '#7c6af7' : '#f76a7c'}
                      strokeWidth={0.5 + score * 3} opacity={0.15 + score * 0.7} />
                  )
                })}

                {/* Carte de comparaison — ambre + convergences blanches */}
                {comparisonData && showComparison && Object.entries(comparisonData.matrix).map(([key, theirScore]) => {
                  if (theirScore < 0.06) return null
                  const [from, to] = key.split('-')
                  const pa = positions[from]; const pb = positions[to]
                  if (!pa || !pb) return null
                  const myScore = matrix[key] ?? 0
                  const convergence = Math.min(myScore, theirScore)
                  const isConvergent = myScore > 0.25 && theirScore > 0.25
                  return (
                    <path key={`cmp-${key}`}
                      d={curvePath(pa, pb, 0.22)}
                      fill="none"
                      stroke={isConvergent ? '#ffffff' : '#f7c46a'}
                      strokeWidth={isConvergent ? 0.4 + convergence * 3.5 : 0.3 + theirScore * 2}
                      opacity={isConvergent ? 0.2 + convergence * 0.7 : theirScore * 0.45}
                      filter={isConvergent && convergence > 0.5 ? 'url(#glow)' : undefined} />
                  )
                })}

                {/* Légende */}
                <text x={0} y={-350} textAnchor="middle" fill="#7c6af7" fontSize={10} opacity={0.7}>
                  violet/rose : {profileName || 'toi'}
                  {comparisonData && showComparison ? ` · ambre : ${comparisonData.profil} · blanc : convergence` : ''}
                </text>
              </g>
            )}

            {/* ── MÉMOIRE : TRACES + ÉCHOS ──────────────────────────────────── */}
            {!showMap && showMemory && activeNodes.map((node) => {
              const trail  = trails[node.id] ?? []
              const dimmed = selected && selected !== node.id &&
                !([...CONNECTIONS_BASE, ...emergent].some(c =>
                  (c.from === selected && c.to === node.id) || (c.to === selected && c.from === node.id)))
              if (dimmed) return null
              return (
                <g key={`mem-${node.id}`}>
                  {echoes.filter(e => e.nodeId === node.id).map((echo, ei) => {
                    const life = (time - echo.t) / ECHO_LIFE
                    return (
                      <circle key={`echo-${ei}`} cx={echo.x} cy={echo.y}
                        r={6 + life * 28} fill="none" stroke={node.color} strokeWidth={0.8} opacity={(1 - life) * 0.2} />
                    )
                  })}
                  {trail.map((pt, i) => {
                    const ratio = i / trail.length
                    return <circle key={`tr-${i}`} cx={pt.x} cy={pt.y} r={1 + ratio * 1.5} fill={node.color} opacity={ratio * ratio * 0.45} />
                  })}
                </g>
              )
            })}

            {/* ── CONNEXIONS DE BASE ─────────────────────────────────────────── */}
            {!showMap && CONNECTIONS_BASE.map((conn) => {
              const pa = positions[conn.from]
              const pb = positions[conn.to]
              const na = ORBITAL_MAP[conn.from]
              const nb = ORBITAL_MAP[conn.to]
              const isLinked = selectedConns?.has(`${conn.from}-${conn.to}`)
              const score = matrix[`${conn.from}-${conn.to}`] ?? 0

              if (selected && !isLinked)
                return <path key={`${conn.from}-${conn.to}`} d={curvePath(pa, pb)} fill="none" stroke="#111128" strokeWidth={0.4} opacity={0.15} />

              const pulse     = pulseIntensity(conn, time)
              const prox      = angularProximity(na, nb, time, speedMult)
              const resonance = prox > RESONANCE_TRESH
              const baseOpacity = 0.08 + score * 0.35
              const opacity   = isLinked ? 0.92 : Math.max(0, baseOpacity + pulse * 0.5 + (resonance ? 0.2 : 0))
              const sw        = isLinked ? 2.0 : 0.4 + score * 1.2 + pulse * 0.8 + (resonance ? 0.8 : 0)
              const stroke    = isLinked ? '#ffffff' : resonance ? '#ffffff' : pulse > 0.6 ? (activeNodeMap[conn.from]?.color ?? '#7c6af7') : (activeNodeMap[conn.to]?.color ?? '#7c6af7')

              return (
                <path key={`${conn.from}-${conn.to}`} d={curvePath(pa, pb)}
                  fill="none" stroke={stroke} strokeWidth={sw} opacity={opacity}
                  filter={resonance || isLinked ? 'url(#glow)' : undefined} />
              )
            })}

            {/* ── CONNEXIONS ÉMERGENTES ──────────────────────────────────────── */}
            {!showMap && emergent.map((pair) => {
              const key   = `${pair.from}-${pair.to}`
              const score = matrix[key] ?? 0
              const pa    = positions[pair.from]
              const pb    = positions[pair.to]
              const na    = ORBITAL_MAP[pair.from]
              const nb    = ORBITAL_MAP[pair.to]
              const isLinked  = selectedConns?.has(key)
              const prox      = angularProximity(na, nb, time, speedMult)
              const strength  = (score - EMERGE_THRESH) / (1 - EMERGE_THRESH)

              return (
                <path key={`em-${key}`} d={curvePath(pa, pb, 0.25)} fill="none"
                  stroke={isLinked ? '#ffffff' : '#f76a7c'}
                  strokeWidth={0.5 + strength * 2.0}
                  strokeDasharray={`${3 + strength * 4} ${6 - strength * 3}`}
                  opacity={isLinked ? 0.9 : 0.15 + strength * 0.55}
                  filter={prox > RESONANCE_TRESH || isLinked ? 'url(#glow)' : undefined} />
              )
            })}

            {/* ── NŒUDS ──────────────────────────────────────────────────────── */}
            {activeNodes.map((node) => {
              const pos = positions[node.id]
              if (!pos) return null
              const isSelected = selected === node.id
              const isLinked   = selectedConns
                ? [...CONNECTIONS_BASE, ...emergent].some(c =>
                    (c.from === selected && c.to === node.id) || (c.to === selected && c.from === node.id))
                : false
              const dimmed = selected && !isSelected && !isLinked

              const futurePos = currentPos(node, time + 0.4, speedMult)
              const dx = futurePos.x - pos.x
              const dy = futurePos.y - pos.y
              const len = Math.sqrt(dx * dx + dy * dy) || 1

              const nodeScore = [...CONNECTIONS_BASE, ...CANDIDATE_PAIRS]
                .filter(c => c.from === node.id || c.to === node.id)
                .reduce((sum, c) => sum + (matrix[`${c.from}-${c.to}`] ?? 0), 0)
              const memRadius = 5.5 + Math.min(nodeScore * 0.8, 3.5)
              const actStrength = activations[node.id] ?? 0
              const isActive    = actStrength > ACTIVATION_MIN

              return (
                <g key={node.id}
                  onClick={(e) => { e.stopPropagation(); node.id === focusId ? (setFocusId(null), setSelected(null)) : navigateTo(node.id) }}
                  style={{ cursor: 'pointer' }}>
                  {/* Anneau de personnalité */}
                  {personality[node.id] !== undefined && (
                    <circle cx={pos.x} cy={pos.y} r={memRadius + 12} fill="none" stroke={node.color}
                      strokeWidth={1.2} strokeDasharray="2 4" opacity={0.35 + personality[node.id] * 0.45} />
                  )}
                  {/* Marqueur nœud personnalisé */}
                  {node.isCustom && (
                    <circle cx={pos.x} cy={pos.y} r={memRadius + 7} fill="none" stroke={node.color}
                      strokeWidth={0.7} strokeDasharray="1 3" opacity={0.5} />
                  )}
                  {/* Halo d'activation IA */}
                  {isActive && (
                    <>
                      <circle cx={pos.x} cy={pos.y} r={memRadius + 8 + actStrength * 14} fill={node.color} opacity={actStrength * 0.12} />
                      <circle cx={pos.x} cy={pos.y} r={memRadius + 4 + actStrength * 8} fill="none" stroke={node.color}
                        strokeWidth={1 + actStrength * 1.5} opacity={actStrength * 0.7} filter="url(#glow)" />
                    </>
                  )}
                  {/* Halo mémoire */}
                  {!dimmed && nodeScore > 0.3 && (
                    <circle cx={pos.x} cy={pos.y} r={memRadius + 6} fill="none" stroke={node.color} strokeWidth={0.6} opacity={Math.min(nodeScore * 0.15, 0.35)} />
                  )}
                  {!dimmed && (
                    <line x1={pos.x} y1={pos.y} x2={pos.x + (dx / len) * 12} y2={pos.y + (dy / len) * 12}
                      stroke={node.color} strokeWidth={0.8} opacity={0.25} />
                  )}
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r={18} fill="none" stroke={node.color} strokeWidth={1.2} opacity={0.45}>
                      <animateTransform attributeName="transform" type="rotate"
                        from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`} dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={pos.x} cy={pos.y}
                    r={isSelected ? 9 : isLinked ? 7 : memRadius}
                    fill={node.color}
                    opacity={dimmed ? 0.12 : isActive ? Math.min(1, 0.88 + actStrength * 0.12) : 0.88}
                    filter={isSelected || isLinked || isActive ? 'url(#glow)' : undefined} />
                  {!dimmed && (
                    <text x={pos.x} y={pos.y - (memRadius + 6)} textAnchor="middle" fill={node.color}
                      fontSize={isSelected || isActive ? 10 : 8}
                      fontWeight={isSelected || isActive ? 'bold' : 'normal'}
                      opacity={isSelected ? 1 : isActive ? 0.95 : 0.55}
                      style={{ userSelect: 'none', letterSpacing: '0.03em' }}>
                      {personality[node.id] !== undefined ? `◆ ${node.label}` : node.isCustom ? `✦ ${node.label}` : node.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Écho de Revati — texte au centre */}
            {echoText && (() => {
              const age     = time - echoText.born
              const opacity = Math.max(0, 1 - age / 3.5)
              if (opacity <= 0) return null
              const txt = echoText.text.length > 55 ? echoText.text.slice(0, 55) + '…' : echoText.text
              return (
                <g>
                  <circle cx={0} cy={0} r={22} fill="#7c6af7" opacity={opacity * 0.1} />
                  <text x={0} y={-12} textAnchor="middle" fill="#9a8aff"
                    fontSize={9} fontWeight="bold" opacity={opacity * 0.95} letterSpacing="0.1em"
                    style={{ userSelect: 'none' }}>
                    REVATI
                  </text>
                  <text x={0} y={6} textAnchor="middle" fill="#9a9adf"
                    fontSize={10} fontStyle="italic" opacity={opacity}
                    style={{ userSelect: 'none' }}>
                    {txt}
                  </text>
                </g>
              )
            })()}

            {isThinking && (
              <circle cx={0} cy={0} r={18} fill="none" stroke="#f7c46a" strokeWidth={1.5} opacity={0.6}>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            {emergent.length > 0 && (
              <text x={0} y={345} textAnchor="middle" fill="#f76a7c" fontSize={10} opacity={0.6}>
                {emergent.length} connexion{emergent.length > 1 ? 's' : ''} émergente{emergent.length > 1 ? 's' : ''}
              </text>
            )}
          </g>
        </svg>

        {/* Contrôles */}
        <div style={{ position: 'absolute', bottom: 24, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setIsPaused(p => !p)} style={btn()}>{isPaused ? '▶' : '⏸'}</button>
          {SPEED_PRESETS.map(p => (
            <button key={p.label} onClick={() => setSpeedMult(p.mult)} style={btn(speedMult === p.mult)}>{p.label}</button>
          ))}
          <button onClick={() => setShowMemory(m => !m)} style={btn(showMemory, '#2a6e2a', '#6af7a0')}>
            {showMemory ? 'Mémoire ON' : 'Mémoire OFF'}
          </button>
          <button onClick={() => setShowMap(m => !m)} style={btn(showMap, '#6e2a6e', '#f76af7')}>
            {showMap ? 'Carte ON' : 'Carte OFF'}
          </button>
          <button onClick={() => exportMatrix(matrixRef.current, profileName, domainId)} style={btn(false, '#1a3a3a', '#6af7f7')}>Ma carte</button>
          <label style={{ ...btn(false, '#1a3a2a', '#6af7a0'), cursor: 'pointer' }}>
            Importer
            <input type="file" accept=".json" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0]
                if (file) importMatrix(file, m => { matrixRef.current = m; saveMatrix(m, domainId) })
                e.target.value = ''
              }} />
          </label>
          <button onClick={() => { const m = initMatrix(); matrixRef.current = m; saveMatrix(m, domainId) }}
            style={btn(false, '#6e2a2a', '#f76a6a')}>Reset mémoire</button>
          <label style={{ ...btn(false, '#1a2a1a', '#a0f7a0'), cursor: 'pointer' }}>
            {comparisonData ? `Carte de ${comparisonData.profil}` : 'Comparer une carte'}
            <input type="file" accept=".json" style={{ display: 'none' }}
              onChange={e => { const file = e.target.files[0]; if (file) importComparison(file); e.target.value = '' }} />
          </label>
          {comparisonData && (
            <button onClick={() => setShowComparison(s => !s)}
              style={btn(showComparison, '#2a4a2a', '#a0f7a0')}>
              {showComparison ? 'Comparaison ON' : 'Comparaison OFF'}
            </button>
          )}
          {comparisonData && (
            <button onClick={() => setComparisonData(null)} style={btn(false, '#2a1a1a', '#f76a6a')}>✕</button>
          )}
          <label style={{ ...btn(dataInfo !== null, '#1a2a3a', '#6af7f7'), cursor: 'pointer' }}>
            {dataInfo ? `Données ${dataInfo.annee ?? ''}` : 'Charger données'}
            <input type="file" accept=".json" style={{ display: 'none' }}
              onChange={e => { const file = e.target.files[0]; if (file) loadDataJSON(file); e.target.value = '' }} />
          </label>
          <span style={{ color: '#2a2a4e', fontSize: 11 }}>Scroll → zoom · clic → isoler</span>
        </div>

        {/* Oracle : zone de saisie + question en retour */}
        <div style={{ position: 'absolute', top: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={input}
              onChange={e => { setInput(e.target.value); if (isFollowUp) setIsFollowUp(false) }}
              onKeyDown={e => e.key === 'Enter' && callOracle()}
              placeholder="une intention, un mot, une question..."
              style={{ background: 'rgba(10,10,20,0.85)', border: '1px solid #2a2a6e', borderRadius: 10, color: '#c0b8ff', padding: '8px 16px', fontSize: 13, width: 320, outline: 'none', backdropFilter: 'blur(8px)' }} />
            <button onClick={callOracle} disabled={isThinking || !input.trim()}
              style={{ background: isThinking ? '#1a1a3e' : '#2a1a6e', color: isThinking ? '#4a4a8e' : '#c0b8ff', border: '1px solid #3a2a8e', borderRadius: 10, padding: '8px 16px', cursor: isThinking ? 'default' : 'pointer', fontSize: 13 }}>
              {isThinking ? '···' : 'Invoquer'}
            </button>
          </div>

          {/* Question de Revati */}
          {currentQuestion && !isThinking && (
            <div
              onClick={() => { setInput(currentQuestion.text); setIsFollowUp(true); setCurrentQuestion(null) }}
              style={{
                pointerEvents: 'auto', cursor: 'pointer',
                maxWidth: 400, textAlign: 'center',
                padding: '8px 18px',
                background: 'rgba(8,8,22,0.88)',
                border: `1px solid ${currentQuestion.nodeColor}44`,
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
              <span style={{ color: '#9a8aff', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.1em' }}>REVATI</span>
              <span style={{ color: currentQuestion.nodeColor, fontSize: 13, fontStyle: 'italic', lineHeight: 1.5 }}>
                {currentQuestion.text}
              </span>
              <span style={{ color: '#2a2a5e', fontSize: 9 }}>→ cliquer pour répondre</span>
            </div>
          )}

          {apiError && <span style={{ color: '#f76a6a', fontSize: 11, pointerEvents: 'auto' }}>{apiError}</span>}
        </div>
      </div>

      {/* ── PANNEAU NAVIGATION (droite) ──────────────────────────────────────── */}
      <div style={{ width: 230, minWidth: 230, height: '100vh', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1a1a3e', background: 'rgba(6,6,18,0.95)' }}>

        {/* Profil utilisateur */}
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #1a1a3e', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.06em', flexShrink: 0 }}>MON NOM</span>
          <input
            value={profileName}
            onChange={e => setProfileName(e.target.value)}
            placeholder="identifie-toi..."
            maxLength={20}
            style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: profileName ? `1px solid #3a3a7e` : '1px solid #1a1a3e', color: '#c0b8ff', fontSize: 10, outline: 'none', padding: '2px 0' }}
          />
          {comparisonData && showComparison && (
            <span style={{ color: '#a0f7a0', fontSize: 9, flexShrink: 0 }}>vs {comparisonData.profil}</span>
          )}
        </div>

        {/* Domaines */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a1a3e', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(DOMAINS).map(([id, d]) => (
            <button key={id} onClick={() => switchDomain(id)} style={{
              background: domainId === id ? d.accent + '22' : 'transparent',
              color: domainId === id ? d.accent : '#2a2a5e',
              border: `1px solid ${domainId === id ? d.accent : '#1a1a3e'}`,
              borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 9,
            }}>{d.name}</button>
          ))}
        </div>

        {/* Bouton mode création */}
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #1a1a3e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.06em' }}>
            {customNodes.length > 0 ? `${customNodes.length} nœud${customNodes.length > 1 ? 's' : ''} libre${customNodes.length > 1 ? 's' : ''}` : 'NŒUDS LIBRES'}
          </span>
          <button onClick={() => setCreateMode(m => !m)} style={{
            background: createMode ? '#2a2a6e' : '#12122a',
            color: createMode ? '#c0b8ff' : '#3a3a7e',
            border: `1px solid ${createMode ? '#3a3a8e' : '#1a1a3e'}`,
            borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 10,
          }}>
            {createMode ? '✕ Fermer' : '+ Créer'}
          </button>
        </div>

        {/* ── FORMULAIRE DE CRÉATION ─────────────────────────────────────────── */}
        {createMode && (
          <div style={{ padding: '14px 14px', borderBottom: '1px solid #1a1a3e', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Nom */}
            <div>
              <div style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.06em', marginBottom: 5 }}>NOM DU NŒUD</div>
              <input
                value={createForm.label}
                onChange={e => setCreateForm(f => ({ ...f, label: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && createNode()}
                placeholder="ex: Intuition, Delta, Seuil…"
                maxLength={18}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#0a0a1a', border: '1px solid #2a2a5e',
                  borderRadius: 6, color: '#c0b8ff', padding: '6px 10px',
                  fontSize: 12, outline: 'none',
                }}
              />
            </div>

            {/* Couleur */}
            <div>
              <div style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.06em', marginBottom: 5 }}>COULEUR</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {CUSTOM_COLORS.map(c => (
                  <div key={c} onClick={() => setCreateForm(f => ({ ...f, color: c }))}
                    style={{
                      width: 18, height: 18, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: `2px solid ${createForm.color === c ? '#ffffff' : 'transparent'}`,
                      boxSizing: 'border-box',
                    }} />
                ))}
              </div>
            </div>

            {/* Orbite */}
            <div>
              <div style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.06em', marginBottom: 5 }}>ORBITE</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2, 3].map(o => (
                  <button key={o} onClick={() => setCreateForm(f => ({ ...f, orbit: o }))} style={{
                    flex: 1, background: createForm.orbit === o ? '#2a2a6e' : '#12122a',
                    color: createForm.orbit === o ? '#c0b8ff' : '#3a3a6e',
                    border: `1px solid ${createForm.orbit === o ? '#4a4a9e' : '#1a1a3e'}`,
                    borderRadius: 5, padding: '4px 0', cursor: 'pointer', fontSize: 10,
                  }}>
                    {['○', '◎', '⊙', '●'][o]}
                  </button>
                ))}
              </div>
              <div style={{ color: '#2a2a4e', fontSize: 9, marginTop: 4, textAlign: 'center' }}>
                {['rapide', 'moyenne', 'lente', 'très lente'][createForm.orbit]}
              </div>
            </div>

            {/* Direction */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.06em' }}>DIRECTION</span>
              <div style={{ display: 'flex', gap: 5 }}>
                <button onClick={() => setCreateForm(f => ({ ...f, retrograde: false }))} style={{
                  ...btnSm(createForm.retrograde ? '#12122a' : '#1a2a6e', createForm.retrograde ? '#2a2a5e' : '#c0b8ff'),
                  opacity: createForm.retrograde ? 0.5 : 1,
                }}>Direct</button>
                <button onClick={() => setCreateForm(f => ({ ...f, retrograde: true }))} style={{
                  ...btnSm(createForm.retrograde ? '#1a2a6e' : '#12122a', createForm.retrograde ? '#f76a6a' : '#2a2a5e'),
                  opacity: createForm.retrograde ? 1 : 0.5,
                }}>Rétrograde</button>
              </div>
            </div>

            {/* Bouton créer */}
            <button onClick={createNode} disabled={!createForm.label.trim()} style={{
              background: createForm.label.trim() ? '#2a1a6e' : '#12122a',
              color: createForm.label.trim() ? '#c0b8ff' : '#2a2a4e',
              border: `1px solid ${createForm.label.trim() ? '#3a2a8e' : '#1a1a3e'}`,
              borderRadius: 8, padding: '7px 0', cursor: createForm.label.trim() ? 'pointer' : 'default',
              fontSize: 12, width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <span style={{ color: createForm.color }}>✦</span> Ajouter à l'orbite
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #12122a', minHeight: 36, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {breadcrumb.length === 0
            ? <span style={{ color: '#1a1a3e', fontSize: 9 }}>TRAJECTOIRE</span>
            : breadcrumb.flatMap((n, i) => [
                i > 0 ? <span key={`s${i}`} style={{ color: '#2a2a4e', fontSize: 9 }}>→</span> : null,
                <span key={n.id} onClick={() => navigateTo(n.id)} style={{
                  color: n.id === focusId ? n.color : '#3a3a6e', fontSize: 9, cursor: 'pointer',
                  borderBottom: n.id === focusId ? `1px solid ${n.color}` : 'none',
                }}>{n.label}</span>
              ]).filter(Boolean)
          }
        </div>

        {focusNode ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>

            {/* En-tête nœud */}
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #12122a' }}>
              <div style={{ color: focusNode.color, fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                {focusNode.isCustom ? '✦ ' : ''}{focusNode.label}
              </div>
              <div style={{ color: '#4a4a7e', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {focusNode.fn}
              </div>
              <div style={{ color: '#2a2a4e', fontSize: 9, marginTop: 6 }}>
                orbite {focusNode.orbit} · {focusNode.speed < 0 ? 'rétrograde' : 'direct'}
                {focusNode.isCustom && <span style={{ color: '#3a3a6e', marginLeft: 6 }}>· nœud libre</span>}
              </div>
            </div>

            {/* Note de données réelles */}
            {dataInfo?.notes?.[focusNode.label] && (
              <div style={{ margin: '0 16px 14px', padding: '10px 12px', background: '#0a1a2a', borderRadius: 6, borderLeft: `2px solid ${focusNode.color}` }}>
                <div style={{ color: '#2a4a6e', fontSize: 8, letterSpacing: '0.06em', marginBottom: 5 }}>DONNÉES RÉELLES</div>
                <div style={{ color: '#a0c0e0', fontSize: 10, lineHeight: 1.6 }}>{dataInfo.notes[focusNode.label]}</div>
              </div>
            )}

            {/* Résonances mémoire */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.08em', marginBottom: 12 }}>RÉSONANCES MÉMOIRE</div>
              {focusResonances.length === 0
                ? <p style={{ color: '#1a1a3e', fontSize: 10, lineHeight: 1.8 }}>Aucune résonance encore.<br />Laisse la roue tourner.</p>
                : focusResonances.map(({ id, score }) => {
                    const n = activeNodeMap[id]
                    if (!n) return null
                    return (
                      <div key={id} onClick={() => navigateTo(id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer' }}>
                        <div style={{ width: Math.round(20 + score * 60), height: 3, borderRadius: 2, background: n.color, opacity: 0.3 + score * 0.7, flexShrink: 0 }} />
                        <span style={{ color: n.color, fontSize: 11, opacity: 0.8 + score * 0.2 }}>{n.label}</span>
                        <span style={{ color: '#2a2a4e', fontSize: 9, marginLeft: 'auto' }}>{Math.round(score * 100)}%</span>
                      </div>
                    )
                  })
              }
            </div>

            {/* Interroger ce nœud */}
            <div style={{ padding: '0 16px 12px' }}>
              <button onClick={() => setInput(`${focusNode.label} — `)}
                style={{ ...btn(false, '#12122a', focusNode.color), width: '100%', textAlign: 'center', fontSize: 11 }}>
                Interroger {focusNode.label}
              </button>
            </div>

            {/* Supprimer — uniquement pour nœuds libres */}
            {focusNode.isCustom && (
              <div style={{ margin: '0 16px 12px' }}>
                <button onClick={() => deleteCustomNode(focusNode.id)}
                  style={{ ...btn(false, '#1a0a0a', '#f76a6a'), width: '100%', textAlign: 'center', fontSize: 11 }}>
                  Supprimer ce nœud libre
                </button>
              </div>
            )}

            {/* Personnalité gravée */}
            <div style={{ margin: '0 16px 16px', padding: '12px 14px', border: `1px solid ${personality[focusNode.id] !== undefined ? focusNode.color + '44' : '#1a1a3e'}`, borderRadius: 8 }}>
              <div style={{ color: '#2a2a5e', fontSize: 9, letterSpacing: '0.08em', marginBottom: 10 }}>PERSONNALITÉ GRAVÉE</div>
              {personality[focusNode.id] !== undefined ? (
                <>
                  <div style={{ color: focusNode.color, fontSize: 10, marginBottom: 10 }}>
                    ◆ Gravé · intensité {Math.round(personality[focusNode.id] * 100)}%
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                    {[['Léger', 0.35], ['Moyen', 0.6], ['Fort', 0.9]].map(([lbl, w]) => (
                      <button key={lbl} onClick={() => graveNode(focusNode.id, w)} style={{
                        flex: 1, ...btnSm(personality[focusNode.id] === w ? focusNode.color + '33' : '#12122a', focusNode.color),
                        opacity: personality[focusNode.id] === w ? 1 : 0.45,
                      }}>{lbl}</button>
                    ))}
                  </div>
                  <button onClick={() => graveNode(focusNode.id, null)}
                    style={{ ...btnSm('#1a0a0a', '#f76a6a'), width: '100%', textAlign: 'center' }}>
                    Dégraver
                  </button>
                </>
              ) : (
                <button onClick={() => graveNode(focusNode.id, 0.6)}
                  style={{ ...btnSm('#12122a', focusNode.color), width: '100%', textAlign: 'center' }}>
                  ◆ Graver ce nœud
                </button>
              )}
            </div>

          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <p style={{ color: '#1a1a3e', fontSize: 10, textAlign: 'center', lineHeight: 2 }}>
              Cliquez un nœud<br />pour naviguer
            </p>
          </div>
        )}
      </div>

    </div>
  )
}

function btnSm(bg = '#1a1a3e', color = '#7c6af7') {
  return { background: bg, color, border: `1px solid ${bg}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 10 }
}

function btn(active = false, activeBg = '#2a2a6e', activeColor = '#fff') {
  return { background: active ? activeBg : '#1a1a3e', color: active ? activeColor : '#7c6af7', border: `1px solid ${active ? activeBg : '#2a2a6e'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }
}
