const webpack = require('webpack');
const path = require('path');
const CHUNK_FILE_HASH_TAG = '_[chunkhash:5]';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: false,
    entry: {
        vendors: [
            'vue/dist/vue.esm.js',
            'vuex',
            'axios',
            'vue-router',
            'core-js/stable']
    },
    output: {
        path: path.join(__dirname, '../vendors/js'),
        filename: `[name]${CHUNK_FILE_HASH_TAG}.js`,
        library: `[name]${CHUNK_FILE_HASH_TAG}`
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.join(__dirname, '../vendors/js'),
            verbose: true
        }),
        new webpack.DllPlugin({
            path: './build/vendors_manifest.json',
            name: `[name]${CHUNK_FILE_HASH_TAG}`,
            context: __dirname
        })
    ],
    performance: {
        hints: false

    }
};
