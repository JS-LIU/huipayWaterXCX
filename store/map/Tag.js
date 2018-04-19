class Tag{
  constructor(info,selected = false){
    this.id = info.id;
    this.name = info.name;
    this.selected = selected;
    this.border = "1rpx solid #D7D7D7";
    this.color = "#666";
  }
  select(selectState){
    if(selectState !== undefined){
      this.selected = selectState;
    }else{
      this.selected = !this.selected;
    }
    this.changeStyle(this.selected);
  }
  changeStyle(selectState){
    if (selectState){
      this.border = "1rpx solid #399cfe";
      this.color = "#399cfe";
    }else{
      this.border = "1rpx solid #D7D7D7";
      this.color = "#666";
    }
  }
}
module.exports = Tag;