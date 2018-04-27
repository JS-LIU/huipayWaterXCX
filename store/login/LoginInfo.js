class LoginInfo{
  constructor(){
    this.appKey = "b5958b665e0b4d8cae77d28e1ad3f521";
    this.appId = "wxb2ca31f3d0825289";
  }
  setInfo(info) {
    this.accessToken = info.access_token;
    this.accessSecret = info.access_secret;
    wx.setStorageSync("loginInfo",info );
    
  }
  getInfo(){
    return wx.getStorageSync("loginInfo");
  }
}
module.exports.loginInfo = new LoginInfo();