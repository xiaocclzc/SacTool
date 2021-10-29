#!/usr/bin/env node

const childProcess = require('child_process');
const iconv = require('iconv-lite');
const fs = require('fs');
// var binaryEncoding = 'binary';
// var encoding = 'cp936';
console.log("index：开头");
var proc = childProcess.exec("sac-test-cmds", {
    // encoding: binaryEncoding
}, function (err, stdout, stderr) {
    if (err) {
        throw err;
    }
});
console.log("index：中间");
proc.stdout.setEncoding('utf8');
proc.stdout.on('data', function(data){
    console.log("[父监听]"+data);
});
proc.stderr.on('data', (data) => {
    console.log("[父监听]"+data);
});
console.log("index：结尾");

setTimeout(function () {
    console.log("index：异步");
}, 1000)