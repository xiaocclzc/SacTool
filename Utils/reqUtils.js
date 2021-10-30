/**
 * 请求相关的工具类
 * 
*/
const request = require('request');
const fs = require('fs');
/**
 * 
 * @param {String} url 下载地址
 * @param {String} filename 文件名称
 */
function download(url, filename) {
    const promise = new Promise((resolve, reject) => {
        try {
            if(!url){
                reject(new Error("无法下载, 请检查是否传入地址."));
                return;
            }
            // const url = 'https://registry.npmjs.org/sac-react-template/-/sac-react-template-1.0.0.tgz';
            let fileName = filename;//"sac-react-template-1.0.0.tgz";
            if(!fileName){
                url = url.replace(/\\/g,"/");
                fileName= url.substring(url.lastIndexOf("/") + 1);
            }
            request(url).pipe(
                fs.createWriteStream(fileName)
            ).on("finish", ()=>{
                resolve(fileName);
            }).on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
    return promise;
}
module.exports = {
    download
}