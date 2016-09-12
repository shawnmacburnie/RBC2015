var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: './www',
        publicPath: '/',
        filename: './js/bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: [
            path.resolve('./')
        ]
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?cacheDirectory']},
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{from: 'template'}]),
        new webpack.optimize.DedupePlugin()

    ]
};
