const path = require('path')

const { CLIEngine } = require('eslint')
const rules = require('eslint/lib/rules')

const configs = [
  { name: 'eslint:recommended', slug: 'eslint__recommended' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Google', slug: 'google' },
  { name: 'Standard', slug: 'standard' },
  { name: 'Semistandard', slug: 'semistandard' },
  { name: 'XO', slug: 'xo' },
]

module.exports = {
  build() {
    return {
      configs: configs.map(({ name, slug }) => ({
        name,
        config: new CLIEngine().getConfigForFile(path.resolve(__dirname, `../eslint-configs/${slug}/.eslintrc.js`)),
      })),
      categories: [...[...rules.entries()]
        .map(([name, { meta }]) => ({
          name,
          description: meta.docs.description,
          url: meta.docs.url,
          category: meta.docs.category,
          recommended: meta.docs.recommended,
          fixable: meta.fixable,
        }))
        .reduce((carry, rule) => {
          carry.has(rule.category) || carry.set(rule.category, [])
          carry.get(rule.category).push(rule)
          return carry
        }, new Map())
        .entries()]
        .map(([name, rules]) => ({
          name,
          rules: rules.sort((a, b) => a.name > b.name ? 1 : -1),
        }))
    }
  },
}
