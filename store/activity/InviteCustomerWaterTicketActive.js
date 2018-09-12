var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
class InviteCustomerWaterTicketActive{
  constructor(activityId,inviteId){
    //  是否进行中
    this.activityId = activityId;
    this.active = true;
    this.inviteId = inviteId;
    this.accept = false;
  }
  closeActive(){
    this.active = false;
  }
  
  acceptActivityWaterTicket(){
    this.accept = true;
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      activityId:this.activityId,
      inviteUserId: this.inviteId
    }
    return huipayRequest.resource('/activity/acceptActivityInvite').save({}, postInfo)
  }
  
}
module.exports = InviteCustomerWaterTicketActive;
