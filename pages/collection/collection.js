// pages/collection/collection.js
var { collectionContainer } = require('../../store/shop/CollectionContainer.js');
var { shopProductList } = require('../../store/shop/ShopProductList.js');
var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowProductList: true,
    isShowShopList: false,
    productContainer:{},
    shopContainer:{}
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
    collectionContainer.getProudctList().then((productList)=>{
      this.setData({
        productList: productList
      })
    });
    collectionContainer.getShopList().then((shopList) => {
      this.setData({
        shopList: shopList 
      })
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
  bindGetShopCollectList: function(){
    this.setData({
      isShowProductList: false,
      isShowShopList: true
    })
  },
  bindGetProductCollectList:function(){
    this.setData({
      isShowProductList: true,
      isShowShopList: false
    })
  },
  addToShoppingCart: function (e){
    let productItemId = e.currentTarget.dataset.product.productItemId;
    let shopInfo = {
      shopId: e.currentTarget.dataset.product.shopId
    }
    let shopProduct = shopProductList.findProductById(productItemId);
    let shoppingCartProduct = shopProduct.convertToShoppingCartProduct(shopInfo);
    shoppingCartContainer.addProduct(shoppingCartProduct, () => {
      let shopShoppingCart = shoppingCartContainer.findShoppingCart(shopInfo.shopId);
      this.setData({
        shopShoppingCart: shopShoppingCart
      })
    });
  },
  bindNavigateToShop: function (e){
    let shopId = e.currentTarget.dataset.shopId;
    console.log(shopId)
    wx.navigateTo({
      url: '/pages/shop/shop?shopId=' + shopId
    })
  },
  bindNavigateToProduct: function (e){
    let productItemId = e.currentTarget.dataset.productItemId;
    let shopId = e.currentTarget.dataset.shopId;
    wx.navigateTo({
      url: '/pages/shopproductdetail/shopproductdetail?productItemId=' + productItemId + "&shopId=" + shopId,
    })
  }
})