var HotSaleShopContainer = require('../../store/shop/HotSaleShopContainer.js');
var { shoppingCartContainer } = require('../../store/shoppingCart/ShoppingCartContainer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSaleProductList:[],
    hotSaleTag:[],
    animationData:{},
    sortType:[],
    isShowPanel:false
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
    this.hotSaleShopContainer = new HotSaleShopContainer();   
    this.setData({
      sortType: this.hotSaleShopContainer.getSortType()
    })
    HotSaleShopContainer.getHotSaleShopList().then((list)=>{      
      let hotSaleProductList = this.hotSaleShopContainer.convertToProductList(list.data);
      this.setData({
        hotSaleProductList: hotSaleProductList
      })
    });
    HotSaleShopContainer.getBrandList().then((info)=>{
      let hotSaleTag = this.hotSaleShopContainer.convertToBrandList(info.data);
      this.setData({
        hotSaleTag: hotSaleTag
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
  bindShowBrandList:function(){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      
    });
    this.animation = animation;
    animation.right("0rpx").step()
    this.setData({
      animationData: animation.export(),
      isShowPanel:true
    });
    
  },
  bindSelectTag: function(e){
    let tagId = e.currentTarget.dataset.tagId;
    let hotSaleTag = this.hotSaleShopContainer.selectedTag(tagId);
    this.setData({
      hotSaleTag: hotSaleTag
    })
  },
  bindConfirm: function(){
    let hotSaleProductList = this.hotSaleShopContainer.getFilterProductList();
    this.animation.right("-690rpx").step();
    this.setData({
      animationData: this.animation.export(),
      hotSaleProductList: hotSaleProductList,
      isShowPanel: false
    })
  },
  bindResetTag: function(){
    let hotSaleTag = this.hotSaleShopContainer.clearSelectTag();
    this.setData({
      hotSaleTag: hotSaleTag
    })
  },
  addToShoppingCart: function(e){
    let productItemId = e.currentTarget.dataset.productItemId;
    let shopId = e.currentTarget.dataset.shopId;
    
    let shopProduct = this.hotSaleShopContainer.findProductById(productItemId);
    let shoppingCartProduct = shopProduct.convertToShoppingCartProduct({shopId:shopId});
    shoppingCartContainer.addProduct(shoppingCartProduct);
  },
  bindSortProductList: function (e){
    let sortStrategy = e.currentTarget.dataset.sortStrategy;
    let productList = e.currentTarget.dataset.productList;
    let hotSaleProductList = this.hotSaleShopContainer.sortProductList(sortStrategy, productList);
    this.setData({
      sortType: this.hotSaleShopContainer.getSortType(),
      hotSaleProductList: hotSaleProductList
    })
  },
  bindNavigatorToProductDetail: function (e) {
    let productItemId = e.currentTarget.dataset.shopProduct.productItemId;
    let shopId = e.currentTarget.dataset.shopProduct.shopId;
    wx.navigateTo({
      url: '/pages/shopproductdetail/shopproductdetail?productItemId=' + productItemId + "&shopId=" + shopId,
    })
  }
})