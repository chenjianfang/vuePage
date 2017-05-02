var webpack = require('webpack');

let fse = require('fs-extra');

var merge = require('webpack-merge');

var webpackDevMiddleware = require('webpack-dev-middleware');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');

var express = require('express');

var app = express();

//获取webpack入口文件目录

var entryFile = require('./entryfile.config.js');

var extractCSS = new ExtractTextPlugin({
	filename:function(getPath){
		console.log(getPath("css/[name].css").replace("\\js",""));
		return getPath("css/[name].css").replace("js","");
	},
	allChunks:true
});

module.exports = {
	entry: entryFile,

	output: {
		path: __dirname+"/../static/dist",
		filename:"[name].js"
	},
	module:{
		rules:[
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						'scss': 'vue-style-loader!css-loader!sass-loader',
						'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
					}
				}
			},
			{
				test: /\.js$/,
				loader:'babel-loader',
				exclude:/node_modules/
			},
			{
				test:/\.css$/,
				loader:'style-loader!css-loader?modules'
			},
			{
				test:/\.scss$/,
				use:extractCSS.extract(["css-loader","sass-loader"])
			},
			{
				test:/\.(gif|png|jpe?g|svg)$/i,
				loaders:[
					{
						loader:'file-loader',
						query:{
							outputPath: '../images/',
							name:function(dir){
								var dirArr = dir.split('\\');
								var dirIndex = 0;
								for(var i = 0, len = dirArr.length; i < len; i++){
									if(dirArr[i] === "images"){
										dirIndex = i+1;
										break;
									}
								}
								return dirArr[dirIndex]+'/[name].[ext]';
							}
						}
					},
					{
						loader:'image-webpack-loader',
						query:{
							progressive: true,
							optimizationLevel: 7,
							interlaced: false,
							pngquant: {
								quality: '65-90',
								speed: 4
							}
						}
					}
				]
			}
		]
	},
	plugins:[
		extractCSS
	]
}

