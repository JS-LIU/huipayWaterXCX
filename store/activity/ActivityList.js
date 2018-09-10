var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var Active = require('./Active.js');
var NewCustomerWaterTicketActive = require('./NewCustomerWaterTicketActive.js');
var InviteCustomerWaterTicketActive = require('./InviteCustomerWaterTicketActive.js');
class ActivityList{
    constructor(){
        this.activities = {};
    }
    createNewCustomerWaterTicketActive(active) {
      if (active instanceof NewCustomerWaterTicketActive ) {
        this.activities = {
          newCustomerWaterTicketActive: active
        }
      }
      return "nextSuccessor";
    }
    createInvitedCustomerWaterTicketActive(active) {
      if (active instanceof InviteCustomerWaterTicketActive) {
        this.activities = {
          inviteCustomerWaterTicketActive: active
        }
      }
      return "nextSuccessor";
    }
  getActivityId(activeId) {
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
    };
    return new Promise((resolve, reject) => {
      if (activeId) {
        resolve(activeId)
      } else {
        huipayRequest.resource('/activity/getActivity').save({}, postInfo).then((actives) => {
          resolve(actives.data.activityId)
        }).catch((err)=>{
          reject(null);
        })
      }

    })
    
  }
  createActivity(activityId) {
    this.activities = {};
    let active = new Active(activityId).createActive();
    let activities = this.createInvitedCustomerWaterTicketActive.after(this.createNewCustomerWaterTicketActive).bind(this);
    activities(active);
    
  }
  getActivities(activityId){
    
    return new Promise((resolve, reject) => {
      this.getActivityId(activityId).then((activityId) => {
        this.createActivity(activityId);
        console.log(this.activities);
        resolve(this.activities)
      });
    })
  }
}
module.exports.activityList = new ActivityList();