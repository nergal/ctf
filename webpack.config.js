const path = require('path');

const APP_DIR = path.resolve(__dirname, 'src');
const PHASER_DIR = path.resolve(__dirname, 'node_modules/phaser');
const NODE_ENV = process.env.NODE_ENV;

let config = {
	entry: `${APP_DIR}/main.js`,
    output: {
    	path: path.resolve('./dist'),
    	filename: '[name].bundle.js',
    	chunkFilename: '[hash].js',
    	publicPath: 'dist/',
    },
	module: {
		loaders: [
            {
    			test: /\.js$/,
    			exclude: /node_modules/,
                include: APP_DIR,
    			loader: 'babel-loader',
    			query: {
    				presets: ['es2015'],
    			},
    		},
            { test: /.png$/, loader: 'url-loader?limit=1000' },
            { test: /\.(le|c)ss$/, loader: 'style-loader' },
            { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
            { test: /p2\.js/, loader: 'expose-loader?p2' },
        ],
	},
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [APP_DIR, 'node_modules'],
        alias: {
            constants: `${APP_DIR}/constants`,
            phaser: path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
            pixi: path.join(PHASER_DIR, 'build/custom/pixi.js'),
            p2: path.join(PHASER_DIR, 'build/custom/p2.js'),
        },
    },
    plugins: NODE_ENV === 'production' ? [ new webpack.optimize.UglifyJsPlugin() ] : [],
	devtool: '#source-map'
};

module.exports = config;
