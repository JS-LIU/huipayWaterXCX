var { huipayRequest } = require('../../store/init.js');
var { homeMap } = require('../../store/map/HomeMap.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var Shop = require('../../store/shop/Shop.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[]
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
    let self = this;
    homeMap.getLocation().then((info) => {
      self.setData({
        addressInfo: info
      })
      let accessInfo = Object.assign({}, { app_key: loginInfo.appKey }, loginInfo.getInfo());
      let postInfo = {
        accessInfo: accessInfo,
        cityName: info.city,
        latitude: info.latitude,
        longtitude: info.longitude
      }
      //  获取店铺列表
      return huipayRequest.resource('/shopList').save({}, postInfo);
    }).then((info) => {
      let shopList = [];
      for(let i = 0 ;i < info.data.length;i++){
        shopList.push(new Shop(info.data[i]));
      }
      self.setData({
        shopList: shopList.sort(function (a, b) {
          return parseFloat(a.distance) - parseFloat(b.distance);
        })
      });
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

  bindNavigateToShop:function(e){
    let shopId = e.currentTarget.dataset.shopId;
    wx.navigateTo({
      url: '/pages/shop/shop?shopId='+shopId
    })
  }
})