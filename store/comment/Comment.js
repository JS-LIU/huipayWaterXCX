class Comment{
  constructor(commentModel){
    this.comment = commentModel.comment;
    this.userName = commentModel.userName;
    this.commentTime = commentModel.commentTime;
    this.userIconUrl = commentModel.userIconUrl;
    this.score = this.convertToWXScore(commentModel.score);
    this.imageUrlList = commentModel.imageUrlList;
  }
  convertToWXScore(productScore) {
    let start = Math.floor(productScore / 2);
    let unStart = 5 - start;
    let score = [];
    for (let i = 0; i < start; i++) {
      score.push({
        imageUrl: "../images/icon_star_orange.png"
      })
    }
    for (let i = 0; i < unStart; i++) {
      score.push({
        imageUrl: "../images/icon_star_gray.png"
      })
    }
    return score;
  }
}
module.exports = Comment;