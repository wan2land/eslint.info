const path = require('path')

const { CLIEngine } = require('eslint')
const eslintRules = [...require('eslint/lib/rules').entries()].map(([name, { meta }]) => ({
  pkg: 'eslint',
  name,
  meta,
}))

const pluginImportRules = Object.entries(require('eslint-plugin-import').rules).map(([name, { meta }]) => ({
  pkg: 'eslint-plugin-import',
  name: `import/${name}`,
  meta,
}))

const pluginJsxA11yRules = Object.entries(require('eslint-plugin-jsx-a11y').rules).map(([name, { meta }]) => ({
  pkg: 'eslint-plugin-jsx-a11y',
  name: `jsx-a11y/${name}`,
  meta,
}))

const pluginReactRules = Object.entries(require('eslint-plugin-react').rules).map(([name, { meta }]) => ({
  pkg: 'eslint-plugin-react',
  name: `react/${name}`,
  meta,
}))

const pluginNodeRules = Object.entries(require('eslint-plugin-node').rules).map(([name, { meta }]) => ({
  pkg: 'eslint-plugin-node',
  name: `node/${name}`,
  meta,
}))

const pluginPromiseRules = Object.entries(require('eslint-plugin-promise').rules).map(([name, { meta }]) => ({
  pkg: 'eslint-plugin-promise',
  name: `promise/${name}`,
  meta,
}))

const pluginStandardRules = Object.entries(require('eslint-plugin-standard').rules).map(([name, { meta }]) => ({
  pkg: 'eslint-plugin-standard',
  name: `standard/${name}`,
  meta,
}))

const configs = [
  { name: 'eslint:recommended', slug: 'eslint__recommended' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Google', slug: 'google' },
  { name: 'Standard', slug: 'standard' },
  { name: 'Semistandard', slug: 'semistandard' },
  { name: 'XO', slug: 'xo' },
]

const rules = [
  ...eslintRules,
  ...pluginImportRules,
  ...pluginJsxA11yRules,
  ...pluginReactRules,
  ...pluginNodeRules,
  ...pluginPromiseRules,
  ...pluginStandardRules,
]

module.exports = {
  build() {
    return {
      configs: configs.map(({ name, slug }) => ({
        name,
        config: new CLIEngine().getConfigForFile(path.resolve(__dirname, `../eslint-configs/${slug}/.eslintrc.js`)),
      })),
      categories: Object.entries(rules.reduce((carry, rule) => {
          const groupKey = `${rule.pkg}__${rule.category || ''}`
          carry[groupKey] = carry[groupKey] || { pkg: rule.pkg, category: rule.category, rules: [] }
          carry[groupKey].rules.push(rule)
          return carry
        }, {}))
        .map(([_, { pkg, category, rules }]) => ({
          pkg,
          category,
          rules: rules.sort((a, b) => a.name > b.name ? 1 : -1),
        }))
    }
  },
}
