module.exports = {
    publicPath: '/',
    filenameHashing: false,
    chainWebpack: config => {
      config.module
        .rule('html')
        .test(/\.html$/)
        .use('html-loader')
          .loader('html-loader')
          .end()
        .end()

    }
} 