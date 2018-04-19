var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var { homeMap } = require('../map/HomeMap.js');
var Shop = require("../shop/Shop.js");
var ShopProduct = require('../product/ShopProduct.js');
class CollectionContainer{
  constructor(){

  }
  getProudctList(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo:accessInfo,
      type:"product"
    }
    return new Promise((resolve,reject)=>{
      huipayRequest.resource('/shop/:action').save({ action: 'collectList' }, postInfo).then((info)=>{
        let productList = [];
        let productItemCommonModel = info.data.productItemCommonModel;
        for (let i = 0; i < productItemCommonModel.length;i++){
          let productItemModels = productItemCommonModel[i].productItemModels
          for (let j = 0; j < productItemModels.length;j++){
            productList.push(new ShopProduct(productItemModels[j], productItemCommonModel[i].shopId, productItemCommonModel[i].ticketProductItemId));
          }
        }
        resolve(productList);
      })
    })
  }
  getShopList(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    return new Promise((resolve,reject)=>{
      homeMap.getLocation().then((locationInfo) => {
        let postInfo = {
          accessInfo: accessInfo,
          type: "shop",
          cityName: locationInfo.city,
          latitude: locationInfo.latitude,
          longtitude: locationInfo.longitude
        }
        return huipayRequest.resource('/shop/:action').save({ action: 'collectList' }, postInfo)
      }).then((info)=>{
        let shopList = [];
        let shopBasicInfoList = info.data.shopBasicInfoModel
        for (let i = 0; i < shopBasicInfoList.length; i++){
          shopList.push(new Shop(shopBasicInfoList[i]));
        }
        resolve(shopList);
      })
    })
  }
}

module.exports.collectionContainer = new CollectionContainer();