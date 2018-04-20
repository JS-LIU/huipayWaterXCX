// pages/discoverproductlist/discoverproductlist.js
var { moreGoodProductContainer } = require('../../store/shop/MoreGoodProductContainer.js');
var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:[]
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
    moreGoodProductContainer.getProductList(2, "desc", "saleMount").then((productList)=>{
      console.log(productList)
      this.setData({
        productList: productList
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
  addToShoppingCart: function (e) {
    let productItemId = e.currentTarget.dataset.productItemId;
    let shopInfo = {
      shopId: 2
    };
    let shopProduct = moreGoodProductContainer.findProductById(productItemId);
    let shoppingCartProduct = shopProduct.convertToShoppingCartProduct(shopInfo);
    shoppingCartContainer.addProduct(shoppingCartProduct).then((shopShoppingCart)=>{
        shopShoppingCart.increaseRequest(shoppingCartProduct);
    });

  }
});