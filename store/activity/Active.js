var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var NewCustomerWaterTicketActive = require('./NewCustomerWaterTicketActive.js');
class Active{
  constructor(activityId){
    this.activityId = activityId;
    this.activeStrategies = {
      2: new NewCustomerWaterTicketActive(this.activityId)
    }
  }
  createActive(){
    return this.activeStrategies[this.activityId]
  }
}
module.exports = Active;