/**
 * 流相关的工具类
 */
/**
 * 数据转换，目前仅支持json文件流
 */
const { Transform, pipeline } = require('stream');
const fs = require("fs");
/**
 * 使用管道转换内容
 * @param {Stream} readStream 读取流
 * @param {Stream} writerStream 文件输出的绝对路径
 */
function transform(readStream, writerStream, handle) {
    pipeline(
        readStream.setEncoding('utf8'),
        new Transform({
            decodeStrings: false, // 接受字符串输入而不是缓冲区
            // defaultEncoding:"utf-8",//不注释是也有乱码问题
            construct(callback) {
                this.data = '';
                callback();
            },
            transform(chunk, encoding, callback) {
                if (!this.data) {
                    this.data = "";
                }
                this.data += chunk;
                callback();
            },
            flush(callback) {
                try {
                    // 确保是有效的 json。
                    let _data = this.data;
                    JSON.parse(_data);
                    if(typeof(handle) == "function"){//自定义
                        _data = handle(_data);
                    }
                    this.push(_data);
                } catch (err) {
                    callback(err);
                }
            }
        }),
        writerStream,
        (err) => {
            if (err) {
                console.error('failed', err);
            } else {
                console.log('completed');
            }
        }
    );
}
module.exports = {
    transform
}