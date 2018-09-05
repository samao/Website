/*
 * @Author: iDzeir 
 * @Date: 2018-09-05 17:48:11 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-09-05 18:47:51
 */
const chalk = require('chalk');
const { log, promisify } = require('util');
const fs = require('fs');
const path = require('path');

log(chalk.yellow('上传页面代码'));

/** 递归拷贝文件 */
async function copy(src, dst) {
	const paths = await promisify(fs.readdir)(src);
	if(!paths) {
		return
	}
	for(const pathUrl of paths) {
		const _src = path.join(src, pathUrl);
		const _dst = path.join(dst, pathUrl);
		const st = await promisify(fs.stat)(_src);
		if(st) {
			if(st.isFile()) {
				fs.createReadStream(_src).pipe(fs.createWriteStream(_dst));
			}else if(st.isDirectory()){
				const exist = fs.existsSync(_dst);
				if(exist) {
					copy(_src, _dst);
				}else{
					await promisify(fs.mkdir)(_dst);
					copy(_src, _dst);
				}
			}
		}
	}
}

const [,,source, dist] = process.argv;
copy(source, dist).then(_ => log(chalk.yellow('上传完毕！！！')))