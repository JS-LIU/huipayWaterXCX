var { autoComplete } = require('../../store/map/AutoComplete.js');
var { homeMap } = require('../../store/map/HomeMap.js');
var { customerAddressContainer } = require('../../store/map/CustomerAddressContainer.js');
var { editCustomerAddress } = require('../../store/map/EditCustomerAddress.js');
var { homeResetAddress } = require('../../store/map/HomeResetAddress.js');
var { settleMap } = require('../../store/map/SettleMap.js');
var LocationInfo = require('../../store/map/LocationInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationInfo:{},
    familyAddress:{},
    companyAddress:{},
    currentAddress:{},
    tips:[]
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
    console.log("resetaddressonReady");

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    customerAddressContainer.getCustomerAddressList().then((list)=>{  
      this.familyAddress = customerAddressContainer.getFamilyAddress() || {};
      this.companyAddress = customerAddressContainer.getCompanyAddress() || {};
      this.isLogin = true;
      this.setData({
        companyAddress: this.companyAddress.locationInfo,
        familyAddress: this.familyAddress.locationInfo,
      })           
    }).catch((info)=>{
      if(info.data.message === "需要用户正式登陆"){
        this.isLogin = false;
      }
    })
    homeMap.getCurrentLocation().then((currentAddress)=>{
      this.currentAddress = currentAddress; 
      this.setData({
        currentAddress: this.currentAddress,
        
      });
      let words = currentAddress.fullAddress;
      let city = currentAddress.city;
      return autoComplete.getAddressList(words, city)     
    }).then((list)=>{
      this.setData({
        tips:list
      })
    })
    let locationInfo = homeResetAddress.getLocationInfo();
    this.setData({
      locationInfo: locationInfo,
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

  bindInput:function(e){
    let words = e.detail.value; 
    let self = this;
    let city = autoComplete.getLocationInfo().city;
    
    autoComplete.getAddressList(words, city).then((list)=>{
      let addressList = [];
      for(let i = 0;i < list.length;i++){
        addressList.push(new LocationInfo(list[i]).convertToAddress());
      }
      self.setData({
        tips: addressList
      })
      
    })
  },
  bindSelected:function(e){
    homeMap.selectAddress(e.currentTarget.dataset.address);
    //  跳转回上一个页面
    let backUrl = "/"+getCurrentPages()[getCurrentPages().length-2].route;
    console.log(backUrl);
    wx.switchTab({
      url: backUrl
    })
  },
  bindRedirectTo:function(){
    wx.redirectTo({
      url: '/pages/resetcities/resetcities?backTo=resetaddress',
    });
  },
  bindSetHomeAddress:function(e){
    if (this.isLogin){
      if (customerAddressContainer.getFamilyAddress()) {
        homeMap.selectAddress(customerAddressContainer.getFamilyAddress().locationInfo);
        //  设置结算时的默认地址
        settleMap.setSettleReceiverInfo(customerAddressContainer.getFamilyAddress());
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        editCustomerAddress.setStrategy("create");
        editCustomerAddress.setTagId(3);
        wx.navigateTo({
          url: '/pages/createspecaddress/createspecaddress',
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  bindSetCompanyAddress:function(){
    if (this.isLogin){
      if (customerAddressContainer.getCompanyAddress()) {
        homeMap.selectAddress(customerAddressContainer.getCompanyAddress().locationInfo);
        //  设置结算时的默认地址
        settleMap.setSettleReceiverInfo(customerAddressContainer.getCompanyAddress());
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        editCustomerAddress.setStrategy("create");
        editCustomerAddress.setTagId(2)
        wx.navigateTo({
          url: '/pages/createspecaddress/createspecaddress',
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    
  },
  bindNavigatorLogin:function(){
    
  }
})