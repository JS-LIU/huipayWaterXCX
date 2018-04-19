var { autoComplete } = require('../../store/map/AutoComplete.js');
var { homeMap } = require('../../store/map/HomeMap.js');
var LocationInfo = require('../../store/map/LocationInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: [],
    locationInfo: {}
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
    let locationInfo = autoComplete.getLocationInfo();
    this.setData({
      locationInfo: locationInfo
    });
    let self = this;
    autoComplete.getAddressList(locationInfo.fullAddress, locationInfo.city).then((list) => {
      self.setData({
        tips: list
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
  bindInput: function (e) {
    let words = e.detail.value;
    let self = this;
    
    homeMap.getLocation().then((info)=>{
      return autoComplete.getAddressList(words, info.city)
    }).then((list) => {

      self.setData({
        tips: list
      })
    });
    
  },
  bindSelected: function (e) {
    homeMap.selectAddress(e.currentTarget.dataset.address);
    wx.navigateBack({
      delta: 2
    })
    
  },
  bindRedirectTo: function () {
    wx.redirectTo({
      url: '/pages/resetcities/resetcities?backTo=resethomeaddress',
    });
  }
})