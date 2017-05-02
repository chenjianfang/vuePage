let fse = require('fs-extra');

let fs = require('fs');

let path = require('path');

let files = {};

let relativePath = path.resolve()+"/build"; //配置文件目录

function findSync (filesDir) {

	let result = {};

	if(process.env.NODE_ENV != "production"){
		fse.remove(path.resolve()+'/static/dist/js');
	}
	//清空dist/js文件


	function finder (pathDir) {

		let files = fs.readdirSync(pathDir);

		files.forEach( (val, index) => {

			let fPath = path.join(pathDir,val);

			let stats = fs.statSync(fPath);

			if(stats.isDirectory()) finder(fPath);

			if(stats.isFile() && val.indexOf('.e.js') !== -1) {

				let jsName = path.dirname(fPath) + "/" + val.replace(/.e.js$/,"");
				jsName = path.normalize(jsName);
				let urlArr = jsName.split("src");
				urlArr.shift();
				jsName = path.normalize(urlArr.join(""));

				fPath = path.normalize(__dirname + "/" + path.relative(relativePath,fPath));

				result[jsName] = fPath;

			}
		});
	}

	finder(filesDir);

	return result;
}

let fileNames = findSync(path.resolve()+'/static'); //构建文件目录

module.exports = fileNames;





