var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var { wxLogin } = require('../login/WxLogin.js');
var hex_md5 = require('../../libs/md5.js');
class WxPay{
  constructor(){
    
    this.wxLogin = wxLogin;
  }
  getOpenId(userInfo){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    return wxLogin.getWxUserInfo(userInfo).then(() => {
      return wxLogin.getCode()
    }).then(() => {
      let postData = wxLogin.getWxLoginPostData();
      postData = Object.assign(postData, { accessInfo: accessInfo });
      return huipayRequest.resource('/user/weixinInfo').save({}, postData)
    })
  }
  pay(orderInfo,openId){
    this.totalPrice = orderInfo.totalPrice;
    this.orderId = orderInfo.orderId;
    this.orderNo = orderInfo.orderNo;

    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    wx.showLoading({
      title: '请稍后',
    })
    huipayRequest.resource('/client/pay/confirm').save({}, {
        payChannel: "WeixinMiniProgramPay",
        orderId: this.orderId,
        openId: openId,
        accessInfo: accessInfo
      }).then((info)=>{
      let data = info.data;

      var sign = "appId=" + data.wexinSpec.appid + "&nonceStr=" + data.wexinSpec.noncestr +
        "&package=prepay_id=" + data.wexinSpec.prepay_id + "&signType=MD5&timeStamp=" +
        data.wexinSpec.timestamp + "&key=9LhHxg6qg29YHCp3TnL6Qvl6jfprZh2q";
      var paySign = hex_md5(sign).toUpperCase();
      console.log(paySign);
      wx.requestPayment({
        "timeStamp": data.wexinSpec.timestamp,
        "nonceStr": data.wexinSpec.noncestr,
        "package": "prepay_id=" + data.wexinSpec.prepay_id,
        'signType': 'MD5',
        "paySign": paySign,
        'success': function (res) {
          wx.hideLoading();
          wx.redirectTo({
            url: '/pages/orderlist/orderlist',
          })
        },
        'fail': function (res) {
        },
        'complete':function(){
          wx.hideLoading()
        }
      })
    }).catch((err) => {
      console.log(err);
    }); 
  }
}
module.exports = WxPay