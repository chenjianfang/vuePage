var webpack = require('webpack');

var fse = require('fs-extra');

var merge = require('webpack-merge');

var WebpackDevServer = require("webpack-dev-server");

var path = require('path');

var opn = require('opn')

var HtmlWebpackPlugin = require('html-webpack-plugin');

//获取webpack入口文件目录

var baseConf = require('./base.config.js');

var compiler = webpack(merge(baseConf,{
	devtool: 'eval-source-map',

	devServer: {
		colors: true,
		historyApiFallback:true,
		inline:true,
		hot:true,
	},

	plugins:[
		new webpack.BannerPlugin("17.04.17 @config by jef"),
		new webpack.HotModuleReplacementPlugin() //热加载插件
	]

}),function(err, stats){
	if(err) return console.log(err);
	fse.move(path.resolve()+"/static/images",path.resolve()+"/static/dist/images",function(err){
		if(err) return console.error(err);
		console.log("move images success!");
	})
});
if(process.env.NODE_ENV == "production"){
	var port = 8082;
	var server = new WebpackDevServer(compiler,{
		contentBase:"./",
		inline:true,
		hot:true,
		stats:{
			colors:true
		},

		proxy:{
			'/dev':{
				target:'http://192.168.108.1:'+port+'',
				pathRewrite:{
					'^/dev':'/index.html'
				},
				changeOrigin:true
			}
		}
	});

	server.listen(port);

	opn('http://localhost:'+port+'/');
}


