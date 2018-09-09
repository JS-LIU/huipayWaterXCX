var { login } = require('../../store/login/Login.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var { huipayRequest } = require('../../store/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum:""
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
  bindWxLogin: function(e){
    login.wxLogin(e.detail).then((info)=>{
      console.log('info',info);
      if (info.data.nextStep === "mainPage") {
        
        loginInfo.setInfo(info.data.accessToken);
        login.trigger("login");
        wx.reLaunch({
          url: '/pages/index/index',
        })
      } else {
        console.log('==================',info);
        loginInfo.setInfo(info.data.accessToken);
        //  绑定手机号
        wx.navigateTo({
          url: '/pages/bindphonenum/bindphonenum',
        })
      }
    })
  }, 
  bindInputPhoneNum: function (e){
    this.phoneNum = e.detail.value;
    this.setData({
      phoneNum: this.phoneNum
    })
  },
  bindForgetPsd: function (e){
    if(this.phoneNum && this.phoneNum.length === 11){
      let self = this;
      wx.showModal({
        title: '确认手机号码',
        content: '我们将发送验证码到这个号码\r\n' + this.phoneNum,
        cancelText: "取消",
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            huipayRequest.resource('/checkCode/changePassword').save({}, { phoneNum: self.phoneNum })
            wx.navigateTo({
              url: '/pages/resetpswcheckcode/resetpswcheckcode?phoneNum=' + self.phoneNum,
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }else{
      wx.showToast({
        title: '请填写手机号码',
        duration: 2000
      })
    }
  },
  bindGetPhoneNum: function (e){
    this.phoneNum = e.detail.value;
  },
  bindGetPsw: function (e){
    this.psw = e.detail.value;
  },
  bindLogin: function (e){
    huipayRequest.resource('/login/byPassword').save({}, { phoneNum: this.phoneNum, password: this.psw }).then((info)=>{
      loginInfo.setInfo(info.data);
      login.trigger("login");
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch((errMsg) =>{
      // console.log(errMsg.data.message)
      // console.log(errMsg)
      wx.showToast({
        title: errMsg.data.message,
        icon: 'none',
        duration: 2000
      })
    })
  }
})