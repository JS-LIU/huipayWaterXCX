var { loginInfo } = require('../../store/login/LoginInfo.js');
var { huipayRequest } = require('../../store/init.js');
var { order } = require('../../store/order/Order.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waterTicketList: []
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
    let postData = {
      accessInfo: accessInfo
    }
    huipayRequest.resource('/user/watertickets').save({}, postData).then((info) => {
      this.setData({
        waterTicketList: info.data.userWaterTicketModelList
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
  bindUseTicketSettle:function(e){
    let userTicketId = e.currentTarget.dataset.userTicketId;
    order.getSettleInfo('default', 'useTicketSettle', userTicketId).then(() => {
      wx.navigateTo({
        url: '/pages/settle/settle?isCanSetWaterTicketsNum=false'
      })
    })
  }
})