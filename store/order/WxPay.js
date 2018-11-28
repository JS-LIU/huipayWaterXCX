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
    this.openId = openId;
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
      let self = this;
      wx.requestPayment({
        "timeStamp": data.wexinSpec.timestamp,
        "nonceStr": data.wexinSpec.noncestr,
        "package": "prepay_id=" + data.wexinSpec.prepay_id,
        'signType': 'MD5',
        "paySign": paySign,
        'success': function (res) {
          
        },
        'fail': function (res) {
        },
        'complete':function(res){
          wx.hideLoading();
          self.queryResult({ 
            orderNo: self.orderNo, 
            payChannel: "WeixinMiniProgramPay"
          }).then(()=>{
            wx.redirectTo({
              url: '/pages/orderlist/orderlist?orderType=total',
            })
          })
          
        }
      })
    }).catch((err) => {
      console.log(err);
    }); 
  }
  queryResult(postInfo){
    return huipayRequest.resource('/client/pay/queryResult').save({}, postInfo)
  }
}
module.exports = WxPay