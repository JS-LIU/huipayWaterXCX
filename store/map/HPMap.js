var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var LocationInfo = require('./LocationInfo.js');
var { huipayRequest } = require('../../store/init.js');
class HPMap {
  constructor() {
    this.qqMapSdk = new QQMapWX({
      key: 'SYABZ-VYWCG-UXKQL-I5V3J-JY64H-QKFXX'
    });
  }

  getLngLat(){

    return new Promise((resolve, reject) => {
      wx.getLocation({
        altitude: true,
        success: function (res) {
          resolve({ latitude: res.latitude, longitude: res.longitude});
        }
      })
    })
  }
  getLocation(location){
    return new Promise((resolve,reject)=>{
      this.qqMapSdk.reverseGeocoder({
        location: location,
        success: function (res) {
          let data = Object.assign(res.result, { location });
          resolve(new LocationInfo(data).getInfo('locate'));
        },
        fail: function (res) {
          console.log(new LocationInfo().getInfo("fail"));
        }
      });
    })    
  }
  getGeocoder(addressName){
    return new Promise((resolve,reject)=>{
      this.qqMapSdk.geocoder({
        address: addressName,
        success: function (res) {
          let data = res.result;
          resolve(new LocationInfo(data).getInfo('geoCoder'))
        },
        fail: function (res) {
          console.log(new LocationInfo().getInfo("fail"));
        }
      });
    })
    
  }
  autoComplete(keyword, region) {
    return new Promise((resolve, reject) => {
      this.qqMapSdk.getSuggestion({
        keyword: keyword,
        region: region,
        region_fix:1,
        success: function (res) {
          let locationList = [];
          if (res && res.data) {
            for (let i = 0; i < res.data.length; i++) {
              locationList.push(new LocationInfo(res.data[i]).getInfo("autoComplete"));
            }
            resolve(locationList);
          }
        },
        complete: function (res) {
        }
      })
    })
  }

  getCities(){
    return huipayRequest.resource('/common/city/getCities').save({}, {})
  }
}
module.exports = HPMap;