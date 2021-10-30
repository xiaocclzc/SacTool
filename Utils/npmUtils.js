/**
 * npm相关的工具方法
 */
const commandUtils = require("./commandUtils");
/**
 * 获取下来路径
 * @param {String} packageName npm包名
 */
function getDownloadUrl(packageName) {
    const prose = new Promise((resolve, reject) => {
        const promise = commandUtils.execute(`npm view ${packageName} --json`);
        promise.then((json) => {
            let url;
            if (json) {
                json = JSON.parse(json);
            }
            if (json && json.dist) {
                url = json.dist.tarball;
            }
            resolve(url);
        }).catch(err => {
            reject(err);
        });
    });
    return prose;
}
module.exports = {
    getDownloadUrl
}