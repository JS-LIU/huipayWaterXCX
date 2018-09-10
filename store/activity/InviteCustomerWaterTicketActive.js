var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
class InviteCustomerWaterTicketActive{
  constructor(activityId) {
    this.activityId = activityId;
    //  是否进行中
    this.active = true;
  }
  setInviteId(inviteId){
    this.inviteId = inviteId;
  }
  setType(type){
    this.type = type;
  }
  closeActive() {
    this.active = false;
  }
  acceptActivityWaterTicket() {
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      activityId: this.activityId,
      inviteUserId: this.inviteId
    }
    return huipayRequest.resource('/activity/acceptActivityInvite').save({}, postInfo)
  }
}
module.exports = InviteCustomerWaterTicketActive;