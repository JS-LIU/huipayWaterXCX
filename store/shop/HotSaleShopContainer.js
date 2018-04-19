var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var { homeMap } = require('../map/HomeMap.js');
var ShopProduct = require('../product/ShopProduct.js');

class HotSaleShopContainer{
  constructor(){
    this.tagList = [];
    this.productList = [];
    
    this.sortType = [{ name: "推荐", key: "default", selected: true }, { name: "销量", key: "saleMount", selected: false }, { name: "价格", key: "currentPrice", selected: false}];
    
    this.currentSortWay = 'asc';
    this.sortByWay = {
      "asc":(list,prop)=>{
        list.sort((a,b)=>{
          return a[prop] - b[prop]
        });
        return list;
      },
      "desc": (list, prop) => {
        list.sort((a, b) => {
          return b[prop] - a[prop]
        })
        return list;
      }
    }
    this.sortStrategies = {
      "default":(list)=>{
        this.changeSortType("default");
        this.sortByWay["desc"](list, 'currentPrice');
        return list;
      },
      "saleMount":(list)=>{
        let sortType = this.findSortTypeByKey("saleMount");
        let sortWay = this.getSortWay(sortType);
        this.changeSortType("saleMount");
        return this.sortByWay[sortWay](list,'saleMount');
        
      },
      "currentPrice":(list)=>{
        let sortType = this.findSortTypeByKey("currentPrice");
        let sortWay = this.getSortWay(sortType);
        this.changeSortType("currentPrice");
        return this.sortByWay[sortWay](list, 'currentPrice');
      }
    }
  }
  
  findSortTypeByKey(key){
    for (let i = 0; i < this.sortType.length; i++){
      if (this.sortType[i].key === key){
        return this.sortType[i];
      }
    }
    return null;
  }
  changeSortType(sortTypeKey){
    for (let i = 0; i < this.sortType.length; i++){
      this.sortType[i].selected = false;
      if (this.sortType[i].key === sortTypeKey){
        this.sortType[i].selected = true;
      }
    }
    return this.sortType;
  }
  getSortType(){
    return this.sortType;
  }
  sortProductList(sortType,productList){
    let list = [...productList];
    return this.sortStrategies[sortType](list);
  }
  changeCurrentSortWay(){
    if (this.currentSortWay === "asc"){
      this.currentSortWay = "desc";
    }else{
      this.currentSortWay = "asc";
    }
  }
  setCurrentSortWay(sortWay){
    this.currentSortWay = sortWay;
  }
  getSortWay(sortType){
    if(sortType.selected){
      this.changeCurrentSortWay();
    }else{
      this.setCurrentSortWay("asc");
    }
    return this.currentSortWay;
  }
  static getHotSaleShopList(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());    
    return homeMap.getLocation().then((locationInfo)=>{
      let postInfo = {
        accessInfo: accessInfo,
        cityName:locationInfo.city,
        latitude: locationInfo.latitude,
        longtitude: locationInfo.longitude
      }
      return huipayRequest.resource('/hotSaleProduct').save({}, postInfo)
    })    
  }
  convertToProductList(shopList){
    let list = [];
    for (let i = 0; i < shopList.length;i++){
      let productList = shopList[i].productList;
      for (let j = 0; j < productList.length;j++){
        let productItemModels = productList[j].productItemModels;
        for (let k = 0; k < productItemModels.length;k++){
          this.productList.push(new ShopProduct(productItemModels[k], shopList[i].shopId));
        }       
      }
    }
    return this.productList;
  }
  findProductById(productItemId){
    for (let i = 0; i < this.productList.length; i++){
      if (this.productList[i].productItemId === productItemId){
        return this.productList[i];
      }
    }
    return null;
  }
  getFilterProductList(){
    let list = [];
    let selectTagList = this.getSelectedTagList();
    if (selectTagList.length > 0){
      for (let i = 0; i < selectTagList.length; i++) {
        for (let j = 0; j < this.productList.length; j++) {
          if (this.productList[j].name === selectTagList[i].tagInfo.brandName) {
            list.push(this.productList[j]);
          } else if (this.productList[j].volume.slice(0, 3) === selectTagList[i].tagInfo.categoryName) {
            list.push(this.productList[j]);
          }
        }
      }
      return list;
    }else{
      return this.productList;
    }
  }
  getSelectedTagList(){
    let list = [];
    for(let i = 0;i < this.tagList.length;i++){
      if (this.tagList[i].selected) {
        list.push(this.tagList[i]);
      }
    }
    return list;
  }
  static getBrandList(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    return huipayRequest.resource('/shop/:list').save({ list:"brandList"}, {
      accessInfo:accessInfo
    })   
  }
  convertToBrandList(tagList){
    for(let i = 0;i < tagList.length;i++){
      this.tagList.push({
        selected:false,
        tagInfo:tagList[i],
        style: ' color: #333; background:#f1f2f6;'
      })
    }
    return this.tagList;
  }
  selectedTag(tagId){
    for (let i = 0; i < this.tagList.length;i++){
      if (tagId == this.tagList[i].tagInfo.id){
        this.tagList[i].selected = !this.tagList[i].selected;
        if (this.tagList[i].selected) {
          this.tagList[i].style =  'color: #4dc0ff; background: #d5f7fe;border:1rpx solid #4dc0ff'
        } else {
          this.tagList[i].style = ' color: #333; background: #f1f2f6; '
        }
      }    
    }
    return this.tagList;
  }
  clearSelectTag(){
    for (let i = 0; i < this.tagList.length; i++) {
      this.tagList[i].selected = false;
      this.tagList[i].style = ' color: #333; background: #f1f2f6; ' 
    }
    return this.tagList;
  }
}
module.exports = HotSaleShopContainer;