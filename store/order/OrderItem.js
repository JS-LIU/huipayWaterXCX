var WxPay = require('./WxPay.js');
var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
class OrderItem{
  constructor(shopOrder){
    this.orderId = shopOrder.orderId;
    this.shopName = shopOrder.shopName;
    this.productItemModels = shopOrder.productItemModels;
    this.totalPayRmb = shopOrder.totalPayRmb;
    this.totalCount = shopOrder.totalCount;
    this.status = shopOrder.status;
    this.actionList = this.getActionList(shopOrder.status);
    this.deliveryAddressModel = shopOrder.deliveryAddressModel;
    this.createTime = shopOrder.createTime;
    this.orderNo = shopOrder.orderNo;
    this.deliveryerName = shopOrder.deliveryerName;
    this.deliveryerPhoneNum = shopOrder.deliveryerPhoneNum;
    this.shopId = shopOrder.shopId;
    this.deliveryId = shopOrder.deliveryId;
    let self = this;
    this.strategies = {
      "pay": self.pay.bind(this),
      "sign":self.sign.bind(this),
    }
  }

  getActionList(status){
    let convertTable = {
      "待付款": [{ name:'支付',key:"pay"}],
      "待收货": [{ name: "签收", key: "sign" }],
      "待评价": [{ name: '评价', key: "comment" }, {key:"payAgain",name: '再来一单'}],
      "已完成": [{ key: "payAgain", name: '再来一单' }]
    }
    return convertTable[status];
  }
  
  getDetail(){
    
  }
  pay(){
    console.log("支付：",this.orderId)
    let wxPay = new WxPay({
      orderId: this.orderId,
      totalPrice: this.totalPayRmb,
      orderNo: this.orderNo
    });
    wxPay.pay();
    
  }
  sign() {
    console.log(this.orderId)
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    huipayRequest.resource('/order/confirmOrder').save({}, {
      orderId: this.orderId,
      accessInfo: accessInfo
    }).then(()=>{
      wx.redirectTo({
        url: '/pages/orderlist/orderlist?orderType=waiting_comment',
      })
    })
  }
  payAgain(){

  }
  
  orderOperation(actionKey){
    return this.strategies[actionKey]();
  }
}
module.exports = OrderItem;