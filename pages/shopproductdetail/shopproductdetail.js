var { huipayRequest } = require('../../store/init.js');
var { loginInfo } = require('../../store/login/LoginInfo.js');
var { shopProductList } = require('../../store/shop/ShopProductList.js');
var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
var { order } = require('../../store/order/Order.js');
var ShopProductDetail = require('../../store/product/ShopProductDetail.js');
var Shop = require('../../store/shop/Shop.js');
var ShoppingCartProduct = require('../../store/product/ShoppingCartProduct.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    waterTicketList:[],
    commentList:[],
    commentCount: 0,
    shop:{},
    recommentList:[],
    shoppingCartProductCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.productItemId = parseInt(options.productItemId);
    this.shopId = parseInt(options.shopId);
    
    ShopProductDetail.getDetail(this.productItemId, this.shopId).then((info)=>{
      
      let shopProductDetail = new ShopProductDetail(this.productItemId, this.shopId);
      let productModel = info.data.productModel;
      let commonModels = info.data.commonModels;
      this.product = shopProductDetail.getProduct(productModel);
      let commentList = shopProductDetail.getIncompleteList(commonModels);
      this.setData({
        product: this.product,
        commentList: commentList,
        commentCount: commentList.length
      });
      
      if (productModel.ticketProductItemId) {
        
        return this.product.getSelfWaterTicketList();
      }
    }).then((waterTicketList)=>{
      console.log(waterTicketList);
      this.setData({
        waterTicketList: waterTicketList
      })
    }).catch(()=>{

    })
    Shop.getShopInfo(this.shopId).then((info)=>{
      let shopInfo = info.data;
      let shop = new Shop(shopInfo);
      this.setData({
        shop: shop
      })
    });
    shopProductList.getProductList(this.shopId, "desc", "saleMount").then((productList)=>{
      let recommentList = shopProductList.getRecommentList(this.productItemId);
      this.setData({
        recommentList: recommentList
      })
    });
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
    this.setData({
      shoppingCartProductCount: shoppingCartContainer.getTotalCount()
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
  bindNavigateToWaterTicketDetail:function(e){
    let productItemId = e.currentTarget.dataset.waterTicket.productItemId;
    let shopId = e.currentTarget.dataset.waterTicket.shopId;
    wx.navigateTo({
      url: '/pages/shopproductdetail/shopproductdetail?productItemId=' + productItemId + "&shopId=" + shopId,
    })
  },
  bindShopNow: function (e){
    let productInfo = Object.assign({}, e.currentTarget.dataset.shopProduct, { hasSelected:true});
    let shopInfo = e.currentTarget.dataset.shopInfo;

    let shoppingCartProduct = new ShoppingCartProduct(productInfo, shopInfo);
    order.getSettleInfo('default', 'shopNowSettle', shoppingCartProduct).then(()=>{
      wx.navigateTo({
        url: '/pages/settle/settle'
      })
    }).catch((info) => {
      console.log(info);
      if (info.data.message === "需要用户正式登录") {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    });
  },
  bindCollectProduct:function(){
    this.product.collection();
    this.setData({
      product: this.product
    })
  },
  addToShoppingCart: function (e) {
    let productItemId = e.currentTarget.dataset.productItemId;
    let shopInfo = e.currentTarget.dataset.shopInfo;
    let shopProduct = shopProductList.findProductById(productItemId);
    let shoppingCartProduct = shopProduct.convertToShoppingCartProduct(shopInfo);
    shoppingCartContainer.addProduct(shoppingCartProduct, () => {
      this.setData({
        shoppingCartProductCount: shoppingCartContainer.getTotalCount()
      });
    }).then((shopShoppingCart)=>{
        shopShoppingCart.increaseRequest(shoppingCartProduct);
    });
  },
  bindNavigateToShop: function (e){
    let shopId = e.currentTarget.dataset.shopId;
    console.log(shopId)
    wx.navigateTo({
      url: '/pages/shop/shop?shopId=' + shopId
    })
  }, 
  bindNavigateToProductDetail: function (e){
    let productItemId = e.currentTarget.dataset.productItemId;
    let shopId = e.currentTarget.dataset.shopId;
    wx.navigateTo({
      url: '/pages/shopproductdetail/shopproductdetail?productItemId=' + productItemId + "&shopId=" + shopId,
    })
  },
  bindCall:function(){
    wx.makePhoneCall({
      phoneNumber: '4000613229'
    })
  }
})