var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var CustomerAddress = require('./CustomerAddress.js');
class CustomerAddressContainer{
  constructor(){
    this.list = [];
  }
  getCustomerAddressList(){
    this.list = [];
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let self = this;
    return new Promise((resolve,reject)=>{
      huipayRequest.resource('/delivery/:list').save({ list: "addressList" }, {
        accessInfo: accessInfo
      }).then((info) => {
        let list = info.data;
        for (let i = 0; i < list.length; i++) {
          self.list.push(new CustomerAddress(list[i]));
        }
        resolve(self.list);
      }).catch((data)=>{
        reject(data);
      });
    })
  }
  deleteAddress(addressId){
    let i = this.list.findIndex((item)=>{
      return item.id === addressId
    })
    this.list.splice(i, 1);
    
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    huipayRequest.resource('/delivery/:action').save({ action: "delete" }, {
      accessInfo: accessInfo,
      deliveryAddressId: addressId
    }).then((info) => {
      console.log(info)
    });
    return this.list;
  }
  setDefault(addressId){
    for(let i = 0 ;i < this.list.length;i++){
      if (this.list[i].id === addressId){
        this.list[i].setToDefault();
      }else{
        this.list[i].setToDefault(false);
      }
    }
    return this.list;
  }
  getFamilyAddress(){
    let familyAddress;
    for(let i = 0;i < this.list.length;i++){
      if (this.list[i].addressTagName === "家庭"){
        familyAddress = this.list[i];
        return familyAddress;
      }
    }
    return familyAddress;
  }
  getCompanyAddress() {
    let companyAddress;
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].addressTagName === "单位") {
        companyAddress = this.list[i];
        return companyAddress;
      }
    }
    return companyAddress;
  }
  

}
module.exports.customerAddressContainer = new CustomerAddressContainer();