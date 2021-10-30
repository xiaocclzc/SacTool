const request = require('request');
const path = require('path');
const { tgz } = require('compressing');
const mkdirp = require('mkdirp');
const fs = require('fs');
const url = 'https://registry.npmjs.org/sac-react-template/-/sac-react-template-1.0.0.tgz';
const filename = "sac-react-template-1.0.0.tgz";
const destDir = path.resolve('./');
let dirCache = {};
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
request(url).pipe(fs.createWriteStream(filename)).on("finish", () => {
    try {
        // tgz.uncompress(filename, path.resolve(__dirname, ".."));
        //========================================================
        function onEntry(header, stream, next) {
            stream.on('end', next);

            // header.type => file | directory
            // header.name => path name
            let fileName = header.name;
            if (fileName == "package.json") {//测试，需要删
                stream.resume();
            } else {
                if (fileName.startsWith("package")) {
                    fileName = fileName.substring(8);
                }
                if (header.type === 'file') {
                    const index = fileName.lastIndexOf("/");
                    if (index != -1) {
                        const dir = path.join(destDir, fileName.substring(0, index));
                        mkdir(dir);
                    }
                    stream.pipe(fs.createWriteStream(path.join(destDir, fileName)));
                } else { // directory
                    mkdirp(path.join(destDir, fileName), err => {
                        if (err) throw err;
                        stream.resume();
                    });
                }
            }
        }
        new tgz.UncompressStream({ source: filename }).on('error', (error) => {
            throw error;
        }).on('finish', () => {
            console.log("finish");
        }).on('entry', onEntry);
        console.log("解压完成");
    } catch (error) {
        throw error
    }
});