// eslint-disable-next-line @typescript-eslint/no-require-imports
const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/index.ts',
  plugins: [
    typescript({
      exclude:['**/*.spec.ts', './src/tests/**']
    }),
  ],
  output: {
    dir: './build',
    format: 'umd',
    name: 'heap',
  },
};