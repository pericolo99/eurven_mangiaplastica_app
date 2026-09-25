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
- **Node 18+** (vedi `.nvmrc`); la Cordova CLI 12 è già tra le dipendenze del progetto
- **CocoaPods**: `sudo gem install cocoapods` (oppure `brew install cocoapods`)
- Un **Apple ID** (per il simulatore basta quello gratuito; per dispositivo fisico /
  App Store serve un account **Apple Developer**)

## Setup rapido sulla VM macOS (clone pulito)
`platforms/`, `plugins/` e `node_modules/` **non** sono nel repo: vengono rigenerati
da `package.json` (sezione `cordova`) e `config.xml`.

Accesso a GitHub dalla VM (una volta sola) — il clone usa SSH:
```bash
xcode-select --install                             # porta anche git
brew install node cocoapods                        # Xcode invece dall'App Store
ssh-keygen -t ed25519 -C "pericolo99@gmail.com"    # Invio alle domande
pbcopy < ~/.ssh/id_ed25519.pub                     # copia la chiave pubblica
```
Incollala su GitHub in **Settings → SSH and GPG keys → New SSH key**, poi verifica con
`ssh -T git@github.com` (risponde "Hi pericolo99!"). In alternativa senza SSH:
`brew install gh && gh auth login && gh repo clone pericolo99/eurven_mangiaplastica_app`.

```bash
git clone git@github.com:pericolo99/eurven_mangiaplastica_app.git
cd eurven_mangiaplastica_app
nvm use              # opzionale: usa la Node di .nvmrc
npm run ios:setup    # controlla prerequisiti, npm ci, build UI, platform add + prepare ios
npm run ios:open     # apre il .xcworkspace in Xcode → imposta il Team e premi Run
```
Per aggiornare dopo modifiche fatte su Linux: `git pull && npm run ios:prepare`.

Note VM:
- Usa la CLI Cordova **locale** del progetto (`npx cordova …` o gli script npm):
  è la 12, quella richiesta da `cordova-ios@7`. Una Cordova globale vecchia non va.
- Il **simulatore** funziona in VM (lento ma ok). Per un **iPhone fisico** serve il
  passthrough USB della VM; in alternativa distribuisci via TestFlight (passo 6).
- Assegna alla VM almeno 8 GB di RAM e ~60 GB di disco (Xcode + simulatori).

## Scorciatoie npm (dalla cartella `App/`)
Gli script fanno automaticamente **build UI + comando Cordova**:
```bash
npm run setup        # una volta: installa le dipendenze della UI (app-src)
npm run ios          # build UI + cordova run ios (simulatore)
npm run ios:prepare  # build UI + cordova prepare ios (poi apri in Xcode)
npm run ios:open     # apre platforms/ios/Mangiaplastica.xcworkspace
npm run ios:release  # build release per device (firma dal Team impostato in Xcode)
```
I passi manuali qui sotto restano validi per capire cosa succede / firmare in Xcode.

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
# npx cordova platform rm ios && npx cordova platform add ios

npx cordova prepare ios   # copia www + plugin ed esegue 'pod install'
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
