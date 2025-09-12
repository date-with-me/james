const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Get the project root directory (one level up from tools/)
const projectRoot = path.resolve(__dirname, '..');

async function buildSingleFile() {
  // Build the JavaScript bundle
  await esbuild.build({
    entryPoints: [path.join(projectRoot, 'src/index.tsx')],
    bundle: true,
    minify: true,
    outfile: path.join(projectRoot, 'docs/bundle.js'),
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // Build the CSS
  const { execSync } = require('child_process');
  execSync(`npx tailwindcss -i ${path.join(projectRoot, 'src/index.css')} -o ${path.join(projectRoot, 'docs/bundle.css')} --minify`, { cwd: projectRoot });

  // Read the built files
  let jsContent = fs.readFileSync(path.join(projectRoot, 'docs/bundle.js'), 'utf8');
  let cssContent = fs.readFileSync(path.join(projectRoot, 'docs/bundle.css'), 'utf8');

  // Also inline Leaflet and Leaflet-Draw CSS (index.html includes these via CDN, but our single-file build bypasses index.html)
  try {
    const leafletCssPath = path.join(projectRoot, 'node_modules', 'leaflet', 'docs', 'leaflet.css');
    const leafletDrawCssPath = path.join(projectRoot, 'node_modules', 'leaflet-draw', 'docs', 'leaflet.draw.css');
    let leafletCss = fs.existsSync(leafletCssPath) ? fs.readFileSync(leafletCssPath, 'utf8') : '';
    let leafletDrawCss = fs.existsSync(leafletDrawCssPath) ? fs.readFileSync(leafletDrawCssPath, 'utf8') : '';

    // Rewrite relative image urls in these CSS files to absolute CDN URLs so they work in a single file context
    // Leaflet images
    const leafletCdnBase = 'https://unpkg.com/leaflet@1.9.4/docs/images/';
    leafletCss = leafletCss
      .replace(/url\(("|')?images\//g, `url($1${leafletCdnBase}`)
      .replace(/url\(images\//g, `url(${leafletCdnBase}`);

    // Leaflet-Draw images
    const leafletDrawCdnBase = 'https://unpkg.com/leaflet-draw@1.0.4/docs/images/';
    leafletDrawCss = leafletDrawCss
      .replace(/url\(("|')?images\//g, `url($1${leafletDrawCdnBase}`)
      .replace(/url\(images\//g, `url(${leafletDrawCdnBase}`);

    cssContent = `${cssContent}\n/* Inlined Leaflet CSS */\n${leafletCss}\n/* Inlined Leaflet-Draw CSS */\n${leafletDrawCss}`;
  } catch (e) {
    console.warn('Warning: Failed to inline Leaflet CSS for single-file build.', e);
  }
  
  // Read assets and convert to base64
  const assetsDir = path.join(projectRoot, 'assets');
  const assetFiles = fs.readdirSync(assetsDir);
  
  // Create a mapping of asset paths to base64 data URLs
  const assetPathToBase64 = {};
  assetFiles.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) return; // Skip subdirectories
    const content = fs.readFileSync(filePath);
    const base64 = content.toString('base64');
    const ext = path.extname(file).toLowerCase();
    const mimeTypeMap = {
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
    };
    const mimeType = mimeTypeMap[ext] || 'application/octet-stream';
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Map both the filename and the full path
    assetPathToBase64[file] = dataUrl;
    assetPathToBase64[`/assets/${file}`] = dataUrl;
    assetPathToBase64[`./assets/${file}`] = dataUrl;
  });

  // Add favicon to the mapping
  const faviconPath = path.join(projectRoot, 'favicon.svg');
  if (fs.existsSync(faviconPath)) {
    const faviconContent = fs.readFileSync(faviconPath);
    const faviconBase64 = faviconContent.toString('base64');
    const faviconDataUrl = `data:image/svg+xml;base64,${faviconBase64}`;
    
    assetPathToBase64['favicon.svg'] = faviconDataUrl;
    assetPathToBase64['/favicon.svg'] = faviconDataUrl;
    assetPathToBase64['./favicon.svg'] = faviconDataUrl;
  }

  // Replace asset references in the JavaScript bundle
  Object.entries(assetPathToBase64).forEach(([assetPath, dataUrl]) => {
    // Replace various forms of asset references
    const patterns = [
      new RegExp(`"${assetPath}"`, 'g'),
      new RegExp(`'${assetPath}'`, 'g'),
      new RegExp(`\`${assetPath}\``, 'g'),
    ];
    
    patterns.forEach(pattern => {
      jsContent = jsContent.replace(pattern, `"${dataUrl}"`);
    });
  });

  // Create the single HTML file
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TORRENT</title>
    <style>${cssContent}</style>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${fs.readFileSync(path.join(projectRoot, 'favicon.svg')).toString('base64')}">
</head>
<body>
    <div id="root"></div>
    <script>
        ${jsContent}
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(projectRoot, 'docs/single-file.html'), htmlTemplate);
  console.log('Single HTML file built: docs/single-file.html');
}

buildSingleFile().catch(console.error);