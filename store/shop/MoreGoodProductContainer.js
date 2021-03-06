var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var ShopProduct = require('../product/ShopProduct.js');
class MoreGoodProductContainer {
  constructor() {
    this.productList = [];
  }
  //  发起请求
  getProductList(shopId, sortType, categoryType) {
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      shopId: shopId,
      sortType: sortType,
      categoryType: categoryType,
      accessInfo: accessInfo
    }
    return new Promise((resolve, reject) => {
      huipayRequest.resource('/shop/:info').save({ info: 'moreGoodProduct' }, postInfo).then((info) => {
        let productList = info.data.productList;
        let shopId = info.data.shopId;
        resolve(this.convertToShopProductList(productList, shopId));
      });
    })

  }

  // 里面的product转换为ShopProduct
  convertToShopProductList(productList, shopId) {
    this.productList = [];
    for (let i = 0; i < productList.length; i++) {
      let productModelList = productList[i].productItemModels;
      for (let j = 0; j < productModelList.length; j++) {
        this.productList.push(new ShopProduct(productModelList[j], shopId));
      }
    }
    return this.productList;
  }
  findProductById(productItemId) {
    for (let i = 0; i < this.productList.length; i++) {
      if (this.productList[i].productItemId === productItemId) {
        return this.productList[i];
      }
    }
    return null;
  }
}
module.exports.moreGoodProductContainer = new MoreGoodProductContainer();