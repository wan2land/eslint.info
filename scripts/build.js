const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const ejs = require('ejs')
const minify = require('html-minifier').minify

function log(name, color, data) {
  const prefix = chalk[color].bold(`[${name}] `)
  data = data instanceof Buffer
    ? data.toString()
    : typeof data === 'object'
      ? data.toString({ colors: true, chunks: false })
      : `${data}`
  console.log(data.split(/\r?\n/).map(line => `${prefix}${line}`).join('\n'))
}

function buildWebpack(config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)

    compiler.hooks.done.tap('done', stats => {
      log('Webpack', 'yellow', stats)
    })

    log('Webpack', 'yellow', chalk.cyan('compiling...'))
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function buildTemplate() {
  return new Promise(async (resolve, reject) => {

    log('Template', 'cyan', chalk.cyan('compiling...'))
 
    const build = require('../src/build').build

    ejs.renderFile(path.resolve(__dirname, '../templates/index.ejs'), {
      ...await build(),
      pluginPackage(name) {
        if (name[0] === '@') {
          const [ns, pkg] = name.split('/')
          return `${ns}/eslint-plugin${pkg ? `-${pkg}` : ''}`
        }
        return `eslint-plugin-${name}`
      },
      anchor(name) {
        return name.replace(/\s+/, '-').toLowerCase()
      },
    }, (err, body) => {
      if (err) {
        return reject(err)
      }
      fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), minify(body, {
        html5: true,
        collapseWhitespace: true,
        minifyJS: true,
        removeComments: true,
        removeStyleLinkTypeAttributes: true,
        removeScriptTypeAttributes: true,
      }))

      log('Template', 'cyan', 'Complete index.ejs -> index.html')
      resolve()
    })
  })
}

buildWebpack(require('./webpack.config'))
  .then(() => buildTemplate())
