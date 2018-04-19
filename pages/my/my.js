var { loginInfo } = require('../../store/login/LoginInfo.js');
var { login } = require('../../store/login/Login.js');
var { huipayRequest } = require('../../store/init.js');

function bindNavigateTo(isLogin, url) {
  if (isLogin) {
    wx.navigateTo({
      url: url,
    })
  } else {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    isLogin:true
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

    huipayRequest.resource('/user/me').save({}, postInfo).then((info) => {
      this.setData({
        user: info.data,
        isLogin: true
      })
    }).catch((info) => {
      if (info.data.message === "需要用户正式登录") {
        this.setData({
          isLogin: false,
          user: { userIconUrl: "../images/header_icon_default.png" }
        });
      }
    });
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
  bindToLogin:function(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  bindNavigateTo:function(e){
    let url = e.currentTarget.dataset.url
    bindNavigateTo(this.data.isLogin, url);
  }
});


