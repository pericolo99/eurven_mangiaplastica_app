import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:5180'

const barcodeSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">` +
      Array.from({ length: 40 })
        .map((_, i) => {
          const w = (i % 3) + 1
          const x = i * 7
          return i % 2 ? `<rect x="${x}" y="0" width="${w * 2}" height="100" fill="#0e1430"/>` : ''
        })
        .join('') +
      `</svg>`
  )

const seed = {
  user_token: 'demo-token-123',
  user: {
    nome: 'Marco',
    cognome: 'Rossi',
    email: 'marco.rossi@email.it',
    cellulare: '+39 333 1234567',
    codice_comune: 'ROMA01',
    codice_fiscale: 'RSSMRC90A01H501Z',
  },
  punti: 1240,
  conferimenti: 312,
  ultimi: [
    { macchina_desc: 'Ecocompattatore Piazza Centrale', data_conferimento: '12/05/2026', quantita: 24 },
    { macchina_desc: 'Eco Point Stazione', data_conferimento: '08/05/2026', quantita: 16 },
    { macchina_desc: 'RVM Centro Commerciale', data_conferimento: '02/05/2026', quantita: 30 },
  ],
  elaborazioni: { bottiglie: 312, pet: '5.8', co: '31.20' },
  classifica: [
    { nominativo: 'Comune di Roma', punti: '1.240,50 kg' },
    { nominativo: 'Comune di Milano', punti: '980,10 kg' },
    { nominativo: 'Comune di Napoli', punti: '770,00 kg' },
  ],
  elenco_tessere: [{ id: 1, nome: 'Carta Fedeltà' }],
  tessere: [
    { tipo_tessera: 'Carta Fedeltà', codice_tessera: '3001234567', numero_conferimenti: 12 },
    { tipo_tessera: 'App Partner', codice_tessera: '3009988776', numero_conferimenti: 0 },
  ],
  progetti: true,
  code: { codice: '7112000123456', image: barcodeSvg },
}

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await page.evaluateOnNewDocument((data) => {
  for (const [k, v] of Object.entries(data)) {
    localStorage.setItem(k, JSON.stringify(v))
  }
}, seed)

const shots = [
  ['home', '/#/home'],
  ['code', '/#/code'],
  ['cards', '/#/cards'],
  ['profile', '/#/profile'],
]

for (const [name, route] of shots) {
  await page.goto(BASE + route, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: `/tmp/auth-${name}.png` })
  console.log('shot', name)
}

// Drawer aperto sulla Home
await page.goto(BASE + '/#/home', { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 800))
await page.click('header button[aria-label="menu"]')
await new Promise((r) => setTimeout(r, 600))
await page.screenshot({ path: '/tmp/auth-drawer.png' })
console.log('shot drawer')

await browser.close()
