var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var ShopProduct = require('../product/ShopProduct.js');
var ShopWaterTicket = require('../product/ShopWaterTicket.js');
var CommentList = require('../comment/CommentList.js');
class ShopProductDetail{
  constructor(productItemId,shopId){
    this.productItemId = productItemId;
    this.shopId = shopId;
  } 
  static getDetail(productItemId, shopId){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    
    return huipayRequest.resource('/shop/:item').save({ item: "productItem" }, {
      accessInfo: accessInfo,
      productItemId: productItemId,
      shopId: shopId
    })
  }  

  getProduct(productModel){
    let productItemModels = productModel.productItemModels;
    for (let i = 0; i < productItemModels.length; i++) {
      if (productItemModels[i].productItemId === this.productItemId) {
        if (productModel.type === "entityProduct") { 
          productItemModels[i].collectProductFlg = productModel.collectProductFlg;
          return new ShopProduct(productItemModels[i], this.shopId, productModel.ticketProductItemId);
        } else {
          return new ShopWaterTicket(productModel.name, this.shopId, productItemModels[i]);
        }
      }
    }
  }
  getCommentList(commonModels){
    return new CommentList().getList(commonModels);
  }
  
}
module.exports = ShopProductDetail;


