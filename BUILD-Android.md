# Compilare l'app per Android

L'app è una **Cordova app**: la UI (Vue) viene buildata in `www/` e impacchettata
dalla shell Cordova. Android si compila su **Linux, macOS o Windows**.

Dati del progetto:
- Bundle ID: `com.eurven.greenpoints`
- Versione `1.2.1` · `android-versionCode` `23`
- Piattaforma: `cordova-android@14` · minSdk **21** · targetSdk **35** (Android 15)
- Chiave Google Maps (launchnavigator) già configurata nel `config.xml`

## 1. Prerequisiti
- **JDK 17** ⚠️ (cordova-android 14 lo richiede; la JDK 11 NON va bene)
  ```bash
  sudo apt install openjdk-17-jdk
  sudo update-alternatives --config java     # seleziona la 17
  export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
  ```
- **Android SDK** — il modo più semplice è installare **Android Studio**, che porta
  SDK, platform-tools ed emulatore. In alternativa solo le command-line tools.
  Servono: **SDK Platform 35**, **Build-Tools**, **Platform-Tools**.
- Variabili d'ambiente (aggiungile a `~/.bashrc`):
  ```bash
  export ANDROID_HOME=$HOME/Android/Sdk
  export ANDROID_SDK_ROOT=$ANDROID_HOME
  export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
  ```
- Installa i pacchetti SDK e accetta le licenze:
  ```bash
  sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
  sdkmanager --licenses
  ```
- **Node 18+** e **Cordova CLI**: `npm i -g cordova`

> Verifica l'ambiente con: `cordova requirements android`

## Scorciatoie npm (dalla cartella `App/`)
Gli script fanno automaticamente **build UI + comando Cordova**:
```bash
npm run setup            # una volta: installa le dipendenze della UI (app-src)
npm run android          # build UI + cordova run android (device/emulatore)
npm run android:build    # build UI + APK di debug
npm run android:release  # build UI + AAB firmato per il Play Store
```
I passi manuali qui sotto restano validi per capire cosa succede / fare debug.

## 2. Build della UI (Vue → www)
Da fare **prima** di ogni build Cordova:
```bash
cd App/app-src
npm install
npm run build        # genera ../www
```

## 3. Preparare ed eseguire (debug)
Dalla cartella `App/`:
```bash
cordova prepare android        # copia www + plugin

# Emulatore o dispositivo (USB debugging attivo):
cordova run android

# Solo build dell'APK di debug:
cordova build android
# APK in: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 4. Build di release (firmata)
### a) Crea il keystore (una volta sola, conservalo!)
```bash
keytool -genkey -v -keystore mangiaplastica.keystore \
  -alias mangiaplastica -keyalg RSA -keysize 2048 -validity 10000
```

### b) Configura la firma — crea `App/build.json`
```json
{
  "android": {
    "release": {
      "keystore": "mangiaplastica.keystore",
      "storePassword": "LA_TUA_PASSWORD",
      "alias": "mangiaplastica",
      "password": "LA_TUA_PASSWORD",
      "keystoreType": ""
    }
  }
}
```
> Non committare `build.json` né il keystore (contengono segreti).

### c) Genera il pacchetto
```bash
# AAB per il Play Store (consigliato):
cordova build android --release -- --packageType=bundle
# -> platforms/android/app/build/outputs/bundle/release/app-release.aab

# APK firmato (per distribuzione diretta):
cordova build android --release -- --packageType=apk
```

## 5. Pubblicare sul Play Store
1. Carica l'**.aab** su **Google Play Console** (Internal testing → Production).
2. Per ogni nuova release **incrementa `android-versionCode`** (e di solito `version`)
   in `config.xml`, poi rifai i passi 2–4.

## Note specifiche di questo progetto
- **Sempre `npm run build` prima** di `cordova prepare` (altrimenti vedi la vecchia UI
  o una pagina bianca).
- **Scanner barcode** (fotocamera) e **Vicino a me** (GPS): i permessi runtime sono
  gestiti dai plugin; su Android 6+ vengono chiesti all'uso.
- **Google Maps / launchnavigator**: la chiave Android è già nel `config.xml`; assicurati
  che sia abilitata per "Maps SDK for Android" nella Google Cloud Console.
- La nuova UI usa path relativi (`base: './'`): compatibile con lo schema
  `https://localhost` di cordova-android.

## Errori comuni
- *"Unsupported Java version" / build fallita* → stai usando JDK ≠ 17 (passo 1).
- *"ANDROID_HOME not set" / "Failed to find ... SDK"* → variabili d'ambiente / pacchetti
  SDK mancanti (passo 1).
- *Licenze non accettate* → `sdkmanager --licenses`.
- *Pagina bianca all'avvio* → manca `npm run build` prima del `prepare`.
