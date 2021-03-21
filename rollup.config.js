// @ts-check
import ts from '@wessberg/rollup-plugin-ts'

import pkg from './package.json'

const banner = `/*!
  ${pkg.name} v${pkg.version}
  Based on Sindre Sorhus' screenfull.js
  @license MIT
*/`

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: pkg.source,

  plugins: [
    ts({
      include: ['src/**/*'],
    }),
  ],

  output: [
    {
      file: pkg.module,
      format: 'es',
      preferConst: true,
      sourcemap: true,
      banner,
    },
    {
      file: pkg.main,
      format: 'cjs',
      esModule: false,
      preferConst: true,
      sourcemap: false,
      banner,
    },
  ],
}
