var HPMap = require('./HPMap.js');

class HomeMap{
  constructor(){
    this._hpMap = new HPMap();
    this.selectedAddress = null;
    this.city = null;
  }
  //  当前位置
  getCurrentLocation(){ 
    let self = this;
    return self._hpMap.getLngLat().then((lngLat)=>{
      return self._hpMap.getLocation(lngLat)
    }) 
  }
  //  选择的位置
  selectAddress(address) {
    this.selectedAddress = address;
  }
  //  首页展示的位置
  getLocation() {
    wx.showLoading()
    return new Promise((resolve, reject) => {
      if (!this.selectedAddress) {
        this.getCurrentLocation().then((locationInfo)=>{
          wx.hideLoading()
          resolve(locationInfo)
        }).catch(()=>{
          wx.hideLoading()
        })
        
      } else {
        wx.hideLoading();
        resolve(this.selectedAddress)
      }
    })
  }
  
}
module.exports.homeMap = new HomeMap();