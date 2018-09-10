// pages/receivewaterticketactive/receivewaterticketactive.js
var { activityList } = require('../../store/activity/ActivityList.js');
var { userInfo } = require('../../store/user/UserInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviter:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inviteCustomerWaterTicketActive = activityList.activities.inviteCustomerWaterTicketActive;
    userInfo.getInviteUserInfo(inviteCustomerWaterTicketActive.inviteId).then((inviteInfo)=>{
      console.log(inviteInfo.data);
      this.setData({
        inviter: inviteInfo.data
      })
    }).catch((err)=>{
      this.setData({
        inviter: null
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindAcceptWaterTicket: function () {
    activityList.activities.inviteCustomerWaterTicketActive.acceptActivityWaterTicket().then((info)=>{
      console.log('success======',info);
      //  领取成功
      wx.redirectTo({
        url: '/pages/receivewaterticketsuccess/receivewaterticketsuccess'
      })
      
    }).catch((err)=>{
      console.log(err);
      //  领取失败
      if(err.data.message === "已经领取过新用户赠送水票"){
        wx.redirectTo({
          url: '/pages/receivewaterticketfail/receivewaterticketfail'
        })
      }
      // if(err.data.message === ""){
      //   wx.redirectTo({
      //     url: 'pages/login/login?receivewaterticketactive=true'
      //   })
      // }
    })
  }
})