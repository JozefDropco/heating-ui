module.exports = {
    runtimeCompiler: false,
    baseUrl: "/recon",
    configureWebpack: {
        devtool: 'source-map'
    },
    pluginOptions: {
        quasar: {
            theme: 'mat',
            importAll: true
        }
    },
    // chainWebpack: config => {
    //     config.module
    //         .conrule('vue')
    //         .use('vue-loader')
    //         .loader('vue-loader')
    //         .tap(options => {
    //             // modify the options...
    //             return options
    //         })
    // },
    transpileDependencies: [
        /[\\\/]node_modules[\\\/]quasar-framework[\\\/]/
    ]
}
