// pages/wallet/wallet.js
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
    userFriendAmount: "",
    canWithDrawRmbMount: "",
    rmbMount: "",
    ticketRmbMount: "",
    xtbMount: "",
    waterTicketListCount:""
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
    huipayRequest.resource('/profit/userProfitInfo').save({}, postInfo).then((info) => {
      this.setData({
        inviteProfitXtbAmount: info.data.inviteProfitXtbAmount,
        shareSellProfitRmbAmount: info.data.shareSellProfitRmbAmount,
        userFriendAmount: info.data.userFriendAmount
      })
    }) 
    huipayRequest.resource('/account/clientAccount').save({}, postInfo).then((info) => {
      this.setData({
        canWithDrawRmbMount: info.data.canWithDrawRmbMount,
        rmbMount: info.data.rmbMount,
        ticketRmbMount: info.data.ticketRmbMount,
        xtbMount: info.data.xtbMount
      })
    }) 
    huipayRequest.resource('/user/watertickets').save({}, postInfo).then((info) => {
      let waterTicketListCount = 0;
      for (let i = 0; i < info.data.userWaterTicketModelList.length;i++){
        if (info.data.userWaterTicketModelList[i].status === "未使用"){
          waterTicketListCount += info.data.userWaterTicketModelList[i].count;
        }
      }
      this.setData({
        waterTicketListCount: waterTicketListCount
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
  onShareAppMessage: function () {

  }
})