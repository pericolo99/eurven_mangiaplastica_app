#!/usr/bin/env node
// phonegap-plugin-barcodescanner@8.1.0 usa `compile(...)` e `jcenter()`, rimossi
// nelle versioni recenti di Gradle (cordova-android 14 -> Gradle 8): la build fallisce
// con "Could not find method compile()". Patchiamo il .gradle copiato in platforms/android
// ad ogni prepare, cosi' funziona anche su un clone pulito.
const fs = require('fs');
const path = require('path');

module.exports = function (context) {
  const dir = path.join(context.opts.projectRoot, 'platforms', 'android', 'phonegap-plugin-barcodescanner');
  if (!fs.existsSync(dir)) return;

  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.gradle'))) {
    const file = path.join(dir, f);
    const src = fs.readFileSync(file, 'utf8');
    const out = src
      .replace(/\bcompile\s*\(/g, 'implementation(')
      .replace(/\bjcenter\(\)/g, 'mavenCentral()');
    if (out !== src) {
      fs.writeFileSync(file, out);
      console.log('fix-barcodescanner-gradle: patchato ' + f);
    }
  }
};
