var { orderContainer } = require('../../store/order/OrderContainer.js');
var WxPay = require('../../store/order/WxPay.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.orderType = options.orderType; 
    console.log(this.orderType);
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
    orderContainer.getOrderList(this.orderType).then((orderList)=>{
      this.setData({
        orderList: orderList
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
  bindOrderOperate: function (e){
    let orderAction = e.currentTarget.dataset.orderAction;
    let orderId = e.currentTarget.dataset.orderId;
    let order = orderContainer.findOrderItemByOrderId(orderId);
    
    if (orderAction === "pay"){
      let wxP = new WxPay();
      wxP.getOpenId(e.detail).then((info) => {
        order.orderOperation(orderAction)(info.data.openId);
      })
      
    }else{
      order.orderOperation(orderAction)();
    }
    
  },
  bindNavigateToDetail:function(e){
    // let orderId = e.currentTarget.dataset.orderId;
    // wx.navigateTo({
    //   url: '/pages/orderdetail/orderdetail?orderId=' + orderId,
    // })
  }
})