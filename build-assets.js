import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';
import CleanCSS from 'clean-css';

const root = path.resolve('./');
const outDir = path.join(root, 'dist');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const cssFile = path.join(root, 'css', 'style.css');

const jsBundlePath = path.join(outDir, 'bundle.js');
const cssOutPath = path.join(outDir, 'style.css');
const bundleEntry = path.join(root, 'js', 'bundle-entry.js');

await esbuild.build({
  entryPoints: [bundleEntry],
  bundle: true,
  format: 'iife',
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  outfile: jsBundlePath,
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  logLevel: 'silent'
});

const css = fs.readFileSync(cssFile, 'utf8');
const minifiedCss = new CleanCSS({ level: 2 }).minify(css).styles;
fs.writeFileSync(cssOutPath, minifiedCss, 'utf8');

console.log('Built assets:', jsBundlePath, cssOutPath);
