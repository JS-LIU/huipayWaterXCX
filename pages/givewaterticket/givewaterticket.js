// pages/givewaterticket.js
var { loginInfo } = require('../../store/login/LoginInfo.js');
var { login } = require('../../store/login/Login.js');
var { huipayRequest } = require('../../store/init.js');
var { userInfo } = require('../../store/user/UserInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteProfitXtbAmount: "",
    shareSellProfitRmbAmount: "",
    userFriendAmount: ""
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
   
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo
    }
    huipayRequest.resource('/profit/userProfitInfo').save({}, postInfo).then((info)=>{
      this.setData({
        inviteProfitXtbAmount: info.data.inviteProfitXtbAmount,
        shareSellProfitRmbAmount: info.data.shareSellProfitRmbAmount,
        userFriendAmount: info.data.userFriendAmount
      })
    }) 
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
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    // }
    
    return {
      title: userInfo.userName + '送你一张水票，点击可免费领取1桶喜腾山泉！赶快行动吧！',
      path: '/pages/index/index?type=receiveTicket&activityId=2&inviteId=' + userInfo.id,
      imageUrl:'../images/fenxiang_photo_zhuanxiang@2x.png'
    }
    
  },
  bindGiveWaterTicket:function(){
    wx.navigateTo({
      url: '/pages/savepicture/savepicture',
    })
  }
})