var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var ShopWaterTicket = require('../product/ShopWaterTicket.js');
class ShopWaterTicketList{
  constructor(){
    this.waterTicketList = [];
  }
  getWaterTicketlList(shopId, sortType, categoryType) {
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      shopId: shopId,
      sortType: sortType,
      categoryType: categoryType,
      accessInfo: accessInfo
    }
    return new Promise((resolve,reject)=>{
      huipayRequest.resource('/shop/:cart/:list').save({ cart: 'shoppingcart', list: 'oldWaterTicketProductList' }, postInfo).then((info)=>{
        resolve(this.convertToShopWaterTicketList(info.data.productList));
      })
    })  
  }
  convertToShopWaterTicketList(waterTicketList){
    this.waterTicketList = [];
    for(let i = 0;i < waterTicketList.length;i++){
      let name = waterTicketList[i].name;
      let shopId = waterTicketList[i].shopId;
      let waterTicketListItems = waterTicketList[i].productItemModels;
      console.log(waterTicketListItems);
      for (let j = 0; j < waterTicketListItems.length;j++){
        this.waterTicketList.push(new ShopWaterTicket(name, shopId, waterTicketListItems[j]));
      }
    }
    return this.waterTicketList;
  }
  findWaterTicketById(productItemId){
    for (let i = 0; i < this.waterTicketList.length; i++){
      if (this.waterTicketList[i].productItemId === productItemId){
        return this.waterTicketList[i];
      }
    }
    return null;
  }
}
module.exports.shopWaterTicketList = new ShopWaterTicketList();