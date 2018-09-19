
var { shoppingCartContainer } = require('../shoppingCart/ShoppingCartContainer.js');
var ShoppingCartProduct = require('../product/ShoppingCartProduct.js');
class SettleProduct{
  constructor(productInfo){
    console.log('=============',productInfo);
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
    this.productDetailPictures = productInfo.productDetailPictures;
    this.productImage = productInfo.productImage;
    this.productInfo = productInfo;
  }



  findShopShoppingCartProduct(){
    return shoppingCartContainer.findShoppingCart(this.shopId);
  }
  increase(){
    let shoppingCartProduct = new ShoppingCartProduct(this.productInfo,{shopId:this.shopId});
    if (!this.findShopShoppingCartProduct()){
      shoppingCartContainer.addProduct(shoppingCartProduct).then((shopShoppingCart) => {
        shopShoppingCart.increaseRequest(shoppingCartProduct);
      });
    }
    shoppingCartContainer.addProduct(shoppingCartProduct).then((shopShoppingCart) => {
      shopShoppingCart.increaseRequest(shoppingCartProduct);
    });
    this.selectCount ++;

  }
  reduce(){
    if (this.selectCount > 1){
      this.selectCount--;
      console.log(1231231);
      //  修改购物车数量
      let shoppingCartProduct = this.findShopShoppingCartProduct();
      shoppingCartContainer.removeProduct(shoppingCartProduct);
     
    }
    
  }

}
module.exports = SettleProduct;