var {homeMap} = require('../../store/map/HomeMap.js');
var {loginInfo} = require('../../store/login/LoginInfo.js');
var {login} = require('../../store/login/Login.js');
var {huipayRequest} = require('../../store/init.js');
var {shoppingCartContainer} = require('../../store/shoppingCart/ShoppingCartContainer.js');
var {customerAddressContainer} = require('../../store/map/CustomerAddressContainer.js');
var {editCustomerAddress} = require('../../store/map/EditCustomerAddress.js');
var {autoComplete} = require('../../store/map/AutoComplete.js');
var {homeResetAddress} = require('../../store/map/HomeResetAddress.js');
var {guessLikeList} = require('../../store/shop/GuessLikeList.js');
var {activityList} = require('../../store/activity/ActivityList.js')
var NewCustomerWaterTicketActive = require('../../store/activity/NewCustomerWaterTicketActive.js');
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

        wx.getStorage({
            key: "loginInfo",
            success: function (res) {
                var localLoginInfo = res.data;
                loginInfo.setInfo(localLoginInfo);
                login.trigger("login");
            },
            fail: function () {
                //  登录游客
                login.touristLogin().then((info) => {
                    loginInfo.setInfo(info.data);
                    login.trigger("login");
                })
            }
        });
        
        //  获取首页轮播图
        login.listen('login', function () {
            console.log('=========', loginInfo.getInfo());
            let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
            console.log(accessInfo);
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
        login.listen('login', function () {
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
      login.listen('login', function () {
        console.log("getActivities")
        activityList.getActivities().then((activities) => {
          console.log("activities==========",activities);
          self.setData(activities)
        })
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log("onReady");
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        // console.log('onshow')
        let self = this;

        homeMap.getLocation().then((data) => {
            self.setData({
                addressInfo: data
            })
            editCustomerAddress.setSelectedLocationInfo(data);
            autoComplete.setShowLocation(data);
            homeResetAddress.setLocationInfo(data);
        });
        
        login.listen('login', function () {
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

    let newCustomerWaterTicketActive = activityList.activities.newCustomerWaterTicketActive;
    
    newCustomerWaterTicketActive.closeActive();
    this.setData({
      newCustomerWaterTicketActive: newCustomerWaterTicketActive
    })
  },
  bindReceiveWaterTicket:function(){
    let newCustomerWaterTicketActive = activityList.activities.newCustomerWaterTicketActive;

    newCustomerWaterTicketActive.acceptActivityWaterTicket().then((accecptInfo)=>{
      wx.navigateTo({
        url: '/pages/mywaterticketlist/mywaterticketlist',
      })
      newCustomerWaterTicketActive.closeActive();
    }).catch((err)=>{
      if (err.data.message === "需要用户正式登录"){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    });
  }
});  