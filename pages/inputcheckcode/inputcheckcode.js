var { loginInfo } = require('../../store/login/LoginInfo.js');
var { huipayRequest } = require('../../store/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum:"",
    isCanSendMsg:false,
    checkCode:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.phoneNum = options.phoneNum;
    this.setData({
      phoneNum: options.phoneNum,
      checkCode:""
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
  bindInputCheckCode: function (e){
    if (e.detail.value.length === 6) {
      this.checkCode = e.detail.value;
      this.setData({
        isCanSendMsg: true,
        checkCode: this.checkCode
      })
    } else {
      this.setData({
        isCanSendMsg: false,
        checkCode: this.checkCode
      })
    }
  },
  bindPhoneNum:function(){
    let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
    let postInfo = {
      accessInfo: accessInfo,
      checkCode: this.checkCode,
      phoneNum: this.phoneNum
    }
    huipayRequest.resource('/login/bindPhoneNum').save({}, postInfo).then((info)=>{
      loginInfo.setInfo(info.data);
      wx.navigateTo({
        url: '/pages/bindpassword/bindpassword',
      })
    }).catch(()=>{
      wx.showToast({
        title: '验证码输入错误',
        duration: 2000
      })
    })
  },
  bindTestSetPsw: function (){
    wx.navigateTo({
      url: '/pages/bindpassword/bindpassword',
    })
  }
})