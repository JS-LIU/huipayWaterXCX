var ShoppingCartWaterTicket = require('./ShoppingCartWaterTicket.js');
class ShopWaterTicket{
  constructor(name,shopId,info){
    this.name = name;
    
    this.prefix = info.prefix;
    this.volume = info.volume;
    this.shopId = shopId;
    this.productType = info.productType;
    this.productItemId = info.productItemId;
    this.originalPrice = info.originalPrice;
    this.currentPrice = info.currentPrice;
    this.productCategory = info.productCategory;
    this.saleMount = info.saleMount;
    this.baseCount = info.baseCount;
    this.smallName = info.name;
    this.productImage = info.productImage;
    this.presentEntityInfo = info.presentEntityInfo; 
    this.imageUrl = info.imageUrl;
  }

  convertToShoppingCartWaterTicket(shopInfo) {
    let self = this;
    console.log(self)
    let waterTicketInfo = Object.assign({},self,{hasSelected:true});
    return new ShoppingCartWaterTicket(waterTicketInfo, shopInfo);
  }
}
module.exports = ShopWaterTicket;