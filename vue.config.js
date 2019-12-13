const path = require('path');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const zopfli = require('@gfx/zopfli');
// const BrotliPlugin = require('brotli-webpack-plugin');
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const webpack = require('webpack');
const vendorsManifest = require('./build/vendors_manifest.json');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // 默认'/'，部署应用包时的基本 URL
    publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : './',
    // outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
    // assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
    // lintOnSave: false,
    // runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: !IS_PROD, // 生产环境的 source map
    parallel: require('os').cpus().length > 1,

    css: {
        sourceMap: true
    },

    pluginOptions: {
        lintStyleOnBuild: true,
        stylelint: {
            fix: true
        }
    },

    devServer: {
        // overlay: { // 让浏览器 overlay 同时显示警告和错误
        //   warnings: true,
        //   errors: true
        // },
        // open: false, // 是否打开浏览器
        // host: "localhost",
        // port: "8080", // 端口
        // https: false,
        // hotOnly: false, // 启用Hot Module Replacement，当编译失败时，不刷新页面。
        // proxy: {
        //     '/api': {
        //         target: '', // 目标代理接口地址
        //         secure: false,
        //         changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        //         // ws: true, // 是否启用websockets
        //         pathRewrite: {
        //             '^/api': '/'
        //         }
        //     }
        // }
    },

    configureWebpack: config => {
        const plugins = [];
        if (IS_PROD) {
            // plugins.push(
            //     new CompressionWebpackPlugin({
            //         algorithm(input, compressionOptions, callback) {
            //             return zopfli.gzip(input, compressionOptions, callback);
            //         },
            //         compressionOptions: {
            //             numiterations: 15
            //         },
            //         minRatio: 0.99,
            //         test: productionGzipExtensions
            //     })
            // );
            // plugins.push(
            //     new BrotliPlugin({
            //         test: productionGzipExtensions,
            //         minRatio: 0.99
            //     })
            // );
            plugins.push(
                new webpack.DllReferencePlugin({
                    context: path.resolve(__dirname, './build'),
                    manifest: vendorsManifest
                })
            );
            plugins.push(
                new AddAssetHtmlWebpackPlugin([
                    {
                        filepath: path.resolve(__dirname, `./vendors/js/${vendorsManifest.name}.js`),
                        publicPath: process.env.VUE_APP_PUBLIC_PATH + 'js',
                        outputPath: './js',
                        includeSourcemap: false
                    }
                ])
            );
            plugins.push(
                // extract css into its own file
                new MiniCssExtractPlugin({
                    filename: 'css/commons.[contenthash:5].css',
                    chunkFilename: 'css/commons.[contenthash:5].css'
                })
            );

            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        common: {
                            name: 'chunk-common',
                            chunks: 'initial',
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 1,
                            reuseExistingChunk: true,
                            enforce: true
                        },
                        vendors: {
                            name: 'chunk-vendors',
                            test: /[\\/]node_modules[\\/]/,
                            chunks: 'initial',
                            priority: 2,
                            reuseExistingChunk: true,
                            enforce: true
                        },
                        elementUI: {
                            name: 'chunk-elementui',
                            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                            chunks: 'all',
                            priority: 3,
                            reuseExistingChunk: true,
                            enforce: true
                        },
                        // echarts: {
                        //     name: 'chunk-echarts',
                        //     test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
                        //     chunks: 'all',
                        //     priority: 4,
                        //     reuseExistingChunk: true,
                        //     enforce: true
                        // }
                        styles: {
                            name: 'styles',
                            test: m => m.constructor.name === 'CssModule',
                            chunks: 'all',
                            enforce: true
                        }
                    }
                },
                runtimeChunk: 'single',
                minimizer: [
                    // Compress extracted CSS. We are using this plugin so that possible
                    // duplicated CSS from different components can be deduped.
                    new OptimizeCSSAssetsPlugin({
                        assetNameRegExp: /\.css\.*(?!.*map)/g,
                        cssProcessor: require('cssnano'),
                        cssProcessorOptions: {
                            discardComments: { removeAll: true },
                            // 避免 cssnano 重新计算 z-index
                            safe: true,
                            // cssnano 集成了autoprefixer的功能
                            // 会使用到autoprefixer进行无关前缀的清理
                            // 关闭autoprefixer功能
                            // 使用postcss的autoprefixer功能
                            autoprefixer: { disable: true }
                        },
                        canPrint: true
                    })
                ]
            };

            config.plugins = [...config.plugins, ...plugins];
        }
    },

    chainWebpack: config => {
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', resolve('src'));
        const oneOfsMap = config.module.rule('less').oneOfs.store;
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // Provide path to the file with resources
                    resources: path.resolve(__dirname, './src/assets/less/variables.less')
                })
                .end();
        });
        if (IS_PROD) {
            config.module
                .rule('images')
                .use('image-webpack-loader')
                .loader('image-webpack-loader')
                .options({
                    mozjpeg: { progressive: true, quality: 65 },
                    optipng: { enabled: false },
                    pngquant: { quality: [0.65, 0.9], speed: 4 },
                    gifsicle: { interlaced: false }
                // webp: { quality: 75 }
                });
        }
        // // 打包分析
        // if (IS_PROD) {
        //     config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        //         {
        //             analyzerMode: 'static'
        //         }
        //     ]);
        // }
        // // 修复HMR
        // config.resolve.symlinks(true);

        // // 修复 Lazy loading routes Error： Cyclic dependency
        // // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        // config.plugin('html').tap(args => {
        //     // 修复 Lazy loading routes Error
        //     args[0].chunksSortMode = 'none';
        //     return args;
        // });
    },

    runtimeCompiler: true
};
