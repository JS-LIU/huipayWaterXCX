var Map = require('./Map.js');
var { editCustomerAddress } = require('./EditCustomerAddress.js');
var HPMap = require('./HPMap.js');
//  被创建的地址的地图对象
class CustomerMap{
  constructor(){
    this.hpMap = new HPMap();
    this.showLocationInfo = null;
  }
  shopMap(id){
    this.map = new Map(id);
  }
  getCenterLocationInfo(){
    return this.map.getCenterLngLat().then((lngLat) => {
      return this.hpMap.getLocation(lngLat)
    });
  }
  convertToLocationInfo(city){
    return this.hpMap.getGeocoder(city);
  }
  setShowLocationInfo(locationInfo){
    this.showLocationInfo = locationInfo;
  }
  getShowLocationInfo(){
    return this.showLocationInfo;
  }
}
module.exports.customerMap = new CustomerMap();