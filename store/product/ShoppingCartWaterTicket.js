var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var { homeMap } = require('../map/HomeMap.js');
class ShoppingCartWaterTicket {
  constructor(waterTicket,shopInfo) {
    this.name = waterTicket.name;
    this.volume = waterTicket.volume;
    this.productType = waterTicket.productType;
    this.productItemId = waterTicket.productItemId;
    this.originalPrice = waterTicket.originalPrice;
    this.currentPrice = waterTicket.currentPrice;
    this.productCategory = waterTicket.productCategory;
    this.saleMount = waterTicket.saleMount;
    this.baseCount = waterTicket.baseCount;
    this.smallName = waterTicket.smallName;
    this.imageUrl = waterTicket.imageUrl;
    
    this.selectCount = waterTicket.selectCount || 1;
    this.selected = waterTicket.hasSelected;
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
  increase() {
    this.selectCount++;
  }
  reduce() {

  }
}
module.exports = ShoppingCartWaterTicket;