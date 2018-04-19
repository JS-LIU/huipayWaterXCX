var { huipayRequest } = require('../../store/init.js');
var { homeMap } = require('../../store/map/HomeMap.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
var Shop = require('../../store/shop/Shop.js');
var ShopProduct = require('../../store/product/ShopProduct.js');
var { shopProductList } = require('../../store/shop/ShopProductList.js');
var ShoppingCartProduct = require('../../store/product/ShoppingCartProduct.js');
var { order } = require('../../store/order/Order.js');
// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop:{},
    productList:[],
    shopShoppingCart:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shopId = parseInt(options.shopId);
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
    let self = this;
    Shop.getShopInfo(this.shopId).then((info)=>{
      this.shop = new Shop(info.data);
      self.setData({
        shop: this.shop
      })
      //  获取商品
      return shopProductList.getProductList(this.shopId, "desc", "saleMount");
    }).then((productList) => {

      let shopShoppingCart = shoppingCartContainer.getOrCreateShopShoppingCart({ shopId: this.shop.shopId, shopName: this.shop.name });
      shopShoppingCart.getSelectedCount();
      shopShoppingCart.getTotalCount();
      self.setData({
        productList: productList,
        shopShoppingCart: shopShoppingCart
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
  addToShoppingCart:function(e){
    let productItemId = e.currentTarget.dataset.productItemId;
    let shopInfo = e.currentTarget.dataset.shopInfo;
    let shopProduct = shopProductList.findProductById(productItemId);
    let shoppingCartProduct = shopProduct.convertToShoppingCartProduct(shopInfo);
    shoppingCartContainer.addProduct(shoppingCartProduct,()=>{
      let shopShoppingCart = shoppingCartContainer.findShoppingCart(shopInfo.shopId);
      this.setData({
        shopShoppingCart: shopShoppingCart
      })
    });
  },
  bindNavigatorTo:function(e){
    let shopId = e.currentTarget.dataset.shopInfo.shopId;
    let shopName = e.currentTarget.dataset.shopInfo.name;
    wx.navigateTo({
      url: '/pages/shopshoppingcart/shopshoppingcart?shopId=' + shopId + "&shopName=" + shopName
    })
  },
  bindNavigateToSettle: function () {
    order.getSettleInfo('default', "shopShoppingCartSettle", this.shopId).then(() => {
      wx.navigateTo({
        url: '/pages/settle/settle'
      })
    }).catch((info) => {
      if (info.data.message === "需要用户正式登录") {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    });
  },
  bindCollect:function(){
    this.shop.collection();
    this.setData({
      shop:this.shop
    })
  },
  bindNavigatorToProductDetail: function (e) {
    let productItemId = e.currentTarget.dataset.shopProduct.productItemId;
    let shopId = e.currentTarget.dataset.shopProduct.shopId;
    wx.navigateTo({
      url: '/pages/shopproductdetail/shopproductdetail?productItemId=' + productItemId + "&shopId=" + shopId,
    })
  },
  bindCall: function () {
    wx.makePhoneCall({
      phoneNumber: '4000613229'
    })
  },
  bindNavigateToShopDetail: function(){
    wx.navigateTo({
      url: '/pages/shopdetail/shopdetail?shopId=' + this.shopId,
    })
  }
})