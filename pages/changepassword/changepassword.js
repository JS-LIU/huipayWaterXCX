var { huipayRequest } = require('../../store/init.js');
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
    this.phoneNum = options.phoneNum;
    this.checkCode = options.checkCode;
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
  bindInput: function (e){
    this.passWord = e.detail.value;

  },
  bindPassWord : function () {

    let postInfo = {
      checkCode: this.checkCode,
      password: this.passWord,
      phoneNum: this.phoneNum
    }
    huipayRequest.resource('/user/changePassword').save({}, postInfo).then((info) => {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    })
  }
})