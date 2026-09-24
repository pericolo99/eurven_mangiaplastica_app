#!/usr/bin/env bash
# Setup completo per compilare iOS su un Mac (anche VM) partendo da un clone pulito.
# Uso (dalla cartella App/):  npm run ios:setup   oppure   bash scripts/ios-setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; exit 1; }

echo "==> Controllo prerequisiti"
[[ "$(uname)" == "Darwin" ]] || fail "iOS si compila solo su macOS"
xcode-select -p >/dev/null 2>&1 || fail "Command Line Tools mancanti: xcode-select --install"
xcodebuild -version >/dev/null 2>&1 || fail "Xcode non installato/selezionato: sudo xcode-select -s /Applications/Xcode.app"
ok "$(xcodebuild -version | head -1)"
command -v node >/dev/null || fail "Node mancante (serve >= 18, vedi .nvmrc)"
ok "node $(node -v)"
command -v pod >/dev/null || fail "CocoaPods mancante: brew install cocoapods"
ok "CocoaPods $(pod --version)"

echo "==> Dipendenze npm (shell Cordova + UI)"
npm ci
npm --prefix app-src ci

echo "==> Build UI (app-src -> www)"
npm --prefix app-src run build

echo "==> Piattaforma iOS + plugin"
if [[ ! -d platforms/ios ]]; then
  npx cordova platform add ios
fi
npx cordova prepare ios

echo
echo "Fatto. Prossimi passi:"
echo "  npm run ios:open   # apre Mangiaplastica.xcworkspace in Xcode (imposta il Team in Signing)"
echo "  npm run ios        # build + run sul simulatore"
