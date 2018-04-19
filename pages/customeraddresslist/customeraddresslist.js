var { editCustomerAddress } = require('../../store/map/EditCustomerAddress.js');
var { customerAddressContainer } = require('../../store/map/CustomerAddressContainer.js');
var { tagContainer } = require('../../store/map/TagContainer.js');
var { homeMap } = require('../../store/map/HomeMap.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
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
    customerAddressContainer.getCustomerAddressList().then((list)=>{
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
  bindcreateaddress: function(){
    editCustomerAddress.setStrategy("create");
    editCustomerAddress.setName("");
    editCustomerAddress.setPhoneNum("");
    homeMap.getLocation().then((locationInfo)=>{
      editCustomerAddress.setSelectedLocationInfo(locationInfo);
      wx.navigateTo({
        url: '/pages/createaddress/createaddress'
      })
    })
    editCustomerAddress.setPaddingAddress("");
    editCustomerAddress.setTagId("");
  },
  bindDeleteAddress: function(e){ 
    let addressList = customerAddressContainer.deleteAddress(e.currentTarget.dataset.addressId);
    this.setData({
      addressList: addressList
    })
  },
  bindEditAddress: function(e){  
    let addressInfo = e.currentTarget.dataset.addressInfo;
    editCustomerAddress.setStrategy("updata");
    editCustomerAddress.setName(addressInfo.name);
    editCustomerAddress.setPhoneNum(addressInfo.phoneNum);
    editCustomerAddress.setSelectedLocationInfo(addressInfo.locationInfo);
    editCustomerAddress.setPaddingAddress(addressInfo.appendingAddress);
    editCustomerAddress.setTagId(tagContainer.convertToId(addressInfo.addressTagName));
    editCustomerAddress.setId(addressInfo.id);
    wx.navigateTo({
      url: '/pages/createaddress/createaddress',
    })
  },
  bindSetDefault: function(e){
    let addressId = e.currentTarget.dataset.addressId;
    let list = customerAddressContainer.setDefault(addressId);
    console.log(list);
    this.setData({
      addressList: list
    })
  }
})