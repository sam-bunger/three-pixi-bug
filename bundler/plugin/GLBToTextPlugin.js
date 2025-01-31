// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RawSource } = require('webpack-sources')

class GLBToTextPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('GLBToTextPlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'GLBToTextPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets, callback) => {
          for (const assetName in assets) {
            if (assetName.endsWith('.glb')) {
              const source = assets[assetName].source()
              const textRepresentation = Buffer.from(source).toString('base64')
              compilation.deleteAsset(assetName)
              compilation.emitAsset(assetName, new RawSource(textRepresentation))
            }
          }
          callback()
        }
      )
    })
  }
}

module.exports = { GLBToTextPlugin }
