/**
 * 请求相关的工具类
 * 
*/
const request = require('request');
const fs = require('fs');
function download(url, filename) {
    const promise = new Promise((resolve, reject) => {
        try {
            // const url = 'https://registry.npmjs.org/sac-react-template/-/sac-react-template-1.0.0.tgz';
            const fileName = filename;//"sac-react-template-1.0.0.tgz";
            request(url).pipe(
                fs.createWriteStream(fileName)
            ).on("finish", resolve).on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
    return promise;
}
module.exports = {
    download
}