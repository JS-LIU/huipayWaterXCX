var { shopWaterTicketList } = require('../../store/shop/ShopWaterTicketList.js');
var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
var ShoppingCartWaterTicket = require('../../store/product/ShoppingCartWaterTicket.js');
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
    shopWaterTicketList.getWaterTicketlList(1, "desc", "saleMount").then((waterTicketList)=>{
      this.setData({
        waterTicketList: waterTicketList
      })
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
  bindAddToShoppingCart:function(e){
    let waterTicketItemId = e.currentTarget.dataset.productItemId;
    let shopId = e.currentTarget.dataset.shopId;
    let shopWaterTicket = shopWaterTicketList.findWaterTicketById(waterTicketItemId);
    let shoppingCartWaterTicket = shopWaterTicket.convertToShoppingCartWaterTicket({ shopId: shopId });

    shoppingCartContainer.addProduct(shoppingCartWaterTicket).then((shopShoppingCart)=>{
        shopShoppingCart.increaseRequest(shoppingCartWaterTicket);
    });
  }
});