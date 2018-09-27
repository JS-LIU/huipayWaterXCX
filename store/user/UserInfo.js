var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
class UserInfo{
  constructor(){
    this.id = null;
    this.phoneNum = null;
    this.huibeiCode = null;
    this.userName = null;
    this.userIconUrl = null;
    this.userWaterTicketCount = null;
  }
  getUserInfo(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo
    }
    return huipayRequest.resource('/user/me').save({}, postInfo)
    
  }
  setUserInfo(info){
    this.id = info.id;
    this.phoneNum = info.phoneNum;
    this.huibeiCode = info.huibeiCode;
    this.userName = info.userName;
    this.userIconUrl = info.userIconUrl;
    this.userWaterTicketCount = info.userWaterTicketCount;
  }
  getInviteUserInfo(inviteId){
    let postInfo = {
      inviterUserId: inviteId
    }
    return huipayRequest.resource('/activity/getInviteInfo').save({}, postInfo)
  }
  getEmptyBucket(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo
    }
    return huipayRequest.resource('/user/emptyBucket').save({}, postInfo);
  }
}
module.exports.userInfo = new UserInfo();