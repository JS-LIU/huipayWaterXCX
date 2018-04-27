var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var { wxLogin } = require('../login/WxLogin.js');
var hex_md5 = require('../../libs/md5.js');
class WxPay{
  constructor(orderInfo){
    this.totalPrice = orderInfo.totalPrice;
    this.orderId = orderInfo.orderId;
    this.orderNo = orderInfo.orderNo;
    this.wxLogin = wxLogin;
  }

  pay(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    this.wxLogin.getCode().then((code)=>{
      return wxLogin.getWxUserInfo()
    }).then((res)=>{
      let postData = wxLogin.getWxLoginPostData();
      let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
      postData = Object.assign(postData, { accessInfo: accessInfo });
      return huipayRequest.resource('/user/weixinInfo').save({}, postData)
    }).then((info)=>{
      return huipayRequest.resource('/client/pay/confirm').save({}, {
        payChannel: "WeixinMiniProgramPay",
        orderId: this.orderId,
        openId: info.data.openId,
        accessInfo: accessInfo
      })
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
          wx.redirectTo({
            url: '/pages/orderlist/orderlist',
          })
        },
        'fail': function (res) {
        }
      })
    }); 
  }
}
module.exports = WxPay