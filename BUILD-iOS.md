# Compilare l'app per iOS

L'app è una **Cordova app**: la UI (Vue) viene buildata in `www/` e impacchettata
dalla shell Cordova. iOS si compila **solo su macOS con Xcode** (non su Linux/Windows).

Dati del progetto:
- Bundle ID: `com.eurven.greenpoints`
- Nome: Mangiaplastica · versione `1.2.1` (build `23`)
- Piattaforma: `cordova-ios@7` (WKWebView) — già aggiunta
- Permessi iOS (fotocamera/posizione): già predisposti in `config.xml`

## 1. Prerequisiti (sul Mac)
- **macOS** recente + **Xcode** (da App Store) e Command Line Tools:
  `xcode-select --install`
- **Node 18+** e **Cordova CLI**: `npm i -g cordova`
- **CocoaPods**: `sudo gem install cocoapods` (oppure `brew install cocoapods`)
- Un **Apple ID** (per il simulatore basta quello gratuito; per dispositivo fisico /
  App Store serve un account **Apple Developer**)

## 2. Build della UI (Vue → www)
Da fare **prima** di ogni build Cordova, così `www/` è aggiornato:
```bash
cd App/app-src
npm install
npm run build        # genera ../www
```

## 3. Preparare iOS
Dalla cartella `App/`:
```bash
# se la piattaforma dà problemi, rigenerala pulita:
# cordova platform rm ios && cordova platform add ios@7

cordova prepare ios   # copia www + plugin ed esegue 'pod install'
```

## 4. Aprire in Xcode e firmare
```bash
open platforms/ios/Mangiaplastica.xcworkspace   # IMPORTANTE: .xcworkspace, non .xcodeproj
```
In Xcode:
1. Seleziona il target **Mangiaplastica** → tab **Signing & Capabilities**
2. Spunta **Automatically manage signing** e scegli il tuo **Team**
3. Se il bundle id `com.eurven.greenpoints` è già usato da altri, mettine uno tuo
4. Verifica in **Info.plist** che ci siano i testi dei permessi (già iniettati da
   `config.xml`): *NSCameraUsageDescription*, *NSLocationWhenInUseUsageDescription*

## 5. Eseguire
- **Simulatore / dispositivo**: scegli il device in alto e premi ▶︎ (Run)
- **Da CLI** (in `App/`):
  ```bash
  cordova run ios                 # simulatore
  cordova run ios --device        # dispositivo collegato
  ```

## 6. Pubblicare su App Store
1. In Xcode: device target = **Any iOS Device (arm64)**
2. Menu **Product → Archive**
3. Nell'Organizer: **Distribute App → App Store Connect**
4. Completa la scheda su **App Store Connect** (privacy, screenshot, ecc.)

## Note specifiche di questo progetto
- Usa **sempre `.xcworkspace`** (ci sono CocoaPods dei plugin WKWebView).
- **Scanner barcode** (fotocamera) e **Vicino a me** (GPS): su un device reale iOS
  chiederà i permessi grazie alle usage description del `config.xml`.
- **Google Maps** e **launchnavigator** caricano da rete: serve connessione.
- La nuova UI usa moduli ES e path relativi (`base: './'`): compatibile con lo
  schema WKWebView di cordova-ios 7.
- Per cambiare versione/build prima di una release, aggiorna `version` e
  `ios-CFBundleVersion` in `config.xml`, poi `cordova prepare ios`.

## Errori comuni
- *"pod: command not found"* → installa CocoaPods (passo 1).
- *Signing error* → imposta il Team in Signing & Capabilities (passo 4).
- *Pagina bianca all'avvio* → hai dimenticato `npm run build` (passo 2) prima del
  `cordova prepare`.
