import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

/** Userscript metadata block — must remain at the very top of the output file. */
const banner = `// ==UserScript==
// @name         Claude RTL Persian
// @namespace    https://github.com/claude-rtl-persian
// @version      1.0.0
// @description  Fix RTL and Persian text rendering on claude.ai
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==`;

const options = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'build/claude-rtl.user.js',
  format: 'iife',
  target: 'es2020',
  platform: 'browser',
  banner: { js: banner },
  legalComments: 'none',
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
