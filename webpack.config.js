module.exports = env => {
    const path = require('path');
    let devMode = true;
    if (env === 'production') {
        devMode = false;
    }
    const webpack = require('webpack');


    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const {CleanWebpackPlugin} = require('clean-webpack-plugin');
    const CopyPlugin = require('copy-webpack-plugin');

    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

    return {
        entry: {
            app: ['babel-polyfill', "./src/index.js"]
        },
        output: {
            filename: devMode ? 'assets/js/bundle.dev.[hash:8].js' : 'assets/js/bundle.prod.[hash:8].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
            }
        },
        mode: env,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "",
                                esModule: true,
                                modules: {
                                    namedExport: false,
                                },
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: true,
                                modules: {
                                    namedExport: false,
                                    // localIdentName: devMode ? '[name]__[local]__[hash:8]' : 'asdev_[hash:8]',
                                    localIdentName: devMode ? '[local]' : '[local]',
                                },
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        require('autoprefixer')({
                                            'overrideBrowserslist': [
                                                "last 2 chrome version",
                                                "last 2 firefox version",
                                                "last 2 safari version",
                                                "last 2 ie version"
                                            ]
                                        })
                                    ]
                                }
                            }
                        },
                    ],
                },
                {
                    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader',
                    options: {
                        name: devMode ? '[name]__[hash:8].[ext]' : 'assets/fonts/[hash:8].[ext]'
                    }
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: devMode ? '[name]__[hash:8].[ext]' : 'assets/images/[hash:8].[ext]',
                            },
                        },
                    ],
                }
            ]
        },
        optimization: {
            minimize: !devMode,
            minimizer: [
                new CssMinimizerPlugin({
                    parallel: 5,
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: {removeAll: true},
                            },
                        ],
                    },
                }),
                new UglifyJsPlugin({
                    test: /\.js$/,
                    exclude: /node_modules/,
                    uglifyOptions: {
                        ie8: false,
                        mangle: true,
                        compress: {
                            drop_console: true,
                            sequences: true,  // join consecutive statemets with the “comma operator”
                            properties: true,  // optimize property access: a["foo"] → a.foo
                            dead_code: true,  // discard unreachable code
                            drop_debugger: true,  // discard “debugger” statements
                            unsafe: false, // some unsafe optimizations (see below)
                            conditionals: true,  // optimize if-s and conditional expressions
                            comparisons: true,  // optimize comparisons
                            evaluate: true,  // evaluate constant expressions
                            booleans: true,  // optimize boolean expressions
                            loops: true,  // optimize loops
                            unused: true,  // drop unused variables/functions
                            hoist_funs: true,  // hoist function declarations
                            hoist_vars: false, // hoist variable declarations
                            if_return: true,  // optimize if-s followed by return/continue
                            join_vars: true,  // join var declarations
                            side_effects: true,  // drop side-effect-free statements
                        },
                        parallel: 5,
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./src/index.html"
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src/services_file/'),
                        to: path.resolve(__dirname, 'dist/')
                    },
                ],
            }),
            new MiniCssExtractPlugin({
                filename: devMode ? 'assets/css/bundle.dev.[hash:8].css' : 'assets/css/bundle.prod.[hash:8].css',
            }),
            new webpack.HashedModuleIdsPlugin({
                hashFunction: 'md4',
                hashDigest: 'base64',
                hashDigestLength: 8,
            }),
        ],
        devServer: {
            overlay: true,
            compress: true,
            host: 'lvh.me',

            open: true
        }
    }
};