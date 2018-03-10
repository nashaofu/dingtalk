if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  module.exports = path.join(__dirname, '../')
} else {
  module.exports = __dirname
}
