#!/usr/bin/env node
// Postinstall script - patches package exports for Vite compatibility

const fs = require('fs');
const path = require('path');

const patches = [
  {
    pkg: 'property-information',
    exports: {
      ".": "./index.js",
      "./find": "./lib/find.js",
      "./html": "./lib/html.js",
      "./normalize": "./lib/normalize.js",
      "./svg": "./lib/svg.js",
      "./hast-to-react": "./lib/hast-to-react.js"
    }
  },
  {
    pkg: 'entities',
    exports: {
      ".": { "require": "./lib/index.js", "import": "./lib/esm/index.js" },
      "./decode": { "require": "./lib/decode.js", "import": "./lib/esm/decode.js" },
      "./escape": { "require": "./lib/escape.js", "import": "./lib/esm/escape.js" },
      "./lib/decode.js": { "require": "./lib/decode.js", "import": "./lib/esm/decode.js" },
      "./lib/escape.js": { "require": "./lib/escape.js", "import": "./lib/esm/escape.js" }
    }
  }
];

let patched = 0;

for (const patch of patches) {
  const pkgPath = path.join(__dirname, 'node_modules', patch.pkg, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.log(`[postinstall] Skipping ${patch.pkg}: not found`);
    continue;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  // Check if already patched
  const currentExports = JSON.stringify(pkg.exports);
  const targetExports = JSON.stringify(patch.exports);
  if (currentExports === targetExports) {
    console.log(`[postinstall] ${patch.pkg} already patched ✓`);
    continue;
  }

  pkg.exports = patch.exports;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`[postinstall] Patched ${patch.pkg} ✓`);
  patched++;
}

if (patched === 0) {
  console.log('[postinstall] All packages up to date');
} else {
  console.log(`[postinstall] Patched ${patched} package(s)`);
}