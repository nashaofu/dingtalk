module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: 16
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
