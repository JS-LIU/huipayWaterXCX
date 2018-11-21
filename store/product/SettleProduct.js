var {shoppingCartContainer} = require('../shoppingCart/ShoppingCartContainer.js');
var ShoppingCartProduct = require('../product/ShoppingCartProduct.js');
// var ShopShoppingCart = require('../shoppingCart/ShopShoppingCart');
class SettleProduct {
    constructor(productInfo) {
        this.baseCount = productInfo.baseCount;
        this.imageUrl = productInfo.imageUrl;
        this.name = productInfo.name != "" ? productInfo.name : productInfo.prefix + productInfo.volume;
        this.volume = productInfo.volume;
        this.prefix = productInfo.prefix;
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
        this.emptyBucketProduct = productInfo.emptyBucketProduct;
        this.presentEntityInfo = productInfo.presentEntityInfo;
        this.productInfo = productInfo;
    }

    isBucketProduct() {
        return this.emptyBucketProduct;
    }


    // findShopShoppingCartProduct(){
    //   return shoppingCartContainer.findShoppingCart(this.shopId);
    // }
    add() {
        this.selectCount++;
    }
    remove(){
      if(this.selectCount > 1){
        this.selectCount--;
      }
        
    }
    //  同步到购物车
    increase(callback=function(){}) {
        let shoppingCartProduct = new ShoppingCartProduct(this.productInfo, {shopId: this.shopId});
        if (!shoppingCartContainer.findProductByProductItemId(this.productItemId)) {
            shoppingCartContainer.addProduct(shoppingCartProduct).then((shopShoppingCart) => {
                shopShoppingCart.increaseRequest(shoppingCartProduct,callback);
            });
        }
        shoppingCartContainer.addProduct(shoppingCartProduct).then((shopShoppingCart) => {
            shopShoppingCart.increaseRequest(shoppingCartProduct,callback);
        });
        this.add();

    }

    reduce(callback=function(){}) {
        if (this.selectCount > 1) {
            this.remove();
            //  修改购物车数量
            let shoppingCartProduct = shoppingCartContainer.findProductByProductItemId(this.productItemId);
            shoppingCartContainer.removeProduct(shoppingCartProduct,()=>{},callback);
        }
    }

}

module.exports = SettleProduct;