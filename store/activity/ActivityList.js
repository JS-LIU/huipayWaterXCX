var { huipayRequest } = require('../init.js');
var { loginInfo } = require('../login/LoginInfo.js');
var Active = require('./Active.js');
var NewCustomerWaterTicketActive = require('./NewCustomerWaterTicketActive.js');

class ActivityList{
    constructor(){
        this.activities = {};
    }

    getActivities(){
      this.activities = {};
      let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
      let postInfo = {
          accessInfo: accessInfo,
      };
      return new Promise((resolve,reject)=>{
        huipayRequest.resource('/activity/getActivity').save({}, postInfo).then((actives)=>{
          let active = new Active(actives.data.activityId).createActive();
          if (active instanceof NewCustomerWaterTicketActive){
            this.activities = {
              newCustomerWaterTicketActive: active
            }
          }
          resolve(this.activities);
        }).catch((err)=>{
          reject(null);
        })
      })
    }
}
module.exports.activityList = new ActivityList();