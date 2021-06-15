//this is test file
function genData(){
    return [1,2,3];
}
function addData(){
    if(!this.datas){
        this.datas = [];
    }
    this.datas.push(Math.random());
}