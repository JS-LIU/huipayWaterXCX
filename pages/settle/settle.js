// pages/settle/settle.js
var { order } = require('../../store/order/Order.js');
var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
var { settleMap } = require('../../store/map/SettleMap.js');
var WxPay = require('../../store/order/WxPay.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settleProductList:[],
    useWaterTicketList: [],
    waterTicketTotalUsedMoney: 0,
    waterTicketTotalCount: 0,
    totalProductCount:0,
    totalProductPrice:0,
    totalPayRmb:0,
    receiverInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.actionType);
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
    this.settleProductContainer = order.getSettleProductContainer();
    this.useWaterTicketContainer = order.getUseWaterTicketContainer();
    this.receiverInfo = settleMap.getSettleReceiverInfo();
    console.log(this.receiverInfo);
    this.setData({
      settleProductList: this.settleProductContainer.getSettleProductList(),
      useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
      waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
      waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
      totalProductCount: this.settleProductContainer.getTotalCount(),
      totalProductPrice: this.settleProductContainer.getTotalPrice(),
      totalPayRmb: order.getTotalPayRmb(),
      receiverInfo: this.receiverInfo
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
    settleMap.setSettleReceiverInfo(null);
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
  bindAddProduct: function (e){
    console.log(productItemId);
    let shopId = e.currentTarget.dataset.shopId;
    let productItemId = e.currentTarget.dataset.productId;
    let settleProduct = this.settleProductContainer.findProductById(productItemId);
    settleProduct.increase();
    console.log('settleProduct:先getsettleproduct:',settleProduct);
    this.useWaterTicketContainer.matchingTicket(settleProduct);
    this.setData({
      settleProductList: this.settleProductContainer.getSettleProductList(),
      useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
      waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
      waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
      totalProductCount: this.settleProductContainer.getTotalCount(),
      totalProductPrice: this.settleProductContainer.getTotalPrice(),
      totalPayRmb: order.getTotalPayRmb()
    })    
  },
  bindRemoveProduct: function (e){
    let shopId = e.currentTarget.dataset.shopId;
    let productItemId = e.currentTarget.dataset.productId;
    let settleProduct = this.settleProductContainer.findProductById(productItemId);
    settleProduct.reduce();
    this.useWaterTicketContainer.matchingTicket(settleProduct);
    this.setData({
      settleProductList: this.settleProductContainer.getSettleProductList(),
      useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
      waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
      waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
      totalProductCount: this.settleProductContainer.getTotalCount(),
      totalProductPrice: this.settleProductContainer.getTotalPrice(),
      totalPayRmb: order.getTotalPayRmb()
    })    
  },
  bindCreateOrder:function(){
    let deliveryAddressId = this.receiverInfo.id;
    let deliveryTime = "9:00-17:00";
    order.createOrder(deliveryAddressId, deliveryTime).then((orderInfo)=>{
      shoppingCartContainer.getShoppingCartContainer();
      if (orderInfo.totalPrice === 0){ 
        wx.redirectTo({
          url: '/pages/orderlist/orderlist?orderType=total',
        })
      }else{
        let wxP = new WxPay(orderInfo);
        wxP.pay(orderInfo);
      }
    });  
  }
})