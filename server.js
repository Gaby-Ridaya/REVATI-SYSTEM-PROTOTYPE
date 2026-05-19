import express from 'express'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { rateLimit } from 'express-rate-limit'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Charge .env.local manuellement (sans dépendance dotenv)
try {
  const env = readFileSync(resolve(__dirname, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {}

const API_KEY    = process.env.ANTHROPIC_API_KEY
const PROVIDER   = process.env.AI_PROVIDER || 'anthropic'   // 'anthropic' | 'lmstudio'
const LM_URL     = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1'
const LM_MODEL   = process.env.LM_STUDIO_MODEL || 'mistral-7b-instruct-v0.3'

if (PROVIDER === 'anthropic' && !API_KEY) {
  console.error('ANTHROPIC_API_KEY manquante dans .env.local')
  process.exit(1)
}

console.log(`Fournisseur IA : ${PROVIDER}${PROVIDER === 'lmstudio' ? ` (${LM_MODEL})` : ''}`)

const app = express()
app.use(express.json())

// Accepte uniquement les requêtes venant de localhost
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && !origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
    return res.status(403).json({ error: 'Accès refusé' })
  }
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin)
  next()
})

// 20 appels max par minute par IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Trop de requêtes — réessaie dans une minute.' },
})
app.use('/api/oracle', limiter)

app.get('/favicon.ico', (req, res) => res.status(204).end())

async function queryAnthropic(body) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw Object.assign(new Error('Anthropic error'), { status: response.status, data })
  return data
}

async function queryLMStudio(body) {
  const response = await fetch(`${LM_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: LM_MODEL,
      max_tokens: body.max_tokens ?? 200,
      messages: body.messages,
      temperature: 0.7,
    }),
  })
  const data = await response.json()
  if (!response.ok) throw Object.assign(new Error('LM Studio error'), { status: response.status, data })
  // Traduit la réponse OpenAI → format Anthropic attendu par le frontend
  return { content: [{ type: 'text', text: data.choices[0].message.content }] }
}

app.post('/api/oracle', async (req, res) => {
  try {
    const data = PROVIDER === 'lmstudio'
      ? await queryLMStudio(req.body)
      : await queryAnthropic(req.body)
    res.json(data)
  } catch (e) {
    const status = e.status ?? 500
    res.status(status).json(e.data ?? { error: e.message })
  }
})

app.use((req, res) => res.status(404).end())

app.listen(3001, () => console.log('Serveur oracle → http://localhost:3001'))
