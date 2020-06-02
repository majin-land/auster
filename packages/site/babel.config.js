const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      corejs: '3',
    },
  ],
  '@babel/preset-react',
]

const plugins = [
  '@babel/plugin-transform-runtime',
  [
    '@babel/plugin-proposal-decorators',
    { legacy: true },
  ],
  [
    '@babel/plugin-proposal-class-properties',
    { loose: true },
  ],
]

if (process.env.NODE_ENV === 'production') {
  plugins.push('@babel/plugin-transform-react-constant-elements')
  plugins.push('@babel/plugin-transform-react-inline-elements')
  plugins.push([
    'transform-react-remove-prop-types',
    {
      ignoreFilenames: ['node_modules'],
    },
  ])
  plugins.push(
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
  )
} else {
  plugins.unshift('react-hot-loader/babel')
}

module.exports = { presets, plugins }
