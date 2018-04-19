var { huipayRequest } = require('../init.js');
var Tag = require('./Tag.js');
class TagContainer{
  constructor(){
    this.list = [];
    huipayRequest.resource('/delivery/:list').save({ list: "tagList" }, {}).then((info) => {
      for(let i = 0;i < info.data.length;i++){
        this.list.push(new Tag(info.data[i]));
      }   
    });
  }
  getList(selectId){
    for(let i = 0;i < this.list.length;i++){     
      if (this.list[i].id === selectId){
        this.list[i].select();
      }else{
        this.list[i].select(false);
      }
    }
    return this.list;
  } 
  convertToId(tagName){
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].name === tagName) {
        return this.list[i].id;
      } 
    }
  }
}
module.exports.tagContainer = new TagContainer();