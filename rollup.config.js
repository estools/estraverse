import { terser } from 'rollup-plugin-terser';

import babel from '@rollup/plugin-babel';

/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} [config= {}]
 * @param {boolean} [config.minifying=false]
 * @param {string} [config.format='umd']
 * @returns {external:RollupConfig}
 */
function getRollupObject ({ minifying, format = 'umd' } = {}) {
    const nonMinified = {
        input: 'src/estraverse.js',
        output: {
            format,
            sourcemap: minifying,
            file: `dist/estraverse${
                format === 'umd' ? '' : `.${format}`
            }${minifying ? '.min' : ''}.js`,
            name: 'estraverse'
        },
        plugins: [
            babel({
                babelHelpers: 'bundled'
            })
        ]
    };
    if (minifying) {
        nonMinified.plugins.push(terser());
    }
    return nonMinified;
}

export default [
    getRollupObject({ minifying: true, format: 'umd' }),
    getRollupObject({ minifying: false, format: 'umd' }),
    getRollupObject({ minifying: true, format: 'esm' }),
    getRollupObject({ minifying: false, format: 'esm' })
];
