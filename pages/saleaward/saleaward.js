// pages/inviteredpocket/inviteredpocket.js
var { loginInfo } = require('../../store/login/LoginInfo.js');
var { login } = require('../../store/login/Login.js');
var { huipayRequest } = require('../../store/init.js');
var { userInfo } = require('../../store/user/UserInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diamondFriendShareSellProfitRmbAmount: "",
    diamondFriendShareSellProfitRmbRecordModelList: [],
    goldenFriendShareSellProfitRmbAmount: "",
    goldenFriendShareSellProfitRmbRecordModelList: [],
    userProfitDiamondFriendAmount: "",
    userProfitGoldenFriendAmount: "",
    currentFriendType:'diamond'
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
    huipayRequest.resource('/profit/shareSellProfitRmb').save({}, postInfo).then((info) => {
      this.setData({
        diamondFriendShareSellProfitRmbAmount: info.data.diamondFriendShareSellProfitRmbAmount,
        diamondFriendShareSellProfitRmbRecordModelList: info.data.diamondFriendShareSellProfitRmbRecordModelList,
        goldenFriendShareSellProfitRmbAmount: info.data.goldenFriendShareSellProfitRmbAmount,
        goldenFriendShareSellProfitRmbRecordModelList: info.data.goldenFriendShareSellProfitRmbRecordModelList,
        userProfitDiamondFriendAmount: info.data.userProfitDiamondFriendAmount,
        userProfitGoldenFriendAmount: info.data.userProfitGoldenFriendAmount
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

  },
  bindCutFriendType: function (e) {
    this.setData({
      currenFriendType: e.currentTarget.dataset.friendType
    })
  }
})