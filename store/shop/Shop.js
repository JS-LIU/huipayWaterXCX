var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var { homeMap } = require('../map/HomeMap.js');
class Shop{
  constructor(shopInfo){
    this.address = shopInfo.address;
    this.certification = shopInfo.certification;
    this.collectFlg = shopInfo.collectFlg;
    this.deliveryTime = shopInfo.deliveryTime;
    this.distance = shopInfo.distance;
    this.fansCount = shopInfo.fansCount;
    this.imageUrl = shopInfo.imageUrl;
    this.name = shopInfo.name;
    this.saleMount = shopInfo.saleMount;
    this.score = this.convertToWXScore(shopInfo.score);
    this.shareUrl = shopInfo.shareUrl;
    this.shopId = shopInfo.shopId;
    this.totalProductCount = shopInfo.totalProductCount;  
  }
  collection(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      shopId:this.shopId,
      type:"shop"
    }
    this.collectFlg = !this.collectFlg;
    this.resetFansCount();
    return huipayRequest.resource('/shop/collect').save({}, postInfo)
  }
  resetFansCount(){
    if (this.collectFlg){
      this.fansCount += 1;
    }else{
      this.fansCount -= 1;
    }
  }
  static getShopInfo(shopId){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    
    return homeMap.getLocation().then((locationInfo)=>{
      let postInfo = {
        accessInfo: accessInfo,
        cityName: locationInfo.city,
        latitude: locationInfo.latitude,
        longtitude: locationInfo.longitude,
        shopId: shopId
    }
      return huipayRequest.resource('/shopinfo').save({}, postInfo)
    })
  }
  convertToWXScore(shopScore){
    let start = Math.floor(shopScore / 2);
    let unStart = 5 - start;
    let score = [];
    for (let i = 0; i < start; i++) {
      score.push({
        imageUrl:"../images/icon_star_orange.png"
      })
    }
    for (let i = 0; i < unStart; i++) {
      score.push({
        imageUrl: "../images/icon_star_gray.png"
      })
    }
    return score;
  }
}
module.exports = Shop;