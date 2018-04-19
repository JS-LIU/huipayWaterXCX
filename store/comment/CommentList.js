var Comment = require('./Comment.js');
class CommentList{
  constructor(){
    this.commentList = [];
  }
  getList(commentModels){
    for (let i = 0; i < commentModels.length;i++){
      this.commentList.push(new Comment(commentModels[i]));
    }
    return this.commentList;
  }
}
module.exports = CommentList;