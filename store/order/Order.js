var {huipayRequest} = require('../init.js');
var {loginInfo} = require('../login/LoginInfo.js');
var SettleProductContainer = require('../order/SettleProductContainer.js');
var UseWaterTicketContainer = require('../product/UseWaterTicketContainer.js');
var {shoppingCartContainer} = require('../shoppingCart/ShoppingCartContainer.js');
var ShoppingCartProduct = require('../product/ShoppingCartProduct.js')

class Order {
    constructor() {
        this.settleType;
        this.settleParam;
        this.settleProductContainer = null;
        this.useWaterTicketContainer = null;
        this.orderInfo = null;
        let self = this;
        this.strategies = {
            /**
             * 购物车结算
             * @param actionType
             * @returns {Promise<Order>}
             */
            'cartSettle': function (actionType) {
                self._setSettleParam({});
                return new Promise((resolve, reject) => {

                    self._getSettleInfo(actionType).then((settle) => {
                        console.log('=====', settle.data);
                        self._setContainer(settle.data);
                        resolve(self);
                    }).catch((info) => {
                        reject(info);
                    });
                })
            },
            /**
             * 立即购买
             * @param actionType
             * @param shoppingCartProduct
             * @returns {Promise<Order>}
             */
            'shopNowSettle': function (actionType, shoppingCartProduct) {
                let productItemId = shoppingCartProduct.productItemId;
                let shopId = shoppingCartProduct.shopInfo.shopId;
                self._setSettleParam({productItemId: productItemId});
                return new Promise((resolve, reject) => {
                    //  如果购物车中没有该商品加入购物车结算否则结算购物车中的该商品
                    if (!shoppingCartContainer.findProudctByProductItemId(productItemId)) {
                        shoppingCartContainer.addProduct(shoppingCartProduct);
                    }
                    self._getSettleInfo(actionType).then((settle) => {
                        self._setContainer(settle.data);
                        resolve(self);
                    }).catch((info) => {
                        reject(info);
                    });

                })
            },
            "shopShoppingCartSettle": function (actionType, shopId) {
                self._setSettleParam({shopId: shopId});
                return new Promise((resolve, reject) => {
                    self._getSettleInfo(actionType).then((settle) => {
                        self._setContainer(settle.data);
                        resolve(self);
                    }).catch((info) => {
                        reject(info);
                    });
                })
            },
            /**
             * 使用水票购买
             * @param actionType
             * @param userTicketId
             * @returns {Promise<Order>}
             */
            'useTicketSettle': function (actionType, userTicketId) {
                self._setSettleParam({userTicketId: userTicketId});
                return new Promise((resolve, reject) => {
                    self._getSettleInfo(actionType).then((settle) => {
                        self._setContainer(settle.data);
                        let productInfo = settle.data.orderProductInfo.productItemModels[0];

                        let productItemId = productInfo.productItemId;
                        if (!shoppingCartContainer.findProudctByProductItemId(productItemId)) {
                            let shoppingCartProduct = new ShoppingCartProduct(productInfo, {
                                shopName: settle.data.shopName,
                                shopId: settle.data.shopId
                            });
                            shoppingCartContainer.addProduct(shoppingCartProduct);
                        }
                        resolve(self);
                    }).catch((info) => {
                        reject(info);
                    });
                })
            }
        }
    }

    //  设置结算类型（购物车结算，立即购买，水票购买）
    _setSettleType(settleType) {
        this.settleType = settleType;
    }

    //  设置结算参数（obj:{}|{shopId:shopId}|{productItemId:productItemId}|{userTicketId:userTicketId}）
    _setSettleParam(settleParam) {
        this.settleParam = settleParam;
    }

    //  获取结算信息
    _getSettleInfo(actionType) {
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        let postInfo = Object.assign({accessInfo, accessInfo}, this.settleParam);
        return huipayRequest.resource('/order/confirmOrderInfo/:actionType').save({actionType: actionType}, postInfo)
    }

    //  给【结算商品】、【使用水票】赋值
    _setContainer(settle) {
        let orderProductInfo = settle.orderProductInfo;
        let orderTicketInfo = settle.orderTicketInfo;
        this._matching(orderTicketInfo, orderProductInfo);

        this.settleProductContainer = new SettleProductContainer(orderProductInfo);
        this.useWaterTicketContainer = new UseWaterTicketContainer(orderTicketInfo);
    }

    _matching(orderTicketInfo, orderProductInfo) {
        for (let i = 0; i < orderTicketInfo.userTicketModels.length; i++) {
            for (let j = 0; j < orderProductInfo.productItemModels.length; j++) {
                if (orderTicketInfo.userTicketModels[i].productItemId === orderProductInfo.productItemModels[j].productItemId) {
                    orderTicketInfo.userTicketModels[i].currentPrice = orderProductInfo.productItemModels[j].currentPrice;
                }
            }
        }
    }

    getSettleInfo(actionType, settleType, settleParam) {
        if (settleType) {
            this._setSettleType(settleType);
        }

        return this.strategies[this.settleType](actionType, settleParam);
    }

    getSettleProductContainer() {
        return this.settleProductContainer;
    }

    getUseWaterTicketContainer() {
        return this.useWaterTicketContainer;
    }

    getTotalPayRmb() {
        this.totalPayRmb = 0;
        let totalProductPrice = this.settleProductContainer.getTotalPrice();
        let totalWaterTicketPrice = this.useWaterTicketContainer.getTotalUsedMoney();
        this.totalPayRmb = totalProductPrice - totalWaterTicketPrice;
        return this.totalPayRmb;
    }

    findSettleProductById(productItemId) {

    }

    createOrder(deliveryAddressId, deliveryTime) {
        ;
        let self = this;
        let createOrderInfo = {
            "cartSettle": function () {
                return {}
            },
            "shopShoppingCartSettle": function () {
                return self.settleParam;
            },
            "useTicketSettle": function () {
                return {
                    productItemId: self.settleProductContainer.settleProductList[0].productItemId
                }
            },
            "shopNowSettle": function () {
                return self.settleParam;
            }
        }
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        let postInfo = Object.assign({
            accessInfo: accessInfo,
            deliveryAddressId: deliveryAddressId,
            deliveryTime: deliveryTime,
            payType: "online"
        }, createOrderInfo[this.settleType]());
        return new Promise((resolve, reject) => {
            huipayRequest.resource('/order/:actionType').save({actionType: "create"}, postInfo).then((info) => {
                this.orderInfo = info.data;
                resolve(this.orderInfo);
            });
        })
    }
}


module.exports.order = new Order();
