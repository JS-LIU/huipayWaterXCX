var { homeMap } = require('./HomeMap.js');
var { TagContainer } = require('./TagContainer.js');
var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
//  正在被创建的地址对象
class EditCustomerAddress{
  constructor(){
    this.selectedLocationInfo = null;
    this.name = "";
    this.phoneNum = "";
    this.paddingAddress = "";
    this.tagId = "";
    this.strategy = "";
    this.id;
  }  
  getLocation(){
    return this.selectedLocationInfo;
  }
  setSelectedLocationInfo(locationInfo){
    this.selectedLocationInfo = locationInfo;
  }
  setId(id){
    this.id = id; 
  }
  getId(){
    return this.id;
  }
  setStrategy(strategy){
    this.strategy = strategy;
  }
  createAddress(id){
    return strategies[this.strategy].call(this,id)
  }
  setName(name){
    this.name = name;
  }
  getName(){
    return this.name;
  }
  setPhoneNum(phoneNum){
    this.phoneNum = phoneNum;
  }
  getPhoneNum(){
    return this.phoneNum;
  }
  setPaddingAddress(paddingAddress){
    this.paddingAddress = paddingAddress;
  }
  getPaddingAddress(){
    return this.paddingAddress;
  }
  setTagId(id){
    this.tagId = id;
  }
  getTagId(){
    return this.tagId;
  }
} 

let strategies = {
  "updata":function(id){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      id:id,
      createAddressModel: {
        addressTagId: this.getTagId(),
        name: this.getName(),
        phone: this.getPhoneNum(),
        createAddressModel: {
          appendAddress: this.getPaddingAddress(),
          pCode: this.getLocation().pcode,
          pName: this.getLocation().province,
          cityCode: this.getLocation().citycode,
          cityName: this.getLocation().city,
          adCode: this.getLocation().adcode,
          adCode: this.getLocation().adcode,
          mappingAddress: (this.getLocation().address || "") + this.getLocation().fullAddress,
          latitude: this.getLocation().latitude,
          longtitude: this.getLocation().longitude
        }
      }
    }
    return huipayRequest.resource('/delivery/:action').save({ action: 'update' }, postInfo);
  },
  "create":function(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo:accessInfo,
      createAddressModel:{
        addressTagId: this.getTagId(),
        name: this.getName(),
        phone: this.getPhoneNum(),
        createAddressModel:{
          appendAddress: this.getPaddingAddress(),         
          pCode: this.getLocation().pcode,
          pName: this.getLocation().province,
          cityCode: this.getLocation().citycode,
          cityName: this.getLocation().city,
          adCode: this.getLocation().adcode,
          adCode: this.getLocation().adcode,
          mappingAddress: (this.getLocation().address || "") + this.getLocation().fullAddress,
          latitude: this.getLocation().latitude,
          longtitude: this.getLocation().longitude
        }
      }
    }
    return huipayRequest.resource('/delivery/:action').save({ action: 'create'}, postInfo);
  }
}


module.exports.editCustomerAddress = new EditCustomerAddress();