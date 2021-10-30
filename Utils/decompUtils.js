/**
 * 解压工具类
 */
const path = require('path');
const { tgz } = require('compressing');
const fs = require('fs');
// const url = 'https://registry.npmjs.org/sac-react-template/-/sac-react-template-1.0.0.tgz';
// const filename = "sac-react-template-1.0.0.tgz";
const destDir = path.resolve('./');
const streamUtils = require("./streamUtils");
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
function onEntry(header, stream, next, pathHandle, jsonHandle) {
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
        let fPath = path.join(destDir, fileName);
        if (typeof (pathHandle) == "function") {//用户自定义文件路径
            fPath = pathHandle(fPath);
        }
        if (!fPath) {
            stream.resume();
            return;
        }
        const index = fPath.replace(/\\/g,"/").lastIndexOf("/");
        if (index != -1) {
            const tmpDir = fPath.substring(0, index);
            mkdir(tmpDir);
        }
        let writerStream = fs.createWriteStream(fPath);
        if(fPath.endsWith(".json") && typeof(jsonHandle) == "function"){
            //handleData
            streamUtils.transform(stream,writerStream,jsonHandle)
            // stream.pipe(writerStream);
        }else{
            stream.pipe(writerStream);
        }
    } else { // directory
        mkdir(path.join(destDir, fileName));
        stream.resume();
    }
}
/**
 * 
 * @param {String} tgzFilePath 压缩包的绝对路径
 * @param {Object} params   其他参数
 * {
 *  pathHandle {Function}  文件路径处理
 *  jsonHandle {Function}  json文件处理
 * }
 * @returns {Promise}
 */
function untgz(tgzFilePath, params) {
    const {pathHandle,jsonHandle} = (params ? params : {});
    const promise = new Promise((resolve, reject) => {
        const handler = (...args) => {
            let tmpArgs = [...args, pathHandle, jsonHandle];
            return onEntry.apply(this, tmpArgs);
        };
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