var path = require('path');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: [
        './src/index.js',
    ],
    resolve: {
        modules: [
            'src',
            'crate/pkg',
            'node_modules',
            path.resolve(__dirname),
        ],
        extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.wasm'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                        plugins: [
                            'transform-class-properties',
                            'transform-object-rest-spread',
                            'syntax-dynamic-import',
                        ],
                    },
                },
            }
        ],
    },
    externals: {
        react: 'React',
        redux: 'Redux',
        'react-redux': 'ReactRedux',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/plugins/mattemrost-wasm-sample/',
        filename: 'main.js',
    },
    plugins: [
        new WasmPackPlugin({
            crateDirectory: path.join(__dirname, 'crate'),
        }),
        new CopyPlugin([
            {
                from: 'dist',
                to: '../../assets',
                ignore: ['main.js'],
            }
        ])
    ]
};
