# Mangiaplastica — App (UI Vue 3)

Interfaccia dell'app **Mangiaplastica / GreenPoints** (Vue 3 + Vite + Tailwind).
Il build viene generato in `../www/` ed è servito dalla shell **Cordova** esistente
(plugin nativi invariati: barcode, GPS, Google Maps, launch-navigator).

## Requisiti
- Node 18+

## Sviluppo locale

```bash
cd App/app-src
npm install

# 1) Test locale SENZA backend (dati demo) — consigliato per provare la UI
npm run dev:mock        # http://localhost:5173

# 2) Sviluppo contro un backend reale (API v3)
npm run dev
```

In **modalità mock** puoi accedere con qualsiasi numero/password: l'app risponde con
dati demo realistici e tutte le schermate sono navigabili (Home, Codice, Tessere,
Macchine, Storico, Progetti+adesione, Profilo).

> La mappa Google su `localhost` mostra solo un segnaposto: la chiave è ristretta al
> dominio dell'app, quindi i tile si vedono solo sul dispositivo. La lista macchine
> funziona comunque.

### Puntare a un backend diverso
Imposta `VITE_API_BASE` (es. staging) in un file `.env.local`:

```
VITE_API_BASE=https://staging.eurven.online/v3/
```

Default: `https://mangiaplastica.eurven.online/v3/`.

## Build (output in ../www, usato da Cordova)

```bash
npm run build
```

Il `www/` risultante è già pronto per Cordova. Dalla cartella `App/`:

```bash
cordova prepare
cordova run android      # oppure: cordova run ios
```

## Struttura
- `src/api/` — client HTTP v3, endpoint, mock locale
- `src/stores/` — sessione (reattiva, persistita) e UI (toast/loader/dialog)
- `src/native/` — wrapper plugin Cordova con fallback browser
- `src/components/` — componenti condivisi (nav, toolbar, skeleton, count-up, ...)
- `src/views/` — schermate
- `src/i18n.js` — traduzioni it/en
