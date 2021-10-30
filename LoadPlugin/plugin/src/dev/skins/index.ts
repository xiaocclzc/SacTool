import skin from "./vars/index";
import { markTest } from "v3-react-skin";

let testSkins:Array<{skin:{code:string,title:string,desc:string},vars:object}> = [];

let skins = skin.getSkins();

let keys = Object.keys(skins);

keys.forEach(key => {
    testSkins.push({
        skin: {
            code: key,
            title: key,
            desc: ""
        },
        vars:skins[key]
    });
});

markTest(testSkins);