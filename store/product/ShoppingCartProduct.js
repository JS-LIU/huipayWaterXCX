var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var { homeMap } = require('../map/HomeMap.js');
class ShoppingCartProduct{
  constructor(productInfo,shopInfo){
    this.name = productInfo.name;
    this.currentPrice = productInfo.currentPrice;
    this.imageUrl = productInfo.imageUrl;
    this.originalPrice = productInfo.originalPrice;
    this.productDetailPictures = productInfo.productDetailPictures;
    this.productImage = productInfo.productImage;
    this.productItemId = productInfo.productItemId;
    this.productType = productInfo.productType;
    this.saleMount = productInfo.saleMount;
    this.volume = productInfo.volume;
    this.selectCount = productInfo.selectCount || 1;


    this.deleteSelected = false;  
    this.selected = productInfo.hasSelected;
    this.shopInfo = shopInfo;
  }
  getShopInfo() {
    let self = this;
    return new Promise((resolve, reject) => {
      if (self.shopInfo.shopName) {
        resolve(self.shopInfo);
      } else {
        let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
        let postInfo = {
          accessInfo: accessInfo,
          shopId: self.shopInfo.shopId,
          cityName: "北京",
          latitude: 0,
          longtitude: 0,
        }
        huipayRequest.resource('/shopinfo').save({}, postInfo).then((info) => {
          resolve({
            shopId: info.data.shopId,
            shopName: info.data.name
          })
        });
      }
    })
  }
  increase(){
    this.selectCount ++;
  }
  reduce(){
    this.selectCount --;
  }

  hasSelected() {
    return this.selected;
  }
  toggleSelected(selected) {
    if(selected){
      this.selected = selected;
    }else{
      this.selected = !this.selected;
    }    
    this.selected = this.selected;

    let actionType = this.selected?"selected":"unSelected";
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      productItemId: this.productItemId,
      shopId: this.shopInfo.shopId
    }
    huipayRequest.resource('/shop/shoppingCart/productItemToggle/:actionType').save({ actionType: actionType}, postInfo).then((data)=>{console.log(data)});
  }
  
}
module.exports = ShoppingCartProduct;