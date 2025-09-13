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

  
  console.log('Build complete!');
  console.log('Files created:');
  console.log('  - dist/bundle.js');
  console.log('  - dist/bundle.css');
}


buildForGitHubPages().catch(console.error);