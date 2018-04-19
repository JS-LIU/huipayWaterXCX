var { customerMap } = require('../../store/map/CustomerMap.js');
var { autoComplete } = require('../../store/map/AutoComplete.js');
var { editCustomerAddress } = require('../../store/map/EditCustomerAddress.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationInfo:{},
    nearAddressList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    customerMap.shopMap('customer_map');
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
    let locationInfo = customerMap.getShowLocationInfo();
    autoComplete.setShowLocation(locationInfo);
    this.setData({
        locationInfo: locationInfo
      });
    autoComplete.getAddressList(locationInfo.fullAddress, locationInfo.city).then((nearAddressList) => {
      this.setData({
        nearAddressList: nearAddressList
      })
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
  bindMoveMap:function(e){
    let self = this;
    if(e.type === "end"){
      customerMap.getCenterLocationInfo().then((locationInfo)=>{
        customerMap.setShowLocationInfo(locationInfo);
        self.setData({
          locationInfo: locationInfo
        })
        autoComplete.setShowLocation(locationInfo);
        return autoComplete.getAddressList(locationInfo.fullAddress, locationInfo.city);
      }).then((nearAddressList)=>{
        this.setData({
          nearAddressList: nearAddressList
        })
      })
    }

  },
  bindRedirectTo:function(){
    wx.redirectTo({
      url: '/pages/resetcities/resetcities?backTo=receiveaddressmap',
    })
  },
  bindSelected:function(e){
    editCustomerAddress.setSelectedLocationInfo(e.currentTarget.dataset.address); 
    wx.navigateBack({
      delta:1
    })
  }
})