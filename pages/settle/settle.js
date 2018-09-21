// pages/settle/settle.js
var {order} = require('../../store/order/Order.js');
var {shoppingCartContainer} = require('../../store/shoppingCart/ShoppingCartContainer.js');
var {settleMap} = require('../../store/map/SettleMap.js');
var WxPay = require('../../store/order/WxPay.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        settleProductList: [],
        bucketProductList: [],
        shoppingCartList:[],
        useWaterTicketList: [],
        waterTicketTotalUsedMoney: 0,
        waterTicketTotalCount: 0,
        totalProductCount: 0,
        totalProductPrice: 0,
        totalPayRmb: 0,
        totalXb: 0,
        xbTotalUseMoney: 0,
        receiverInfo: null,
        isShowChangeXb: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.actionType);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },


    updateShowProductList(){
        let shoppingCartProductList = [];
        let settleProductList = [];
        let bucketProductList = [];
        if(order.byEmptyBucket){
            settleProductList = this.settleProductContainer.getExcludeBucketSettleProductList();
            bucketProductList = this.settleProductContainer.getBucketProductList();

            shoppingCartProductList = shoppingCartContainer.getBucketList();

        }else{
            settleProductList = this.settleProductContainer.getSettleProductList();
            bucketProductList = [];
            shoppingCartProductList = [];
        }
        this.setData({
            settleProductList: settleProductList,
            bucketProductList: bucketProductList,
            shoppingCartProductList: shoppingCartProductList
        });
    },
    updateCalcInfo(){
        this.setData({
            useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
            waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
            waterTicketTotalCount: this.useWaterTicketContainer.getTotalCount(),
            totalProductCount: this.settleProductContainer.getTotalCount(),
            totalProductPrice: this.settleProductContainer.getTotalPrice(),
            totalPayRmb: order.getTotalPayRmb(),
            totalXb: this.xbContainer.totalXb,
            xbTotalUse: this.xbContainer.getCanUseXb(),
            receiverInfo: this.receiverInfo
        });
    },

    updatePageShowData(){
        this.updateShowProductList();
        this.updateCalcInfo();
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.settleProductContainer = order.getSettleProductContainer();
        this.useWaterTicketContainer = order.getUseWaterTicketContainer();
        this.xbContainer = order.getXbContainer();
        this.receiverInfo = settleMap.getSettleReceiverInfo();
        shoppingCartContainer.syncBucketList(()=>{
            this.updatePageShowData();
        }).then(()=>{
            return this.xbContainer.getTotalXb()
        }).then((info)=>{
            this.xbContainer.totalXb = info.data.xtbMount;
            this.updatePageShowData();
        });
        // console.log(this.receiverInfo);
        // this.xbContainer.getTotalXb().then((info) => {
        //
        //
        // })

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
        settleMap.setSettleReceiverInfo(null);
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
    bindAddProduct: function (e) {
        let shopId = e.currentTarget.dataset.shopId;
        let productItemId = e.currentTarget.dataset.productId;
        let settleProduct = this.settleProductContainer.findProductById(productItemId);
        settleProduct.increase();
        // order.refreshSettleInfo();
        console.log('settleProduct:先getsettleproduct:', settleProduct);
        this.useWaterTicketContainer.matchingTicket(settleProduct);
        this.updatePageShowData();
    },
    bindRemoveProduct: function (e) {
        let shopId = e.currentTarget.dataset.shopId;
        let productItemId = e.currentTarget.dataset.productId;
        let settleProduct = this.settleProductContainer.findProductById(productItemId);
        settleProduct.reduce();
        // order.refreshSettleInfo();
        this.useWaterTicketContainer.matchingTicket(settleProduct);
        this.updatePageShowData();
    },
    bindCreateOrder: function (e) {
        let deliveryTime = "9:00-17:00";
        if (this.receiverInfo) {
            let deliveryAddressId = this.receiverInfo.id;
            if (order.getTotalPayRmb() === 0) {
                wx.showModal({
                    content: "是否确认支付？",
                    success: function (res) {
                        console.log(res);
                        if (res.confirm) {
                            order.createOrder(deliveryAddressId, deliveryTime).then((orderInfo) => {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '/pages/orderlist/orderlist?orderType=total',
                                    })
                                }
                            })
                        }
                    }
                })
            } else {
                let wxP = new WxPay();
                wxP.getOpenId(e.detail).then((info) => {
                    order.createOrder(deliveryAddressId, deliveryTime).then((orderInfo) => {
                        wxP.pay(orderInfo, info.data.openId);
                    })
                }).catch(() => {

                })
            }
        } else {
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none'
            });
            setTimeout(() => {
                wx.hideToast();
            }, 500)
        }

    },
    bindReduceXb: function () {
        this.xbContainer.reduceXb();
        this.updatePageShowData();
    },
    bindIncreaseXb: function () {
        this.xbContainer.increaseXb();
        this.updatePageShowData();
    },
    bindShowXbChange: function () {
        this.setData({
            isShowChangeXb: true
        })
    },
    bindCloseXbChange: function () {
        this.setData({
            isShowChangeXb: false
        })
    },
    bindRemoveShoppingCartProduct: function (e) {
        let shopId = e.currentTarget.dataset.shopId;
        let productItemId = e.currentTarget.dataset.productId;
        let shoppingCartProduct = shoppingCartContainer.findShopShoppingCartProduct(shopId, productItemId);
        shoppingCartContainer.removeProduct(shoppingCartProduct, () => {
            let settleProduct = this.settleProductContainer.findOrCreateProduct(shoppingCartProduct);
            settleProduct.remove();
            this.updatePageShowData();
        });
    },
    bindAddShoppingCartProduct: function (e) {
        let shopId = e.currentTarget.dataset.shopId;
        let productItemId = e.currentTarget.dataset.productId;
        let shoppingCartProduct = shoppingCartContainer.findShopShoppingCartProduct(shopId, productItemId);
        shoppingCartContainer.addProduct(shoppingCartProduct, () => {

            let settleProduct = this.settleProductContainer.findOrCreateProduct(shoppingCartProduct);
            settleProduct.add();
            this.updatePageShowData();
        }).then((shopShoppingCart) => {
            shopShoppingCart.increaseRequest(shoppingCartProduct);
        });

    },
    bindSelectedProductItem: function (e) {
        let productId = e.currentTarget.dataset.productId;
        let shopId = e.currentTarget.dataset.shopShoppingCartId;
        let shoppingCartProduct = shoppingCartContainer.findShopShoppingCartProduct(shopId, productId);
        shoppingCartProduct.toggleSelected().selectedRequest();
        if(!shoppingCartProduct.hasSelected()){
            this.settleProductContainer.deleteProduct(productId);
        }else{
            this.settleProductContainer.findOrCreateProduct(shoppingCartProduct);
        }
        let selected = shoppingCartContainer.hasSelected();
        let shoppingCartList = shoppingCartContainer.getList();
        this.updatePageShowData();
    },
})