const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Get the project root directory (one level up from tools/)
const projectRoot = path.resolve(__dirname, '..');

async function buildForGitHubPages() {
  console.log('Building for GitHub Pages...');

  // Ensure dist directory exists
  const distDir = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Build the JavaScript bundle
  console.log('Building JavaScript bundle...');
  await esbuild.build({
    entryPoints: [path.join(projectRoot, 'src/index.tsx')],
    bundle: true,
    minify: true,
    outfile: path.join(distDir, 'bundle.js'),
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // Build the CSS
  console.log('Building CSS...');
  const { execSync } = require('child_process');
  execSync(`npx tailwindcss -i ${path.join(projectRoot, 'src/index.css')} -o ${path.join(distDir, 'bundle.css')} --minify`, { cwd: projectRoot });

  // Copy assets directory to root for GitHub Pages
  console.log('Copying assets...');
  const sourceAssetsDir = path.join(projectRoot, 'assets');
  const targetAssetsDir = path.join(projectRoot, 'assets');
  
  if (fs.existsSync(sourceAssetsDir)) {
    // Copy assets to the root level for GitHub Pages
    copyDirectory(sourceAssetsDir, targetAssetsDir);
  }

  // Copy favicon to root
  const faviconSource = path.join(projectRoot, 'favicon.svg');
  const faviconTarget = path.join(projectRoot, 'favicon.svg');
  if (fs.existsSync(faviconSource)) {
    fs.copyFileSync(faviconSource, faviconTarget);
  }

  // Create the main index.html file
  console.log('Creating index.html...');
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About James</title>
    <link href="./dist/bundle.css" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css" />
</head>
<body>
    <div id="root"></div>
    <script src="./dist/bundle.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(projectRoot, 'index.html'), htmlTemplate);
  
  console.log('GitHub Pages build complete!');
  console.log('Files created:');
  console.log('  - index.html (root)');
  console.log('  - dist/bundle.js');
  console.log('  - dist/bundle.css');
  console.log('  - assets/ (copied to root)');
  console.log('  - favicon.svg (root)');
}

// Helper function to copy directories recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

buildForGitHubPages().catch(console.error);