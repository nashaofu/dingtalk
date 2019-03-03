module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '58',
          node: '8',
          electron: '2'
        }
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from'
  ]
}
