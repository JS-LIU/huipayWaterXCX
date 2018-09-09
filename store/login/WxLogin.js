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
  getWxUserInfo(info){
    console.log("getUserInfo:",info);
    this.iv = info.iv;
    this.encryptedData = info.encryptedData;
    return new Promise((resolve,reject)=>{
      resolve(info);
    })
  }
  wxLogin(postData){
    return huipayRequest.resource('/login/:level').save({ level: "weixin" }, postData)  
  }
  getWxLoginPostData(){
    let self = this;
    console.log('code:getPOstData:',self.code)
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