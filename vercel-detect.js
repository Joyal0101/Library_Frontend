const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log('> Running:', cmd);
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
}

function readPkg() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (e) {
    return {};
  }
}

const pkg = readPkg();
const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});

if (deps.next) {
  run('npx next build');
} else if (deps['react-scripts']) {
  run('npx react-scripts build');
} else if (deps.vite) {
  // Vite typically outputs to "dist", ensure vercel static build picks that or configure vercel.json if needed
  run('npx vite build');
} else if (deps.gatsby) {
  run('npx gatsby build');
} else if (deps.parcel) {
  run('npx parcel build');
} else if (pkg.scripts && pkg.scripts.build) {
  // fallback: if repo already has a build script, run it
  run('npm run build --if-present');
} else {
  console.error('\nNo known build tool detected (next, react-scripts, vite, gatsby, parcel) and no "build" script found in package.json.');
  console.error('If your project uses a different build command, either add a "build" script to package.json or update this script.');
  process.exit(1);
}
