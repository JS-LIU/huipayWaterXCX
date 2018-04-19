var { loginInfo } = require('../../store/login/LoginInfo.js');
var { huipayRequest } = require('../../store/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    isCanSendMsg:false
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
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo
    }
    huipayRequest.resource('/user/weixinMsg').save({}, postInfo).then((info) => {
      this.setData({
        user: info.data
      })
    })
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
  bindRegister:function(){
    let self = this;
    wx.showModal({
      title: '确认手机号码',
      content: '我们将发送验证码到这个号码\r\n'+this.phoneNum,
      cancelText:"取消",
      confirmText:"确定",
      success: function (res) {
        if (res.confirm) {
          console.log(self.phoneNum);
          huipayRequest.resource('/checkCode/login').save({}, { phoneNum: self.phoneNum})
          wx.navigateTo({
            url: '/pages/inputcheckcode/inputcheckcode?phoneNum=' + self.phoneNum,
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  bindInputPhoneNum:function(e){
    if (e.detail.value.length === 11){
      this.phoneNum = e.detail.value;
      this.setData({
        isCanSendMsg: true,
      })
    }else{
      this.setData({
        isCanSendMsg: false
      })
    }
  }
})