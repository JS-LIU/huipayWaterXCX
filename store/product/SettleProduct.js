var { shoppingCartContainer } = require('../shoppingCart/ShoppingCartContainer.js');
class SettleProduct{
  constructor(productInfo){
    this.baseCount = productInfo.baseCount;
    this.imageUrl = productInfo.imageUrl;
    this.name = productInfo.name;
    this.volume = productInfo.volume;
    this.productCategory = productInfo.productCategory;
    this.productItemId = productInfo.productItemId;
    this.productType = productInfo.productType;
    this.promotionActivityInfo = productInfo.promotionActivityInfo;
    this.saleMount = productInfo.saleMount;
    this.currentPrice = productInfo.currentPrice;
    this.originalPrice = productInfo.originalPrice;
    this.totalPayRmb = productInfo.totalPayRmb;
    this.totalPrice = productInfo.totalPrice;
    this.payRmb = productInfo.payRmb;
    this.hasSelected = productInfo.hasSelected;
    this.shopId = productInfo.shopId;
    this.selectCount = productInfo.selectCount;    
  }
  findShopShoppingCartProduct(){
    return shoppingCartContainer.findShopShoppingCartProduct(this.shopId, this.productItemId);
  }
  increase(){
    this.selectCount++;
    
    //  修改购物车数量
    let shoppingCartProduct = this.findShopShoppingCartProduct();
    shoppingCartContainer.addProduct(shoppingCartProduct);
  }
  reduce(){
    if (this.selectCount > 1){
      this.selectCount--;

      //  修改购物车数量
      let shoppingCartProduct = this.findShopShoppingCartProduct();
      shoppingCartContainer.removeProduct(shoppingCartProduct);
    }
    
  }

}
module.exports = SettleProduct;