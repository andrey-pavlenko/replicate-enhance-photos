#!/usr/bin/env node
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  allowOverwrite: true,
  bundle: true,
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);"
  },
  outfile: './dist/index.js'
});
