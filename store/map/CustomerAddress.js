var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
class CustomerAddress{
  constructor(info){
    this.id = info.id;
    this.locationInfo = {
      longitude: info.position.longitude,
      latitude: info.position.latitude,

      province: info.address.province,
      city: info.address.cityName,

      receiveAddress: info.address.mapAddress,
      fullAddress:info.address.fullAddress
    }
    this.appendingAddress = info.address.appendingAddress,
    this.name = info.name;
    this.phoneNum = info.phoneNum;
    this.addressTagName = info.addressTagName;
    this.defaultFlag = info.defaultFlag;
  }
  setToDefault(isDefault){
    if (isDefault === undefined){
      this.defaultFlag = !this.defaultFlag;
    }else{
      this.defaultFlag = isDefault;
    }
    if (this.defaultFlag){
      let self = this;
      let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
      huipayRequest.resource('/delivery/:action').save({ action: "defaultAddress" }, {
        accessInfo: accessInfo,
        deliveryAddressId: self.id
      }).then((info) => {
        console.log(info)
      });
    }
  }

}
module.exports = CustomerAddress;