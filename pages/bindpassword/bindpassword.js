var { loginInfo } = require('../../store/login/LoginInfo.js');
var { huipayRequest } = require('../../store/init.js');
var { activityList } = require('../../store/activity/ActivityList.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.active = activityList.activities.inviteCustomerWaterTicketActive || activityList.activities.scanWaterTicketActive;
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
  bindInputPassWord:function(e){
    this.password = e.detail.value;
  },
  bindPassWord: function (e) {
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let password = this.password;
    console.log(password)
    let postInfo = {
      accessInfo: accessInfo,
      password: password
    }
    huipayRequest.resource('/login/setPassword').save({}, postInfo).then((info) => {
      if (this.active && this.active.accept){
        this.active.acceptActivityWaterTicket().then(() => {
          wx.reLaunch({
            url: '/pages/receivewaterticketsuccess/receivewaterticketsuccess',
          })
        }).catch((err) => {
          console.log(err);
          wx.reLaunch({
            url: '/pages/receivewaterticketfail/receivewaterticketfail',
          })
        })
      }else{
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
      
    })
  }
})