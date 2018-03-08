'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./env.prod')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
