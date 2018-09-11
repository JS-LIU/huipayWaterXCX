var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var InviteCustomerWaterTicketActive = require('./InviteCustomerWaterTicketActive.js');
var ScanWaterTicketActive = require('./ScanWaterTicketActive.js');
class Active{
  constructor(activityId,inviteId){
    this.activityId = activityId;
    this.inviteId = inviteId;
    this.activeStrategies = {
      1: new ScanWaterTicketActive(this.activityId),
      2: new InviteCustomerWaterTicketActive(this.activityId, this.inviteId)
    }
  }
  createActive(){
    return this.activeStrategies[this.activityId]
  }
}
module.exports = Active;