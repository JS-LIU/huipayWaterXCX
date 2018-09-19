var { settleMap } = require('../../store/map/SettleMap.js');
var { customerAddressContainer } = require('../../store/map/CustomerAddressContainer.js');
var { editCustomerAddress } = require('../../store/map/EditCustomerAddress.js');
var { homeMap } = require('../../store/map/HomeMap.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
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
    customerAddressContainer.getCustomerAddressList().then((list) => {
      this.setData({
        addressList: list
      })
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
  bindSetSettleReceiverInfo: function (e) {
    console.log(e.currentTarget.dataset.receiverInfo);
    settleMap.setSettleReceiverInfo(e.currentTarget.dataset.receiverInfo);
    wx.navigateBack({
      delta: 1
    })
  },
  bindcreateaddress: function () {
    editCustomerAddress.setStrategy("create");
    // editCustomerAddress.setStrategy("create");
    editCustomerAddress.setName("");
    editCustomerAddress.setPhoneNum("");
    homeMap.getLocation().then((locationInfo) => {
      editCustomerAddress.setSelectedLocationInfo(locationInfo);
      wx.navigateTo({
        url: '/pages/createaddress/createaddress'
      })
    })
    editCustomerAddress.setPaddingAddress("");
    editCustomerAddress.setTagId("");
  }
})