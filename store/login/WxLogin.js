var { huipayRequest } = require('../init.js');
class WxLogin{
  constructor(){
    this.code = null;
    this.iv = null;
    this.encryptedData = null;
  }
  getCode(){
    let self = this;
    return new Promise((resolve,reject)=>{
      wx.login({
        success: function (res) {
          console.log("getCode================",res.code);
          self.code = res.code;
          resolve(res.code);          
        },
        fail:function(res){
          console.log(res);
          reject("获取code失败");
        }
      })
    })  
  }
  getWxUserInfo(){
    let self = this;
    return new Promise((resolve,reject)=>{
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log("getUserInfo==============",res)
          self.iv = res.iv;
          self.encryptedData = res.encryptedData;
          resolve(res);
        }
      })
    })
  }
  wxLogin(postData){
    return huipayRequest.resource('/login/:level').save({ level: "weixin" }, postData)  
  }
  getWxLoginPostData(){
    let self = this;
    return {
      miniProgramsEncode: {
        iv: self.iv,
        encryptedData: self.encryptedData
      },
      code: self.code,
      platform: 'miniPrograms'
    }
  }
}
module.exports.wxLogin = new WxLogin();