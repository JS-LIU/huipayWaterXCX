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
    totalXb:0,
    xbTotalUseMoney:0,
    receiverInfo:null,
    isShowChangeXb:false
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
    this.xbContainer = order.getXbContainer();
    this.receiverInfo = settleMap.getSettleReceiverInfo();
    console.log(this.receiverInfo);
    this.xbContainer.getTotalXb().then((info)=>{
      this.xbContainer.totalXb = info.data.xtbMount;
      this.setData({
        settleProductList: this.settleProductContainer.getSettleProductList(),
        useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
        waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
        waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
        totalProductCount: this.settleProductContainer.getTotalCount(),
        totalProductPrice: this.settleProductContainer.getTotalPrice(),
        totalPayRmb: order.getTotalPayRmb(),
        totalXb: this.xbContainer.totalXb,
        xbTotalUse: this.xbContainer.getCanUseXb(),
        receiverInfo: this.receiverInfo
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
    order.getSettleInfo('default');
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
    order.getSettleInfo('default');
    this.useWaterTicketContainer.matchingTicket(settleProduct);
    this.setData({
      settleProductList: this.settleProductContainer.getSettleProductList(),
      useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
      waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
      waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
      totalProductCount: this.settleProductContainer.getTotalCount(),
      totalProductPrice: this.settleProductContainer.getTotalPrice(),
      xbTotalUse: this.xbContainer.getCanUseXb(),
      totalPayRmb: order.getTotalPayRmb()
    })    
  },
  bindCreateOrder:function(e){
    let deliveryTime = "9:00-17:00";
    if (this.receiverInfo){
      let deliveryAddressId = this.receiverInfo.id;
      if (order.getTotalPayRmb() === 0) {
        wx.showModal({
          content: "是否确认支付？",
          success: function (res) {
            console.log(res);
            order.createOrder(deliveryAddressId, deliveryTime).then((orderInfo) => {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/orderlist/orderlist?orderType=total',
                })
              }
            })
          }
        })
      } else {
        order.createOrder(deliveryAddressId, deliveryTime).then((orderInfo) => {
          let wxP = new WxPay(orderInfo);
          wxP.pay(e.detail);
        })
      }
    }else{
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      });
      setTimeOut(() => {
        wx.hideToast();
      }, 300)
    }
      
    
    
    // order.createOrder(deliveryAddressId, deliveryTime).then((orderInfo)=>{
    //   shoppingCartContainer.getShoppingCartContainer();
    //   if (orderInfo.totalPrice === 0){
        
        
    //   }else{
        
    //   }
    // });
  },
  bindReduceXb:function(){
    this.xbContainer.reduceXb();
    this.setData({
      settleProductList: this.settleProductContainer.getSettleProductList(),
      useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
      waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
      waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
      totalProductCount: this.settleProductContainer.getTotalCount(),
      totalProductPrice: this.settleProductContainer.getTotalPrice(),
      totalPayRmb: order.getTotalPayRmb(),
      xbTotalUse: this.xbContainer.getCanUseXb(),
    })    
  },
  bindIncreaseXb: function () {
    this.xbContainer.increaseXb();
    this.setData({
      settleProductList: this.settleProductContainer.getSettleProductList(),
      useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
      waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
      waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
      totalProductCount: this.settleProductContainer.getTotalCount(),
      totalProductPrice: this.settleProductContainer.getTotalPrice(),
      totalPayRmb: order.getTotalPayRmb(),
      xbTotalUse: this.xbContainer.getCanUseXb(),
    })
  },
  bindShowXbChange:function(){
    this.setData({
      isShowChangeXb: true
    })
  },
  bindCloseXbChange:function(){
    this.setData({
      isShowChangeXb: false
    })
  }
})