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
      "待评价": [{ name: '评价', key: "comment" }],
      "已完成": [{ key: "payAgain", name: '已完成' }]
    }
    return convertTable[status];
  }
  
  getDetail(){
    
  }
  pay(orderId){
    console.log("支付：",this.orderId)
    // let wxPay = new WxPay({
    //   orderId: this.orderId,
    //   totalPrice: this.totalPayRmb,
    //   orderNo: this.orderNo
    // });
    // wxPay.pay();
    let wxP = new WxPay();
    
      
    wxP.pay({
      orderId: this.orderId,
      totalPrice: this.totalPayRmb,
      orderNo: this.orderNo
    }, orderId);
      
    
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
    }).catch((err)=>{
      if (err.data.message === "订单还没有配送"){
        wx.showToast({
          icon:"none",
          title: err.data.message,
        })
      }
    })
  }
  payAgain(){

  }
  
  orderOperation(actionKey){
    return this.strategies[actionKey];
  }
}
module.exports = OrderItem;