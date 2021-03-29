const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'
    //const MiniCSSExtract = new MiniCssExtractPlugin({filename: 'styles.css'})
    return({
        entry: "./src/app.js",
        output: {
            path: path.join(__dirname, 'public', 'dist'),
            filename: 'bundle.js'
        },        
        module : {
            rules: [{
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },{
                test:/\.s?css$/,
                use:[    MiniCssExtractPlugin.loader,
                        {
                            loader:'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options:{
                                sourceMap: true
                            }
                        }                    
                ],                
            },{
              test: /\.(png|jpg|jpeg)$/,
              loader: 'url-loader'
            }
          ]                 
        },
        plugins: [
           new MiniCssExtractPlugin()
        ],
        devtool: isProduction? "source-map"  :"inline-source-map",
        devServer: {
            proxy: {
              '/api': 'http://localhost:3000'
            },
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true,
            publicPath: '/dist/'
        }
    })
}

