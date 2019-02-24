const path = require('path');

module.exports = {
    entry: './client/src/app.jsx',

    output: {
        path: path.resolve(__dirname, './client/dist/assets'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, './client/src'),
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}