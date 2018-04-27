var { login } = require('../../store/login/Login.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var { huipayRequest } = require('../../store/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: "获取验证码"
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
    this.timer = "获取验证码";
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
  bindWxLogin: function () {
    login.wxLogin().then((info) => {
      if (info.data.nextStep === "mainPage") {
        console.log(info.data.accessToken);
        loginInfo.setInfo(info.data.accessToken);
      } else {
        loginInfo.setInfo(info.data.accessToken);
        //  绑定手机号
        wx.navigateTo({
          url: '/pages/bindphonenum/bindphonenum',
        })
      }
    })
  },
  
  bindGetPhoneNum: function (e) {
    this.phoneNum = e.detail.value;
  },
  bindGetCheckCode: function (e) {
    this.checkCode = e.detail.value;
  },
  bindLogin: function (e) {
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postData = {
      accessInfo: accessInfo,
      checkCode: this.checkCode,
      phoneNum: this.phoneNum
    }
    huipayRequest.resource('/login/user').save({}, postData).then((info) => {
      loginInfo.setInfo(info.data);

      login.trigger("login");
      wx.switchTab({
        url: '/pages/index/index',
      })
    })
  },
  bindStartGetCheckCode: function (e){
    if(this.timer === "获取验证码"){
      this.timer = 60;
      huipayRequest.resource('/checkCode/login').save({}, { phoneNum: this.phoneNum});
      let t = setInterval(()=>{
        this.timer--;
        this.setData({
          timer:this.timer + "s后重新获取"
        })
        if (this.timer === 0){
          this.timer = "获取验证码";
          this.setData({
            timer: "获取验证码"
          })
          clearInterval(t);
        }
        
      },1000)
    }
  }
})