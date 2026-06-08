import { reactive, computed } from 'vue'

const LS = {
  token: 'user_token',
  user: 'user',
  code: 'code',
  punti: 'punti',
  conferimenti: 'conferimenti',
  ultimi: 'ultimi',
  elaborazioni: 'elaborazioni',
  classifica: 'classifica',
  elencoTessere: 'elenco_tessere',
  tessere: 'tessere',
  progetti: 'progetti',
}

// Mappa delle chiavi restituite dall'API -> proprieta' dello store
const KEY_MAP = {
  user_token: 'token',
  user: 'user',
  code: 'code',
  punti: 'punti',
  conferimenti: 'conferimenti',
  ultimi: 'ultimi',
  elaborazioni: 'elaborazioni',
  classifica: 'classifica',
  elenco_tessere: 'elencoTessere',
  tessere: 'tessere',
  progetti: 'progetti',
}

function read(key, fallback = null) {
  try {
    const v = localStorage.getItem(key)
    return v == null ? fallback : JSON.parse(v)
  } catch (e) {
    return fallback
  }
}

export const session = reactive({
  token: read(LS.token),
  user: read(LS.user),
  code: read(LS.code),
  punti: read(LS.punti, 0),
  conferimenti: read(LS.conferimenti, 0),
  ultimi: read(LS.ultimi, []),
  elaborazioni: read(LS.elaborazioni, { bottiglie: 0, pet: 0, co: 0 }),
  classifica: read(LS.classifica, []),
  elencoTessere: read(LS.elencoTessere, []),
  tessere: read(LS.tessere, []),
  progetti: read(LS.progetti, false),

  /**
   * Assorbe la risposta API: per ogni chiave dichiarata in `keys` salva il
   * valore corrispondente da `data` nello store e nel localStorage.
   */
  absorb(json) {
    if (!json || !json.data) return
    const keys = Array.isArray(json.keys) ? json.keys : []
    for (const k of keys) {
      const prop = KEY_MAP[k]
      if (!prop) continue
      const value = json.data[k]
      if (value === undefined) continue
      this[prop] = value
      try {
        localStorage.setItem(LS[prop], JSON.stringify(value))
      } catch (e) {
        /* storage pieno: ignora */
      }
    }
  },

  setToken(token) {
    this.token = token
    if (token) localStorage.setItem(LS.token, JSON.stringify(token))
  },

  logout() {
    Object.values(LS).forEach((k) => localStorage.removeItem(k))
    this.token = null
    this.user = null
    this.code = null
    this.punti = 0
    this.conferimenti = 0
    this.ultimi = []
    this.elaborazioni = { bottiglie: 0, pet: 0, co: 0 }
    this.classifica = []
    this.elencoTessere = []
    this.tessere = []
    this.progetti = false
  },
})

export const isAuthenticated = computed(() => !!session.token)

export function fullName() {
  if (!session.user) return ''
  return [session.user.nome, session.user.cognome].filter(Boolean).join(' ')
}
