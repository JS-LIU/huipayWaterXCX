var {homeMap} = require('../../store/map/HomeMap.js');
var {loginInfo} = require('../../store/login/LoginInfo.js');
var {login} = require('../../store/login/Login.js');
var Logger = require('../../store/login/Logger.js');
var {huipayRequest} = require('../../store/init.js');
var {shoppingCartContainer} = require('../../store/shoppingCart/ShoppingCartContainer.js');
var {customerAddressContainer} = require('../../store/map/CustomerAddressContainer.js');
var {editCustomerAddress} = require('../../store/map/EditCustomerAddress.js');
var {autoComplete} = require('../../store/map/AutoComplete.js');
var {homeResetAddress} = require('../../store/map/HomeResetAddress.js');
var {guessLikeList} = require('../../store/shop/GuessLikeList.js');
var {activityList} = require('../../store/activity/ActivityList.js');
var InviteCustomerWaterTicketActive = require('../../store/activity/InviteCustomerWaterTicketActive.js');
var HB = require("../../libs/HB.js");
// var ShopProduct = require('../../store/product/ShopProduct.js');
// var ShoppingCartProduct = require('../../store/product/ShoppingCartProduct.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressInfo: {
            fullAddress: "正在定位",
            latitude: "",
            longitude: ""
        },
        productList: [],
        cPic: [],
        hotSale: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let self = this;
      self.logger = new Logger();
      let baseUrl = "https://huipay.com/huibeiwater/index/index";
      console.log('========options:',options);
      let url = HB.scanUrl.getUrl(options.q, baseUrl);
      self.activityId = HB.scanUrl.getQueryString(url, baseUrl, "activityId") || options.activityId;
      self.inviteId = HB.scanUrl.getQueryString(url, baseUrl, "inviteId") || options.inviteId;
      self.type = HB.scanUrl.getQueryString(url, baseUrl, "type") || options.type;
        wx.getStorage({
            key: "loginInfo",
            success: function (res) {
                var localLoginInfo = res.data;
                loginInfo.setInfo(localLoginInfo);
              self.logger.trigger("login");
            },
            fail: function () {
                //  登录游客
                login.touristLogin().then((info) => {
                    loginInfo.setInfo(info.data);
                  self.logger.trigger("login");
                })
            }
        });
        
        //  获取首页轮播图
      self.logger.listen('login', function () {
            let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
            let postInfo = {
                type: "banner",
                accessInfo: accessInfo
            }
            huipayRequest.resource('/banner').save({}, postInfo).then((imgList) => {
                self.setData({
                    cPic: imgList.data
                })
            });
        });
        //  获取首页热卖图
      self.logger.listen('login', function () {
            let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
            let postInfo = {
                type: "hotSale",
                accessInfo: accessInfo
            }
            huipayRequest.resource('/banner').save({}, postInfo).then((imgList) => {
                self.setData({
                    hotSale: imgList.data[0]
                })
            });
        })
      //  获取活动
      self.logger.listen('login', function () {
        activityList.getActivities(self.activityId,self.inviteId).then((activities) => {
          console.log(activities)
          if (activities.scanWaterTicketActive || (activities.inviteCustomerWaterTicketActive && activities.inviteCustomerWaterTicketActive.inviteId)){
            
            wx.navigateTo({
              url: '/pages/receivewaterticketactive/receivewaterticketactive'
            })
          }
          self.setData(activities);
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

        let self = this;

        homeMap.getLocation().then((data) => {
            self.setData({
                addressInfo: data
            })
            editCustomerAddress.setSelectedLocationInfo(data);
            autoComplete.setShowLocation(data);
            homeResetAddress.setLocationInfo(data);
        });
        
      self.logger.listen('login', function () {
            guessLikeList.getProductList().then((productList) => {
                self.setData({
                    productList: productList
                })
            });

            //  预加载
            shoppingCartContainer.getShoppingCartContainer();
            customerAddressContainer.getCustomerAddressList();
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
            shopId: 1
        };
        let shopProduct = guessLikeList.findProductById(productItemId);
        let shoppingCartProduct = shopProduct.convertToShoppingCartProduct(shopInfo);
        shoppingCartContainer.addProduct(shoppingCartProduct).then((shopShoppingCart) => {
            shopShoppingCart.increaseRequest(shoppingCartProduct);
        });
    },
    bindNavigatorToProductDetail: function (e) {
        let productItemId = e.currentTarget.dataset.shopProduct.productItemId;
        let shopId = e.currentTarget.dataset.shopProduct.shopId;
        wx.navigateTo({
            url: '/pages/shopproductdetail/shopproductdetail?productItemId=' + productItemId + "&shopId=" + shopId,
        })
    },
  bindCloseReceiveTicket:function(e){

    let inviteCustomerWaterTicketActive = activityList.activities.inviteCustomerWaterTicketActive;
    
    inviteCustomerWaterTicketActive.closeActive();
    this.setData({
      inviteCustomerWaterTicketActive: inviteCustomerWaterTicketActive
    })
  },
  bindReceiveWaterTicket:function(){
    let inviteCustomerWaterTicketActive = activityList.activities.inviteCustomerWaterTicketActive;

    inviteCustomerWaterTicketActive.acceptActivityWaterTicket().then((accecptInfo)=>{
      wx.navigateTo({
        url: '/pages/mywaterticketlist/mywaterticketlist',
      })
      inviteCustomerWaterTicketActive.closeActive();
    }).catch((err)=>{
      if (err.data.message === "需要用户正式登录"){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    });
  }
});  