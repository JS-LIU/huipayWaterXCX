var Address = require("./Address.js");
const strategies = {
  "locate": function (data){
    var info = {
      longitude: data.location.longitude,
      latitude: data.location.latitude,

      province: data.address_component.province,
      city: data.address_component.city,

      pcode : "miniprograms",
      citycode: "miniprograms",
      adcode: data.ad_info.adcode,

      fullAddress: data.address,
      receiveAddress: data.address
    }    
    return info;
  },
  "autoComplete":function (data){
    var info = {
      longitude: data.location.lng,
      latitude: data.location.lat,

      province: data.province,
      city: data.city,

      adcode: data.adcode,
      
      fullAddress: data.title,
      receiveAddress: data.title,
      address:data.address
    }
    return info;
  },
  "geoCoder":function(data){
    var info = {
      longitude: data.location.lng,
      latitude: data.location.lat,

      province: data.address_components.province,
      city: data.address_components.city,

      adcode: data.adcode,

      fullAddress: data.address_components.district + data.address_components.street + data.address_components.street_number,
      receiveAddress: data.address_components.district + data.address_components.street + data.address_components.street_number
    }
    return info 
  },
  "fail":function(data){
    var info = {
      fullAddress : "定位失败",
      receiveAddress : "定位失败"
    }
    return info;
  }
}

class LocationInfo{
  constructor(positionInfo){
    this.positionInfo = positionInfo;
  }
  getInfo(creator){
    return strategies[creator](this.positionInfo)
  }
  convertToAddress() {
    return new Address(this.positionInfo)
  }
}
module.exports = LocationInfo;