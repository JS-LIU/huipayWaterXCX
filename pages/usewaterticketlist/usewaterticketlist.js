var { order } = require('../../store/order/Order.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waterTicketList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.useWaterTicketContainer = order.getUseWaterTicketContainer();
    this.setData({
      waterTicketList: this.useWaterTicketContainer.getUseTicketList()
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
  bindIncreaseSelectUseCount:function(e){
    let ticketId = e.currentTarget.dataset.ticketId;
    let waterTicket = this.useWaterTicketContainer.findTicketById(ticketId);
    waterTicket.increase();
    this.setData({
      waterTicketList: this.useWaterTicketContainer.getUseTicketList()
    })
  },
  bindReduceSelectUseCount: function (e){
    let ticketId = e.currentTarget.dataset.ticketId;
    let waterTicket = this.useWaterTicketContainer.findTicketById(ticketId);
    waterTicket.reduce();
    console.log(this.useWaterTicketContainer.getUseTicketList());
    this.setData({
      waterTicketList: this.useWaterTicketContainer.getUseTicketList()
    })
  }
})