var { homeMap } = require('./HomeMap.js');
class SettleMap{
  constructor(){
    this.settleReceiverInfo = null;
  }
  setSettleReceiverInfo(settleReceiverInfo){
    this.settleReceiverInfo = settleReceiverInfo;
  }
  getSettleReceiverInfo(){
    return this.settleReceiverInfo;
  }
}
module.exports.settleMap = new SettleMap();