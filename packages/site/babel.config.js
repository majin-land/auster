module.exports = function (api) {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          // https://babeljs.io/docs/en/babel-preset-env#forcealltransforms
          forceAllTransforms: api.env('production'),
          corejs: '3',
          targets: {
            browsers: ['last 2 versions', 'ie >= 11'],
          },
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
    // https://github.com/storybookjs/storybook/issues/3346#issuecomment-554270012
    sourceType: 'unambiguous',
    env: {
      development: {
        plugins: [
          'react-hot-loader/babel',
        ],
      },
      production: {
        plugins: [
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements',
          ['transform-react-remove-prop-types', { ignoreFilenames: ['node_modules'] }],
          ['transform-remove-console', { exclude: ['info'] }],
          [
            'babel-plugin-import',
            {
              libraryName: '@material-ui/core',
              // Use "'libraryDirectory': ''," if your bundler does not support ES modules
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'core',
          ],
          [
            'babel-plugin-import',
            {
              libraryName: '@material-ui/icons',
              // Use "'libraryDirectory': ''," if your bundler does not support ES modules
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'icons',
          ],
        ],
      },
    },
  }
}
