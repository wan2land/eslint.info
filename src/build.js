const path = require('path')

const { CLIEngine } = require('eslint')
const rules = require('eslint/lib/rules')

const configs = [
  'airbnb',
]

module.exports = {
  build() {
    return {
      configs: configs.map((name) => ({
        name,
        config: new CLIEngine().getConfigForFile(path.resolve(__dirname, `../eslint-configs/${name}/.eslintrc.js`)),
      })),
      rules: [...rules.entries()].map(([name, { meta }]) => ({
        name,
        description: meta.docs.description,
      })),
    }
  },
}
