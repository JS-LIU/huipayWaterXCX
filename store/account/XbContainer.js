var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
class XbContainer{
  constructor(settleProductContainer, useWaterTicketContainer){
    this.settleProductContainer = settleProductContainer;
    this.useWaterTicketContainer = useWaterTicketContainer;
    this.totalXb = 0;
    this.expectXb = 0;
  }
  getTotalXb(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo
    }
    return huipayRequest.resource('/account/clientAccount').save({}, postInfo)    
  }
  getCanUseXb(){
    let maxXb = this.getMaxUseXb();
    this.expectXb = (maxXb > this.expectUseXb ? this.expectUseXb : maxXb)
    return this.expectXb;
  }
  getMaxUseXb(){
    let totalProductPrice = this.settleProductContainer.getTotalPrice();
    let totalWaterTicketPrice = this.useWaterTicketContainer.getTotalUsedMoney();
    let maxXb = totalProductPrice - totalWaterTicketPrice;
    return maxXb > this.totalXb ? this.totalXb : maxXb
  }
  reduceXb(){
    if (this.expectXb > 0){
      this.expectXb--;
    }
    return this.expectXb;
  }
  increaseXb(){
    if (this.expectXb < this.getMaxUseXb()) {
      this.expectXb++;
    }
    return this.expectXb;
  }
  getTotalUseMoney(){
    return this.expectXb;
  }
}
module.exports = XbContainer;