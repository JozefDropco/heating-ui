module.exports = {
    runtimeCompiler: false,
    baseUrl: "",
    configureWebpack: {
        devtool: 'source-map'
    },
    devServer: {
        proxy: {
            '/ws':{
                target: 'http://localhost:8080'
            }
        }
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
    //         .tap(tempOptions => {
    //             // modify the tempOptions...
    //             return tempOptions
    //         })
    // },
    transpileDependencies: [
        /[\\\/]node_modules[\\\/]quasar-framework[\\\/]/
    ]
}
