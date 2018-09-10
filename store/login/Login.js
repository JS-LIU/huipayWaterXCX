var { huipayRequest } = require('../init.js');
var { wxLogin } = require('./WxLogin.js')
var { loginInfo } = require('./LoginInfo.js');
class Login{
    
    //  游客登录
    touristLogin(){
      return huipayRequest.resource('/login/:level').save({ level: "tourist" }, {})
    }
    //  微信授权
    wxLogin(userInfo){
      return wxLogin.getCode().then((code)=>{
        return wxLogin.getWxUserInfo(userInfo)
      }).then(()=>{
        let postData = wxLogin.getWxLoginPostData();
        let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
        postData = Object.assign(postData, { accessInfo: accessInfo});
        console.log(postData);
        return huipayRequest.resource('/login/:level').save({ level: "weixin" }, postData)
      });           
    }

    getLoginState() {
      let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
      let postData = {
        accessInfo: accessInfo
      }
      return new Promise((resolve,reject)=>{
        huipayRequest.resource('/user/me').save({}, postData).then((info) => {
          console.log("....:", info);
          this.loginState = true;
          resolve(this.loginState)
        }).catch(() => {
          this.loginState = false;
          resolve(this.loginState)
        })
      })
      
    }
    
}
module.exports.login = new Login();
