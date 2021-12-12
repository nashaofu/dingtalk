module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: 15
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
