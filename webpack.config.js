module.exports = {
    module: {
        rules: [{
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            include: /src/
        }]
    }
}