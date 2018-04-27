var Comment = require('./Comment.js');
class CommentList{
  constructor(){
    this.commentList = [];
    this.incompleteList = [];
  }
  getList(commentModels){
    for (let i = 0; i < commentModels.length;i++){
      this.commentList.push(new Comment(commentModels[i]));
    }
    return this.commentList;
  }
  getIncompleteList(commentModels){
    let l = commentModels.length > 2 ? 2 : commentModels.length;
    for (let i = 0; i < l; i++) {
      this.incompleteList.push(new Comment(commentModels[i]));
    }
    return this.incompleteList;
  }
}
module.exports = CommentList;