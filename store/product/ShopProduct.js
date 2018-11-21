var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var ShopWaterTicket = require('../product/ShopWaterTicket.js');
var ShoppingCartProduct = require('./ShoppingCartProduct.js');
class ShopProduct{
  constructor(productInfo, shopId, ticketProductItemId){
    this.name = productInfo.name != "" ? productInfo.name : productInfo.prefix + productInfo.volume;
    this.currentPrice = productInfo.currentPrice;
    this.imageUrl = productInfo.imageUrl;
    this.originalPrice = productInfo.originalPrice;
    this.productDetailPictures = productInfo.productDetailPictures;
    this.productImage = productInfo.productImage;
    this.productItemId = productInfo.productItemId;
    this.productType = productInfo.productType;
    this.saleMount = productInfo.saleMount;
    this.collectProductFlg = productInfo.collectProductFlg;
    this.volume = productInfo.volume;
    this.shopId = shopId;
    this.ticketProductItemId = ticketProductItemId;
    this.prefix = productInfo.prefix;
    this.presentEntityInfo = productInfo.presentEntityInfo;
  }
  convertToShoppingCartProduct(shopInfo){
    let self = this;
    //  增加默认选中属性
    let shoppingCartProductInfo = Object.assign({}, self, { hasSelected:true});
    return new ShoppingCartProduct(shoppingCartProductInfo,shopInfo);
  }

  collection(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      itemId: this.productItemId,
      type:"product"
    }
    this.collectProductFlg = !this.collectProductFlg;
    return huipayRequest.resource('/shop/collect').save({}, postInfo)
  }
  //  获取相应水票列表
  getSelfWaterTicketList(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let shopWaterTicketList = [];
    let self = this;
    return new Promise((resolve,reject)=>{      
      huipayRequest.resource('/shop/:item').save({ item: "productItem" }, {
        accessInfo: accessInfo,
        productItemId: this.ticketProductItemId,
        shopId: this.shopId
      }).then((info) => {   
        let productModel = info.data.productModel;
        let productItemModels = productModel.productItemModels;
        for (let i = 0; i < productItemModels.length;i++){
          shopWaterTicketList.push(new ShopWaterTicket(productModel.name, self.shopId, productItemModels[i]));
        }
        
        resolve(shopWaterTicketList);
      }).catch(()=>{
        resolve(shopWaterTicketList);
      })     
    })   
  }
}
module.exports = ShopProduct;