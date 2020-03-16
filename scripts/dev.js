const express = require('express')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

function log(name, color, data) {
  const prefix = chalk[color].bold(`[${name}] `)
  data = data instanceof Buffer
    ? data.toString()
    : typeof data === 'object'
      ? data.toString({ colors: true, chunks: false })
      : `${data}`
  console.log(data.split(/\r?\n/).map(line => `${prefix}${line}`).join('\n'))
}

function startWebpack(config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)

    compiler.hooks.watchRun.tap('watch-run', () => {
      log('Webpack', 'yellow', chalk.cyan('compiling...'))
    })
    compiler.hooks.done.tap('done', stats => {
      log('Webpack', 'yellow', stats)
    })
    compiler.watch({}, (err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function startExpress() {
  return new Promise((resolve, reject) => {
    const app = express()

    app.use(express.static(path.resolve(__dirname, '../dist')))

    app.set('views', path.resolve(__dirname, '../templates'))
    app.set('view engine', 'ejs')
    app.engine('html', require('ejs').renderFile)

    app.get('/', (_, res) => {
      delete require.cache[require.resolve('../src/build')]
      const build = require('../src/build').build
      res.render('index.ejs', {
        ...build(),
      })
    })

    app.listen(9001, () => {
      log('Express', 'cyan', chalk.cyan('listen 9001'))
      resolve()
    })
  })
}

Promise.all([
  startWebpack(require('./webpack.config')),
  startExpress(),
])
