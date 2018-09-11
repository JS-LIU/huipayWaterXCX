var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
class NewCustomerWaterTicketActive{
  constructor(activityId){
    //  是否进行中
    this.activityId = activityId;
    this.active = true;
  }
  closeActive(){
    this.active = false;
  }
  setInviteId(inviteId) {
    this.inviteId = inviteId;
  }
  acceptActivityWaterTicket(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      activityId:this.activityId
    }
    return huipayRequest.resource('/activity/acceptActivityInvite').save({}, postInfo)
  }
}
module.exports = NewCustomerWaterTicketActive;
