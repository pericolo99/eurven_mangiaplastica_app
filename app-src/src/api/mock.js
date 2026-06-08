// Mock API per il test LOCALE (solo in dev, attivo con VITE_MOCK=1).
// Restituisce risposte nella forma dell'API v3 cosi' l'app e' navigabile
// senza backend. Mantiene un minimo di stato (tessere, adesione progetto).

const barcode =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="110">` +
      Array.from({ length: 46 })
        .map((_, i) => (i % 2 ? `<rect x="${i * 7}" y="0" width="${((i % 3) + 1) * 2}" height="110" fill="#0e1430"/>` : ''))
        .join('') +
      `</svg>`
  )

// Flag "progetti attivi" pilotabile dal toggle di sviluppo (default: attivo).
function mockProgettiAttivi() {
  const v = localStorage.getItem('mock_progetti')
  return v === null ? true : v === 'true'
}

// Stato mutabile della sessione demo
const state = {
  tessere: [
    { tipo_tessera: 'Carta Fedeltà', codice_tessera: '3001234567', numero_conferimenti: 12 },
  ],
  adesione: null, // { codice_progetto, ... } quando l'utente aderisce a un progetto
}

const elencoTessere = [
  { id: 1, nome: 'Carta Fedeltà', descrizione: 'Carta punti del comune' },
  { id: 2, nome: 'App Partner', descrizione: 'Applicazione partner' },
  { id: 3, nome: 'Tessera Scuola', descrizione: 'Progetti scolastici' },
]

const comuni = [
  { codice_cliente: 'ROMA01', nome: 'Roma' },
  { codice_cliente: 'MILA01', nome: 'Milano' },
  { codice_cliente: 'NAPO01', nome: 'Napoli' },
  { codice_cliente: 'TORI01', nome: 'Torino' },
  { codice_cliente: 'BOLO01', nome: 'Bologna' },
  { codice_cliente: 'FIRE01', nome: 'Firenze' },
]

const macchine = [
  { codice_macchina: 'RVM001', nome: 'Eco Piazza Centrale', comune: 'Roma', provincia: 'RM', descrizione: 'Ecocompattatore Piazza Centrale', latitudine: '41.9028', longitudine: '12.4964', online_sync: 1, distance: '350 m', color: 'green', stato: 'online' },
  { codice_macchina: 'RVM002', nome: 'Eco Stazione', comune: 'Roma', provincia: 'RM', descrizione: 'Eco Point Stazione Termini', latitudine: '41.9009', longitudine: '12.5020', online_sync: 1, distance: '1,2 km', color: 'green', stato: 'online' },
  { codice_macchina: 'RVM003', nome: 'Eco Centro Comm.', comune: 'Roma', provincia: 'RM', descrizione: 'RVM Centro Commerciale Est', latitudine: '41.8890', longitudine: '12.5130', online_sync: 0, distance: '2,8 km', color: 'red', stato: 'offline' },
]

const ultimi = [
  { data_conferimento: '12/05/2026', macchina_desc: 'Ecocompattatore Piazza Centrale', quantita: 24 },
  { data_conferimento: '08/05/2026', macchina_desc: 'Eco Point Stazione Termini', quantita: 16 },
  { data_conferimento: '02/05/2026', macchina_desc: 'RVM Centro Commerciale Est', quantita: 30 },
]

const storico = [
  { quantita: 24, descrizione: 'Ecocompattatore Piazza Centrale', data: '12/05/2026', sort: '2026-05-12', class: 'bg-color-blue' },
  { quantita: 16, descrizione: 'Eco Point Stazione Termini', data: '08/05/2026', sort: '2026-05-08', class: 'bg-color-blue' },
  { quantita: '- 50', descrizione: 'Scarico Premialità', data: '05/05/2026', sort: '2026-05-05', class: 'bg-color-red' },
  { quantita: 30, descrizione: 'RVM Centro Commerciale Est', data: '02/05/2026', sort: '2026-05-02', class: 'bg-color-blue' },
  { quantita: '- 100', descrizione: 'Scarico Premialità', data: '21/04/2026', sort: '2026-04-21', class: 'bg-color-red' },
]

const classifica = [
  { nominativo: 'Comune di Roma', punti: '1.240,50 kg' },
  { nominativo: 'Comune di Milano', punti: '980,10 kg' },
  { nominativo: 'Comune di Napoli', punti: '770,00 kg' },
  { nominativo: 'Comune di Torino', punti: '654,30 kg' },
]

const progettiList = [
  {
    id: 7, codice_progetto: 'SCUOLA2026', nome: 'Scuole Plastic Free',
    descrizione: 'Un progetto per ridurre la plastica nelle scuole del comune. Conferisci le bottiglie e fai vincere la tua classe!',
    istruzioni: 'Iscriviti indicando la tua scuola e la classe. Ogni bottiglia conferita conta per la classifica.',
    data_attivazione: '01/03/2026', data_chiusura: '30/06/2026',
  },
]

const progettoDetail = {
  id: 7, codice_progetto: 'SCUOLA2026', nome: 'Scuole Plastic Free',
  descrizione: 'Un progetto per ridurre la plastica nelle scuole.',
  extra_input: 1, descrizione_extra_input: 'Classe e sezione',
  partecipanti: [
    { codice_adesione: 'IC-ROSSI', descrizione: 'IC Giovanni Rossi' },
    { codice_adesione: 'IC-VERDI', descrizione: 'IC Giuseppe Verdi' },
  ],
}

const user = {
  id: 7112000123456,
  nome: 'Marco', cognome: 'Rossi', email: 'marco.rossi@email.it',
  cellulare: '+39 333 1234567', codice_comune: 'ROMA01', codice_fiscale: 'RSSMRC90A01H501Z',
}

function loginResponse() {
  return {
    hasError: false,
    statusMessage: '',
    keys: ['user_token', 'user', 'code', 'elenco_tessere', 'tessere', 'conferimenti', 'ultimi', 'elaborazioni', 'punti', 'classifica', 'progetti'],
    data: {
      user_token: 'mock-token-demo',
      user,
      code: { image: barcode, codice: String(user.id) },
      elenco_tessere: elencoTessere,
      tessere: state.tessere,
      conferimenti: 312,
      ultimi,
      elaborazioni: { bottiglie: 312, pet: '5.8', co: '31.20' },
      punti: 1240,
      classifica,
      progetti: mockProgettiAttivi(),
    },
  }
}

function tessereResponse() {
  return { hasError: false, statusMessage: 'OK', keys: ['tessere'], data: { tessere: state.tessere } }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function mockApi(endpoint, data = {}) {
  await delay(450) // simula la latenza (fa vedere skeleton/loader)

  switch (endpoint) {
    case 'login':
    case 'login_token':
      return loginResponse()

    case 'registrazione':
      return { hasError: false, statusMessage: 'registrazione_ok', data: {} }

    case 'aggiorna':
      Object.assign(user, { nome: data.nome, cognome: data.cognome, email: data.email, codice_comune: data.codice_comune, codice_fiscale: data.codice_fiscale })
      return loginResponse()

    case 'cancella':
      return { hasError: false, statusMessage: 'OK', data: {} }

    case 'recupera_password':
      return { hasError: false, statusMessage: 'utente_reset', data: {} }

    case 'comuni':
      return { hasError: false, data: { comuni } }

    case 'elenco_tessere':
      return { hasError: false, keys: ['tessere'], data: { tessere: state.tessere, elenco_tessere: elencoTessere } }

    case 'registra_tessera':
      if (data.codice_tessera) {
        state.tessere = [...state.tessere, { tipo_tessera: data.tipo_tessera, codice_tessera: data.codice_tessera, numero_conferimenti: 0 }]
      }
      return tessereResponse()

    case 'elimina_tessera':
      state.tessere = state.tessere.filter((t) => t.codice_tessera !== data.codice_tessera)
      return tessereResponse()

    case 'macchine':
      return { hasError: false, keys: ['macchine'], data: { macchine } }

    case 'storico':
      return { hasError: false, data: { storico } }

    case 'progetti':
      if (state.adesione) {
        return {
          hasError: false,
          data: {
            allow_adesione: false,
            adesione: { codice_progetto: state.adesione.codice_progetto, progetto: progettoDetail.nome, partecipante: state.adesione.partecipante, data_adesione: '08/05/2026', classe: state.adesione.classe, punti: 84 },
            classifica: [
              { nome: '3A', qta: 320 },
              { nome: '2B', qta: 210 },
              { nome: '1C', qta: 150 },
            ],
          },
        }
      }
      return { hasError: false, data: { allow_adesione: true, progetti: progettiList } }

    case 'progetto':
      return { hasError: false, data: { progetto: progettoDetail, allow_adesione: true } }

    case 'progetto/adesione': {
      const part = progettoDetail.partecipanti.find((p) => p.codice_adesione === data.codice_adesione)
      state.adesione = {
        codice_progetto: progettoDetail.codice_progetto,
        partecipante: part ? part.descrizione : data.codice_adesione,
        classe: [data.extra_input_1, data.extra_input_2].filter(Boolean).join(' ').toUpperCase(),
      }
      return { hasError: false, statusMessage: '', data: {} }
    }

    case 'progetto/rimuovi_adesione':
      state.adesione = null
      return { hasError: false, statusMessage: 'Adesione rimossa', data: {} }

    default:
      return { hasError: false, data: {} }
  }
}
