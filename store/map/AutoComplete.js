var HPMap = require('./HPMap.js');

class AutoComplete{
  constructor(){
    this._hpMap = new HPMap();
  }
  getAddressList(words,city){
    return this._hpMap.autoComplete(words, city);
  }
  setShowLocation(locationInfo){
    this.locationInfo = locationInfo
  };
  getLocationInfo(){
    return this.locationInfo;
  }
}

module.exports.autoComplete = new AutoComplete();