/**
 * 解压工具类
 */
const path = require('path');
const { tgz } = require('compressing');
const fs = require('fs');
// const url = 'https://registry.npmjs.org/sac-react-template/-/sac-react-template-1.0.0.tgz';
// const filename = "sac-react-template-1.0.0.tgz";
const destDir = path.resolve('./');
//已创建过的路径
let dirCache = {};
/**
 * 创建不存在的文件目录
 * @param {String} filepath 文件路径
 */
function mkdir(filepath) {
    const arr = filepath.replace(/\\/g, "/").split('/');
    let dir = arr[0];
    for (let i = 1; i <= arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }
}
function onEntry(header, stream, next, handle) {
    stream.on('end', next);
    // header.type => file | directory
    // header.name => path name
    let fileName = header.name;
    // if (fileName == "package.json") {//测试，需要删
    //     stream.resume();
    // } else {
    // }
    if (fileName.startsWith("package")) {//根据地址从npm获取的压缩包多了package
        fileName = fileName.substring(8);
    }
    if (header.type === 'file') {
        const fPath = path.join(destDir, fileName);
        if (typeof (handle) == "function") {//用户自定义文件路径
            fPath = handle(fPath);
        }
        if (!fPath) {
            stream.resume();
            return;
        }
        const index = fPath.lastIndexOf("/");
        if (index != -1) {
            const tmpDir = fileName.substring(0, index);
            mkdir(tmpDir);
        }
        stream.pipe(fs.createWriteStream(path.join(destDir, fileName)));
    } else { // directory
        mkdir(path.join(destDir, fileName));
        stream.resume();
    }
}
/**
 * 
 * @param {String} tgzFilePath 压缩包的绝对路径
 * @param {Function} handle 解压每个文件前的处理函数，支持调整解压目录
 * @returns {Promise}
 */
function untgz(tgzFilePath, handle) {
    const promise = new Promise((resolve, reject) => {
        const handler = typeof (handle) != "function" ? onEntry : (header, stream, next) => {
            const args = [header, stream, next, handle];
            return onEntry.apply(this, args);
        }
        new tgz.UncompressStream({ source: tgzFilePath }).on('error', (error) => {
            reject(error);
        }).on('finish', () => {
            resolve();
        }).on('entry', handler);
    });
    return promise;
}
module.exports = {
    untgz
}