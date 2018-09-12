var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
class ScanWaterTicketActive{
  constructor(activityId) {
    this.activityId = activityId;
    //  是否进行中
    this.active = true;
    this.accept = false;
  }
  closeActive() {
    this.active = false;
  }
  acceptActivityWaterTicket() {
    this.accept = true;
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      activityId: this.activityId
    }
    return huipayRequest.resource('/activity/acceptActivityInvite').save({}, postInfo)
  }
}
module.exports = ScanWaterTicketActive;