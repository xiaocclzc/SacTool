//this is test file
function genData(){
    return [1,2,3];
}
function addData(){
    if(!this.datas1){
        this.datas1 = [];
    }
    this.datas.push(Math.random());
}
function test(){
    console.log(1)
}