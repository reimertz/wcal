const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const isProductionMode = ~process.argv.indexOf('-p')
const outputDir = isProductionMode ? 'dist' : '.build'

const commandFiles = [''].map( command => {
  return `wcal${command}`;
})

const commonOptions = {
  resolve: {
    extensions: ['', '.js', '.sass'],
    modulesDirectories: ['src', 'node_modules']
  }
}

const binConfigs = commandFiles.map(commandFile => {
  return Object.assign({}, commonOptions, {
    entry: `./src/bin/${commandFile}.js`,
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      preLoaders: [{
        test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/
      }],
      loaders: [{
        loader: 'babel',
        test: /\.js?$/,
        exclude: /node_modules/
      }]
    },
    plugins: [
      new webpack.BannerPlugin('#!/usr/bin/env node', { raw: true })
    ],
    output: {
      filename: `${outputDir}/bin/${commandFile}`
    },
    externals: [ nodeExternals() ]
  })
})

module.exports = binConfigs
