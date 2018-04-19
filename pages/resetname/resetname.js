// pages/resetname/resetname.js
var { loginInfo } = require('../../store/login/LoginInfo.js');
var { login } = require('../../store/login/Login.js');
var { huipayRequest } = require('../../store/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.name = options.name
    this.setData({
      name:this.name
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
  bindGetName:function(e){
    console.log(e.detail.value);
    this.name = e.detail.value;
  },
  bindSaveName: function () {
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      nickName: this.name
    }
    huipayRequest.resource('/user/setNickName').save({}, postInfo);
    
    wx.switchTab({
      url: '/pages/my/my',
    })
  }
})