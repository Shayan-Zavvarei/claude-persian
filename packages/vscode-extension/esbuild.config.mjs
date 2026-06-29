import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

/** Bundles the extension (inlining workspace deps like rtl-core) into a single CJS file. */
const options = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  external: ['vscode'], // provided by the VS Code runtime
  sourcemap: true,
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
