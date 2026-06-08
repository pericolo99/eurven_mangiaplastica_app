// Wrapper dei plugin nativi Cordova con fallback per il browser (sviluppo).
// La shell Cordova e i plugin restano invariati: qui li usiamo via window/cordova.

export const GOOGLE_MAPS_KEY = 'AIzaSyDdPAeD-8BY3o7ZqN-GnKazsTVqTmEKJ2w'

export function isCordova() {
  return typeof window !== 'undefined' && !!window.cordova
}

let _readyResolve
export const deviceReady = new Promise((resolve) => {
  _readyResolve = resolve
})

if (typeof document !== 'undefined') {
  if (isCordova()) {
    document.addEventListener('deviceready', () => _readyResolve(true), false)
    // Sicurezza: se deviceready non arriva entro 4s, sblocca comunque la UI.
    setTimeout(() => _readyResolve(true), 4000)
  } else {
    // In browser non c'e' deviceready: pronto subito.
    setTimeout(() => _readyResolve(false), 0)
  }
}

/** Scansione barcode/QR. Risolve con la stringa letta o null se annullato. */
export function scanBarcode(prompt = '') {
  return new Promise((resolve) => {
    if (isCordova() && window.cordova?.plugins?.barcodeScanner) {
      window.cordova.plugins.barcodeScanner.scan(
        (result) => resolve(result && !result.cancelled ? result.text : null),
        () => resolve(null),
        {
          preferFrontCamera: false,
          showFlipCameraButton: false,
          showTorchButton: true,
          torchOn: false,
          saveHistory: true,
          prompt,
          resultDisplayDuration: 500,
          disableAnimations: true,
          disableSuccessBeep: false,
        }
      )
    } else {
      // Fallback browser per sviluppo
      const v = window.prompt(prompt || 'Codice a barre (dev):', '')
      resolve(v || null)
    }
  })
}

/** Posizione corrente. Risolve {latitude, longitude} o null. */
export function getPosition(opts = { enableHighAccuracy: true, timeout: 5000, maximumAge: 3000 }) {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      opts
    )
  })
}

/** Avvia la navigazione verso una coordinata. */
export function navigateTo(lat, lng) {
  if (typeof window !== 'undefined' && window.launchnavigator) {
    window.launchnavigator.navigate([lat, lng])
  } else {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_system'
    )
  }
}

/** Versione dell'app. */
export function getAppVersion() {
  return new Promise((resolve) => {
    if (isCordova() && window.cordova?.getAppVersion) {
      window.cordova.getAppVersion.getVersionNumber(
        (v) => resolve(v),
        () => resolve('2.0.0')
      )
    } else {
      resolve('2.0.0')
    }
  })
}

/** Apre un URL esterno (privacy, link...). */
export function openExternal(url) {
  if (typeof window !== 'undefined' && window.cordova?.InAppBrowser) {
    window.cordova.InAppBrowser.open(url, '_system')
  } else {
    window.open(url, '_blank')
  }
}

let _mapsPromise = null
/** Carica l'SDK Google Maps una sola volta. */
export function loadGoogleMaps() {
  if (typeof window !== 'undefined' && window.google?.maps) return Promise.resolve(window.google)
  if (_mapsPromise) return _mapsPromise
  _mapsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`
    s.async = true
    s.defer = true
    s.onload = () => resolve(window.google)
    s.onerror = () => reject(new Error('maps-load-failed'))
    document.head.appendChild(s)
  })
  return _mapsPromise
}
