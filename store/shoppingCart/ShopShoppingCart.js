var ShoppingCartProduct = require('../product/ShoppingCartProduct.js');
var {huipayRequest} = require('../init.js');
var {loginInfo} = require('../../store/login/LoginInfo.js');

class ShopShoppingCart {
    constructor(shopShoppingCartInfo) {
        this.shopName = shopShoppingCartInfo.shopName;
        this.shopId = shopShoppingCartInfo.shopId;
        this.selectCount = shopShoppingCartInfo.selectCount;
        this.totalPrice = shopShoppingCartInfo.totalPrice;
        this.totalCount = 0;
        this.shopInfo = {
            shopName: this.shopName,
            shopId: this.shopId
        };
        this.productList = [];
        let productItemModelList = shopShoppingCartInfo.productItemModels;
        for (let i = 0; i < productItemModelList.length; i++) {
            this.productList.push(new ShoppingCartProduct(productItemModelList[i], this.shopInfo));
        }

        this.selected = shopShoppingCartInfo.shopSelected;
        this.ajax = huipayRequest.resource('/shop/shoppingcart/:action');
        // this.increaseToServer = function (shoppingCartProduct) {
        //     let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        //     huipayRequest.resource('/shop/shoppingcart/:action').save({action: "increase"}, {
        //         accessInfo: accessInfo,
        //         productItemId: shoppingCartProduct.productItemId,
        //         productType: shoppingCartProduct.productType,
        //         shopId: shoppingCartProduct.shopInfo.shopId
        //     }).then((info) => {
        //         wx.showToast({
        //             title: "成功加入购物车",
        //             icon: "success",
        //             duration: 1000
        //         });
        //         console.log("addProduct:", info);
        //     });
        //     return this.productList;
        // }
    }

    /**
     * 向服务器发送增加商品请求
     * @param shoppingCartProduct
     * @returns {Array}
     */
    increaseRequest(shoppingCartProduct) {
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        this.ajax.save({action: "increase"}, {
            accessInfo: accessInfo,
            productItemId: shoppingCartProduct.productItemId,
            productType: shoppingCartProduct.productType,
            shopId: shoppingCartProduct.shopInfo.shopId
        }).then((info) => {
            wx.showToast({
                title: "成功加入购物车",
                icon: "success",
                duration: 1000
            });
            console.log("addProduct:", info);
        });
        return this.productList;
    }

    decreaseRequest(shoppingCartProduct,delta = 1){
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        this.ajax.save({action: "decrease"}, {
            accessInfo: accessInfo,
            productItemId: shoppingCartProduct.productItemId,
            productType: shoppingCartProduct.productType,
            shopId: shoppingCartProduct.shopInfo.shopId,
            delta:delta
        }).then((info) => {
            console.log("removeProduct:", info);
        });
    }
    removeProductsRequest(removeProductList){
        for(let i = 0;i < removeProductList.length; i++){
            this.decreaseRequest(removeProductList[i],removeProductList[i].selectCount);
        }
    }
    /**
     * 获得购物车商品列表
     * @returns {Array}
     */
    getProductList() {
        return this.productList;
    }

    addProduct(shoppingCartProduct) {
        let flag = true;
        for (let i = 0; i < this.productList.length; i++) {
            if (this.productList[i].productItemId === shoppingCartProduct.productItemId) {
                this.productList[i].increase();
                this.productList[i].toggleSelected(true);
                this.getSelectedCount();
                this.getSelectedPrice();
                this.hasSelected();
                this.getTotalCount();
                flag = false;
            }
        }
        if (flag) {
            this.productList.push(shoppingCartProduct);
            this.getSelectedCount();
            this.getSelectedPrice();
            this.hasSelected();
            this.getTotalCount();
        }
        return this;
    }

    /**
     * 单个商品的数量-1
     * @param shoppingCartProduct
     * @returns {Array|*}
     */
    removeProduct(shoppingCartProduct) {

        for (let i = 0; i < this.productList.length; i++) {
            if (this.productList[i].productItemId === shoppingCartProduct.productItemId) {
                this.productList[i].reduce();
                this.productList[i].toggleSelected(true);
                if (this.productList[i].selectCount === 0) {
                    this.productList.splice(i, 1);
                }

                this.getSelectedCount();
                this.getSelectedPrice();
                this.hasSelected();
                this.getTotalCount();
            }
        }
        this.decreaseRequest(shoppingCartProduct);
        return this.productList;
    }

    /**
     * 批量删除商品
     * @returns {Array|*}
     */
    removeSelectedProduct(requestCallBack = function(){}){
        requestCallBack();
        // this.removeProductsRequest(this.getSelectedProduct());
        this.productList = this.getUnSelectedProduct();
        this.getSelectedCount();
        this.getSelectedPrice();
        this.hasSelected();
        this.getTotalCount();
        return this.productList;
    }
    getSelectedProduct(){
        let list = [];
        for(let i = 0; i < this.productList.length;i++){
            if(this.productList[i].selected){
                list.push(this.productList[i]);
            }
        }
        return list;
    }
    getUnSelectedProduct(){
        let list = [];
        for(let i = 0; i < this.productList.length;i++){
            if(!this.productList[i].selected){
                list.push(this.productList[i]);
            }
        }
        return list;
    }
    getTotalCount() {
        this.totalCount = 0;
        for (let i = 0; i < this.productList.length; i++) {
            this.totalCount += this.productList[i].selectCount;
        }
        return this.totalCount;
    }

    getSelectedCount() {
        let selectCount = 0;
        for (let i = 0; i < this.productList.length; i++) {
            if (this.productList[i].selected) {
                selectCount += this.productList[i].selectCount;
            }
        }
        this.selectCount = selectCount;
        return selectCount;
    }

    getSelectedPrice() {
        let totalPrice = 0;
        for (let i = 0; i < this.productList.length; i++) {
            if (this.productList[i].selected) {
                totalPrice += (this.productList[i].selectCount * this.productList[i].currentPrice);
            }
        }
        this.totalPrice = totalPrice;
        return totalPrice;
    }

    findProduct(productItemId) {
        for (let i = 0; i < this.productList.length; i++) {
            if (this.productList[i].productItemId == productItemId) {
                return this.productList[i];
            }
        }
    }

    hasSelected() {
        let list = this.productList;

        for (let i = 0; i < list.length; i++) {
            if (!list[i].selected) {
                this.selected = false;
                return this.selected;
            }
        }
        this.selected = true;
        return this.selected;
    }

    toggleSelected(selected) {
        if (selected) {
            this.selected = selected;
        } else {
            this.selected = !this.selected;
        }

        for (let i = 0; i < this.productList.length; i++) {
            this.productList[i].toggleSelected(this.selected).selectedRequest();
        }
        let actionType = this.selected ? "selected" : "unSelected";
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        let postInfo = {
            accessInfo: accessInfo,
            shopId: this.shopId
        };
        //  不需要这个接口
        // huipayRequest.resource('/shop/shoppingCart/shoppingCartToggle/:actionType').save({ actionType: actionType }, postInfo).then((data) => { console.log(data) });

        return this.productList;
    }
}

module.exports = ShopShoppingCart;