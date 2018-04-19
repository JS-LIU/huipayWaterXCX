class LoginInfo{
  constructor(){
    this.appKey = "b5958b665e0b4d8cae77d28e1ad3f521";
    this.appId = "wx874d8b1c67189074";
  }
  setInfo(info) {
    this.accessToken = info.access_token;
    this.accessSecret = info.access_secret;
    wx.setStorage({ key:"loginInfo",data:info });
    
  }
  getInfo(){
    return wx.getStorageSync("loginInfo");
  }
}
module.exports.loginInfo = new LoginInfo();