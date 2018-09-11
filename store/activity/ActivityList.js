var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var Active = require('./Active.js');
var InviteCustomerWaterTicketActive = require('./InviteCustomerWaterTicketActive.js');
var ScanWaterTicketActive = require('./ScanWaterTicketActive.js');
class ActivityList{
    constructor(){
        this.activities = {};
    }
  createScanWaterTicketActive(active) {
      if (active instanceof ScanWaterTicketActive ) {
        this.activities = {
          scanWaterTicketActive: active
        }
      }
      return "nextSuccessor";
    }
    createInviteCustomerWaterTicketActive(active) {
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
  createActivity(activityId,inviteId) {
    this.activities = {};
    let active = new Active(activityId,inviteId).createActive();
    let activities = this.createScanWaterTicketActive.after(this.createInviteCustomerWaterTicketActive).bind(this);
    activities(active);
    
  }
  getActivities(activityId,inviteId){
    
    return new Promise((resolve, reject) => {
      this.getActivityId(activityId).then((activityId) => {
        this.createActivity(activityId,inviteId);
        resolve(this.activities)
      });
    })
  }
  resetActivities(){
    this.activities = {};
  }
}
module.exports.activityList = new ActivityList();