// pages/settle/settle.js
var {order} = require('../../store/order/Order.js');
var {shoppingCartContainer} = require('../../store/shoppingCart/ShoppingCartContainer.js');
var {settleMap} = require('../../store/map/SettleMap.js');
var WxPay = require('../../store/order/WxPay.js');
var {userInfo} = require('../../store/user/UserInfo.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        emptyBucketAmount: "",
        settleProductList: [],
        bucketProductList: [],
        shoppingCartList: [],
        useWaterTicketList: [],
        waterTicketTotalUsedMoney: 0,
        waterTicketUseCount: 0,
        totalProductCount: 0,
        totalProductPrice: 0,
        totalPayRmb: 0,
        useXb: 0,
        xbTotalUseMoney: 0,
        receiverInfo: null,
        hasBucketList: false,
        isShowChangeXb: false,
        isShowBucketList: false,
        isShowWaterTicketList: false,
        isCanSelectTicket: true
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


    updateShowProductList() {
        let shoppingCartProductList = [];
        let settleProductList = [];
        let bucketProductList = [];
        if (order.byEmptyBucket) {
            settleProductList = this.settleProductContainer.getExcludeBucketSettleProductList();
            bucketProductList = this.settleProductContainer.getBucketProductList();
            shoppingCartProductList = shoppingCartContainer.getBucketList();
            this.setData({
                hasBucketList: true
            })
        } else {
            settleProductList = this.settleProductContainer.getSettleProductList();
            bucketProductList = [];
            shoppingCartProductList = [];
            this.setData({
                hasBucketList: false
            })
        }
        this.setData({
            settleProductList: settleProductList,
            bucketProductList: bucketProductList,
            shoppingCartProductList: shoppingCartProductList
        });
    },
    updateCalcInfo() {
        this.setData({
            useWaterTicketList: this.useWaterTicketContainer.getUseTicketList(),
            waterTicketTotalUsedMoney: this.useWaterTicketContainer.getTotalUsedMoney(),
            waterTicketUseCount: this.useWaterTicketContainer.getTotalUsed(),
            totalProductCount: this.settleProductContainer.getTotalCount(),
            totalProductPrice: this.settleProductContainer.getTotalPrice(),
            bucketPrice: this.settleProductContainer.getBucketPrice(),
            excludeBucketPrice: this.settleProductContainer.getExcludeBucketPrice(),
            totalPayRmb: order.getTotalPayRmb(),
            useXb: this.xbContainer.getTotalUseMoney(),
            xbTotalUse: this.xbContainer.getCanUseXb(),
            receiverInfo: this.receiverInfo,
        });
    },


    updatePageShowData() {
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

        shoppingCartContainer.syncBucketList(() => {
            this.updatePageShowData();
        }).then(() => {
            return this.xbContainer.getTotalXb()
        }).then((info) => {
            this.xbContainer.totalXb = info.data.xtbMount;
            this.updatePageShowData();
            return userInfo.getEmptyBucket()
        }).then((info) => {
            this.setData({
                emptyBucketAmount: info.data.emptyBucketAmount
            })
        });
        this.setData({
            isCanSelectTicket: !(order.settleType === "useTicketSettle")
        })
        // console.log("==========",order.settleType);

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        order.clearMark();
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
        settleProduct.increase(()=>{order.refreshSettleInfo()});

        let maxUseTicketFlag = !this.data.isCanSelectTicket;
        this.useWaterTicketContainer.refreshTicketUse(settleProduct, maxUseTicketFlag);
        this.updatePageShowData();
    },
    bindRemoveProduct: function (e) {
        let shopId = e.currentTarget.dataset.shopId;
        let productItemId = e.currentTarget.dataset.productId;
        let settleProduct = this.settleProductContainer.findProductById(productItemId);
        settleProduct.reduce(()=>{order.refreshSettleInfo()});

        let maxUseTicketFlag = !this.data.isCanSelectTicket;
        this.useWaterTicketContainer.refreshTicketUse(settleProduct, maxUseTicketFlag);
        this.updatePageShowData();
    },
    bindSetMark: function (e) {
        order.setMark(e.detail.value);
    },
    bindCreateOrder: function (e) {
        let deliveryTime = "9:00-17:00";
        if (this.receiverInfo) {
            let deliveryAddressId = this.receiverInfo.id;
            if (order.getTotalPayRmb() === 0) {
                wx.showModal({
                    content: "是否确认支付？",
                    success: function (res) {
                        if (res.confirm) {
                            order.createOrder(deliveryAddressId, deliveryTime).then((orderInfo) => {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '/pages/orderlist/orderlist?orderType=total',
                                    })
                                }
                            })
                        }
                    },

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
        if (!shoppingCartProduct.hasSelected()) {
            this.settleProductContainer.deleteProduct(productId);
        } else {
            this.settleProductContainer.findOrCreateProduct(shoppingCartProduct);
        }
        let selected = shoppingCartContainer.hasSelected();
        let shoppingCartList = shoppingCartContainer.getList();
        this.updatePageShowData();
    },
    bindShowBucketList: function () {
        this.setData({
            isShowBucketList: true
        })
    },
    bindCloseBucketList: function () {
        this.setData({
            isShowBucketList: false
        })
    },
    bindIncreaseSelectUseCount: function (e) {
        let ticketId = e.currentTarget.dataset.ticketId;
        let waterTicket = this.useWaterTicketContainer.findTicketById(ticketId);
        waterTicket.increase();
        this.updateCalcInfo();
    },
    bindReduceSelectUseCount: function (e) {
        let ticketId = e.currentTarget.dataset.ticketId;
        let waterTicket = this.useWaterTicketContainer.findTicketById(ticketId);
        waterTicket.reduce();
        this.updateCalcInfo();
    },
    bindShowWaterTicketList: function () {
        this.setData({
            isShowWaterTicketList: true
        })
    },
    bindCloseWaterTicketList: function () {
        this.setData({
            isShowWaterTicketList: false
        })
    }
});