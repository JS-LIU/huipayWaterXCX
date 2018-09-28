var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var OrderItem = require('./OrderItem.js');
class OrderContainer {
    constructor() {
      this.productList = [];
    }
    getOrderList(orderType) {
      this.productList = [];
      let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());

      let self = this;
      let postInfo = {
          accessInfo: accessInfo,
          orderType: self.convertType(orderType)
      }
      return new Promise((resolve,reject)=>{
        huipayRequest.resource('/order/:list').save({ list: "orderList" }, postInfo).then((info)=>{
          let productList = info.data;
          for (let i = 0; i < productList.length; i++){
            this.productList.push(new OrderItem(productList[i]));
          }
          resolve(this.productList);
        })
      })
    }
    
    convertType(orderType){
      let typeStrategy = {
        "total": "全部",
        "waiting_pay": "待付款",
        "waiting_received": '待收货',
        "waiting_comment": "待评价"
      }
      return typeStrategy[orderType];
    }

    findOrderItemByOrderId(orderId){
      return this.productList.find((productItem)=>{
        return productItem.orderId === orderId
      })
    } 
}
module.exports.orderContainer = new OrderContainer();