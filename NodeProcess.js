#!/usr/bin/env node
const childProcess = require('child_process');
const iconv = require('iconv-lite');
var binaryEncoding = 'binary';
var encoding = 'cp936';
console.log("自定义命令输出：开头");
const formatOutput = function (value) {
    if (value) {
        let result = iconv.decode(new Buffer.from(value, binaryEncoding), encoding)
        return result;
    }
    return value;
}
let child_pro = childProcess.exec('ipconfig', {
    encoding: binaryEncoding
}, function (err, stdout, stderr) {//子进程的全部输出
    // console.log("内部：",iconv.decode(new Buffer.from(stdout, binaryEncoding), encoding),iconv.decode(new Buffer.from(stderr, binaryEncoding), encoding));
});
console.log("自定义命令输出：中间");
child_pro.stdout.on('data', (data) => {
    console.log("自定义命令调用系统命令监听方法的输出: " + formatOutput(data));
});
console.log("自定义命令输出：结尾");
setTimeout(function () {
    console.log("自定义命令输出：异步");
}, 1000)