
// ref. https://eslint.org/docs/developer-guide/working-with-rules

const path = require('path')

const { CLIEngine } = require('eslint')
const eslintRules = [...require('eslint/lib/rules').entries()].map(([name, { meta }]) => ({
  package: 'eslint',
  name,
  meta,
}))

const pluginImportRules = Object.entries(require('eslint-plugin-import').rules).map(([name, { meta }]) => ({
  package: 'eslint-plugin-import',
  name: `import/${name}`,
  meta,
}))

const pluginJsxA11yRules = Object.entries(require('eslint-plugin-jsx-a11y').rules).map(([name, { meta }]) => ({
  package: 'eslint-plugin-jsx-a11y',
  name: `jsx-a11y/${name}`,
  meta,
}))

const pluginReactRules = Object.entries(require('eslint-plugin-react').rules).map(([name, { meta }]) => ({
  package: 'eslint-plugin-react',
  name: `react/${name}`,
  meta,
}))

const pluginNodeRules = Object.entries(require('eslint-plugin-node').rules).map(([name, { meta }]) => ({
  package: 'eslint-plugin-node',
  name: `node/${name}`,
  meta,
}))

const pluginPromiseRules = Object.entries(require('eslint-plugin-promise').rules).map(([name, { meta }]) => ({
  package: 'eslint-plugin-promise',
  name: `promise/${name}`,
  meta,
}))

const pluginStandardRules = Object.entries(require('eslint-plugin-standard').rules).map(([name, { meta }]) => ({
  package: 'eslint-plugin-standard',
  name: `standard/${name}`,
  meta,
}))

const pluginTypescriptEslintRules = Object.entries(require('@typescript-eslint/eslint-plugin').rules).map(([name, { meta }]) => ({
  package: '@typescript-eslint/eslint-plugin',
  name: `@typescript-eslint/${name}`,
  meta,
}))

const configs = [
  { name: 'eslint:recommended', slug: 'eslint__recommended' },
  { name: 'Prettier', slug: 'prettier', package: 'eslint-config-prettier' },
  { name: 'Airbnb', slug: 'airbnb', package: 'eslint-config-airbnb' },
  { name: 'Airbnb Typescript', slug: 'airbnb-typescript', package: 'eslint-config-airbnb-typescript' },
  { name: 'Google', slug: 'google', package: 'eslint-config-google' },
  { name: 'Standard', slug: 'standard', package: 'eslint-config-standard' },
  { name: 'Semistandard', slug: 'semistandard', package: 'eslint-config-semistandard' },
  { name: 'XO', slug: 'xo', package: 'eslint-config-xo' },
  { name: 'XO Space', slug: 'xo-space', package: 'eslint-config-xo-space' },
]

const rules = [
  ...eslintRules,
  ...pluginImportRules,
  ...pluginJsxA11yRules,
  ...pluginReactRules,
  ...pluginNodeRules,
  ...pluginPromiseRules,
  ...pluginStandardRules,
  ...pluginTypescriptEslintRules,
]

function groupBy(nodes, keyBy) {
  return Object.entries(nodes.reduce((carry, node) => ((carry[keyBy(node) || ''] || (carry[keyBy(node) || ''] = [])).push(node), carry), {}))
}

module.exports = {
  async build() {
    return {
      configs: await Promise.all(configs.map(async ({ name, slug, package }) => ({
        name,
        config: new CLIEngine().getConfigForFile(path.resolve(__dirname, `../eslint-configs/${slug}/.eslintrc.js`)),
        package: package,
      }))),
      packages: groupBy(rules, rule => rule.package).map(([name, rules]) => ({
        name,
        categories: groupBy(rules, rule => rule.meta.docs.category).map(([name, rules]) => ({
          name,
          rules: rules.sort((a, b) => a.name > b.name ? 1 : -1),
        })).sort((a, b) => a.category > b.category ? 1 : -1),
      })),
    }
  },
}
