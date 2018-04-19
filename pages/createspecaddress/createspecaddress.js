var { editCustomerAddress } = require('../../store/map/EditCustomerAddress.js');
var { customerMap } = require('../../store/map/CustomerMap.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationInfo: {},
    name: "",
    phoneNum: "",
    paddingAddress: ""
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
    let locationInfo = editCustomerAddress.getLocation();
    customerMap.setShowLocationInfo(locationInfo);
    this.setData({
      locationInfo: locationInfo,
      name: editCustomerAddress.getName(),
      phoneNum: editCustomerAddress.getPhoneNum(),
      paddingAddress: editCustomerAddress.getPaddingAddress()
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
  bindSaveAddress: function () {
    editCustomerAddress.createAddress(editCustomerAddress.getId()).then((info) => {
      console.log(info);
      wx.navigateBack({
        delta: "1"
      });
    })
  },
  bindSetName: function (e) {
    console.log(e.detail.value)
    editCustomerAddress.setName(e.detail.value)
  },
  bindSetPhoneNum: function (e) {
    editCustomerAddress.setPhoneNum(e.detail.value)
  },
  bindSetPaddingAddress: function (e) {
    editCustomerAddress.setPaddingAddress(e.detail.value)
  },
})