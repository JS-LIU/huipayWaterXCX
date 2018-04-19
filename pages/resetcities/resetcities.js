var { cities } = require('../../store/map/Cities.js');
var { homeMap } = require('../../store/map/HomeMap.js');
var { customerMap } = require('../../store/map/CustomerMap.js'); 
var { autoComplete } = require('../../store/map/AutoComplete.js');
var { homeResetAddress } = require('../../store/map/HomeResetAddress.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.backTo = options.backTo;
    let self = this;
    cities.getCities().then((citiesData) => {
      let WXcities = cities.convertToWXList(citiesData);
      console.log(WXcities);
      self.setData({
        cities: WXcities
      });
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
  bindSelectedCity:function(e){
    let city = e.currentTarget.dataset.city;
    if (this.backTo === "resetaddress"){
      cities.convertToLocationInfo(city).then((locationInfo)=>{
        autoComplete.setShowLocation(locationInfo);
        //  设置resetaddress页面的地址
        homeResetAddress.setLocationInfo(locationInfo);

        wx.redirectTo({
          url: '/pages/resetaddress/resetaddress',
        })
      })
      
    }
    if (this.backTo === "resetcreateaddress") {
      cities.convertToLocationInfo(city).then((locationInfo) => {
        autoComplete.setShowLocation(locationInfo);
        wx.redirectTo({
          url: '/pages/resetcreateaddress/resetcreateaddress',
        })
      });
    }
    if (this.backTo === "resethomeaddress"){
      cities.convertToLocationInfo(city).then((locationInfo) => {
        autoComplete.setShowLocation(locationInfo);
        wx.redirectTo({
          url: '/pages/resethomeaddress/resethomeaddress',
        })
      });
    }
    if (this.backTo === "receiveaddressmap"){
      customerMap.convertToLocationInfo(city).then((locationInfo)=>{
        customerMap.setShowLocationInfo(locationInfo);
        wx.redirectTo({
          url: '/pages/receiveaddressmap/receiveaddressmap',
        })
      });
    }
    

    console.log(e.currentTarget.dataset.city);
    
  }
})