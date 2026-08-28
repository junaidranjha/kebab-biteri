const fs = require('fs');
const path = require('path');

const app = process.argv[2];
if (!app) {
  console.error('Usage: node scripts/vercel-install.js <apps/web|apps/api>');
  process.exit(1);
}

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.workspaces = [app, 'packages/*'];
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('workspaces =', pkg.workspaces);
