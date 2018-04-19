class HomeResetAddress{
  constructor(){
    this.locationInfo;
  }
  setLocationInfo(locationInfo){
    this.locationInfo = locationInfo
  }
  getLocationInfo(){
    return this.locationInfo;
  }


}
module.exports.homeResetAddress = new HomeResetAddress();