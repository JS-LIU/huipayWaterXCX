var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
var { order } = require('../../store/order/Order.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    shopName: "",
    selected: false,
    selectedCount: 0,
    selectedPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shopId = parseInt(options.shopId);
    let shopName = options.shopName
    this.shopShoppingCart = shoppingCartContainer.findShoppingCart(this.shopId);
    let selected = this.shopShoppingCart.hasSelected();
    this.setData({
      productList: this.shopShoppingCart.getProductList(),
      shopName: shopName,
      selected: selected,
      selectedCount: this.shopShoppingCart.getSelectedCount(),
      selectedPrice: this.shopShoppingCart.getSelectedPrice(),
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
  bindNavigateToSettle: function (e) {

    let isShowAddress = false;
    for (let i = 0; i < this.shopShoppingCart.productList.length; i++) {
      if (this.shopShoppingCart.productList[i].productType === "实体商品") {
        isShowAddress = true;
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/settle/settle?isShowAddress=' + isShowAddress + "&isCanCtrlProduct=" + false,
    })
  },
  bindSelectedShopShoppingCart: function (e) {
    this.shopShoppingCart.toggleSelected();
    this.setData({
      productList: this.shopShoppingCart.getProductList(),
      selected: this.shopShoppingCart.selected,
      selectedCount: this.shopShoppingCart.getSelectedCount(),
      selectedPrice: this.shopShoppingCart.getSelectedPrice()
    })
  },
  bindSelectedProductItem: function (e) {
    let productId = e.currentTarget.dataset.productId;

    let shoppingCartProduct = this.shopShoppingCart.findProduct(productId);
    shoppingCartProduct.toggleSelected();
    this.shopShoppingCart.hasSelected();

    this.setData({
      productList: this.shopShoppingCart.getProductList(),
      selected: this.shopShoppingCart.selected,
      selectedCount: this.shopShoppingCart.getSelectedCount(),
      selectedPrice: this.shopShoppingCart.getSelectedPrice()
    })
  },
  bindRemoveProduct: function (e) {
    let productItemId = e.currentTarget.dataset.productId;
    let shoppingCartProduct = this.shopShoppingCart.findProduct(productItemId);
    this.shopShoppingCart.removeProduct(shoppingCartProduct);
    this.setData({
      productList: this.shopShoppingCart.getProductList(),
      selectedCount: this.shopShoppingCart.getSelectedCount(),
      selectedPrice: this.shopShoppingCart.getSelectedPrice(),
      selected: this.shopShoppingCart.hasSelected()
    });
  },
  bindAddProduct: function (e) {
    let productItemId = e.currentTarget.dataset.productId;
    let shoppingCartProduct = this.shopShoppingCart.findProduct(productItemId);
    this.shopShoppingCart.addProduct(shoppingCartProduct);
    this.setData({
      productList: this.shopShoppingCart.getProductList(),
      selectedCount: this.shopShoppingCart.getSelectedCount(),
      selectedPrice: this.shopShoppingCart.getSelectedPrice(),
      selected: this.shopShoppingCart.hasSelected()
    });
  },
  bindNavigateToSettle:function(){
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
  }
})